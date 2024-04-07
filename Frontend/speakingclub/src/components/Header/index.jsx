import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './index.css';



export default function Header(props) {
   
  return (
   <>
    <Navbar  expand="lg" className="bg-body-tertiary header">
      <Container fluid>
        <Navbar.Brand href="#">Speaking Club</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav bg="dark"
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px',backgroundColor: 'primary' }}
            navbarScroll
          >
        
       
       <button class="button-87" onClick={props.setbackon}>Create Group</button>
 
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 "
              aria-label="Search"
              style={{width:'30vw'}}
            />
            <Button className="mx-2" variant="outline-success">Search</Button>
          </Form>
          <Button onClick={props.setbackon} variant="outline-success">Login</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

