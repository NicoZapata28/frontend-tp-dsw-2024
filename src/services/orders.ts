import axios from "axios"
const baseUrl = 'http://localhost:3006/api/orders'

export interface IOrder{ 
  idEmployee: string,
  idCustomer: string,
  totalCost: number,
  orderDate: string,
  details: IOrderDetail[]
}

interface IOrderDetail {
  idProduct: string
  quantity: number
  price: number
}

interface IOrderResponse{
  data: IOrder[]
}

interface IDeleteResponse{
  message: string
}

const getAll = async (): Promise<IOrder[]> =>{
  const response = await axios.get<IOrderResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IOrder): Promise<IOrder> =>{
  const response = await axios.post<IOrder>(baseUrl, newObject)
  return response.data
}

const update = async (id: string, newObject: IOrder): Promise<IOrder> =>{
  const response = await axios.put<IOrder>(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> =>{
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
  return response.data
}

export default {getAll, create, update, remove}

