import customerService from '../services/customer.ts'

const handleCustomerDelete = async (id: string): Promise<string> => {
    try {
        const response = await customerService.remove(id);
        console.log("Customer deleted successfully:", response.message);
        return response.message;
    } catch (error) {
        console.error("Error deleting customer:", error);
        throw error;
    }
};

export default handleCustomerDelete;
