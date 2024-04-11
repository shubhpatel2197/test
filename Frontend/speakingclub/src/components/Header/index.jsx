import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './index.css';
import logo from '../../Images/download.png'; // Adjust the path according to the location of your logo
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function Header(props) {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary header">
        <Container fluid>
          <img src={logo} alt="Logo" style={{ width: "11rem",
    height: '10rem',
    marginLeft: '-1rem',
    marginTop: '-3rem',
    marginBottom: '-3rem',}} /> {/* Apply width and height */}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              bg="dark"
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px', backgroundColor: 'primary' }}
              navbarScroll
            >
              <button className="button-87" onClick={props.setbackon}>Create Group</button>
            </Nav>
            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 "
                aria-label="Search"
                style={{ width: '30vw' }}
              />
              <Button className="mx-2" variant="outline-success">Search</Button>
            </Form> */}
            <Link to="/login" class="button-87 ff">Login</Link> {/* Use Link from react-router-dom */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
