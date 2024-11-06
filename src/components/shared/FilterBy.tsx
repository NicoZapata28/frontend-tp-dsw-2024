import React from 'react'
import triangle from '../../img/triangle-filter-icon.svg'
import './FilterBy.css'

interface FilterByProps {
  onFilter: () => void
}

const FilterBy: React.FC<FilterByProps> = ({ onFilter }) => {
  return (
    <div className="filter-by-container">
      <button className="filter-by-button" onClick={onFilter}>
        Filtrar por 
        <img src={triangle} alt="Desplegable" className="dropdown-icon" />
      </button>
    </div>
  )
}

export default FilterBy
