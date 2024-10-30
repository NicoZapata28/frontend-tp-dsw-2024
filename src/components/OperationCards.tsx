import { Container, Row, Col, Card } from 'react-bootstrap'
import styles from '../styles/operationCards.module.css'
import { Link } from 'react-router-dom'
import Icon1 from '../img/materials-icon.svg'
import Icon2 from '../img/orders-icon.svg'
import Icon3 from '../img/customers-icon.svg'
import Icon4 from '../img/balance-icon.svg'

const operations = [
  { path: '/Materials', icon: Icon1, label: 'Materials' },
  { path: '/Orders', icon: Icon2, label: 'Orders' },
  { path: '/Customers', icon: Icon3, label: 'Customers' },
  { path: '/Balance', icon: Icon4, label: 'Balance' },
];

const OperationCards = () => {
  return (
    <Container>
      <Row xs={1} md={2} className={styles.body}>
        {operations.map((operation, idx) => (
          <Col key={idx} className="d-flex justify-content-center">
            <Link to={operation.path} style={{ textDecoration: 'none' }}>
              <Card className={`${styles.card} text-center`} style={{ cursor: 'pointer' }}>
                <Card.Img variant="top" src={operation.icon} style={{ width: '90px', height: '90px', margin: 'auto' }} />
                <Card.Body>
                  <Card.Title>{operation.label}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OperationCards;