import { useState } from 'react'
import { IMaterial } from '../../services/materials.ts'
import './AddMaterialForm.css'

interface AddMaterialProps {
  createMaterial: (data: FormData) => Promise<IMaterial>
  onClose: () => void
}

const AddMaterialForm: React.FC<AddMaterialProps> = ({ createMaterial, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    stock: 0,
    cost: 0,
    image: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files) {
      setFormData({ ...formData, image: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value instanceof File ? value : value.toString())
      }
    })

    try {
      const response = await createMaterial(formDataToSend)
      console.log('Product added:', response)
      alert('Product added!')
      setFormData({
        name: '',
        description: '',
        brand: '',
        category: '',
        stock: 0,
        cost: 0,
        image: null,
      })
      onClose()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div className='popup-background'>
      <div className='popup-container'>
        <button className='close-button' onClick={onClose}>&times;</button>
        <h2>Agregar un material</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del material" />
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descripcion" />
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Marca" />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Categoria" />
          <input type="number" name="stock" value={formData.stock.toString()} onChange={handleChange} placeholder="Stock" />
          <input type="number" name="cost" value={formData.cost.toString()} onChange={handleChange} placeholder="Costo" />
          <input type="file" name="image" onChange={handleChange} />
          <button className='add-button' type='submit'>Agregar material</button>
        </form>
      </div>
    </div>
  )
}

export default AddMaterialForm

