import { useState, useEffect } from "react"
import materialsService from "../services/materials.ts"
import { IMaterial } from "../services/materials.ts"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge'; 

const Materials = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([])
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [stockSortOrder, setStockSortOrder] = useState<string>("none");
  const [costSortOrder, setCostSortOrder] = useState<string>("none");
  const [showNoStock, setShowNoStock] = useState(false) // Estado para mostrar solo materiales sin stock
  const [visibleDescriptions, setVisibleDescriptions] = useState<string[]>([])
  
  const LOW_STOCK_THRESHOLD = 5; // Umbral para considerar "poco stock"
  
  useEffect(() => {
    materialsService.getAll().then(data => {
      setMaterials(data);
      
      const uniqueCategories = Array.from(new Set(data.map(m => m.category)))
      const uniqueBrands = Array.from(new Set(data.map(m => m.brand)))
      setCategories(uniqueCategories)
      setBrands(uniqueBrands)
      
    })
  }, [])

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

  const toggleStockSortOrder = () => {
    if (stockSortOrder === "none") setStockSortOrder("asc");
    else if (stockSortOrder === "asc") setStockSortOrder("desc");
    else setStockSortOrder("none");
  };

  const toggleCostSortOrder = () => {
    if (costSortOrder === "none") setCostSortOrder("asc");
    else if (costSortOrder === "asc") setCostSortOrder("desc");
    else setCostSortOrder("none");
  };

  const filteredMaterials = materials.filter(material => {
    const matchCategory = selectedCategory === "All" || material.category === selectedCategory;
    const matchBrand = selectedBrand === "All" || material.brand === selectedBrand;
    const matchProduct = material.name.toLowerCase().includes(searchProduct.toLowerCase());
    return matchCategory && matchBrand && matchProduct;
  });

  // Filtrar los materiales según el estado `showNoStock`
  const finalFilteredMaterials = showNoStock 
    ? filteredMaterials.filter(m => m.stock === 0)
    : filteredMaterials.filter(m => m.stock > 0)

    const sortedMaterials = finalFilteredMaterials.sort((a, b) => {
      if (stockSortOrder !== "none") {
        return stockSortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock;
      } else if (costSortOrder !== "none") {
        return costSortOrder === "asc" ? a.cost - b.cost : b.cost - a.cost;
      }
      return 0;
    });
    
return (
  <div className="container">
    <h1>Materials</h1>
     
    {/* Botón para alternar entre mostrar materiales con o sin stock */}
    <Button variant="primary" onClick={toggleShowNoStock}>
      {showNoStock ? "Mostrar materiales con stock" : "Mostrar materiales sin stock"}
    </Button>

    {/* Filtro por categoría */}
    <Form.Select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="mt-3"
    >
      <option value="All">All Categories</option>
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </Form.Select>

    {/* Filtro por marca */}
    <Form.Select
      value={selectedBrand}
      onChange={(e) => setSelectedBrand(e.target.value)}
      className="mt-3"
    >
      <option value="All">All Brands</option>
      {brands.map(brand => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </Form.Select>

    {/* Filtro por nombre del producto */}
    <input
      type="text"
      placeholder="Search by product name"
      value={searchProduct}
      onChange={(e) => setSearchProduct(e.target.value)}
      className="mt-3"
    />

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
            <th>
              Stock
              <button onClick={toggleStockSortOrder}>
                {stockSortOrder === "asc" ? "↑" : stockSortOrder === "desc" ? "↓" : "↔"}
              </button>
            </th>
            <th>
              Cost
              <button onClick={toggleCostSortOrder}>
                {costSortOrder === "asc" ? "↑" : costSortOrder === "desc" ? "↓" : "↔"}
              </button>
            </th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {sortedMaterials.map((m) => (
            <tr className="materials" key={m.id}>
              <td>
                {m.image && (
                  <img
                    src={typeof m.image === 'string' ? m.image : URL.createObjectURL(m.image)}
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

              <td>
                {m.stock}
                {m.stock > 0 && m.stock <= LOW_STOCK_THRESHOLD && (
                    <Badge bg="warning" className="ml-2">
                      Poco stock
                    </Badge>
                  )}
                
                </td>
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
)
};

export default Materials;
