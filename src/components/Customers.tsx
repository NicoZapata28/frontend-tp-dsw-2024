import { useState, useEffect } from "react"
import customersService from "../services/customer.ts"
import { ICustomer } from "../services/customer.ts"
import Table from 'react-bootstrap/Table'

const Customers = () => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        customersService.getAll()
            .then(data => setCustomers(data))
            .catch(error => console.error("Error fetching customers:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            customersService.remove(id)
                .then(() => {
                    setCustomers(customers.filter(customer => customer.id !== id));
                })
                .catch(error => {
                    console.error("Error deleting customer:", error);
                });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>Customers</h1>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c =>
                        <tr className="customers" key={c.id}>
                            <td>{c.dni}</td>
                            <td>{c.name}</td>
                            <td>{c.address}</td>
                            <td>{c.email}</td>
                            <td>{c.phone}</td>
                            <td>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default Customers;
