import React, { useState, useEffect } from 'react';
import questions from './Questions.json';
import PatientNavbar from './PatientNavbar';

function OpenEndedQuestions() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(questions[0].timeInSeconds);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isLastQuestion, setIsLastQuestion] = useState(false);

    useEffect(() => {
        // Update the timer every second
        const timer = setInterval(() => {
            if (isTimerActive) {
                setRemainingTime(prevTime => prevTime - 1);
            }
        }, 1000);

        // Clear the timer when the component is unmounted or when the timer reaches 0
        return () => clearInterval(timer);
    }, [isTimerActive]);

    // Additional logic to handle switching questions when the timer reaches 0
    useEffect(() => {
        if (remainingTime === 0 && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
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
                <h2 style={{ fontFamily: ' sans-serif', color: 'white', marginTop: '50px' }}>Question {currentQuestionIndex + 1} of 10</h2>
                <p style={{color:'white'}}>{questions[currentQuestionIndex].question}</p>
                <div>
                    {isLastQuestion ? (
                        <p style={{color:'white'}}>Time's Up!</p>
                    ) : (
                        <p style={{color:'white'}}>Time Remaining: {remainingTime} seconds</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OpenEndedQuestions;
