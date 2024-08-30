import axios from 'axios'
const baseUrl = 'http://localhost:3006/api/materials'

export interface IMaterial{
  id: string,
  name: string,
  description: string,
  stock: number,
  cost: number
}

interface IMaterialResponse{
  data: IMaterial[]
}

const getAll = async (): Promise<IMaterial[]> =>{
  const response = await axios.get<IMaterialResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IMaterial) =>{
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id: string, newObject: IMaterial) =>{
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id: string) =>{
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default {getAll, create, update, remove}