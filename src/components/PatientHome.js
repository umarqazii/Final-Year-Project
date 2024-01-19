import React, { useEffect, useState } from 'react';
import PatientNavbar from './PatientNavbar';
import Typed from 'typed.js';
import '../App.css';
import myPic from '../assets/Mental-Health.gif'; 
import myPic1 from '../assets/Mental-Health1.gif';
import myPic2 from '../assets/Mental-Health2.gif';
import myPic3 from '../assets/Mental-Health3.gif';
import myPic4 from '../assets/Mental-Health4.gif';

const quotes = require('./Quotes');

function PatientHome() {
  const [image, setImage] = useState(myPic);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex].text;

    var typedQuote = new Typed('.typedQuote', {
      strings: [randomQuote],
      typeSpeed: 50,
      showCursor: true,
    });

    return () => {
      typedQuote.destroy();
    };
  }, []);

  useEffect(() => {
    const randomImageIndex = Math.floor(Math.random() * 5);
    const images = [myPic, myPic1, myPic2, myPic3, myPic4];
    setImage(images[randomImageIndex]);

  }, []);

  return (
    <div className='App'>
      <PatientNavbar />

      <header className="App-header" style={{ marginTop: '-80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="intro-text">
                <h1 className="intro-lead-in" >
                  <span className="typedQuote" style={{ color: '#72c4bd', fontFamily: 'Audiowide, sans-serif' }}></span>
                </h1>
              </div>
              <br />
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <img src={image} alt="My Picture" className="img-fluid" style={{ width: '40%', borderRadius: '35%' }} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default PatientHome;
