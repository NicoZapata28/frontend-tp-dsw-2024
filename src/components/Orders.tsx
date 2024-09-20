import { useState, useEffect } from "react"
import React from "react"
import ordersService from "../services/orders.ts"
import employeeService from "../services/employee.ts"
import customerService from "../services/customer.ts"
import materialService from "../services/materials.ts"
import { IOrder } from "../services/orders.ts"
import { ICustomer } from "../services/customer.ts"
import { IEmployee } from "../services/employee.ts"
import { IMaterial } from "../services/materials.ts"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ""; // Maneja el caso en que no sea una fecha válida
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString(undefined, options)
}

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [materials, setMaterials] = useState<IMaterial[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null) // Estado para controlar la orden expandida

  useEffect(() => {
    ordersService.getAll().then((data) => setOrders(data))
    employeeService.getAll().then((data) => setEmployees(data))
    customerService.getAll().then((data) => setCustomers(data))
    materialService.getAll().then((data) => setMaterials(data))
  }, [])

  const getEmployeeName = (idEmployee: string) => {
    const employee = employees.find((e) => e.id === idEmployee)
    return employee ? employee.name : "Desconocido"
  }

  const getCustomerName = (idCustomer: string) => {
    const customer = customers.find((c) => c.id === idCustomer)
    return customer ? customer.name : "Desconocido"
  }

  const getMaterialDescription = (idMaterial: string) => {
    const material = materials.find((m) => m.id === idMaterial)
    return material ? material.description : "Desconocido"
  }

  const toggleDetails = (orderId: string) => {
    // Alternar entre mostrar y ocultar detalles
    setExpandedOrder((prevOrderId) => (prevOrderId === orderId ? null : orderId));
  }

  return (
    <div className="container">
      <h1>Orders</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Customer</th>
            <th>TotalCost</th>
            <th>OrderDate</th>
            <th></th> {/* Columna para el botón de mostrar/ocultar detalles */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr className="orders">
                <td>{getEmployeeName(order.idEmployee)}</td>
                <td>{getCustomerName(order.idCustomer)}</td>
                <td>{order.totalCost}</td>
                <td>{formatDate(new Date(order.orderDate))}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => toggleDetails(order.id)}
                  >
                    {expandedOrder === order.id ? "Ocultar detalles" : "Mostrar detalles"}
                  </Button>
                </td>
              </tr>

              {/* Mostrar los detalles solo si esta orden está expandida */}
              {expandedOrder === order.id && (
                <tr>
                  <td colSpan={5}>
                    <div className="order-details">
                      <strong>Detalles de la orden:</strong>
                      {order.details.map((detail, index) => (
                        <div key={index}>
                          {getMaterialDescription(detail.idProduct)} -{" "}
                          {detail.quantity} x ${detail.price}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Orders
