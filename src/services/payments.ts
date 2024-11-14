import axios from 'axios'

const baseUrl = 'http://localhost:3006/api/payments'

export interface IPayment {
  idOrder: string,
  numberOfInstallments: number, // 0 for Cash
  paid: string, // Y or N
  installmentsDetails: IInstallmentsDetails[],
  id?: string
}

export interface IInstallmentsDetails {
  installmentN: number; 
  paymentDate: string; 
  amount: number;
  paid: "Y" | "N"; 
  _id?: string;
}

interface IPaymentResponse {
  data: IPayment[]
}

interface IDeleteResponse {
  message: string
}

// Obtener todos los pagos
const getAll = async (): Promise<IPayment[]> => {
  try {
    const response = await axios.get<IPaymentResponse>(baseUrl)
    return response.data.data
  } catch (error) {
    console.error('Error fetching payments:', error)
    throw new Error('Failed to fetch payments')
  }
}

// Crear un nuevo pago
const create = async (newObject: IPayment): Promise<IPayment> => {
  try {
    const response = await axios.post<IPayment>(baseUrl, newObject)
    return response.data
  } catch (error) {
    console.error('Error creating payment:', error)
    throw new Error('Failed to create payment')
  }
}

// Actualizar un pago existente
const update = async (id: string, newObject: IPayment): Promise<IPayment> => {
  try {
    const response = await axios.put<IPayment>(`${baseUrl}/${id}`, newObject)
    return response.data
  } catch (error) {
    console.error('Error updating payment:', error)
    throw new Error('Failed to update payment')
  }
}

// Eliminar un pago
const remove = async (id: string): Promise<IDeleteResponse> => {
  try {
    const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting payment:', error)
    throw new Error('Failed to delete payment')
  }
}

export const markInstallmentAsPaid = async (orderId: string, installmentId: string): Promise<void> => {
  try {
    const response = await axios.put(`http://localhost:3006/api/payments/${orderId}/installments/${installmentId}`, {
      paid: 'Y'
    });
    console.log('Cuota marcada como pagada:', response.data);
  } catch (error) {
    console.error('Error al marcar la cuota como pagada:', error);
    throw error; 
  }
}

export default { getAll, create, update, remove, markInstallmentAsPaid }
