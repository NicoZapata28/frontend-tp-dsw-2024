import { IMaterial } from '../../services/materials.ts'

interface DetailProps {
  material: IMaterial
  quantity: number
  onQuantityChange: (quantity: number) => void
}

const MaterialDetail: React.FC<DetailProps> = ({ material, quantity, onQuantityChange }) => {
  return (
    <div>
      <p>{material.name} - {material.brand} - ${material.cost} - Stock: {material.stock}</p>
      <label>Quantity</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value))}
        required
      />
    </div>
  )
}

export default MaterialDetail
