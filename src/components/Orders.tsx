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

  const [searchEmployee, setSearchEmployee] = useState<string>(""); 
  const [searchCustomer, setSearchCustomer] = useState<string>(""); 
  const [sortDateOrder, setSortDateOrder] = useState<string>("none"); 
  const [sortTotalCostOrder, setSortTotalCostOrder] = useState<string>("none"); 
  
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

  const handleDelete = (orderId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
      ordersService.remove(orderId).then(() => {
        // Actualiza el estado eliminando la orden
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
      }).catch((error) => {
        console.error("Error al eliminar la orden:", error)
      })
    }
  }

  const filteredOrders = orders
    .filter((order) =>
      getEmployeeName(order.idEmployee)
        .toLowerCase()
        .includes(searchEmployee.toLowerCase())
    )
    .filter((order) =>
      getCustomerName(order.idCustomer)
        .toLowerCase()
        .includes(searchCustomer.toLowerCase())
    );

    const sortedOrdersByDate = filteredOrders.sort((a, b) => {
      if (sortDateOrder === "asc") {
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      } else if (sortDateOrder === "desc") {
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
      return 0;
    });
    
    const sortedOrders = sortedOrdersByDate.sort((a, b) => {
      if (sortTotalCostOrder === "asc") {
        return a.totalCost - b.totalCost;
      } else if (sortTotalCostOrder === "desc") {
        return b.totalCost - a.totalCost;
      }
      return 0;
    });

    const toggleDateSortOrder = () => {
      setSortDateOrder((prevOrder) => {
        if (prevOrder === "none") return "asc";
        if (prevOrder === "asc") return "desc";
        return "none";
      });
    };

    const toggleTotalCostSortOrder = () => {
      setSortTotalCostOrder((prevOrder) => {
        if (prevOrder === "none") return "asc";
        if (prevOrder === "asc") return "desc";
        return "none";
      });
    };

  return (
    <div className="container">
      <h1>Orders</h1>
        <input
          type="text"
          placeholder="Search by employee name"
          value={searchEmployee}
          onChange={(e) => setSearchEmployee(e.target.value)}
          />
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
      <Table striped hover>
        <thead>
          <tr>
            <th>
              Employee
            </th>
            <th>
              Customer
            </th>
            <th>
              TotalCost
              <button onClick={toggleTotalCostSortOrder}>
                {sortTotalCostOrder === "asc"
                  ? "↑"
                  : sortTotalCostOrder === "desc"
                  ? "↓"
                  : "↔"}
              </button>
            </th>
            <th>
              OrderDate
              <button onClick={toggleDateSortOrder}>
                {sortDateOrder === "asc"
                  ? "↑"
                  : sortDateOrder === "desc"
                  ? "↓"
                  : "↔"}
              </button>
            </th>
            <th></th> {/* Columna para el botón de mostrar/ocultar detalles */}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
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
                    {expandedOrder === order.id
                      ? "Ocultar detalles"
                      : "Mostrar detalles"}
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(order.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>

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
  );
};


export default Orders
