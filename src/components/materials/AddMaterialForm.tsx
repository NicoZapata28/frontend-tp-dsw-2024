import { useState } from 'react'
import { IMaterial } from '../../services/materials.ts'
import './AddMaterialForm.css'

interface AddMaterialProps {
  createMaterial: (data: FormData) => Promise<IMaterial>
  onClose: (newMaterial?: IMaterial) => void
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLSelectElement
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
      const newMaterial = await createMaterial(formDataToSend)
      console.log('Product added:', newMaterial)
      alert('Product added!')
      onClose(newMaterial)
      setFormData({
        name: '',
        description: '',
        brand: '',
        category: '',
        stock: 0,
        cost: 0,
        image: null,
      })
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div className='popup-background'>
      <div className='popup-container'>
        <button className='close-button' onClick={() => onClose()}>&times;</button>
        <h2>Agregar un material</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del material" />
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descripcion" />
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Marca" />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Seleccione una categoría</option>
            <option value="Audio">Audio</option>
            <option value="Periféricos">Periféricos</option>
            <option value="Tablets">Tablets</option>
          </select>
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

