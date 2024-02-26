import React from 'react';
import PatientHome from './components/PatientHome';
import Projects from './components/Projects';
import PatientInstructions from './components/PatientInstructions';
import Contact from './components/Contact';
import Login from './components/Login';
import PatientConsentForm from './components/PatientConsentForm';
import ClosedEndedQuestions from './components/ClosedEndedQuestions';
import PsychologistHome from './components/PsychologistHome';
import PsychologistRegisterPatient from './components/PsychologistRegisterPatient';
import PsychologistPatientProfiles from './components/PsychologistPatientProfiles';
import OpenEndedQuestions from './components/OpenEndedQuestions';
import HealthMonitor from './components/HealthMonitor';



import { BrowserRouter, Route, Routes} from 'react-router-dom';


const App = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/patienthome" element={<PatientHome />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/patientinstructions" element={<PatientInstructions />} />
          <Route path="/patientconsentform" element={<PatientConsentForm />} />
          <Route path="/closedendedquestions" element={<ClosedEndedQuestions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/psychologisthome" element={<PsychologistHome />} />
          <Route path="/psychologistregisterpatient" element={<PsychologistRegisterPatient />} />
          <Route path="/psychologistpatientprofiles" element={<PsychologistPatientProfiles />} />
          <Route path="/openendedquestions" element={<OpenEndedQuestions />} />
          <Route path="/healthmonitor" element={<HealthMonitor />} />
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default App;