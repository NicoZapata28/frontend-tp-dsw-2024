//REVISAR

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import materialsService from '../services/materials'
import { IMaterial } from '../services/materials'
import axios from 'axios'

interface IFormData {name: string;description: string;brand: string;category: string;stock: number;cost: number;image: File | null;}
const UpdateMaterial = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();
  const initialData: IFormData = {name: '',description: '',brand: '',category: '',stock: 0,cost: 0,image: null,}
  const [formData, setFormData] = useState<IFormData>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMaterial = async () => {
      if (id) {
        try {
          const material = await materialsService.getById(id)
          setFormData({
            ...material,image: null, // Optional: Set default for image if needed});
            } catch (err) {
              console.error('Error fetching material:', err);
              setError('Error fetching material');
            } finally {
              setLoading(false);}
            }}
            fetchMaterial()
            }, [id])
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {const { name, value, files } = e.target;if (name === 'image' && files) {setFormData({ ...formData, image: files[0] });} else {setFormData({ ...formData, [name]: value });}};const handleSubmit = async (e: React.FormEvent) => {e.preventDefault();// Construir un objeto IMaterialconst updatedMaterial: IMaterial = {id: id || '', // Asegúrate de que id esté definidoname: formData.name,description: formData.description,brand: formData.brand,category: formData.category,stock: formData.stock,cost: formData.cost,image: formData.image ? URL.createObjectURL(formData.image) : '', // Convierte a string si es necesario};if (id) {try {await materialsService.update(id, updatedMaterial); // Pasa el objeto IMaterialalert('Product updated successfully!');navigate('/materials');} catch (err) {if (axios.isAxiosError(err)) {console.error('Error updating product:', err.response?.data);setError(err.response?.data?.message || 'Failed to update product. Please try again.');} else {console.error('Unexpected error:', err);setError('An unexpected error occurred. Please try again.');}}} else {console.error('ID is undefined');setError('ID is undefined. Cannot update product.');}};if (loading) {return <div>Loading...</div>;}return (<form onSubmit={handleSubmit}>{error && <p style={{ color: 'red' }}>{error}</p>}<input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required /><input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required /><input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required /><input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required /><input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required /><input type="number" name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" required /><input type="file" name="image" onChange={handleChange} /><button type="submit">Update Product</button></form>);};
export default UpdateMaterial