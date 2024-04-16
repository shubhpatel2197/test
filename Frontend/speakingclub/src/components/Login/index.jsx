import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput
}
from 'mdb-react-ui-kit';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import photo from '../../Images/login.png';
import { Link } from 'react-router-dom';
import {  toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const isValidEmail = (email) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleLogin = () => {
    if (!isValidEmail(email)||!password.trim()) {
      toast.error('Invalid input.',{
        position:'top-left'
      });
    } 
    else{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json"); 
     const raw = JSON.stringify({
     "email": email,
     "password": password
     });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

fetch("https://test-6-vdrh.onrender.com/login", requestOptions)
  .then((response) => response.json())
  .then((result) => {

    console.log(result)
    if(result.error) 
    toast.error('Either email or password is incorrect',{
    position:'top-left'
  });
  else {
    toast.success("Login success!",{
      position:'top-left'
    })
    console.log(result.username);
  }
}

)
  .catch((error) => console.error(error));
    
  }
}

  return (
    <>
         
      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img src={photo} className='img-fluid' alt="Login Page"/>
          </MDBCol>
          <MDBCol col='4' md='6'>
            <MDBInput
              onChange={handleEmailChange}
              wrapperClass='mb-4'
              label='Email address'
              id='formControlLg'
              className="login_in"
              type='email'
              size="lg"
            />
            <MDBInput
              onChange={handlePasswordChange}
              wrapperClass='mb-4'
              label='Password'
              id='formControlLg'
              className="login_in"
              type='password'
              size="lg"
            />
            <div className="d-flex justify-content-between mx-4 mb-4">
              <Link to="/signup" className='signup'>Register</Link>
            </div>
            <MDBBtn onClick={handleLogin} className="mb-4 w-100" size="md">
              Login
            </MDBBtn>
            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">OR</p>
            </div>
            <MDBBtn className="mb-4 w-100" size="lg" style={{backgroundColor: '#da4437',borderColor:'#da4437'}}>
              <MDBIcon fab icon="google" className="mx-2"/>
              Continue with Google
            </MDBBtn>
            {/* <MDBBtn className="mb-4 w-100" size="lg" style={{backgroundColor: '#55acee'}}>
              <MDBIcon fab icon="twitter" className="mx-2"/>
              Continue with Twitter
            </MDBBtn> */}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
