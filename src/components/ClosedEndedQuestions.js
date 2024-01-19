import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import Typed from 'typed.js';
import '../App.css';

function ClosedEndedQuestions() {
    const [responses, setResponses] = useState([0, 0, 0, 0, 0, 0, 0]);

    const handleChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = parseInt(value, 10);
        setResponses(newResponses);
    };

    const calculateScore = () => {
        const score = responses.reduce((total, response) => total + response, 0);
        return score;
    };
  return (
    <div className='App'>
      <PatientNavbar />
      <div className="container mt-4">
                <div className="card" style={{ maxWidth: '60%', margin: '0 auto' }}>
                    <div className="card-body">
                        <h3 className="card-title mb-4" style={{color:"black"}}>Closed-Ended Questions</h3>
                <form>
                    {questions.map((question, index) => (
                        <div key={index} className="mb-3">
                            <p>{question}</p>
                            <div className="form-check form-check-inline">
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
                            </div>
                            <hr className="my-2" />
                        </div>
                        
                    ))}
                </form>
                
                <div className="text-center">
                    <Link to="/OpenEndedQuestions" className="btn btn-primary">
                        Proceed to Open-ended Questions
                    </Link>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}
const questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
];
export default ClosedEndedQuestions;

//<button className="btn btn-primary" onClick={() => alert(`Your GAD-7 Score: ${calculateScore()}`)}>
//        Calculate Score
//</button>