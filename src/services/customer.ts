import axios from 'axios'
const baseUrl = 'http://localhost:3006/api/customers'

export interface ICustomer{
    image: string,
    name: string,
    description: string,
    brand: string,
    category: string,
    stock: number,
    cost: number
}

interface ICustomerResponse{
    data: ICustomer[]
}

interface IDeleteResponse{
    message: string
}

const getAll = async (): Promise<ICustomer[]> =>{
    const response = await axios.get<ICustomerResponse>(baseUrl)
    return response.data.data
}

const create = async (newObject: ICustomer): Promise<ICustomer> =>{
    const response = await axios.post<ICustomer>(baseUrl, newObject)
    return response.data
}

const update = async (id: string, newObject: ICustomer): Promise<ICustomer> =>{
    const response = await axios.put<ICustomer>(`${baseUrl}/${id}`, newObject)
    return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> =>{
    const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
    return response.data
}

export default {getAll, create, update, remove}