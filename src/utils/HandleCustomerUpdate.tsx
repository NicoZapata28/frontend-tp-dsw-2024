import customerService, { ICustomer } from '../services/customer.ts'

const handleCustomerUpdate = async (id: string, updatedCustomer: ICustomer): Promise<ICustomer> => {
    try {
        const response = await customerService.update(id, updatedCustomer);
        console.log("Customer updated successfully:", response);
        return response;
    } catch (error) {
        console.error("Error updating customer:", error);
        throw error;
    }
};

export default handleCustomerUpdate;