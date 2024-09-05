import { useState, useEffect } from "react"
import ordersService from "../services/orders.ts"
import { IOrder } from "../services/orders.ts"
import Table from 'react-bootstrap/Table'

function formatDate(date: Date):string {
  if (!(date instanceof Date) || isNaN(date.getTime()))   {
    return "" // Maneja el caso en que no sea una fecha válida
  }

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
}

const Orders = () =>{
  const [orders, setOrders] = useState<IOrder[]>([])
  
  useEffect(() => {
    ordersService.getAll().then(data =>
      setOrders(data)
    )
  }, [])

  return (
    <div className="container">
      <h1>Orders</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th>IdEmployee</th>
            <th>IdCustomer</th>
            <th>IdMaterial</th>
            <th>TotalCost</th>
            <th>OrderDate</th>
          </tr>
        </thead>
        <tbody>
          {(orders.map(m =>
            <tr className="orders" key={m.orderNumber}>
              <td>
                {m.orderNumber}
              </td>
              <td>
                {m.idEmployee}
              </td>
              <td>
                {m.idCustomer}
              </td>
              <td>
                {m.idMaterial}
              </td>
              <td>
                {m.totalCost}
              </td>
              <td>
                {formatDate(new Date(m.orderDate))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Orders