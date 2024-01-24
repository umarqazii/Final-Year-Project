import React, { useState, useEffect } from "react";
import axios from "axios";
import PsychologistNavbar from "./PsychologistNavbar";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import cardimg from '../assets/profile.png';

import '../App.css';

function PsychologistPatientProfiles() {
  const [patientList, setPatientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch all patients
    axios.get('http://localhost:5000/all-patients')
      .then(response => setPatientList(response.data))
      .catch(error => console.error(error));
  }, []);

  // Filter patients based on search query
  const filteredPatients = patientList.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="App">
      <PsychologistNavbar />
      <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '50px' }}>Patient Profiles</h1>

      {/* search bar to search patient using their firstName */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search by patient name"
          style={{ width: '300px', height: '30px', borderRadius: '5px', border: 'none', padding: '5px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="dark" style={{ marginLeft: '10px' }}>Search</Button>
      </div>

      <div className="CardsContainer">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="Card" style={{ width: '18rem', background: 'grey', padding: '8px', margin: '10px' }}>
            <Card.Img variant="top" src={cardimg} style={{ borderRadius: '5px' }} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
              <Card.Title>{`${patient.firstName} ${patient.lastName}`}</Card.Title>
              <Card.Text style={{ fontSize: '13px', flex: '1 0 auto', color: 'white' }}>
                {`Email: ${patient.email}`}
                <br />
                {`Phone: ${patient.phoneNumber}`}
              </Card.Text>
              <div style={{ marginTop: 'auto', marginBottom: '5px' }}>
                <Button variant="dark" href={`https://lab.mlaw.gov.sg/files/Sample-filled-in-MR.pdf`} target="_blank" rel="noopener noreferrer">View Report</Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PsychologistPatientProfiles;