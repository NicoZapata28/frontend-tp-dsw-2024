import React, { useState, useEffect } from 'react'
import { BsCashCoin, BsBoxSeam, BsLaptop } from 'react-icons/bs'
import materialService, { IMaterial } from '../../services/materials'
import './PopupStyle.css'

interface EditMaterialPopupProps {
  materialId: string
  onClose: () => void
}

const EditMaterialPopup: React.FC<EditMaterialPopupProps> = ({ materialId, onClose }) => {
  const [materialData, setMaterialData] = useState<Partial<IMaterial>>({})
  const [originalMaterialData, setOriginalMaterialData] = useState<Partial<IMaterial>>({})
  const [editMode, setEditMode] = useState<null | 'cost' | 'stock' | 'full'>(null)

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const material = await materialService.getById(materialId)
        setMaterialData(material)
        setOriginalMaterialData(material)
      } catch (error) {
        console.error('Error fetching material data:', error)
      }
    }
    fetchMaterial()
  }, [materialId])

  const handleSave = async () => {
    try {
      await materialService.update(materialId, materialData as IMaterial)
      onClose()
    } catch (error) {
      console.error('Error al actualizar el material:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMaterialData((prevData) => ({
      ...prevData,
      [name]: name === 'cost' || name === 'stock' ? Number(value) : value, 
    }))
  }

  const handleEditMode = (mode: 'cost' | 'stock' | 'full') => {
    setEditMode(mode)
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="button-cancel" onClick={onClose}>X</button>

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

        <div className="button-group">
          <button className="button-cost" onClick={() => handleEditMode('cost')}><BsCashCoin /></button>
          <button className="button-stock" onClick={() => handleEditMode('stock')}><BsBoxSeam /></button>
          <button className="button-full" onClick={() => handleEditMode('full')}><BsLaptop /></button>
        </div>

        {editMode === 'cost' && (
          <div className="input-section">
            <label>Costo</label>
            <input
              type="number"
              name="cost"
              value={materialData.cost ?? ''}
              onChange={handleInputChange}
            />
          </div>
        )}
        {editMode === 'stock' && (
          <div className="input-section">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={materialData.stock ?? ''}
              onChange={handleInputChange}
            />
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

        {editMode && <button className="button-save" onClick={handleSave}>Guardar Cambios</button>}
      </div>
    </div>
  )
}

export default EditMaterialPopup