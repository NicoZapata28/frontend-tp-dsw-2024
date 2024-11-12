import React, { useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { IMaterial } from '../../services/materials'
import { getCategoryIcon } from '../../utils/getCategoryIcon'
import EditMaterialPopup from '../materials/EditMaterialPopup.tsx'

interface MaterialCardProps {
  material: IMaterial
  onDelete: () => void
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onDelete }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  const imageSrc = typeof material.image === 'string' 
    ? material.image 
    : material.image 
      ? URL.createObjectURL(material.image) 
      : 'defaultImage.png'

  return (
    <div style={styles.card}>
      <img src={imageSrc} alt={material.name} style={styles.image} />
      <div style={styles.details}>
        <div style={styles.titleContainer}>
          <h3 style={styles.title}>{material.name}</h3>
          <img 
            src={getCategoryIcon(material.category)} 
            alt={`${material.category} icon`} 
            style={styles.categoryIcon } 
          />
        </div>
        <p style={styles.brand}>{material.brand}</p>
        <p style={styles.description}>{material.description}</p>
        <div style={styles.costContainer}>
          <p style={styles.cost}>${material.cost.toLocaleString()}</p>
        </div>
        <p style={styles.stock}>Stock: {material.stock}</p>
      </div>
      <div style={styles.actions}>
        <button style={{ ...styles.button, backgroundColor: '#a3d977' }} onClick={handleOpenPopup}>
          <FaEdit />
        </button>
        <button style={{ ...styles.button, backgroundColor: '#ed6d6d' }} onClick={onDelete}>
          <FaTrashAlt />
        </button>
      </div>
      
      {isPopupOpen && (
        <EditMaterialPopup 
          materialId={material.id} 
          onClose={handleClosePopup} 
        />
      )}
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    border: '1px solid #BB86FC',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    width: '80%',
  },
  categoryIcon: {
    width: '20px',
    height: '20px',
    marginLeft: '6px',
    position: 'relative',
    top: '-2px', 
  },
  image: {
    width: '50px',
    height: '50px',
    borderRadius: '4px',
    marginRight: '10px',
  },
  details: {
    flex: 1,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  brand: {
    fontSize: '14px',
    color: '#d1d1d1',
    marginBottom: '4px',
  },
  description: {
    fontSize: '14px',
    color: '#d1d1d1',
    marginBottom: '4px',
  },
  costContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '4px',
  },
  cost: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#f5f5f5',
    margin: '0 16px 0 0',
    lineHeight: '1.5',
  },
  stock: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#f5f5f5',
    marginBottom: '4px',
  },
  costsButton: {
    backgroundColor: '#BB86FC',
    color: '#121212',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 6px',
    fontSize: '12px',
    cursor: 'pointer',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  button: {
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    padding: '2px',
    cursor: 'pointer',
  },
} as const;

export default MaterialCard;