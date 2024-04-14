import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PsychologistNavbar from "./PsychologistNavbar";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import cardimg from '../assets/profile.png';
import MedicalReportViewer from './MedicalReportViewer';

import '../App.css';

function PsychologistPatientProfiles() {
  const [patientList, setPatientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicalReport, setMedicalReport] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicalInfoModal, setShowMedicalInfoModal] = useState(false);
  let [medicalInfo, setMedicalInfo] = useState(null);
  //const navigate = useNavigate();

  useEffect(() => {
    // Fetch all patients
    axios.get('http://localhost:4000/all-patients')
      .then(response => setPatientList(response.data))
      .catch(error => console.error(error));
  }, []);

  // Filter patients based on search query
  const filteredPatients = patientList.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Function to send patientID to backend and fetch medical report
  const fetchMedicalReport = (patientID) => {
    axios.post('http://localhost:4000/view-report', { patientID })
      .then(response => {
        setMedicalInfo(response.data);
        // medicalInfo = response.data;
        // console.log(medicalInfo);
        // // navigate to medical report viewer with medicalInfo as props state
        // navigate('/medical-report-viewer', { state: { medicalInfo } });

        // scroll down to the medical report viewer component
        console.log(response.data);
        document.getElementById('medical-report-viewer').scrollIntoView({ behavior: 'smooth' });

      })
      .catch(error => console.error(error));
  };

  const fetchAnxietyAnalysis = (patientID) => {
    axios.post('http://localhost:8888/anxiety-analysis', { patientID })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error(error));
  };

  // Function to handle view report button click
  const handleViewReport = (patientID) => {
    setSelectedPatient(patientID);
    fetchMedicalReport(patientID);
    fetchAnxietyAnalysis(patientID);
    
  };

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
                <br />
              </Card.Text>
              <div style={{ marginTop: 'auto', marginBottom: '5px' }}>
                <Button variant="dark" onClick={() => handleViewReport(patient._id)}>View Report</Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div id="medical-report-viewer">
      <MedicalReportViewer medicalInfo={medicalInfo} />
       </div> {/* anchor tag to scroll down to this div */}
      
    </div>
  );
}

export default PsychologistPatientProfiles;
