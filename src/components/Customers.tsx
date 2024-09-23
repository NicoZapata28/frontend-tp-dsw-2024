import { useState, useEffect } from "react"
import customersService from "../services/customer.ts"
import { ICustomer } from "../services/customer.ts"
import Table from 'react-bootstrap/Table'
import {Link}  from 'react-router-dom'
import { Button } from 'react-bootstrap';

const Customers = () =>{
    const [customers, setCustomers] = useState<ICustomer[]>([])
    

    useEffect(() => {
        customersService.getAll().then(data =>
          setCustomers(data)
        )
      }, [])
       
      return (
        <div className="container">
          <h1>Customers</h1>
            {/* Botón para crear un nuevo cliente */}
            <Link to="/CreateCustomer">
        <Button variant="primary" className="mb-3">Agregar Nuevo Customer </Button>
      </Link>

          <Table striped hover>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {(customers.map(c =>
                <tr className="customers" key={c.id}>
                  <td>
                    {c.dni}
                  </td>
                  <td>
                    {c.name}
                  </td>
                  <td>
                    {c.address}
                  </td>
                  <td>
                    {c.email}
                  </td>
                  <td>
                    {c.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
    )
} 

export default Customers