// ... otros importes
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
import AddOrder from "./AddOrder.tsx"


const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ""; 
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchEmployee, setSearchEmployee] = useState<string>(""); 
  const [searchCustomer, setSearchCustomer] = useState<string>(""); 
  const [sortDateOrder, setSortDateOrder] = useState<string>("none"); 
  const [sortTotalCostOrder, setSortTotalCostOrder] = useState<string>("none"); 
  
  useEffect(() => {
    const fetchData = () => {
      ordersService.getAll().then((data) => setOrders(data))
      employeeService.getAll().then((data) => setEmployees(data))
      customerService.getAll().then((data) => setCustomers(data))
      materialService.getAll().then((data) => setMaterials(data))
    }

    fetchData(); // Fetch inicial
    const intervalId = setInterval(fetchData, 5000); // Poll cada 5 segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, [])


  const getEmployeeName = (idEmployee: string) => {
    const employee = employees.find((e) => e.id === idEmployee);
    return employee ? employee.name : "Desconocido";
  };

  const getCustomerName = (idCustomer: string) => {
    const customer = customers.find((c) => c.id === idCustomer);
    return customer ? customer.name : "Desconocido";
  };

  const getMaterialName = (idMaterial: string) => {
    const material = materials.find((m) => m.id === idMaterial);
    return material ? material.name : "Desconocido"; // Cambia aquí para obtener el nombre del producto
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrder((prevOrderId) => (prevOrderId === orderId ? null : orderId));
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
      ordersService.remove(orderId)
        .then(() => setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId)))
        .catch((error) => console.error("Error al eliminar la orden:", error));
    }
  };

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

    {/* Filtros de búsqueda */}
    <input
      type="text"
      placeholder="Search by employee name"
      value={searchEmployee}
      onChange={(e) => setSearchEmployee(e.target.value)}
      className="mb-3"
    />
    <input
      type="text"
      placeholder="Search by customer name"
      value={searchCustomer}
      onChange={(e) => setSearchCustomer(e.target.value)}
      className="mb-3"
    />

    {/* Componente para agregar una nueva orden */}
    <AddOrder />

    <Table striped hover>
      <thead>
        <tr>
          <th>Employee</th>
          <th>Customer</th>
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
          <th>Acciones</th>
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
                <Button
                  variant="danger"
                  onClick={() => handleDelete(order.id)}
                  className="ms-2"
                >
                  Eliminar
                </Button>
              </td>
            </tr>

            {/* Detalles de la orden */}
            {expandedOrder === order.id && (
              <tr>
                <td colSpan={5}>
                  <div className="order-details">
                    <strong>Detalles de la orden:</strong>
                    {order.details && order.details.length > 0 ? (
                      order.details.map((detail, index) => (
                        <div key={index}>
                          {getMaterialName(detail.idProduct)} - {detail.quantity} x ${detail.price}
                        </div>
                      ))
                    ) : (
                      <div>No hay detalles disponibles.</div>
                    )}
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
};

export default Orders;
