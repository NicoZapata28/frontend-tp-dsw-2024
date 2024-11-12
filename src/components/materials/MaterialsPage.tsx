import React, { useState, useEffect } from 'react';
import { IMaterial } from '../../services/materials';
import materialsService from '../../services/materials';
import './MaterialsPage.css';
import Grid from "../Grid";
import MaterialCard from "../materials/MaterialCard";
import handleDelete from '../../utils/handleDelete.tsx';
import handleUpdate from '../../utils/handleUpdate.tsx';

const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([]);

  useEffect(() => {
    materialsService.getAll().then((data) => {
      setMaterials(data);
    });
  }, []);

  return (
    <div className='materials-page'>
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
  );
}

export default MaterialsPage;