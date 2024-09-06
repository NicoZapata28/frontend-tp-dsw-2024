import { Container, Row, Col, Button} from 'react-bootstrap'
import Icon1 from '../img/materials-icon.svg'
import Icon2 from '../img/orders-icon.svg'
import Icon3 from '../img/customers-icon.svg'

const OperationCards = () =>{
  return(
    <Container>
      <Row className="mt-5 text-center g-2">
        <Col md={4}>
          <Button variant="dark" className="icon-button mx-1" href="/Materials">
          <img src={Icon1} alt="Materials Icon" width="90" height="90" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }}/>
            <div style={{fontSize: '18px', marginTop:'10px'}}>Materials</div>
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="dark" className="icon-button mx-1" href="/Orders">
            <img src={Icon2} alt="Orders Icon" width="90" height="90" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }}/>
            <div style={{fontSize: '18px', marginTop:'10px'}}>Orders</div>
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="dark" className="icon-button mx-1" href="/Customers">
            <img src={Icon3} alt="Customers Icon" width="90" height="90" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }}/>
            <div style={{fontSize: '18px', marginTop:'10px'}}>Customers</div>
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default OperationCards