import React from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import './index.css';
import photo from './login.png';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <>


    <MDBContainer fluid className="p-3 my-5">

      <MDBRow>

        <MDBCol col='10' md='6'>
          <img src={photo} className='img-fluid' alt="Login Page"/>
        </MDBCol>

        <MDBCol col='4' md='6'>

          <MDBInput wrapperClass='mb-4' label='Username' id='formControlLg' className="login_in" type='Username' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' className="login_in" type='email' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' className="login_in" type='password' size="lg"/>
        

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <Link to="/Login" className='signup'>Login</Link>
          </div>

          <MDBBtn className="mb-4 w-100" size="lg">Register</MDBBtn>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">OR</p>
          </div>

          <MDBBtn className="mb-4 w-100" size="lg" style={{backgroundColor: '#da4437',borderColor:'#da4437'}}>
            <MDBIcon fab icon="google" className="mx-2"/>
            Continue with google
          </MDBBtn>

          {/* <MDBBtn className="mb-4 w-100" size="lg" style={{backgroundColor: '#55acee'}}>
            <MDBIcon fab icon="twitter" className="mx-2"/>
            Continue with twitter
          </MDBBtn> */}

        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </>
  );
}

