import React, { useState, useEffect, useRef } from 'react';
import questions from './Questions.json';
import PatientNavbar from './PatientNavbar';
import HealthMonitor from './HealthMonitor';
import RecordingComponent from './RecordingComponent';

function OpenEndedQuestions() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(questions[0].timeInSeconds);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isLastQuestion, setIsLastQuestion] = useState(false);

    const videoRef = useRef(null);

    useEffect(() => {
        // Function to open the camera and display the feed
        const openCamera = async () => {
          try {
            // Get access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Display the camera feed in the video element
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
          }
        };
        openCamera();

        const timer = setInterval(() => {
            if (isTimerActive) {
                setRemainingTime((prevTime) => prevTime - 1);
            }
        }, 1000);

        return () => clearInterval(timer); // Clear the interval on component unmount
    }, [isTimerActive]);

    useEffect(() => {
        if (remainingTime === 0 && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setRemainingTime(questions[currentQuestionIndex + 1].timeInSeconds);
        } else if (remainingTime === 0 && currentQuestionIndex === questions.length - 1) {
            setIsLastQuestion(true);
            setIsTimerActive(false);
        }
    }, [remainingTime, currentQuestionIndex]);

    return (
        <div className='App'>
            <PatientNavbar />

            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '30px' }}>Open-Ended Question</h1>
            
            <div>
                <h2 style={{ fontFamily: ' sans-serif', color: 'white', marginTop: '20px' }}>
                    Question {currentQuestionIndex } of {questions.length - 1}
                </h2>
                <p style={{ color: 'white' }}>{questions[currentQuestionIndex].question}</p>
                <div>
                    {isLastQuestion ? (
                        <p style={{ color: 'red' }}>Time's Up!</p>
                    ) : (
                        <p style={{ color: 'white' }}>Time Remaining: {remainingTime} seconds</p>
                    )}
                </div>
            </div>

            {/* Video element for displaying the user's camera feed */}
            {/* <video id='video' width='800' height='300' autoPlay muted ref={videoRef}></video> */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RecordingComponent />
                
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                
                <HealthMonitor />
            </div>
        </div>
    );
}

export default OpenEndedQuestions;
