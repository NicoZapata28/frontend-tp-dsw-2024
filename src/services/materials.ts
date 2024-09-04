import axios from 'axios'
const baseUrl = 'http://localhost:3006/api/materials'

export interface IMaterial{
  id: string,
  image: string,
  name: string,
  description: string,
  brand: string,
  category: string,
  stock: number,
  cost: number
}

interface IMaterialResponse{
  data: IMaterial[]
}

interface IDeleteResponse{
  message: string
}

const getAll = async (): Promise<IMaterial[]> =>{
  const response = await axios.get<IMaterialResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IMaterial): Promise<IMaterial> =>{
  const response = await axios.post<IMaterial>(baseUrl, newObject)
  return response.data
}

const update = async (id: string, newObject: IMaterial): Promise<IMaterial> =>{
  const response = await axios.put<IMaterial>(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> =>{
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
  return response.data
}

export default {getAll, create, update, remove}