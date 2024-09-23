import { useState, useEffect } from "react"
import ordersService, {IOrder} from '../services/orders'
import customersService, {ICustomer} from '../services/customer.ts'
import materialsService, {IMaterial} from '../services/materials.ts'

const initialOrder: IOrder = {
  idEmployee: '',
  idCustomer: '',
  totalCost: 0,
  orderDate: '',
  details: [{ idProduct: '', quantity: 0, price: 0 }],
}

const AddOrder = () =>{
  const [order, setOrder] = useState<IOrder>(initialOrder)
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([])
  const [searchQueryCustomers, setSearchQueryCustomers] = useState<string>('')
  const [materials, setMaterials] = useState<IMaterial[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<IMaterial[]>([])
  const [searchMaterialQuery, setSearchMaterialQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
      const fetchCustomersAndMaterials = async () => {
        try {
          const customerList = await customersService.getAll()
          setCustomers(customerList)
          setFilteredCustomers(customerList)
  
          const materialList = await materialsService.getAll()
          setMaterials(materialList)
          setFilteredMaterials(materialList)
  
          setLoading(false)
        } catch (error) {
          console.error('Error fetching data:', error)
          setLoading(false)
        }
      };
  
      fetchCustomersAndMaterials()
    }, [])

  useEffect(() => {
    const results = customers.filter(customer =>
      customer.dni.toLowerCase().includes(searchQueryCustomers.toLowerCase())
    )
    setFilteredCustomers(results)
  }, [searchQueryCustomers, customers])

  useEffect(() => {
    const results = materials.filter(material =>
      material.name.toLowerCase().includes(searchMaterialQuery.toLowerCase())
    )
    setFilteredMaterials(results)
  }, [searchMaterialQuery, materials])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrder({ ...order, [name]: value })
  }

  const handleDetailChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedDetails = order.details.map((detail, i) => 
      i === index ? { ...detail, [name]: value } : detail
    )
    setOrder({ ...order, details: updatedDetails })
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder({ ...order, idCustomer: e.target.value })
  }

  const handleMaterialChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMaterial = materials.find(material => material.id === e.target.value)
    if (selectedMaterial) {
      const updatedDetails = order.details.map((detail, i) =>
        i === index ? { ...detail, idProduct: selectedMaterial.id, price: selectedMaterial.cost } : detail
      )
      setOrder({ ...order, details: updatedDetails })
    }
  }

  const handleSearchCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryCustomers(e.target.value)
  }

  const handleSearchMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMaterialQuery(e.target.value)
  }

  const addDetail = () => {
    setOrder({
      ...order,
      details: [...order.details, { idProduct: '', quantity: 0, price: 0 }],
    })
  }

  const removeDetail = (index: number) => {
    const updatedDetails = order.details.filter((_, i) => i !== index)
    setOrder({ ...order, details: updatedDetails })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const currentOrder: IOrder = {
      ...order,
      orderDate: new Date().toISOString(), 
    }
    try {
      await ordersService.create(currentOrder)
      alert('Order created successfully')
      setOrder(initialOrder)
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
      
      <h1>Add New Order</h1>
        <label>Employee ID</label>
        <input type="text" name="idEmployee" value={order.idEmployee} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Customer</label>
        <input
          type="text"
          placeholder="Search DNI"
          value={searchQueryCustomers}
          onChange={handleSearchCustomerChange}
        />
        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <select name="idCustomer" value={order.idCustomer} onChange={handleCustomerChange} required>
            <option value="">Select a customer</option>
            {filteredCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.dni}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label>Total Cost</label>
        <input type="number" name="totalCost" value={order.totalCost} onChange={handleInputChange} required />
      </div>

      {order.details.map((detail, index) => (
        <div key={index}>
          <label>Product</label>
          <input
            type="text"
            placeholder="Search product"
            value={searchMaterialQuery}
            onChange={handleSearchMaterialChange}
          />
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <select value={detail.idProduct} onChange={(e) => handleMaterialChange(index, e)} required>
              <option value="">Select a product</option>
              {filteredMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} - {material.brand} - ${material.cost}
                </option>
              ))}
            </select>
          )}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={detail.quantity}
            onChange={(e) => handleDetailChange(index, e)}
            required
          />
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={detail.price}
            onChange={(e) => handleDetailChange(index, e)}
            required
          />
          <button type="button" onClick={() => removeDetail(index)}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={addDetail}>Add Product</button>
      <button type="submit">Create Order</button>
    </form>
    
  )
}


export default AddOrder