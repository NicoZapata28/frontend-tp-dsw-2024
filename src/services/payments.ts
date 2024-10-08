import axios from 'axios'
const baseUrl = 'http://localhost:3006/api/payments'

export interface IPayment{
  idOrder: string,
  numberOfInstallments: number, // 0 for Cash
  paid: string, // Y or N
  installmentsDetails: IInstallmentsDetails[],
  id?: string
}

export interface IInstallmentsDetails {
  installmentN: number, 
  paymentDate: string, 
  amount: number,
  paid: string,
  _id?: string
}

interface IPaymentResponse {
  data: IPayment[]
}

interface IDeleteResponse {
  message: string
}

const getAll = async (): Promise<IPayment[]> => {
  const response = await axios.get<IPaymentResponse>(baseUrl)
  return response.data.data
}

const create = async (newObject: IPayment): Promise<IPayment> => {
  const response = await axios.post<IPayment>(baseUrl, newObject)
  return response.data
}

const update = async (id: string, newObject: IPayment): Promise<IPayment> => {
  const response = await axios.put<IPayment>(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> => {
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, create, update, remove }
