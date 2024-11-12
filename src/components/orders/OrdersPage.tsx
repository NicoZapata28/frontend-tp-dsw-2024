import React, { useState, useEffect } from 'react'
import ordersService from '../../services/orders'
import employeeService from '../../services/employee'
import customerService from '../../services/customer'
import materialService from '../../services/materials'
import paymentsService from '../../services/payments'
import OrderCard from './OrderCard'
import AddOrder from './AddOrder'
import { IOrder } from '../../services/orders';
import { IEmployee } from '../../services/employee'
import { ICustomer } from '../../services/customer'
import { IMaterial } from '../../services/materials'
import { IPayment } from '../../services/payments'
import './OrdersPage.css'

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddOrderForm, setShowAddOrderForm] = useState(false); 

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

        setOrders(ordersData);
        setEmployees(employeesData);
        setCustomers(customersData);
        setMaterials(materialsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (orderId: string) => {
    try {
      await ordersService.remove(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Error deleting order");
    }
  };

  const handleAddOrderClick = () => {
    setShowAddOrderForm(true);
  };

  const handleCancelAddOrder = () => {
    setShowAddOrderForm(false);
  };

  const handleOrderCreated = async () => {
    setShowAddOrderForm(false);
    try {
      const updatedOrders = await ordersService.getAll();
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching updated orders:", error);
      setError("Error fetching updated orders");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-page">
      <h1>Orders</h1>
      <button onClick={handleAddOrderClick}>Crear Nueva Orden</button>
      
      {showAddOrderForm ? (
        <AddOrder onOrderCreated={handleOrderCreated} onCancel={handleCancelAddOrder} />
      ) : (
        <div className="order-cards">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              employees={employees}
              customers={customers}
              materials={materials}
              payments={payments}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage