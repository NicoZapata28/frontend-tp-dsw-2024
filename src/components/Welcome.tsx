import { Container, Row, Col } from 'react-bootstrap'

const Welcome = () => {
  return (
    <Container fluid className="mt-5">
      <Row>
        <Col lg={8} className="mx-auto text-center">
          <h1 style={{ color: 'white' }}>Welcome to TecnoStore!</h1>
        </Col>
      </Row>
    </Container>
  );
}

export default Welcome;