import React, { useState, useEffect } from 'react'
import ordersService, {IOrder} from '../../services/orders.ts'
import paymentService, {IPayment, IInstallmentsDetails} from '../../services/payments.ts'
import {jwtDecode} from 'jwt-decode'
import materialsService, { IMaterial } from '../../services/materials.ts'
import { ICustomer } from '../../services/customer.ts'
import './AddOrderForm.css'

interface AddOrderProps {
  onClose: () => void,
  materialsList: IMaterial[],
  customersList: ICustomer[]
}

const initialOrder: IOrder = {
  id:'',
  idEmployee: '',
  idCustomer: '',
  totalCost: 0,
  paymentMethod: '',
  orderDate: '',
  details: [{ idProduct: '', quantity: 0, price: 0 }],
}

interface DecodedToken {
  id: string
  cuil: string
  name: string
  exp: number
}

const AddOrder: React.FC<AddOrderProps> = ({ onClose, materialsList, customersList }) => {
  const [order, setOrder] = useState<IOrder> (initialOrder)
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([])
  const [searchQueryCustomers, setSearchQueryCustomers] = useState<string>('')
  const [filteredMaterials, setFilteredMaterials] = useState<IMaterial[]>([])
  const [searchMaterialQuery, setSearchMaterialQuery] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('') // C for cash, I for installments
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(1)
  const [installmentDetails, setInstallmentDetails] = useState<IInstallmentsDetails[]>([])

  useEffect(() => {
    const results = customersList.filter(customer =>
      customer.dni.toLowerCase().includes(searchQueryCustomers.toLowerCase())
    )
    setFilteredCustomers(results)
  }, [searchQueryCustomers, customersList])

  useEffect(() => {
    const results = materialsList.filter(material =>
      material.name.toLowerCase().includes(searchMaterialQuery.toLowerCase())
    )
    setFilteredMaterials(results)
  }, [searchMaterialQuery, materialsList])

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
    const total = order.details.reduce((acc, detail) => acc + detail.price, 0)
    setOrder((prevOrder) => ({
      ...prevOrder,
      totalCost: total,
    }))
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
    const selectedMaterial = materialsList.find((material => material.id === e.target.value))
    if (selectedMaterial) {
      const updatedDetails = [...order.details];
      updatedDetails[index] = {
        ...updatedDetails[index],
        idProduct: selectedMaterial.id!,
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
      const selectedMaterial = materialsList.find(material => material.id === updatedDetails[index].idProduct)
  
      if (selectedMaterial) {
        updatedDetails[index] = {
          ...updatedDetails[index],
          quantity: newQuantity,
          price: selectedMaterial.cost * newQuantity,
        };
  
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
    const method = e.target.value
    setPaymentMethod(method)

    if (method === 'I') {  // Si es en cuotas
      const numInstallments = prompt("Ingrese el número de cuotas:")
      const numberOfInstallments = numInstallments ? parseInt(numInstallments, 10) : 1
      setNumberOfInstallments(numberOfInstallments)
      
      const totalCost = order.totalCost
      const installmentAmount = totalCost / numberOfInstallments
      const installments: IInstallmentsDetails[] = []

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
        const selectedMaterial = materialsList.find(material => material.id === detail.idProduct)
        if (selectedMaterial) {
          const updatedStock = selectedMaterial.stock - detail.quantity
          await materialsService.update( selectedMaterial.id!, {
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
    <div className="popup-background" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Create New Order</h2>
        <form onSubmit={handleSubmit}>
          <div>  
            <input type="text" 
            name='idEmployee'
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
            <select name="idCustomer" value={order.idCustomer} onChange={handleCustomerChange} required>
              <option value="">Select a customer</option>
              {filteredCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.dni} - {customer.name}
              </option>
              ))}
            </select>
          </div>

          {order.details.map((detail, index) => (
          <div className='product-field' key={index}>
            <label>Product</label>
            <input
              type="text"
              placeholder="Search product"
              value={searchMaterialQuery}
              onChange={handleSearchMaterialChange}
            />
            <select value={detail.idProduct} onChange={(e) => handleMaterialChange(index, e)} required>
                <option value="">Select a product</option>
                  {filteredMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} - {material.brand} - ${material.cost} - Stock: {material.stock}
                </option>
                  ))}
            </select>

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
            <button type="button" className='r-button' onClick={() => removeDetail(index)}>Remove</button>
          </div>
          ))}

          <button type="button" className='f-button' onClick={addDetail}>Add Product</button>

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
      
          <button type="submit" className='f-button'>Create Order</button>
        </form>
      </div>
    </div>
)}

export default AddOrder
