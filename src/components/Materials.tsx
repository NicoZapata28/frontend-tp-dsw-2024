import { useState, useEffect } from "react"
import materialsService from "../services/materials.ts"
import { IMaterial } from "../services/materials.ts"
import Table from 'react-bootstrap/Table'

const Materials = () =>{
  const [materials, setMaterials] = useState<IMaterial[]>([])
  
  useEffect(() => {
    materialsService.getAll().then(data =>
      setMaterials(data)
    )
  }, [])

  return (
    <div className="container">
      <h1>Materials</h1>
      <Table striped hover>
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
          {(materials.map(m =>
            <tr className="materials" key={m.id}>
              <td>
              {m.image && <img src={m.image} alt={m.name} style={{ width: '60px', height: 'auto' }} />}
              </td>
              <td>
                {m.category}
              </td>
              <td>
                {m.name}
              </td>
              <td>
                {m.brand}
              </td>
              <td>
                {m.description}
              </td>
              <td>
                {m.stock}
              </td>
              <td>
                ${m.cost}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Materials