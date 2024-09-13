import { useState, useEffect } from "react"
import employeesService from "../services/employee.ts"
import { IEmployee } from "../services/employee.ts"
import Table from 'react-bootstrap/Table'

const Employees = () =>{
  const [employees, setEmployees] = useState<IEmployee[]>([])
  
  useEffect(() => {
    employeesService.getAll().then(data =>
      setEmployees(data)
    )
  }, [])

  return (
    <div className="container">
      <h1>Employees</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th>cuil</th>
            <th>dni</th>
            <th>name</th>
            <th>password</th>
            <th>address</th>
            <th>email</th>
            <th>phone</th>
            <th>role</th>
          </tr>
        </thead>
        <tbody>
          {(employees.map(e =>
            <tr className="employee" key={e.dni}>
              <td>
                {e.dni}
              </td>
              <td>
                {e.cuil}
              </td>
              <td>
                {e.name}
              </td>
              <td>
                {e.password}
              </td>
              <td>
                {e.address}
              </td>
              <td>
                {e.email}
              </td>
              <td>
                {e.phone}
              </td>
              <td>
                {e.role}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Employees