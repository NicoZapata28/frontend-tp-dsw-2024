import materialsService from '../services/materials';

const handleDelete = async (materialId: string) => {
  try {
    await materialsService.remove(materialId);
    console.log(`Material con ID ${materialId} eliminado`);
  } catch (error) {
    console.error("Error al eliminar el material:", error);
  }
};

export default handleDelete;