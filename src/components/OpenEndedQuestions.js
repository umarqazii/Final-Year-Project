import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import questions from './Questions.json';
import PatientNavbar from './PatientNavbar';
import HealthMonitor from './HealthMonitor';
import RecordingComponent from './RecordingComponent';
import Webcam from 'react-webcam';

function OpenEndedQuestions() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(questions[0].timeInSeconds);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const webcamRef = useRef(null);
    const [transcript, setTranscript] = useState('');
    const [responses, setResponses] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [completed1, setCompleted1] = useState(false);
    const [frameResponses, setFrameResponses] = useState([]);
    const [transcriptResponse, setTranscriptResponse] = useState('');

    useEffect(() => {
        let recognition; // Declare recognition variable in outer scope
        let frameCount = 0; // Counter for received responses

        const captureAndSendFrame = async () => {
            const imageSrc = webcamRef.current.getScreenshot();

            try {
                const response = await axios.post('http://localhost:5000/save-and-analyze-frame', { frame: imageSrc });
                const emotion = response.data.emotion;
                setFrameResponses(prevResponses => [...prevResponses, emotion]); // Add emotion to responses array
                frameCount++; // Increment counter
                if (frameCount === 6) setCompleted(true); // Check if all responses are received
            } catch (error) {
                console.error('Error sending frame to backend:', error);
            }
        };

        const startSpeechRecognition = () => {
            recognition = new window.webkitSpeechRecognition(); // Assign recognition in outer scope
            recognition.lang = 'en-US'; // Set language to English (United States)
            recognition.continuous = true;

            let accumulatedTranscript = ''; // Variable to accumulate the transcript

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                accumulatedTranscript += transcript; // Accumulate the transcript
                console.log('Accumulated Transcript:', accumulatedTranscript); // Log accumulated transcript
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            recognition.onend = () => {
                setTranscript(accumulatedTranscript); // Update state with the accumulated transcript
                console.log('Final Transcript:', accumulatedTranscript); // Log final transcript

                // Send transcript to backend after 30 seconds
                setTimeout(() => {
                    sendTranscriptToBackend(accumulatedTranscript);
                }, 30000);
            };

            recognition.start();
        };

        const sendTranscriptToBackend = async (transcript) => {
            // Send transcript to backend
            try {
                const response = await axios.post('http://localhost:5000/save-transcript', { transcript: transcript });
                const sentiment = response.data.sentiment;
                setTranscriptResponse(sentiment); // Set transcript response
                setCompleted1(true); // Set completed to true
            } catch (error) {
                console.error('Error sending transcript to backend:', error);
            }
        };

        const intervalId = setInterval(() => {
            captureAndSendFrame();
        }, 5000); // Capture frame and send it every 5 seconds

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId); // Stop capturing frames
            webcamRef.current.stream.getTracks().forEach(track => track.stop()); // Stop the webcam stream
            if (recognition) recognition.stop(); // Stop speech recognition if it's defined
        }, 30000); // Stop after 30 seconds

        startSpeechRecognition();


        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            if (recognition) recognition.stop(); // Stop recognition if it's defined
            // Display frameResponses in the console
            console.log("Frame Responses after timeout:", frameResponses);
        };
    }, []); // Run only once when component mounts

    useEffect(() => {
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

    const sendtoBackend = async () => {
        // Send frameResponses and transcriptResponse to backend
        try {
            const response = await axios.post('http://localhost:4000/sendingEmotions', {
                frameResponses: frameResponses,
                transcriptResponse: transcriptResponse
            });
            console.log('Emotions sent to backend:', response.data);
        } catch (error) {
            console.error('Error sending emotions to backend:', error);
        }
    };


    return (
        <div className='App'>
            <PatientNavbar />

            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '30px' }}>Open-Ended Question</h1>

            <div>
                <h2 style={{ fontFamily: ' sans-serif', color: 'white', marginTop: '20px' }}>
                    Question {currentQuestionIndex} of {questions.length - 1}
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

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                />
                {(completed && completed1) ? (
                    <div>
                        <h2>Analysis completed.</h2>
                        <button onClick={() => {sendtoBackend()}}>Submit</button>

                    </div>
                ) : null}

            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>

                <HealthMonitor />
            </div>
        </div>
    );
}

export default OpenEndedQuestions;