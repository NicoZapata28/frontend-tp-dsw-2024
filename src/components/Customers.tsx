import { useState, useEffect } from "react"
import customersService from "../services/customer.ts"
import { ICustomer } from "../services/customer.ts"
import Table from 'react-bootstrap/Table'

const Customers = () =>{
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [searchName, setSearchName] = useState<string>("");
    const [sortDniOrder, setSortDniOrder] = useState<string>("asc");

    useEffect(() => {
        customersService.getAll().then(data =>
          setCustomers(data)
        )
      }, [])
    
      const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchName.toLowerCase()) 
      );
      const sortedCustomers = filteredCustomers.sort((a, b) => {
        if (sortDniOrder === "asc") {
          return Number(a.dni) - Number(b.dni);
        } else if (sortDniOrder === "desc") {
          return Number(b.dni) - Number(a.dni);
        }
        return 0; 
      });

      const toggleDniSortOrder = () => {
        setSortDniOrder(prevOrder => {
          if (prevOrder === "none") return "asc";
          if (prevOrder === "asc") return "desc";
          return "none";
        });
      };

      return (
        <div className="container">
          <h1>Customers</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)} 
      />
          <Table striped hover>
            <thead>
              <tr>
                <th>
                DNI
                <button onClick={toggleDniSortOrder}>
                {sortDniOrder === "asc" ? "↑" : sortDniOrder === "desc" ? "↓" : "↔"}
              </button>
                </th>
                <th>Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
            {sortedCustomers.map(c => (
            <tr className="customers" key={c.id}>
              <td>{c.dni}</td>
              <td>{c.name}</td>
              <td>{c.address}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
            </tr>
              ))}
            </tbody>
          </Table>
        </div>
    )
} 

export default Customers