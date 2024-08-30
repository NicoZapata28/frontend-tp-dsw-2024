import { useState, useEffect } from "react"
import materialsService from "./services/materials.ts"
import { IMaterial } from "./services/materials.ts"

const App = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([])
  
  useEffect(() => {
    materialsService.getAll().then(data =>
      setMaterials(data)
    )
  }, [])

  return (
    <div>
      <h1>Materials</h1>
      {(materials.map(m =>
        <li className="materials" key={m.id}>
          {m.name} | {m.description} | ${m.cost} | Stock: {m.stock}
        </li>
      ))}
    </div>
  )}

export default App