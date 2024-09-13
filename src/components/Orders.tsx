import { useState, useEffect } from "react";
import ordersService from "../services/orders.ts";
import employeeService from "../services/employee.ts";
import customerService from "../services/customer.ts";
import materialService from "../services/materials.ts";
import { IOrder } from "../services/orders.ts";
import { ICustomer } from "../services/customer.ts";
import { IEmployee } from "../services/employee.ts";
import { IMaterial } from "../services/materials.ts";
import Table from "react-bootstrap/Table";

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ""; // Maneja el caso en que no sea una fecha válida
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);

  useEffect(() => {
    ordersService.getAll().then((data) => setOrders(data));
    employeeService.getAll().then((data) => setEmployees(data));
    customerService.getAll().then((data) => setCustomers(data));
    materialService.getAll().then((data) => setMaterials(data));
  }, []);

  const getEmployeeName = (idEmployee: string) => {
    const employee = employees.find((e) => e.cuil === idEmployee);
    return employee ? employee.name : "Desconocido";
  };

  const getCustomerName = (idCustomer: string) => {
    const customer = customers.find((c) => c.id === idCustomer);
    return customer ? customer.name : "Desconocido";
  };

  const getMaterialDescription = (idMaterial: string) => {
    const material = materials.find((m) => m.id === idMaterial);
    return material ? material.description : "Desconocido";
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Customer</th>
            <th>Material</th> {/* Cambié de IdMaterial a Material */}
            <th>TotalCost</th>
            <th>OrderDate</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((m) => (
            <tr className="orders" key={m.orderNumber}>
              <td>{getEmployeeName(m.idEmployee)}</td>
              <td>{getCustomerName(m.idCustomer)}</td>
              <td>{getMaterialDescription(m.idMaterial)}</td> {/* Mostrar descripción */}
              <td>{m.totalCost}</td>
              <td>{formatDate(new Date(m.orderDate))}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Orders;
