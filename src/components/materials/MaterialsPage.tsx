import React,  { useState, useEffect } from 'react'
import { IMaterial } from '../../services/materials.ts'
import materialsService from '../../services/materials.ts'
import materialCostsService from '../../services/materialCosts.ts'
import AddButton from '../shared/AddButton.tsx'
import AddMaterialForm from './AddMaterialForm.tsx'
import Grid from "../Grid"
import MaterialCard from "../materials/MaterialCard"
import handleDelete from '../../utils/handleDelete.tsx'
import handleUpdate from '../../utils/handleUpdate.tsx'
import './MaterialsPage.css'

const MaterialsPage: React.FC = () =>{
  const [materials, setMaterials] = useState<IMaterial[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    materialsService.getAll().then((data) => {
      setMaterials(data);
    })
  }, [])

  const handleCreateMaterial = async (data: FormData): Promise<IMaterial> => {
    try {
      const newMaterial = await materialsService.create(data)
      
      if (!newMaterial.id) {
        throw new Error('idMaterial not exists.')
      }
  
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial])
  
      const costHistoryEntry = {
        updateDate: new Date(),
        cost: newMaterial.cost,
      }
  
      await materialCostsService.create({
        idMaterial: newMaterial.id,
        costHistory: [costHistoryEntry],
      })
  
      console.log('Cost history added for material:', newMaterial.id)

      togglePopup()
  
      return newMaterial
    } catch (error) {
      console.error('Error creating material or cost history:', error)
      throw error
    }
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
      <Grid
        items={materials}
        CardComponent={({ data }) => (
          <MaterialCard
            material={data}
            onDelete={() => handleDelete(data.id)}
            onUpdate={() => handleUpdate(data.id, data)}
          />
        )}
      />
    </div>
  )
}

export default MaterialsPage