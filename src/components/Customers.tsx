import { useState, useEffect } from "react"
import React from "react"
import customersService from "../services/customer.ts"
import ordersService from "../services/orders.ts"
import materialsService from "../services/materials.ts"
import { ICustomer } from "../services/customer.ts"
import { IOrder } from "../services/orders.ts"
import { IMaterial } from "../services/materials.ts"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const Customers = () => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [orders, setOrders] = useState<IOrder[]>([]); 
    const [materials, setMaterials] = useState<IMaterial[]>([]); 
    const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set()); // Estado para múltiples clientes expandidos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customersData = await customersService.getAll();
                const ordersData = await ordersService.getAll();
                const materialsData = await materialsService.getAll();
                setCustomers(customersData);
                setOrders(ordersData);
                setMaterials(materialsData);
            } catch (error) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleOrders = (customerId: string) => {
        setExpandedCustomers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(customerId)) {
                newSet.delete(customerId); // Si ya está expandido, lo cerramos
            } else {
                newSet.add(customerId); // Si no está, lo abrimos
            }
            return newSet;
        });
    };

    const getMaterialName = (idProduct: string) => {
        const material = materials.find(m => m.id === idProduct);
        return material ? material.name : "Desconocido";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c => (
                        <React.Fragment key={c.id}>
                            <tr className="customers">
                                <td>{c.dni}</td>
                                <td>{c.name}</td>
                                <td>{c.address}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>
                                    <Button
                                        style={{
                                            backgroundColor: expandedCustomers.has(c.id) ? 'white' : 'gray',
                                            color: expandedCustomers.has(c.id) ? 'black' : 'white',
                                            border: '1px solid '
                                        }}
                                        onClick={() => toggleOrders(c.id)}
                                    >
                                        {expandedCustomers.has(c.id) ? "Ocultar compras" : "Mostrar compras"}
                                    </Button>
                                </td>
                            </tr>

                            {expandedCustomers.has(c.id) && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="customer-orders">
                                            <strong>Compras:</strong>
                                            <ul>
                                                {orders
                                                    .filter(order => order.idCustomer === c.id)
                                                    .map((order, index) => (
                                                        <li key={index}>
                                                            {order.details.map(detail => (
                                                                <div key={detail.idProduct}>
                                                                    {getMaterialName(detail.idProduct)} - {detail.quantity} x ${detail.price} (Fecha: {new Date(order.orderDate).toLocaleDateString()})
                                                                </div>
                                                            ))}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Customers;
