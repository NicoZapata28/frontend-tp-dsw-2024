import React, { useState, useEffect } from 'react';
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
  const [materialData, setMaterialData] = useState<Partial<IMaterial>>({});
  const [originalMaterialData, setOriginalMaterialData] = useState<Partial<IMaterial>>({});
  const [editMode, setEditMode] = useState<null | 'cost' | 'stock' | 'full'>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const material = await materialService.getById(materialId);
        setMaterialData(material);
        setOriginalMaterialData(material); // Guarda los datos originales para referencia
      } catch (error) {
        console.error('Error fetching material data:', error);
      }
    };
    fetchMaterial();
  }, [materialId]);

  const handleSave = async () => {
    const updatedFields = {
      ...originalMaterialData,
      ...Object.fromEntries(
        Object.entries(materialData).filter(
          ([key, value]) => value !== originalMaterialData[key as keyof IMaterial]
        )
      )
    };
  
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

  const handleEditMode = (mode: 'cost' | 'stock' | 'full') => {
    setEditMode(mode);
    if (mode === 'cost') {
      setCost(null);
    } else if (mode === 'stock') {
      setStock(null);
    } else if (mode === 'full') {
      setMaterialData({}); // Vacía los campos de materialData para que aparezcan en blanco
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="button-cancel" onClick={onClose}>X</button>
  
        {/* Sección de encabezado: imagen e información del material */}
        <div className="header-section">
          {originalMaterialData.image && (
            <img
              src={
                typeof originalMaterialData.image === 'string'
                  ? originalMaterialData.image
                  : URL.createObjectURL(originalMaterialData.image)
              }
              alt="Material"
              className="material-image"
            />
          )}
          <div className="material-info">
            <h3 className="material-name">{originalMaterialData.name}</h3>
            <p className="material-brand">{originalMaterialData.brand}</p>
          </div>
        </div>
  
        {/* Grupo de botones de edición */}
        <div className="button-group">
          <button className="button-cost" onClick={() => handleEditMode('cost')}><BsCashCoin /></button>
          <button className="button-stock" onClick={() => handleEditMode('stock')}><BsBoxSeam /></button>
          <button className="button-full" onClick={() => handleEditMode('full')}><BsLaptop /></button>
        </div>
  
        {/* Sección de edición */}
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
  
        {/* Botón de guardar */}
        {editMode && <button className="button-save" onClick={handleSave}>Guardar Cambios</button>}
      </div>
    </div>
  );  
};

export default EditMaterialPopup;