import { useState } from "react"
import customerService from "../services/customer"
import { ICustomer } from "../services/customer"
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"


const CreateCustomer = () => {
  const [customer, setCustomer] = useState<ICustomer>({
    id: "",
    dni: "",
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Iniciar el spinner
    try {
      await customerService.create(customer);
      alert("Customer created!");
      setCustomer({
        id: "",
        dni: "",
        name: "",
        address: "",
        email: "",
        phone: "",
      });
      setError(null); // Limpiar error si el envío es exitoso
    } catch (err) {
      setError("Error creating customer. Please try again.");
    } finally {
      setIsLoading(false); // Detener el spinner
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center my-4">Create Customer</h1>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group controlId="formBasicDni">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter DNI"
                name="dni"
                value={customer.dni}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={customer.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={customer.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Creating...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCustomer;