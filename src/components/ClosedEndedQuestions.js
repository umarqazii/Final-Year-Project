import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../App.css';

function ClosedEndedQuestions() {
    const [responses, setResponses] = useState([0, 0, 0, 0, 0, 0, 0]);

    const handleChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = parseInt(value, 10);
        setResponses(newResponses);
    };

    const calculateScore = () => {
        let score = responses.reduce((total, response) => total + response, 0);
        return score;
    };

    //store the GAD-7 score in the database
    const handleSubmit = () => {
        let GADscore = calculateScore();
        console.log("GAD Score:", GADscore); // Debugging log to ensure gadScore is correct
    
        axios
            .post('http://localhost:4000/gadScore', {
                GADscore: GADscore, // Send gadScore with the correct key name
            })
            .then((res) => {
                console.log("Response:", res.data); // Log the response data
            
                // Display a success toast message
                toast.success('GAD Score submitted successfully!', {
                    autoClose: 3000, // Close the toast after 2 seconds
                    onClose: () => {
                        // Redirect to the next page after the toast is closed
                        window.location.href = "/OpenEndedQuestions";
                    }
                });
            })
            .catch((err) => {
                console.error("Error:", err); // Log the error for debugging
                // Display an error toast message
                toast.error('Failed to submit GAD Score!', { autoClose: 5000,
                onClose: () => {
                    // Redirect to the next page after the toast is closed
                    window.location.reload();
                }
                });
            });
    };

    return (
        <div className='App'>
            <PatientNavbar />
            <div className="container mt-4" >
                <div className="card" style={{ maxWidth: '60%', margin: '0 auto', backgroundColor: 'black', borderWidth: '1px', borderColor: 'grey' }}>
                    <div className="card-body">
                        <h3 className="card-title mb-4" style={{ color: "white", fontWeight: 'bolder'}}>Closed-Ended Questions</h3>
                        <i><b><p style={{color: 'white'}}>Over the last two weeks, how often have you been bothered by the following problems?</p></b></i>
                        <hr style={{color:'white'}} />
                        <form >
                            {questions.map((question, index) => (
                                <div key={index} className="mb-3" style={{ color: 'white', transition: 'transform 0.3s' }}>
                                    <p>{question}</p>
                                    Not at all &nbsp;&nbsp;&nbsp;&nbsp;
                                    <div className="form-check form-check-inline" >
                                    
                                        <input
                                            type="radio"
                                            id={`response-${index}-0`}
                                            name={`response-${index}`}
                                            value="0"
                                            checked={responses[index] === 0}
                                            onChange={() => handleChange(index, "0")}
                                            className="form-check-input"
                                        />
                                        
                                        <label htmlFor={`response-${index}-0`} className="form-check-label">
                                            0
                                        </label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            id={`response-${index}-1`}
                                            name={`response-${index}`}
                                            value="1"
                                            checked={responses[index] === 1}
                                            onChange={() => handleChange(index, "1")}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`response-${index}-1`} className="form-check-label">
                                            1
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            id={`response-${index}-2`}
                                            name={`response-${index}`}
                                            value="2"
                                            checked={responses[index] === 2}
                                            onChange={() => handleChange(index, "2")}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`response-${index}-2`} className="form-check-label">
                                            2
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            id={`response-${index}-3`}
                                            name={`response-${index}`}
                                            value="3"
                                            checked={responses[index] === 3}
                                            onChange={() => handleChange(index, "3")}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`response-${index}-3`} className="form-check-label">
                                            3
                                        </label>
                                        &nbsp;&nbsp;&nbsp;&nbsp; Almost every day
                                    </div>
                                    <hr className="my-2" />
                                    
                                </div>

                            ))}
                        </form>

                        <div className="text-center">
                            <button  className="btn btn-outline-light btn-lg" style={{ fontFamily: 'Audiowide, sans-serif', marginBottom: '5px' }} onClick={handleSubmit}>
                                Submit and Move to Open-Ended Questions
                            </button><br></br>
                            
                        </div>
                    </div>
                </div>
            </div>
            <p style={{color: "white"}}>GAD-7 Standard Questionnaire</p>
            <a target='blank' href='https://adaa.org/sites/default/files/GAD-7_Anxiety-updated_0.pdf'>Source</a>
            <ToastContainer />
        </div>
    );
}
const questions = [
    "Q: Feeling nervous, anxious, or on edge",
    "Q: Not being able to stop or control worrying",
    "Q: Worrying too much about different things",
    "Q: Trouble relaxing",
    "Q: Being so restless that it is hard to sit still",
    "Q: Becoming easily annoyed or irritable",
    "Q: Feeling afraid as if something awful might happen",
];
export default ClosedEndedQuestions;

//<button className="btn btn-primary" onClick={() => alert(`Your GAD-7 Score: ${calculateScore()}`)}>
//        Calculate Score
//</button>