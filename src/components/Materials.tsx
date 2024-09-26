import { useState, useEffect } from "react";
import materialsService from "../services/materials.ts";
import { IMaterial } from "../services/materials.ts";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const Materials = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [showNoStock, setShowNoStock] = useState(false); // Estado para mostrar solo materiales sin stock
  const [visibleDescriptions, setVisibleDescriptions] = useState<string[]>([]); // Estado para manejar las descripciones visibles

  useEffect(() => {
    materialsService.getAll()
      .then((data) => {
        setMaterials(data);
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
      });
  }, []);

  // Alternar entre mostrar materiales con stock y sin stock
  const toggleShowNoStock = () => {
    setShowNoStock(!showNoStock);
  };

  // Alternar la visibilidad de la descripción de un material
  const toggleDescription = (id: string) => {
    setVisibleDescriptions((prevVisible) =>
      prevVisible.includes(id)
        ? prevVisible.filter((visibleId) => visibleId !== id) // Eliminamos el ID si ya está visible
        : [...prevVisible, id] // Agregamos el ID si no está visible
    );
  };

  // Filtrar los materiales según el estado `showNoStock`
  const filteredMaterials = showNoStock
    ? materials.filter((m) => m.stock === 0)
    : materials.filter((m) => m.stock > 0);

  return (
    <div className="container">
      <h1>Materials</h1>
      <Button variant="primary" onClick={toggleShowNoStock}>
        {showNoStock ? "Mostrar materiales con stock" : "Mostrar materiales sin stock"}
      </Button>

      {filteredMaterials.length === 0 ? (
        <p className="mt-3">
          {showNoStock ? "No hay materiales sin stock" : "No hay materiales disponibles"}
        </p>
      ) : (
        <Table striped hover className="mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Cost</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((m) => (
              <tr className="materials" key={m.id}>
                <td>
                  {m.image && (
                    <img
                      src={m.image}
                      alt={m.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>{m.category}</td>
                <td>{m.name}</td>
                <td>{m.brand}</td>
                <td>{m.stock}</td>
                <td>${m.cost}</td>
                <td>
                  <Button
                    onClick={() => toggleDescription(m.id)}
                    style={{
                      backgroundColor: visibleDescriptions.includes(m.id) ? "white" : "#737373",
                      color: visibleDescriptions.includes(m.id) ? "black" : "white",
                      border: "1px solid black",
                    }}
                  >
                    {visibleDescriptions.includes(m.id) ? "Ocultar descripción" : "Mostrar descripción"}
                  </Button>
                  {/* Mostrar la descripción solo si está visible */}
                  {visibleDescriptions.includes(m.id) && (
                    <p className="mt-2">{m.description}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Materials;
