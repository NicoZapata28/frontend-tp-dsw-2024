import { useState, useEffect } from "react"
import materialsService from "../services/materials.ts"
import { IMaterial } from "../services/materials.ts"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';

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
  
  useEffect(() => {
    materialsService.getAll().then(data => {
      setMaterials(data);
      
      const uniqueCategories = Array.from(new Set(data.map(m => m.category)));
      const uniqueBrands = Array.from(new Set(data.map(m => m.brand)));
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    });
  }, []);

  // Alternar entre mostrar materiales con stock y sin stock
  const toggleShowNoStock = () => {
    setShowNoStock(!showNoStock)
  }

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
      {/* Botón para alternar la visibilidad de los materiales sin stock */}
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

<Table striped hover className="mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Category</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Description</th>
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
          </tr>
        </thead>
        <tbody>
          {sortedMaterials.map(m => (
            <tr className="materials" key={m.id}>
              <td>
                {m.image && (
                  <img
                    src={typeof m.image === 'string' ? m.image : URL.createObjectURL(m.image)}
                    alt={m.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{m.category}</td>
              <td>{m.name}</td>
              <td>{m.brand}</td>
              <td>{m.description}</td>
              <td>{m.stock}</td>
              <td>${m.cost}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Materials
