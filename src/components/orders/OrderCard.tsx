import React, { useState } from "react"
import { IOrder } from "../../services/orders"
import { ICustomer } from "../../services/customer"
import { IMaterial } from "../../services/materials"
import { IPayment } from "../../services/payments"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import EditOrderForm from "./EditOrder.tsx"
import "./OrderCard.css"


interface OrderCardProps {
  order: IOrder
  customers: ICustomer[]
  materials: IMaterial[]
  payments: IPayment[]
  onDelete: (orderId: string) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, customers, materials, payments, onDelete }) => {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)


  const getCustomerName = (id: string) => {
    const customer = customers.find(c => c.id === id)
    return customer ? customer.name : "Desconocido"
  };

  const getMaterialName = (idProduct: string) => {
    const material = materials.find(m => m.id === idProduct)
    return material ? material.name : "Desconocido"
  }

  const getPaymentDetails = () => {
    const payment = payments.find(p => p.idOrder === order.id)
    if (payment) {
      const unpaidInstallments = payment.installmentsDetails.filter(installment => installment.paid === "N")
      return { unpaidCount: unpaidInstallments.length, totalCount: payment.numberOfInstallments || 0, details: payment.installmentsDetails };
    }
    return { unpaidCount: 0, totalCount: 0, details: [] }
  }

  const formatDate = (date: Date) => new Intl.DateTimeFormat('es-ES').format(date)

  const toggleDetails = () => setExpanded(!expanded)
  const toggleEdit = () => setIsEditing(!isEditing)

  const { unpaidCount, totalCount, details } = getPaymentDetails()

  const handleSave = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <EditOrderForm
        orderId={order.id}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="card-order">
      <Card.Body>
        <Card.Title>{getCustomerName(order.idCustomer)}</Card.Title>
        <Card.Text>
          <strong>Total:</strong> ${order.totalCost} <br />
          <strong>Fecha de Orden:</strong> {formatDate(new Date(order.orderDate))}
        </Card.Text>
        <Button className="button-detail" onClick={toggleDetails}>
          {expanded ? "Ocultar detalles" : "Ver detalles"}
        </Button>
        <Button variant="danger" onClick={() => onDelete(order.id)} className="ms-2">
          Eliminar
        </Button>
        <Button variant="primary" onClick={toggleEdit} className="ms-2">
        Editar
        </Button>

        {expanded && (
          <div className="mt-3">
            <strong>Detalles de la orden:</strong>
            {order.details.length > 0 ? (
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
        )}
      </Card.Body>
    </Card>
  )
}

export default OrderCard
