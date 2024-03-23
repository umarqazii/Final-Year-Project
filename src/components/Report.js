import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalReport = ({ patientID }) => {
  const [medicalReport, setMedicalReport] = useState(null);

  useEffect(() => {
    const fetchMedicalReport = async () => {
      try {
        const response = await axios.get(`/http://localhost:4000/view-report/${patientID}`); // Replace with your actual API endpoint
        setMedicalReport(response.data);
      } catch (error) {
        console.error('Error fetching medical report:', error);
      }
    };

    fetchMedicalReport();
  }, [patientID]);

  if (!medicalReport) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Medical Report</h2>
      <p>Patient ID: {medicalReport.patientID}</p>
      <p>GAD Score: {medicalReport.GADscore}</p>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>% Happiness</th>
            <th>% Sadness</th>
            <th>% Anger</th>
            <th>% Fear</th>
            <th>% Neutral</th>
            <th>Sentiment</th>
            <th>Heart Rate</th>
            <th>Oxygen Level</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(medicalReport.questions).map(question => (
            <tr key={question}>
              <td>{question}</td>
              <td>{medicalReport.questions[question]['% Happiness']}</td>
              <td>{medicalReport.questions[question]['% Sadness']}</td>
              <td>{medicalReport.questions[question]['% Anger']}</td>
              <td>{medicalReport.questions[question]['% Fear']}</td>
              <td>{medicalReport.questions[question]['% Neutral']}</td>
              <td>{medicalReport.questions[question]['Sentiment']}</td>
              <td>{medicalReport.questions[question]['Heart Rate']}</td>
              <td>{medicalReport.questions[question]['Oxygen Level']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Has Anxiety: {medicalReport.hasAnxiety.toString()}</p>
    </div>
  );
};

export default MedicalReport;
