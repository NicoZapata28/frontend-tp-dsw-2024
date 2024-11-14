import React, { useState, useEffect } from 'react'
import ordersService from '../../services/orders'
import employeeService from '../../services/employee'
import customerService, {ICustomer} from '../../services/customer'
import materialService, {IMaterial} from '../../services/materials'
import paymentsService from '../../services/payments'
import AddButton from '../shared/AddButton.tsx'
//import OrderCard from './OrderCard'
import AddOrderForm from './AddOrderForm.tsx'
import './OrdersPage.css'

const OrdersPage: React.FC = () => {
  //const [orders, setOrders] = useState<IOrder[]>([])
  //const [employees, setEmployees] = useState<IEmployee[]>([])
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [materials, setMaterials] = useState<IMaterial[]>([])
  //const [payments, setPayments] = useState<IPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddOrder, setShowAddOrder] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, employeesData, customersData, materialsData, paymentsData] = await Promise.all([
          ordersService.getAll(),
          employeeService.getAll(),
          customerService.getAll(),
          materialService.getAll(),
          paymentsService.getAll(),
        ]);

        //setOrders(ordersData)
        //setEmployees(employeesData)
        setCustomers(customersData)
        setMaterials(materialsData)
        //setPayments(paymentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  return (
    <div className="orders-page">
      <h1>Orders</h1>
      <AddButton onClick={() => setShowAddOrder(true)}/>
        {showAddOrder && <AddOrderForm onClose = {() => setShowAddOrder(false)} materialsList={materials} customersList={customers}/>}

    </div>
  )
}

export default OrdersPage