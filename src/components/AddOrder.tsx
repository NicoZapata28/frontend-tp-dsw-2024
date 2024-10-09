import { useState, useEffect } from "react"
import ordersService, {IOrder} from '../services/orders'
import customersService, {ICustomer} from '../services/customer.ts'
import materialsService, {IMaterial} from '../services/materials.ts'
import paymentService, {IPayment, IInstallmentsDetails} from '../services/payments.ts'
import {jwtDecode} from 'jwt-decode'

const initialOrder: IOrder = {
  id:'',
  idEmployee: '',
  idCustomer: '',
  totalCost: 0,
  paymentMethod: '',
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
  const [paymentMethod, setPaymentMethod] = useState<string>('') // "C" for cash, "I" for installments
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(1)
  const [installmentDetails, setInstallmentDetails] = useState<IInstallmentsDetails[]>([])


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
      }
  
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

  interface DecodedToken {
    id: string
    cuil: string
    name: string
    exp: number
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token)
      setOrder((prevOrder) => ({
        ...prevOrder,
        idEmployee: decodedToken.id
      }))
    }
  }, [])

  useEffect(() => {
    const total = order.details.reduce((acc, detail) => acc + detail.price, 0);
    setOrder((prevOrder) => ({
      ...prevOrder,
      totalCost: total,
    }));
  }, [order.details])

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
      const updatedDetails = [...order.details];
      updatedDetails[index] = {
        ...updatedDetails[index],
        idProduct: selectedMaterial.id,
        quantity: 1, 
        price: selectedMaterial.cost
      }
  
      setOrder({ ...order, details: updatedDetails })
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedDetails = [...order.details]
    const newQuantity = parseInt(e.target.value, 10)
  
    if (!isNaN(newQuantity) && newQuantity > 0) {
      const selectedMaterial = materials.find(material => material.id === updatedDetails[index].idProduct)
  
      if (selectedMaterial) {
        updatedDetails[index] = {
          ...updatedDetails[index],
          quantity: newQuantity,
          price: selectedMaterial.cost * newQuantity,
        }
  
        setOrder({ ...order, details: updatedDetails })
      }
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

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value;
    setPaymentMethod(method);

    if (method === 'I') {  // Si es en cuotas
      const numInstallments = prompt("Ingrese el número de cuotas:");
      const numberOfInstallments = numInstallments ? parseInt(numInstallments, 10) : 1;
      setNumberOfInstallments(numberOfInstallments);
      
      // Generar detalles de cuotas
      const totalCost = order.totalCost;
      const installmentAmount = totalCost / numberOfInstallments;
      const installments: IInstallmentsDetails[] = [];

      for (let i = 0; i < numberOfInstallments; i++) {
        const paymentDate = new Date()
        paymentDate.setMonth(paymentDate.getMonth() + i)  // Aumenta un mes por cuota

        installments.push({
          installmentN: i + 1,
          paymentDate: paymentDate.toISOString(),
          amount: installmentAmount,
          paid: 'N'
        })
      }

      setInstallmentDetails(installments)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const currentOrder: IOrder = {
      ...order,
      paymentMethod,
      orderDate: new Date().toISOString(),
    }
    try {
      const createdOrder = await ordersService.create(currentOrder)
      const orderId = createdOrder.id

      for (const detail of currentOrder.details) {
        const selectedMaterial = materials.find(material => material.id === detail.idProduct)
        if (selectedMaterial) {
          const updatedStock = selectedMaterial.stock - detail.quantity
          await materialsService.update( selectedMaterial.id, {
            ...selectedMaterial,
            stock: updatedStock })
        }
      }

      if (createdOrder.paymentMethod === 'I') {
        const payment: IPayment = {
          idOrder: orderId,
          numberOfInstallments,
          paid: 'N',
          installmentsDetails: installmentDetails
        }

        await paymentService.create(payment)
      }else if(createdOrder.paymentMethod === 'C'){
        const payment: IPayment = {
          idOrder: orderId,
          numberOfInstallments: 0,
          paid: 'Y',
          installmentsDetails: []
        }

        await paymentService.create(payment)
      }
      alert('Order created successfully')
      setOrder(initialOrder)
      setInstallmentDetails([])
      setPaymentMethod('')
      setNumberOfInstallments(1)
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Employee ID</label>
        <input
          type="text"
          name="idEmployee"
          value={order.idEmployee}
          readOnly
        />
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
                {customer.dni} - {customer.name}
              </option>
            ))}
          </select>
        )}
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
                  {material.name} - {material.brand} - ${material.cost} - Stock: {material.stock}
                </option>
              ))}
            </select>
          )}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={detail.quantity}
            onChange={(e) => handleQuantityChange(e, index)}
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

      <div>
        <label>Total Cost</label>
        <input
          type="number"
          name="totalCost"
          value={order.totalCost}
          readOnly
          required
        />
      </div>
      
      <div>
        <label>Método de pago</label>
        <select value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="">Seleccionar método</option>
          <option value="C">Efectivo</option>
          <option value="I">Cuotas</option>
        </select>
      </div>

      {paymentMethod === 'I' && (
        <div>
          <h4>Detalles de cuotas:</h4>
          {installmentDetails.map((installment, index) => (
            <div key={index}>
              <p>Cuota {installment.installmentN}: ${installment.amount.toFixed(2)} - Fecha de pago: {new Date(installment.paymentDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      
      <button type="submit">Create Order</button>
    </form>
  )
}


export default AddOrder