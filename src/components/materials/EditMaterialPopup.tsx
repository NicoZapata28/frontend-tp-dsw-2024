import React, { useState } from 'react';
import { BsCashCoin, BsBoxSeam, BsLaptop } from 'react-icons/bs';
import materialService, { IMaterial } from '../../services/materials';
import './PopupStyle.css';

interface EditMaterialPopupProps {
  materialId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMaterialPopup: React.FC<EditMaterialPopupProps> = ({ materialId, onClose, onUpdate }) => {
  const [cost, setCost] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [materialData, setMaterialData] = useState<Partial<Omit<IMaterial, 'image' | 'id'>>>({});
  const [editMode, setEditMode] = useState<null | 'cost' | 'stock' | 'full'>(null);

  const handleSave = async () => {
    let updatedFields: Partial<IMaterial> = {};
    if (editMode === 'cost' && cost !== null) {
      updatedFields = { cost };
    } else if (editMode === 'stock' && stock !== null) {
      updatedFields = { stock };
    } else if (editMode === 'full') {
      updatedFields = { ...materialData };
    }

    try {
      await materialService.update(materialId, updatedFields as IMaterial);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error al actualizar el material:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editMode === 'cost') {
      setCost(Number(value));
    } else if (editMode === 'stock') {
      setStock(Number(value));
    } else if (editMode === 'full') {
      setMaterialData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="button-cancel" onClick={onClose}>X</button>

        <div className="button-group">
          <button className="button-cost" onClick={() => setEditMode('cost')}><BsCashCoin /></button>
          <button className="button-stock" onClick={() => setEditMode('stock')}><BsBoxSeam /></button>
          <button className="button-full" onClick={() => setEditMode('full')}><BsLaptop /></button>
        </div>

        {editMode === 'cost' && (
          <div className="input-section">
            <label>Costo</label>
            <input type="number" value={cost ?? ''} onChange={handleInputChange} />
          </div>
        )}

        {editMode === 'stock' && (
          <div className="input-section">
            <label>Stock</label>
            <input type="number" value={stock ?? ''} onChange={handleInputChange} />
          </div>
        )}

        {editMode === 'full' && (
          <div className="input-section">
            <label>Nombre</label>
            <input type="text" name="name" value={materialData.name ?? ''} onChange={handleInputChange} />
            <label>Descripción</label>
            <input type="text" name="description" value={materialData.description ?? ''} onChange={handleInputChange} />
            <label>Marca</label>
            <input type="text" name="brand" value={materialData.brand ?? ''} onChange={handleInputChange} />
            <label>Categoría</label>
            <input type="text" name="category" value={materialData.category ?? ''} onChange={handleInputChange} />
          </div>
        )}

        <button className="button-save" onClick={handleSave}>Guardar Cambios</button>
      </div>
    </div>
  );
};

export default EditMaterialPopup;