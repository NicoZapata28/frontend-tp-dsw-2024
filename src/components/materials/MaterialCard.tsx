import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { IMaterial } from '../../services/materials.ts';
import { getCategoryIcon } from '../../utils/getCategoryIcon.ts'

interface MaterialCardProps {
  material: IMaterial;
  onEdit: () => void;
  onDelete: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit, onDelete }) => {
  const imageSrc = typeof material.image === 'string' 
    ? material.image 
    : material.image 
      ? URL.createObjectURL(material.image) 
      : 'defaultImage.png';

  return (
    <div style={styles.card}>
      <img src={getCategoryIcon(material.category)} alt={`${material.category} icon`} style={styles.categoryIcon} />
      <img src={imageSrc} alt={material.name} style={styles.image} />
      <div style={styles.details}>
        <h3 style={styles.title}>{material.name}</h3>
        <p style={styles.brand}>{material.brand}</p>
        <p style={styles.description}>{material.description}</p>
        <p style={styles.cost}>${material.cost.toLocaleString()} | Stock: {material.stock}</p>
      </div>
      <div style={styles.actions}>
        <button style={{ ...styles.button, backgroundColor: '#a3d977' }} onClick={onEdit}>
          <FaEdit />
        </button>
        <button style={{ ...styles.button, backgroundColor: '#ed6d6d' }} onClick={onDelete}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: '8px',
    padding: '10px',
    color: '#fff',
    border: '1px solid #8c7ef0',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '300px',
  },
  categoryIcon: {
    width: '24px',
    height: '24px',
    marginRight: '8px',
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
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  brand: {
    fontSize: '14px',
    color: '#d1d1d1',
  },
  description: {
    fontSize: '14px',
    color: '#d1d1d1',
    marginBottom: '8px',
  },
  cost: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#f5f5f5',
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
    padding: '6px',
    cursor: 'pointer',
  },
} as const;

export default MaterialCard;