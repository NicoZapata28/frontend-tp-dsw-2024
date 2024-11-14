import React, { useState } from 'react';
import { FaIdCard, FaEnvelope, FaPhone, FaHome, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ICustomer } from '../../services/customer';
import EditCustomerPopup from './EditCustomerPopup.tsx';
import './CustomerCard.css';

interface CustomerCardProps {
    customer: ICustomer;
    onEdit: (id: string, updatedFields: Partial<ICustomer>) => void;
    onDelete: (id: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onDelete }) => {
    const [isEditPopupVisible, setEditPopupVisible] = useState(false);

    const handleEditClick = () => {
        setEditPopupVisible(true);
    };

    const handleSave = (updatedFields: Partial<ICustomer>) => {
        if (customer.id) {
            onEdit(customer.id, updatedFields);
        }
        setEditPopupVisible(false);
    };

    const closePopup = () => {
        setEditPopupVisible(false);
    };

    return (
        <div className="card-container">
            <h3 className="customer-name">{customer.name}</h3>
            <div className="customer-info">
                <div className="customer-info-item">
                    <span className="icon-style"><FaIdCard /></span>
                    <p className="customer-text">DNI {customer.dni}</p>
                </div>
                <div className="customer-info-item">
                    <span className="icon-style"><FaEnvelope /></span>
                    <p className="customer-text">{customer.email}</p>
                </div>
                <div className="customer-info-item">
                    <span className="icon-style"><FaPhone /></span>
                    <p className="customer-text">{customer.phone}</p>
                </div>
                <div className="customer-info-item">
                    <span className="icon-style"><FaHome /></span>
                    <p className="customer-text">{customer.address}</p>
                </div>
            </div>
            <div className="actions">
                <button
                    className="action-button action-button-edit"
                    onClick={handleEditClick}
                >
                    <FaEdit />
                </button>
                <button
                    className="action-button action-button-delete"
                    onClick={() => customer.id && onDelete(customer.id)}
                >
                    <FaTrashAlt />
                </button>
            </div>

            {isEditPopupVisible && (
                <EditCustomerPopup
                    customer={customer}
                    onSave={handleSave}
                    onClose={closePopup}
                />
            )}
        </div>
    );
};

export default CustomerCard;