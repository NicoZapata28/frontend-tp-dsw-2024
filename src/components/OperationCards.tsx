import { Container, Row, Col, Button} from 'react-bootstrap'
import Icon1 from '../img/materials-icon.svg'
import Icon2 from '../img/orders-icon.svg'
import Icon3 from '../img/customers-icon.svg'

const OperationCards = () =>{
  return(
    <Container>
      <Row className="mt-5 text-center">
        <Col md={4}>
          <Button variant="outline-primary" className="icon-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={Icon1} alt="Materials Icon" width="50" height="50" />
            <div>Materials</div>
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" className="icon-button" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
            <img src={Icon2} alt="Orders Icon" width="50" height="50" />
            <div>Orders</div>
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" className="icon-button" onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}>
            <img src={Icon3} alt="Customers Icon" width="50" height="50" />
            <div>Customers</div>
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default OperationCards