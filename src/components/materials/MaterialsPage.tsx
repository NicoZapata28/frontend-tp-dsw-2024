import React,  { useState, useEffect } from 'react'
import { IMaterial } from '../../services/materials.ts'
import materialsService from '../../services/materials.ts'
import AddButton from '../shared/AddButton.tsx'
import AddMaterialForm from './AddMaterialForm.tsx'
import './MaterialsPage.css'

const MaterialsPage: React.FC = () =>{
  const [materials, setMaterials] = useState<IMaterial[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    materialsService.getAll().then((data) => {
      setMaterials(data)
    })
  }, [])

  const handleCreateMaterial = (data: FormData) => {
    return materialsService.create(data)
  }

  const togglePopup = () =>{
    setShowForm(!showForm)
  }

  console.log(materials)
  
  return(
    <div className='materials-page'>
      <h1>Materiales</h1>
      <AddButton onClick={togglePopup}/>
      {showForm && (
          <AddMaterialForm createMaterial={handleCreateMaterial} onClose={togglePopup}/>
      )}
    </div>
  )
}

export default MaterialsPage