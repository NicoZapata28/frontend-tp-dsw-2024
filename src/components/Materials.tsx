import { useState, useEffect } from "react"
import materialsService from "../services/materials.ts"
import { IMaterial } from "../services/materials.ts"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const Materials = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([])
  const [showNoStock, setShowNoStock] = useState(false) // Estado para mostrar solo materiales sin stock
  
  useEffect(() => {
    materialsService.getAll().then(data => setMaterials(data))
  }, [])

  // Alternar entre mostrar materiales con stock y sin stock
  const toggleShowNoStock = () => {
    setShowNoStock(!showNoStock)
  }

  // Filtrar los materiales según el estado `showNoStock`
  const filteredMaterials = showNoStock 
    ? materials.filter(m => m.stock === 0)
    : materials.filter(m => m.stock > 0)

  return (
    <div className="container">
      <h1>Materials</h1>
      {/* Botón para alternar la visibilidad de los materiales sin stock */}
      <Button variant="primary" onClick={toggleShowNoStock}>
        {showNoStock ? "Mostrar materiales con stock" : "Mostrar materiales sin stock"}
      </Button>
      
      <Table striped hover className="mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Category</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Stock</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map(m => (
            <tr className="materials" key={m.id}>
              <td>
                {m.image && <img src={m.image} alt={m.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />}
              </td>
              <td>{m.category}</td>
              <td>{m.name}</td>
              <td>{m.brand}</td>
              <td>{m.description}</td>
              <td>{m.stock}</td>
              <td>${m.cost}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Materials
