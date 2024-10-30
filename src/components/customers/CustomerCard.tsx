import React from 'react';
import { FaIdCard, FaEnvelope, FaPhone, FaHome, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ICustomer } from '../../services/customer';

interface CustomerCardProps {
    customer: ICustomer;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onDelete }) => {
    const cardContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '250px',
        padding: '15px',
        borderRadius: '10px',
        backgroundColor: '#1f1f1f',
        color: 'white',
        border: '2px solid #a07fdd',
        position: 'relative',
    };

    const customerNameStyle: React.CSSProperties = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginBottom: '10px',
    };

    const customerInfoStyle: React.CSSProperties = {
        marginBottom: '15px',
    };

    const iconStyle: React.CSSProperties = {
        marginRight: '8px',
        display: 'flex',
        alignItems: 'center',
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
        position: 'absolute',
        top: '10px',
        right: '10px',
    };

    const actionButtonStyle = (color: string): React.CSSProperties => ({
        background: color,
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1.2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px',
        borderRadius: '50%',
        transition: 'opacity 0.3s',
    });

    const handleMouseOver = (e: React.MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
    };

    const handleMouseOut = (e: React.MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
    };

    return (
        <div style={cardContainerStyle}>
            <h3 style={customerNameStyle}>{customer.name}</h3>
            <div style={customerInfoStyle}>
                <p><span style={iconStyle}><FaIdCard /></span> DNI {customer.dni}</p>
                <p><span style={iconStyle}><FaEnvelope /></span> {customer.email}</p>
                <p><span style={iconStyle}><FaPhone /></span> {customer.phone}</p>
                <p><span style={iconStyle}><FaHome /></span> {customer.address}</p>
            </div>
            <div style={actionsStyle}>
                <button 
                    style={actionButtonStyle('#b3cc50')}
                    onClick={() => onEdit(customer.id)}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    <FaEdit />
                </button>
                <button 
                    style={actionButtonStyle('#e87070')}
                    onClick={() => onDelete(customer.id)}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    <FaTrashAlt />
                </button>
            </div>
        </div>
    );
};

export default CustomerCard;