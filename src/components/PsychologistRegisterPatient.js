import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import '../App.css';
import axios from "axios";
import PsychologistNavbar from "./PsychologistNavbar";

function PsychologistRegisterPatient() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate phone number, if it's not 11 digits, show error
        if (!/^\d{11}$/.test(phoneNumber)) {
            setPhoneNumberError("Please enter a valid 11-digit phone number");
            return;
        } 
        else {
        axios
            .post('http://localhost:4000/register-patient', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
            })
            .then((res) => {
                console.log(res);
                
                //display a successful toast message
                toast.success('Patient Registered Successfully!', {
                    autoClose: 2000, // Close the toast after 2 seconds
                    onClose: () => {
                        // Redirect to the home page after the toast is closed
                        window.location.reload();
                    }
                });

                //reload the page
                
                // Handle success, such as displaying a success message to the user
            })
            .catch((err) => {
                console.error(err);
                // Handle error, such as displaying an error message to the user
                toast.error('Error Registering Patient!', {
                    autoClose: 2000, // Close the toast after 2 seconds
                    onClose: () => {
                        // Redirect to the home page after the toast is closed
                        window.location.reload();
                    }
                });
            });
        }
    };

    return (
        <div className='App'>
            <PsychologistNavbar />
            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '50px' }}>REGISTER PATIENT</h1>
            <div className="container mt-5">

                <form
                    onSubmit={handleSubmit}
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        backgroundColor: '#f8f9fa',
                        marginTop: '20px',
                    }}
                >
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                        }}
                    >
                        First Name:
                        <input
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '16px',
                                boxSizing: 'border-box',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                        }}
                    >
                        Last Name:
                        <input
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '16px',
                                boxSizing: 'border-box',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>


                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                        }}
                    >
                        Email:
                        <input
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '16px',
                                boxSizing: 'border-box',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                        }}
                    >
                        Phone Number:
                        <input
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '16px',
                                boxSizing: 'border-box',
                                border: `1px solid ${phoneNumberError ? 'red' : '#ccc'}`,
                                borderRadius: '4px',
                            }}
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </label>
                    {phoneNumberError && (
                        <p style={{ color: 'red', margin: '0' }}>{phoneNumberError}</p>
                    )}
                    <button
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        type="submit"
                    >
                        Register
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default PsychologistRegisterPatient;