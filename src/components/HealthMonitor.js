import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import Typed from 'typed.js';
import axios from 'axios';
import questions from './Questions.json';
import heartRatePic from '../assets/heartbeat.gif';
import oxygenLevelPic from '../assets/oxygenlevel.webp';
import '../App.css';


function HealthMonitor() {
    const [heartRateArray, setHeartRateArray] = useState([]);
    const [oxygenLevelArray, setOxygenLevelArray] = useState([]);
    const [averageHeartRate, setAverageHeartRate] = useState(0);
    const [averageOxygenLevel, setAverageOxygenLevel] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);

    const calculateTotalTime = () => {
        // Calculate total time based on the timeInSeconds property of each question
        // set the total time in seconds to the remainingTime state
        const totalTime = questions.reduce((acc, curr) => acc + curr.timeInSeconds, 0);
        setRemainingTime(totalTime);
    }

    useEffect(() => {
        calculateTotalTime();
    }, []);


    const generateRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const generateHeartRateNumber = () => {
        let heartRate = generateRandomNumber(60, 100);
        setHeartRateArray([...heartRateArray, heartRate]);
        return heartRate;
    }

    const calculateAverageHeartRate = () => {
        if (heartRateArray.length > 0) {
            const sum = heartRateArray.reduce((acc, curr) => acc + curr, 0);
            const average = sum / heartRateArray.length;
            setAverageHeartRate(average);
        }
    }

    const generateOxygenLevelNumber = () => {
        let oxygenLevel = generateRandomNumber(90, 100);
        setOxygenLevelArray([...oxygenLevelArray, oxygenLevel]);
        return oxygenLevel;
    }

    const calculateAverageOxygenLevel = () => {
        if (oxygenLevelArray.length > 0) {
            const sum = oxygenLevelArray.reduce((acc, curr) => acc + curr, 0);
            const average = sum / oxygenLevelArray.length;
            setAverageOxygenLevel(average);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime > 0) {
                generateHeartRateNumber();
                generateOxygenLevelNumber();
                setRemainingTime(prev => prev - 2); // Decrement remaining time by 2 seconds
            } else {
                clearInterval(interval); // Stop interval when total time is completed
            }
        }, 2000); // Run every 2 seconds

        return () => clearInterval(interval); // Clean up on unmount
    }, [remainingTime]);

    useEffect(() => {
        calculateAverageHeartRate();
        calculateAverageOxygenLevel();
    }, [heartRateArray, oxygenLevelArray]);

    // // display the heart rate and oxygen level arrays in the console
    // console.log('Heart Rate Array:', heartRateArray);
    // console.log('Oxygen Level Array:', oxygenLevelArray);

    // // display the average heart rate and oxygen level in the console
    // console.log('Average Heart Rate:', averageHeartRate);
    // console.log('Average Oxygen Level:', averageOxygenLevel);

    return (
        <div className='HealthMonitorBox' style={{marginTop: '2px',padding: '20px',height: '50px',width: '100%',height: '250px',display: 'flex',flexDirection: 'row',justifyContent: 'space-between'}}>
            <div className='heartratebox' style={{padding: '20px',height: '50px',backgroundColor: 'white' ,width: '80%',height: '150px'}}>
                <img id='heartpic' src={heartRatePic} alt="Heart Rate" style={{ width: '5%' }} />
                <h3>{averageHeartRate.toFixed(2)} BPM</h3>
            </div>
            <div className='oxygenlevelbox' style={{padding: '20px',height: '50px',backgroundColor: 'grey',width: '80%',height: '150px'}}>
                <img id='oxygenpic' src={oxygenLevelPic} alt="Oxygen Level" style={{ width: '5%' }} />
                <h3>{averageOxygenLevel.toFixed(2)} %</h3>
            </div>
        </div>
    );
}

export default HealthMonitor;
