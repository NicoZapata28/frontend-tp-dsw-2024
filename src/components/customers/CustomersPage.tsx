import { useState, useEffect } from 'react'
import customersService from '../../services/customer'
import { ICustomer } from '../../services/customer'
import AddCustomerForm from './AddCustomerForm.tsx'
import AddButton from '../shared/AddButton.tsx'
import './CustomersPage.css'
import Grid from '../Grid.tsx'
import CustomerCard from './CustomerCard.tsx'
import handleCustomerUpdate from '../../utils/HandleCustomerUpdate.tsx'
import handleCustomerDelete from '../../utils/HandleCustomerDelete.tsx'

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    customersService.getAll().then((data) => {
      setCustomers(data)
    })
  }, [])

  const handleCreateCustomer = async (data: ICustomer): Promise<ICustomer> => {
    try {
      const newCustomer = await customersService.create(data)
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer])
      
      console.log('Customer added:', newCustomer)
      
      togglePopup()

      return newCustomer
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  const togglePopup = () => {
    setShowForm(!showForm)
  }

  console.log(customers)
  return (
    <div className='customers-page'>
      <h1>Clientes</h1>
      <AddButton onClick={togglePopup} />
      {showForm && (
        <AddCustomerForm createCustomer={handleCreateCustomer} onClose={togglePopup} />
      )}
      <Grid
        items={customers}
        CardComponent={({ data }) => (
          <CustomerCard
            customer={data}
            onEdit={() => handleCustomerUpdate}
            onDelete={() => handleCustomerDelete }
          />
        )}
      />
    </div>
  )
}

export default CustomersPage