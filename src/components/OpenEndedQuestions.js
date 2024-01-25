import React, { useState, useEffect, useRef } from 'react';
import questions from './Questions.json';
import PatientNavbar from './PatientNavbar';

function OpenEndedQuestions() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(questions[0].timeInSeconds);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isLastQuestion, setIsLastQuestion] = useState(false);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();

        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'test.webm';
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const startRecording = () => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    mediaRecorderRef.current = new MediaRecorder(stream);

                    mediaRecorderRef.current.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            recordedChunksRef.current.push(event.data);
                        }
                    };

                    mediaRecorderRef.current.onstop = () => {
                        stopRecording();
                    };

                    mediaRecorderRef.current.start(1000);
                })
                .catch((error) => console.error('Error accessing camera and microphone:', error));
        };

        // Start recording when the component is mounted
        startRecording();

        const timer = setInterval(() => {
            if (isTimerActive) {
                setRemainingTime((prevTime) => prevTime - 1);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
            //mediaRecorderRef.current?.stop();
            //if last question's timer is up, then stop recording
            if (isLastQuestion) {
                mediaRecorderRef.current?.stop();
            }
        };
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

            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '50px' }}>Open-Ended Question</h1>

            <div>
                <h2 style={{ fontFamily: ' sans-serif', color: 'white', marginTop: '50px' }}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <p style={{ color: 'white' }}>{questions[currentQuestionIndex].question}</p>
                <div>
                    {isLastQuestion ? (
                        <p style={{ color: 'white' }}>Time's Up!</p>
                    ) : (
                        <p style={{ color: 'white' }}>Time Remaining: {remainingTime} seconds</p>
                    )}
                </div>
            </div>

            {/* Video element for displaying the user's camera feed */}
            <video id='video' width='640' height='480' autoPlay muted ref={videoRef}></video>
        </div>
    );
}

export default OpenEndedQuestions;
