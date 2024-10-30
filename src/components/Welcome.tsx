import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Welcome = () => {
  const [employeeName, setEmployeeName] = useState<string>('Cargando...');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/employees');
        const employees = response.data.data; 
        console.log("Employees fetched directly:", employees);
        if (employees && employees.length > 0) {
          setEmployeeName(employees[0].name);
        } else {
          setEmployeeName('No se encontraron empleados.');
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setEmployeeName('Error al cargar el nombre.');
      }
    };

    fetchEmployee();
  }, []);

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col lg={8} className="mx-auto text-center">
          <h1 style={{ color: 'white' }}>Welcome, {employeeName}!</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
