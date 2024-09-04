import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Home = () => {
  return (
<div>
      {/* Sección Principal del Body */}
      <Container fluid className="mt-5">
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <h1>Welcome to My Website</h1>
            <p className="lead">
              This is a simple hero section for introducing your website, product, or service.
            </p>
            <Button variant="primary" size="lg">Learn More</Button>
          </Col>
        </Row>

        {/* Sección de Tarjetas */}
        <Row className="mt-5">
          <Col md={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title>Service 1</Card.Title>
                <Card.Text>
                  Description of service 1. A brief explanation of what it entails.
                </Card.Text>
                <Button variant="primary">Learn More</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title>Service 2</Card.Title>
                <Card.Text>
                  Description of service 2. A brief explanation of what it entails.
                </Card.Text>
                <Button variant="primary">Learn More</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src="https://via.placeholder.com/150" />
              <Card.Body>
                <Card.Title>Service 3</Card.Title>
                <Card.Text>
                  Description of service 3. A brief explanation of what it entails.
                </Card.Text>
                <Button variant="primary">Learn More</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Pie de Página */}
      <footer className="bg-dark text-white text-center py-4">
        <Container>
          <p>© 2024 My Website. All rights reserved.</p>
        </Container>
      </footer>
</div>
  );
};

export default Home;