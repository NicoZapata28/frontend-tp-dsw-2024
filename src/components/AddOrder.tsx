import { useState } from "react"
import ordersService, {IOrder} from '../services/orders.ts'

const initialOrder: IOrder = {
  idEmployee: '',
  idCustomer: '',
  totalCost: 0,
  orderDate: '',
  details: [{ idProduct: '', quantity: 0, price: 0 }],
}

const AddOrder = () =>{
  const [order, setOrder] = useState<IOrder>(initialOrder)

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
        <label>Employee ID</label>
        <input type="text" name="idEmployee" value={order.idEmployee} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Customer ID</label>
        <input type="text" name="idCustomer" value={order.idCustomer} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Total Cost</label>
        <input type="number" name="totalCost" value={order.totalCost} onChange={handleInputChange} required />
      </div>

      {order.details.map((detail, index) => (
        <div key={index}>
          <label>Product ID</label>
          <input
            type="text"
            name="idProduct"
            value={detail.idProduct}
            onChange={(e) => handleDetailChange(index, e)}
            required
          />
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