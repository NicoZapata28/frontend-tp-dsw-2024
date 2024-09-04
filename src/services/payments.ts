import axios from 'axios'
const baseUrl = 'http://localhost:3006/api/payments'

export interface IPayment{
  paymentNumber: string,
  orderNumber: string,
  amount: number,
  orderDate: Date
}

interface IPaymentResponse{
  data: IPayment[]
}

interface IDeleteResponse{
  message: string
}

const getAll = async (): Promise<IPayment[]> =>{
  const response = await axios.get<IPaymentResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IPayment): Promise<IPayment> =>{
  const response = await axios.post<IPayment>(baseUrl, newObject)
  return response.data
}

const update = async (paymentNumber: string, newObject: IPayment): Promise<IPayment> =>{
  const response = await axios.put<IPayment>(`${baseUrl}/${paymentNumber}`, newObject)
  return response.data
}

const remove = async (paymentNumber: string): Promise<IDeleteResponse> =>{
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${paymentNumber}`)
  return response.data
}

export default {getAll, create, update, remove}