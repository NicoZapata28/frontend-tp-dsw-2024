import React from 'react'
import { useState, useEffect } from 'react'
import { IMaterial } from '../../services/materials.ts'
import materialsService from '../../services/materials.ts'
import './MaterialsPage.css'

const MaterialsPage: React.FC = () =>{
  const [materials, setMaterials] = useState<IMaterial[]>([])

  useEffect(() => {
    materialsService.getAll().then((data) => {
      setMaterials(data)
    })
  }, [])

  console.log(materials)
  return(
    <div className='materials-page'>

    </div>
  )
}

export default MaterialsPage