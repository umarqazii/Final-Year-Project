// Example component to start and stop recordings
import React, { useState } from 'react';

function RecordingComponent() {
  const [status, setStatus] = useState('');
  const [recordingsData, setRecordingsData] = useState(null);

  const startRecording = () => {
    fetch('http://localhost:5000/start_recording', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Include any necessary data for starting recording
      })
    })
    .then(response => response.json())
    .then(data => {
      setStatus(data.message);
    })
    .catch(error => console.error('Error starting recording:', error));
  };

  const stopRecording = () => {
    fetch('http://localhost:5000/stop_recording', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      setStatus(data.message);
    })
    .catch(error => console.error('Error stopping recording:', error));
  };

  const processRecording = () => {
    fetch('http://localhost:5000/process_recordings', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      setRecordingsData(data); // Set the recordings data in the state
    })
    .catch(error => console.error('Error processing recordings:', error));
  };

  return (
    <div>
      <h2>Status: {status}</h2>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={processRecording}>Process Recordings</button>
      {/* Render recordings data */}
      {recordingsData && (
        <div>
          <h3>Recordings Data</h3>
          <p>Sentiment: {recordingsData["Sentiment"]}</p>
          <p>Emotions: {recordingsData["emotions"].join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default RecordingComponent;
