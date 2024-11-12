import materialsService, { IMaterial } from '../services/materials';

const handleUpdate = async (materialId: string, updatedData: IMaterial) => {
  try {
    await materialsService.update(materialId, updatedData);
    console.log(`Material con ID ${materialId} actualizado`);
    console.log('Data de actualización: ', updatedData)
  } catch (error) {
    console.error("Error al actualizar el material:", error);
  }
};

export default handleUpdate;