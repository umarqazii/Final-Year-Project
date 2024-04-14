import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import '../App.css';

function PatientConsentForm() {
    const [agreed, setAgreed] = useState(false);

    const handleAgree = () => {
        setAgreed(true);
        // You can perform any additional actions upon agreement if needed
    };
  return (
    <div className='App'>
      <PatientNavbar />
      <div className="container mt-4">
                <div className="card" style={{ maxWidth: '60%', margin: '0 auto', marginTop: '100px',backgroundColor: 'black', borderWidth: '2px', borderColor: 'grey' }}>
                    <div className="card-body">
                        <h3 className="card-title mb-4" style={{color:"white"}}>Consent Form</h3>

                        <p style={{color:"white"}}>
                            By agreeing to participate, you acknowledge that you understand the purpose of the assessment, which involves the collection and analysis of your responses to closed-ended and recorded open-ended questions. You consent to the monitoring of physiological data, including heart rate and oxygen levels, through connected IoT devices during the assessment. Your privacy is of utmost importance, and you agree to the confidential storage and use of your data solely for the purpose of mental health assessment. Participation is entirely voluntary, and you reserve the right to withdraw at any point without any impact on your ongoing treatment. MindSight is committed to maintaining the highest standards of data security and confidentiality throughout the assessment process.
                        </p>
                    
                        <div className="form-check mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="consentCheckbox"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                                style={{ marginRight: '8px' }}
                            />
                            <label className="form-check-label" htmlFor="consentCheckbox" style={{color:"white", fontWeight: 'bold'}}>
                                I agree to participate in the assessment.
                            </label>
                        </div>
                    

                        <div className="mb-4">
                            {agreed ? (
                                <Link
                                    to="/closedendedquestions"
                                    className="btn btn-outline-light btn-lg" style={{ fontFamily: 'Audiowide, sans-serif', marginBottom: '5px' }}
                                >
                                    Proceed to Closed-ended Questions
                                </Link>
                            ) : (
                                <button className="btn btn-outline-light btn-lg" style={{ fontFamily: 'Audiowide, sans-serif', marginBottom: '5px' }} disabled>
                                    Please agree to the terms to proceed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
}

export default PatientConsentForm;