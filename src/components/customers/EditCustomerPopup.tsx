import React, { useState } from 'react';
import { ICustomer } from '../../services/customer';
import './EditCustomerPopup.css';

interface EditCustomerPopupProps {
  customer: ICustomer;
  onSave: (updatedFields: Partial<ICustomer>) => void;
  onClose: () => void;
}

const EditCustomerPopup: React.FC<EditCustomerPopupProps> = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<ICustomer>>({
    address: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== '')
    );
    onSave(updatedFields);
    onClose();
  };

  return (
    <div className="popup-background">
      <div className="popup-container">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="customer-header">
          <h2>{customer.name}</h2>
          <p className="customer-dni">DNI: {customer.dni}</p>
        </div>
        <form>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nueva Dirección"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nuevo Email"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nuevo Teléfono"
          />
          <button type="button" className="save-button" onClick={handleSave}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerPopup;