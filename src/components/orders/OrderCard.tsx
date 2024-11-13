import React, { useState, useEffect, useCallback } from 'react'
import { IOrder } from '../../services/orders'
import { ICustomer } from '../../services/customer'
import { IMaterial } from '../../services/materials'
import { IPayment } from '../../services/payments'
import { markInstallmentAsPaid } from '../../services/payments.ts'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import EditOrderForm from './EditOrder'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import './OrderCard.css'

interface OrderCardProps {
  order: IOrder;
  customers: ICustomer[];
  materials: IMaterial[];
  payments: IPayment[];
  onDelete: (orderId: string) => void;
}

interface Installment {
  _id: string; 
  installmentN: number;
  amount: number;
  paid: "Y" | "N"; 
  paymentDate: string; 
}

const OrderCard: React.FC<OrderCardProps> = ({ order, customers, materials, payments, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [installments, setInstallments] = useState<Installment[]>([]); 

const getPaymentDetails = useCallback(() => {
  const payment = payments.find(p => p.idOrder === order.id);
  if (payment) {
    const unpaidInstallments = payment.installmentsDetails.filter(installment => installment.paid === "N");
    return { 
      unpaidCount: unpaidInstallments.length, 
      totalCount: payment.numberOfInstallments || 0, 
      details: payment.installmentsDetails.map(detail => ({
        _id: detail._id || "", 
        installmentN: detail.installmentN,
        amount: detail.amount,
        paid: detail.paid,
        paymentDate: detail.paymentDate,
      })) 
    };
  }
  return { unpaidCount: 0, totalCount: 0, details: [] };
}, [payments, order.id]);


  useEffect(() => {
    const paymentDetails = getPaymentDetails().details;
    setInstallments(paymentDetails); 
  }, [payments, order.id, getPaymentDetails]);

  const getCustomerName = (id: string) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : "Desconocido";
  };

  const getMaterialName = (idProduct: string) => {
    const material = materials.find(m => m.id === idProduct);
    return material ? material.name : "Desconocido";
  };

  const formatDate = (date: Date) => new Intl.DateTimeFormat('es-ES').format(date);

  const toggleDetails = () => setExpanded(!expanded);
  
  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    setIsEditing(false);
  };

const handlePayment = async (installmentId: string | number) => {
  try {
    await markInstallmentAsPaid(order.id.toString(), installmentId.toString());

    setInstallments(prevInstallments =>
      prevInstallments.map(installment =>
        installment._id === installmentId || installment.installmentN === installmentId
          ? { ...installment, paid: "Y" }
          : installment
      )
    );
  } catch (error) {
    console.error('Error al marcar la cuota como pagada:', error);
    alert('Hubo un error al intentar marcar la cuota como pagada. Intenta nuevamente más tarde.');
  }
};

  const { unpaidCount, totalCount } = getPaymentDetails();

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
    <div className="card-container" style={{ position: 'relative', marginBottom: expanded ? '200px' : 'auto' }}>
      <Card className="card-order">
        <Card.Body>
          <Card.Title className='name-customer'>{getCustomerName(order.idCustomer)}</Card.Title>
          <Card.Text>
            <strong className='info-order'>{formatDate(new Date(order.orderDate))}</strong> <br /> <br />
            <strong className='info-order'>${order.totalCost}</strong>
          </Card.Text>
          <Button className='button-detail' onClick={toggleDetails}>
            {expanded ? "Ocultar detalles" : "Ver detalles"}
          </Button>
          <Button className='button button-delete' onClick={() => onDelete(order.id)}>
            <FaTrashAlt />
          </Button>
          <Button className='button button-edit' onClick={toggleEdit}>
            <FaEdit />
          </Button>
        </Card.Body>
      </Card>

      {expanded && (
        <div className="details-order">
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
          {installments.length > 0 && (
            <div>
              <div style={{ border: '1px solid black', width: '90%', margin: 'auto' }} />
              <strong>Detalles de las cuotas:</strong>
              <div>
                <strong>Cuotas adeudadas:</strong> {unpaidCount} / {totalCount}
              </div>
              <ul>
                {installments.map((installment, index) => (
                  <li key={installment._id}>
                    Cuota {index + 1}: {formatDate(new Date(installment.paymentDate))} - ${installment.amount}
                    {installment.paid === "Y" ? (
                      <span className="paid-status">Pagada</span>
                    ) : (
                    <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handlePayment(installment._id)}
                    className="pay-button"
                    disabled={installment.paid !== "N"}  
                    >
                    Pagar
                    </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
