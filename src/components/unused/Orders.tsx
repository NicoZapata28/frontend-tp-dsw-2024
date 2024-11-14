import { useState, useEffect } from "react"
import React from "react"
import ordersService from "../services/orders.ts"
import employeeService from "../services/employee.ts"
import customerService from "../services/customer.ts"
import materialService from "../services/materials.ts"
import paymentsService from "../services/payments.ts"
import { IOrder } from "../services/orders.ts"
import { ICustomer } from "../services/customer.ts"
import { IEmployee } from "../services/employee.ts"
import { IMaterial } from "../services/materials.ts"
import { IPayment } from "../services/payments.ts"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [sortDateOrder, setSortDateOrder] = useState<string>("asc");

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
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? employee.name : "Desconocido";
  };

  const getCustomerName = (id: string) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : "Desconocido";
  };

  const getMaterialName = (idProduct: string) => {
    const material = materials.find(m => m.id === idProduct);
    return material ? material.name : "Desconocido";
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDelete = async (orderId: string) => {
    try {
      await ordersService.remove(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      setError("Error deleting order");
    }
  };

  const getPaymentDetails = (orderId: string) => {
    const payment = payments.find(p => p.idOrder === orderId);
    if (payment) {
      const unpaidInstallments = payment.installmentsDetails.filter(installment => installment.paid === "N");
      return { unpaidCount: unpaidInstallments.length, totalCount: payment.numberOfInstallments || 0, details: payment.installmentsDetails };
    }
    return { unpaidCount: 0, totalCount: 0, details: [] }; // Si no hay pago o todas están pagadas
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES').format(date);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order.idCustomer);
    return customerName.toLowerCase().includes(searchName.toLowerCase());
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortDateOrder === "asc") {
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    } else if (sortDateOrder === "desc") {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    }
    return 0;
  });

  const toggleDateSortOrder = () => {
    setSortDateOrder(prevOrder => {
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
        placeholder="Search by customer name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <Table striped hover>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Customer</th>
            <th>TotalCost</th>
            <th>
              OrderDate
              <button onClick={toggleDateSortOrder}>
                {sortDateOrder === "asc" ? "↑" : sortDateOrder === "desc" ? "↓" : "↔"}
              </button>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => {
            const { unpaidCount, totalCount, details } = getPaymentDetails(order.id);
            return (
              <React.Fragment key={order.id}>
                <tr className="orders">
                  <td>{getEmployeeName(order.idEmployee)}</td>
                  <td>{getCustomerName(order.idCustomer)}</td>
                  <td>{order.totalCost}</td>
                  <td>{formatDate(new Date(order.orderDate))}</td>
                  <td>
                    <Button variant="primary" onClick={() => toggleDetails(order.id)}>
                      {expandedOrder === order.id ? "Ocultar detalles" : "Mostrar detalles"}
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(order.id)} className="ms-2">
                      Eliminar
                    </Button>
                  </td>
                </tr>

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
                        <div>
                          <strong>Cuotas adeudadas:</strong> {unpaidCount} / {totalCount}
                        </div>
                        {details.length > 0 && (
                          <div>
                            <strong>Detalles de las cuotas:</strong>
                            <ul>
                              {details.map((installment, index) => (
                                <li key={index}>
                                  Cuota {index + 1}: {formatDate(new Date(installment.paymentDate))} - ${installment.amount}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Orders;
