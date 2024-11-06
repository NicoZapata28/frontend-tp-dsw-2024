import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import faceStore from '../img/face-store.svg'

interface NavigationProps {
  onLogout: () => void
  employeeName: string
}

const Navigation:React.FC<NavigationProps> = ({onLogout, employeeName}) =>{
  return(
    <Navbar expand="x1" style={{ backgroundColor: '#000000' }} variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt='FaceStore Logo'
            src={faceStore}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{
              filter:
                'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
            }}
          />{' '}
          TecnoStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/Materials">Materials</Nav.Link>
            <Nav.Link href="/Customers">Customers</Nav.Link>
            <Nav.Link href="/Orders">Orders</Nav.Link>
            <NavDropdown title={employeeName} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">My profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Balance</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>Close session</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
