import axios from 'axios'
const baseUrl = 'http://localhost:3006/api/employees'

export interface IEmployee{
   cuil: string,
    dni: string,
    name: string,
    address: string,
    email: string,
    phone: string,
}

interface IEmployeeResponse{
  data: IEmployee[]
}

interface IDeleteResponse{
  message: string
}

const getAll = async (): Promise<IEmployee[]> =>{
  const response = await axios.get<IEmployeeResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IEmployee): Promise<IEmployee> =>{
  const response = await axios.post<IEmployee>(baseUrl, newObject)
  return response.data
}

const update = async (id: string, newObject: IEmployee): Promise<IEmployee> =>{
  const response = await axios.put<IEmployee>(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> =>{
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
  return response.data
}

export default {getAll, create, update, remove}