import { useState } from 'react'
import materialsService from '../services/materials.ts'

const AddMaterial = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    stock: 0,
    cost: 0,
    image: null as File | null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files) {
      setFormData({...formData, image: files[0]})
    } else {
      setFormData({...formData, [name]: value})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value instanceof File ? value : value.toString())
      }
    })

    try {
      const response = await materialsService.create(formDataToSend)
      console.log('Product added:', response)
      alert('Product added!')
      setFormData({
        name: '',
        description: '',
        brand: '',
        category: '',
        stock: 0,
        cost: 0,
        image: null
      })
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" />
      <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" />
      <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
      <input type="number" name="stock" value={formData.stock.toString()} onChange={handleChange} placeholder="Stock" />
      <input type="number" name="cost" value={formData.cost.toString()} onChange={handleChange} placeholder="Cost" />
      <input type="file" name="image" onChange={handleChange} />
      <button type="submit">Add Product</button>
    </form>
  )
}

export default AddMaterial
