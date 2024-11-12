import { useState } from 'react'
import { ICustomer } from '../../services/customer'
import './AddCustomerForm.css'

interface AddCustomerProps {
  createCustomer: (data: ICustomer) => Promise<ICustomer>
  onClose: () => void
}

const AddCustomerForm: React.FC<AddCustomerProps> = ({ createCustomer, onClose }) => {
  const [formData, setFormData] = useState<ICustomer>({
    dni: '',
    name: '',
    address: '',
    email: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCustomer(formData)
      alert('Customer added!')
      setFormData({ dni: '', name: '', address: '', email: '', phone: '' })
      onClose()
    } catch (error) {
      console.error('Error adding customer:', error)
    }
  }

  return (
    <div className='popup-background'>
      <div className='popup-container'>
        <button className='close-button' onClick={onClose}>&times;</button>
        <h2>Agregar un cliente</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI" required />
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" />
          <button type="submit" className='add-button'>Agregar cliente</button>
        </form>
      </div>
    </div>
  )
}

export default AddCustomerForm