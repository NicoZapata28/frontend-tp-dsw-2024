import { IInstallmentsDetails } from '../../services/payments.ts'

interface Props {
  details: IInstallmentsDetails[]
}

const InstallmentDetails: React.FC<Props> = ({ details }) => {
  return (
    <div>
      <h4>Detalles de cuotas:</h4>
      {details.map((installment, index) => (
        <div key={index}>
          <p>Cuota {installment.installmentN}: ${installment.amount.toFixed(2)} - Fecha de pago: {new Date(installment.paymentDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}

export default InstallmentDetails
