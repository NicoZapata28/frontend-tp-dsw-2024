import { useState, useEffect } from "react"
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
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"

interface IOrderWithDetails extends IOrder {
  details?: string;  // Nueva propiedad para almacenar los detalles
}

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
  const [orders, setOrders] = useState<IOrderWithDetails[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrderWithDetails | null>(null);
  const [orderDetails, setOrderDetails] = useState<string>("");

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

  const handleShowModal = (order: IOrderWithDetails) => {
    setSelectedOrder(order);
    setOrderDetails(order.details || "");  // Cargar detalles previos si existen
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOrderDetails("");
  };

  const handleSaveDetails = () => {
    if (selectedOrder) {
      // Actualizar los detalles de la orden seleccionada
      const updatedOrders = orders.map((order) =>
        order.orderNumber === selectedOrder.orderNumber
          ? { ...order, details: orderDetails } // Actualizamos con los nuevos detalles
          : order
      );
      setOrders(updatedOrders);
      setShowModal(false);
    }
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Customer</th>
            <th>Material</th>
            <th>TotalCost</th>
            <th>OrderDate</th>
            <th>Details</th> {/* Nueva columna para los detalles */}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((m) => (
            <tr className="orders" key={m.orderNumber}>
              <td>{getEmployeeName(m.idEmployee)}</td>
              <td>{getCustomerName(m.idCustomer)}</td>
              <td>{getMaterialDescription(m.idMaterial)}</td>
              <td>{m.totalCost}</td>
              <td>{formatDate(new Date(m.orderDate))}</td>
              <td>{m.details || "No details"}</td> {/* Mostrar detalles o mensaje por defecto */}
              <td>
                <Button variant="info" onClick={() => handleShowModal(m)}>
                  Add/Edit Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar detalles */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add/Edit Details for Order {selectedOrder?.orderNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOrderDetails">
              <Form.Label>Order Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={orderDetails}
                onChange={(e) => setOrderDetails(e.target.value)}
                placeholder="Enter additional details about the order"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveDetails}>
            Save Details
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
