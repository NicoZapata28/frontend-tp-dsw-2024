import React from 'react'
import './AddButton.css'

interface AddButtonProps {
  onClick: () => void
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button className="add-button" onClick={onClick}>
      Añadir nuevo
    </button>
  )
}

export default AddButton
