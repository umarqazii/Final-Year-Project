import React, { useEffect, useState } from 'react';
import Typed from 'typed.js';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox
  } from 'mdb-react-ui-kit';
import axios from 'axios';
import logo from '../assets/mind-sight.png'
import '../App.css';
 // Import your image

function Login() {

    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/login', {
      username: username,
      password: password
    })
      .then((res) => {
        console.log(res);

        if (res.data.isPsychologist) {
          // Admin login
          window.location.href = '/psychologisthome';
        } else {
          // User login
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = '/PatientDashboard';
        }
      })
      .catch((err) => {
        console.log(err);
      });

  };
  useEffect(() => {
    var typedPhrase = new Typed('.typedPhrase', {
      strings: ['A Sight into your Mind'],
      typeSpeed: 80,
      showCursor: true,
    });

    return () => {
      typedPhrase.destroy();
    };
  }, []);

  return (
    <div className='App'>
      <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <img src={logo} alt="logo" className="logo" style={{ maxWidth: '350px', height: 'auto', display: 'block', margin: '0 auto', marginTop: "80px" }} />

          <h1 className="my-5 display-3 fw-bold ls-tight px-3 fancy-text gradient-text" style={{ display: 'block', margin: '0 auto' }}>
            <span id="element" className="typedPhrase" style={{ color: '#72c4bd', fontFamily: 'Audiowide, sans-serif', fontSize: '50px' }}></span>
          </h1>



        </MDBCol>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password!</p>

              <MDBInput label='Username' wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' id='formControlLg' type='text' size="lg" onChange={(e) => setUsername(e.target.value)} />
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg" onChange={(e) => setPassword(e.target.value)} />

              <button className='mx-2 px-5 custom-btn' type='button' onClick={handleSubmit}>
                Login
              </button>


              <div>
                <br></br><br></br>
                <MDBCheckbox className="text-white-50 fw-bold" label='Remember Me' />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
  );
}

export default Login;
