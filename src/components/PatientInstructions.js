import React from "react";
import { Link } from 'react-router-dom';
import PatientNavbar from "./PatientNavbar";
import '../timeline.css';
import consentimg from '../assets/consent.png';
import questionimg from '../assets/question.png';
import timeimg from '../assets/time.png';
import heartimg from '../assets/heart.jpg';
import startimg from '../assets/start.jpg';


function PatientInstructions() {

    return (
        <div className="App" >
            <PatientNavbar />
            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '50px' }}>Assessment Instructions <br></br> and <br></br>Step-by-Step Walkthrough</h1>

            <div class="timeline">

                <div class="cont left-cont">
                    <img src={consentimg} alt="" />
                    <div class="text-box">
                        <h3>1st Step</h3>
                        <b><small>Informed Consent</small></b>
                        <p>Before proceeding, you will be presented with an informed consent form. Take the time to read and understand the terms. Your participation is voluntary, and you may proceed only if you agree to participate.</p>
                        <div class="left-cont-arrow"></div>
                    </div>
                </div>

                <div class="cont right-cont">
                    <img src={questionimg} alt="" />
                    <div class="text-box">
                        <h3>2nd Step</h3>
                        <b><small>Questionnaire Overview</small></b>
                        <p>MindSight Evaluation consists of two types of questionnaires: closed-ended and open-ended. During Closed-ended questions, you will not be recorded, providing you with comfortable space and time for your responses. During Open-ended questions, you will be recorded, and your facial expressions and voice will be analyzed to provide a comprehensive assessment.</p>
                        <div class="right-cont-arrow"></div>
                    </div>
                </div>

                <div class="cont left-cont">
                    <img src={timeimg} alt="" />
                    <div class="text-box">
                        <h3>3rd Step</h3>
                        <b><small>Time Limits for Open-Ended Questions</small></b>
                        <p>Open-ended questions have specific time limits for responses. Please answer within the allocated time to ensure accurate data collection.</p>
                        <div class="left-cont-arrow"></div>
                    </div>
                </div>

                <div class="cont right-cont">
                    <img src={heartimg} alt="" />
                    <div class="text-box">
                        <h3>4th Step</h3>
                        <b><small>Physiological Monitoring</small></b>
                        <p>Ensure that any connected IoT devices, monitoring physiological data such as heart rate and oxygen levels, are securely attached and functioning properly during the assessment.</p>
                        <div class="right-cont-arrow"></div>
                    </div>
                </div>

                <div class="cont left-cont">
                    <img src={startimg} alt="" />
                    <div class="text-box">
                        <h3>5th Step</h3>
                        <b><small>Begin Assessment</small></b>
                        <p>Once you have read and understood these instructions, clicking on 'Begin Assessment' will take you to the consent form.</p>
                        <div class="left-cont-arrow"></div>
                    </div>
                </div>
            </div>
            <div className="container" >
                <div className="row">
                    <div className="col text-center">
                        <Link to="/patientconsentform" className="btn btn-outline-light btn-lg" style={{ fontFamily: 'Audiowide, sans-serif' }}>Move to Consent Form</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientInstructions;