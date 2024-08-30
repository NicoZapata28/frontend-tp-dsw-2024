import { useState, useEffect } from "react"
import materialsService from "./services/materials.ts"
import { IMaterial } from "./services/materials.ts"

const App = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([])
  
  useEffect(() => {
    materialsService.getAll().then(data =>{
      console.log('data from service:',data)
      setMaterials(data)
    }
    ).catch(error => {
      console.error('Error fetching materials: ', error)
    })
  }, [])

  useEffect(() => {
    console.log('state updated:', materials)
  }, [materials])

  return (
    <div>
      <h1>Materials</h1>
      {Array.isArray(materials) && materials.length > 0 ? (materials.map(m =>
        <li className="materials" key={m.id}>
          {m.name}
        </li>
      )
      ) : (
        <p>No materials found.</p>
      )}
    </div>
  )}

export default App