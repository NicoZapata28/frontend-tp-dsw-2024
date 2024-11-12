import axios from 'axios'

const baseUrl = 'http://localhost:3006/api/materialCosts'

interface ICostHistory {
    id?: string,
    updateDate: Date,
    cost: number,  
}

export interface IMaterialCosts {
  idMaterial: string,
  costHistory: ICostHistory[],
  id?: number,
}


interface IMaterialResponse {
  data: IMaterialCosts[]
}

interface IDeleteResponse {
  message: string
}

const getById =  async (id: string) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const getAll = async (): Promise<IMaterialCosts[]> => {
  const response = await axios.get<IMaterialResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IMaterialCosts): Promise<IMaterialCosts> =>{
    const response = await axios.post<IMaterialCosts>(baseUrl, newObject)
    return response.data
}


const update = async (id: string, newObject: IMaterialCosts): Promise<IMaterialCosts> =>{
    const response = await axios.put<IMaterialCosts>(`${baseUrl}/${id}`, newObject)
    return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> => {
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, create, update, remove, getById }
