import React, { useState, useEffect } from 'react';
import questions from './Questions.json';
import PatientNavbar from './PatientNavbar';
import HealthMonitor from './HealthMonitor';

function OpenEndedQuestions() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState('');
    const [recordingsData, setRecordingsData] = useState([]);
    const [showData, setShowData] = useState(false);
     const [bloodRate, setBloodRate] = useState('');
    const [heartRate, setHeartRate] = useState('');

    const startTest = () => {
        setIsTestStarted(true);
    };

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
            setIsRecording(true);
            setRecordingStatus(data.message);
            setTimeout(() => {
                setRecordingStatus('Recording Completed. Click Stop Answer.');
            }, 20000); // 20 seconds timer
        })
        .catch(error => console.error('Error starting recording:', error));
    };

    const stopRecording = () => {
        fetch('http://localhost:5000/stop_recording', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            setIsRecording(false);
            setRecordingStatus(data.message);
        })
        .catch(error => console.error('Error stopping recording:', error));
    };

    const processRecording = () => {
        fetch('http://localhost:5000/process_recordings', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(processedData => {
            // Update the recordingsData state with the processed data
            const newData = {
                question: questions[currentQuestionIndex].question,
                bloodRate: bloodRate,
                heartRate: heartRate,
                sentiment: processedData.Sentiment,
                emotions: processedData.emotions
            };
            setRecordingsData(prevData => [...prevData, newData]);
            setBloodRate('');
            setHeartRate('');
        })
        .catch(error => console.error('Error processing recordings:', error));
    };
    

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecording(false);
            setRecordingStatus('');
        } else {
            setShowData(true);
        }
    };

    const showSavedData = () => {
        setShowData(true);
    }
    const saveData = () => {
        const newData = {
            question: questions[currentQuestionIndex].question,
            bloodRate: bloodRate,
            heartRate: heartRate,
            sentiment: '', // Placeholder for sentiment data
            emotions: [] // Placeholder for emotions data
        };
        setRecordingsData([...recordingsData, newData]);
        setBloodRate('');
        setHeartRate('');
    };


    return (
        <div className='App'>
            <PatientNavbar />
            {!isTestStarted && (
                <button onClick={startTest}>Start Test</button>
            )}
            {isTestStarted && !showData && (
                <div>
                    <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '30px' }}>Open-Ended Question</h1>
                    <div>
                        <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
                        <p>{questions[currentQuestionIndex].question}</p>
                        {/* Add input fields for blood rate and heart rate */}
                        <div>
                            <label>Blood Rate: </label>
                            <input type="text" value={bloodRate} onChange={(e) => setBloodRate(e.target.value)} />
                        </div>
                        <div>
                            <label>Heart Rate: </label>
                            <input type="text" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
                        </div>
                        {isRecording ? (
                            <div>
                                <p>{recordingStatus}</p>
                                <button onClick={stopRecording}>Stop Answer</button>
                            </div>
                        ) : (
                            <div>
                                <button onClick={startRecording}>Start Answer</button>
                            </div>
                        )}
                        {!isRecording && (
                            <button onClick={processRecording}>Process Answer</button>
                        )}
                        
                        <button onClick={nextQuestion}>Next Question</button>
                        <button onClick={showSavedData}>Show Saved Data</button>
                    </div>
                    <HealthMonitor />
                </div>
            )}
            {showData && (
                <div>
                    <h2>Saved Data</h2>
                    {recordingsData.map((data, index) => (
                        <div key={index}>
                            <h3>Question: {data.question}</h3>
                            <p>Blood Rate: {data.bloodRate}</p>
                            <p>Heart Rate: {data.heartRate}</p>
                            <p>Sentiment: {data.sentiment}</p>
                            <p>Emotions: {data.emotions.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OpenEndedQuestions;
