import { useState } from "react";
import customerService from "../services/customer";
import { ICustomer } from "../services/customer";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate(); // Para redirigir después de crear el cliente

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await customerService.create(customer);
      navigate("/customers"); // Redirige a la lista de clientes o donde lo necesites
    } catch (err) {
      setError("Error creating customer. Please try again.");
    }
  };

  return (
    <Container>
      <h1>Create Customer</h1>
      <Form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form.Group controlId="formBasicId">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ID"
            name="id"
            value={customer.id}
            onChange={handleChange}
            required
          />
        </Form.Group>

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

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCustomer;
