import React from "react"
import { useState, useEffect } from "react"
import ordersService from "../../services/orders"
import { IOrder } from "../../services/orders"
import customerService from "../../services/customer"
import { ICustomer } from "../../services/customer"
import employeeService from "../../services/employee"
import { IEmployee } from "../../services/employee"

interface EditOrderFormProps {
  orderId: string;
  onSave: () => void;
  onCancel: () => void;
}

const EditOrderForm: React.FC<EditOrderFormProps> = ({ orderId, onSave, onCancel }) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await ordersService.getAll().then(orders => orders.find(o => o.id === orderId));
        const customersData = await customerService.getAll();
        const employeesData = await employeeService.getAll();

        if (orderData) {
          setOrder(orderData);
          setTotalCost(orderData.totalCost);
        }
        setCustomers(customersData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, [orderId]);

  const handleSave = async () => {
    if (order) {
      try {
        await ordersService.update(orderId, { ...order, totalCost });
        onSave();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };

  const handleDetailChange = (index: number, field: keyof IOrder["details"][number], value: string | number) => {
    if (order) {
      const updatedDetails = [...order.details];
      updatedDetails[index] = { ...updatedDetails[index], [field]: value };
      setOrder({ ...order, details: updatedDetails });
      setTotalCost(updatedDetails.reduce((acc, detail) => acc + detail.quantity * detail.price, 0));
    }
  };

  if (!order) return <p>Cargando orden...</p>;

  return (
    <div>
      <h2>Editar Orden</h2>
      <div>
        <label>Cliente:</label>
        <select
          value={order.idCustomer}
          onChange={(e) => setOrder({ ...order, idCustomer: e.target.value })}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Empleado:</label>
        <select
          value={order.idEmployee}
          onChange={(e) => setOrder({ ...order, idEmployee: e.target.value })}
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Método de Pago:</label>
        <input
          type="text"
          value={order.paymentMethod}
          onChange={(e) => setOrder({ ...order, paymentMethod: e.target.value })}
        />
      </div>

      <div>
        <h3>Detalles de Productos</h3>
        {order.details.map((detail, index) => (
          <div key={index}>
            <label>Producto ID:</label>
            <input
              type="text"
              value={detail.idProduct}
              onChange={(e) => handleDetailChange(index, "idProduct", e.target.value)}
            />
            <label>Cantidad:</label>
            <input
              type="number"
              value={detail.quantity}
              onChange={(e) => handleDetailChange(index, "quantity", Number(e.target.value))}
            />
            <label>Precio:</label>
            <input
              type="number"
              value={detail.price}
              onChange={(e) => handleDetailChange(index, "price", Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div>
        <label>Costo Total:</label>
        <input type="number" value={totalCost} readOnly />
      </div>

      <button onClick={handleSave}>Guardar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default EditOrderForm