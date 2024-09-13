import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import faceStore from '../img/face-store.svg'

const Navigation = () =>{
  return(
    <Navbar bg="dark" data-bs-theme="dark" expand="xl" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img 
            alt=''
            src={faceStore}
            width='30'
            height='30'
            className='d-inline-block align-top'
            style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }}
          />{' '}
          TecnoStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/Materials">Materials</Nav.Link>
            <Nav.Link href="#customerLink" >Customers</Nav.Link> {/*Indicar link de Customer.tsx */}
            <Nav.Link href="/Orders" >Orders</Nav.Link> {/*Indicar link de Orders.tsx */}
            <Nav.Link href="/CreateCustomer">Create customer</Nav.Link>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">My profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Another action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Close session
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation