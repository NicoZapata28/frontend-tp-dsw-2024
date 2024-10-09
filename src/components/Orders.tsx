import { useState, useEffect } from "react";
import React from "react";
import ordersService from "../services/orders.ts";
import employeeService from "../services/employee.ts";
import customerService from "../services/customer.ts";
import materialService from "../services/materials.ts";
import paymentsService from "../services/payments.ts";
import { IOrder } from "../services/orders.ts";
import { ICustomer } from "../services/customer.ts";
import { IEmployee } from "../services/employee.ts";
import { IMaterial } from "../services/materials.ts";
import { IPayment, IInstallmentsDetails } from "../services/payments.ts"; // Asegúrate de que esto incluya IInstallmentsDetail
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

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
    return { unpaidCount: 0, totalCount: 0, details: [] };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES').format(date);
  };

  const handlePagar = async (orderId: string, installmentId: string | undefined) => {
    if (!installmentId) {
      console.error("El ID de la cuota no está definido.");
      return;
    }

    const paymentToUpdate = payments.find(p => p.idOrder === orderId);
    if (!paymentToUpdate) {
      console.error("No se encontró el pago para la orden.");
      return;
    }

    const updatedInstallments = paymentToUpdate.installmentsDetails.map(installment => {
      if (installment._id === installmentId) {
        return { ...installment, paid: "Y" }; 
      }
      return installment; 
    });

    const updatedPayment = {
      ...paymentToUpdate,
      installmentsDetails: updatedInstallments,
    };

    try {
      await paymentsService.update(paymentToUpdate.id!, updatedPayment);
      setPayments(prevPayments => 
        prevPayments.map(p => (p.idOrder === orderId ? updatedPayment : p))
      );
      console.log(`Cuota ${installmentId} marcada como pagada.`); // Log para depuración
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
    }
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
                              {details.map((installment: IInstallmentsDetails) => ( // Asegúrate de que IInstallmentsDetail tenga la propiedad 'number'
                                <li key={installment._id}>
                                  Cuota {installment.installmentN ? installment.installmentN : "N/A"} - ${installment.amount}
                                  {installment.paid === "N" ? (
                                    <Button 
                                      className="ms-2" 
                                      onClick={() => handlePagar(order.id, installment._id)} 
                                    >
                                      Pagar
                                    </Button>
                                  ) : (
                                    <span className="ms-2" style={{ color: 'green' }}>Pagado</span>
                                  )}
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