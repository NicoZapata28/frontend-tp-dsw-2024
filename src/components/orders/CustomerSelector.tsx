import { useState, useEffect } from "react"
import { ICustomer } from '../../services/customer.ts'

interface Props {
  customers: ICustomer[]
  onSelect: (customerId: string) => void
}

const CustomerSelector: React.FC<Props> = ({ customers, onSelect }) => {
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>(customers)
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    const results = customers.filter(customer =>
      customer.dni.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCustomers(results)
  }, [searchQuery, customers])

  return (
    <div>
      <input
        type="text"
        placeholder="Search DNI"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select onChange={(e) => onSelect(e.target.value)} required>
        <option value="">Select a customer</option>
        {filteredCustomers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.dni} - {customer.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CustomerSelector
