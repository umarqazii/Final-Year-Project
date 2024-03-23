import React, { useState } from "react";
import PatientNavbar from "./PatientNavbar";
import { Card, Nav, Button } from 'react-bootstrap';
import '../Contact.css';
import phoneimg from '../assets/phone.png';
import hospitalimg from '../assets/hospital.png';
import faqsimg from '../assets/faqs.png';
import chatimg from '../assets/chat.png';
import gmailimg from '../assets/gmail.png';
function Contact() {
    const [selectedTab, setSelectedTab] = useState('phoneno'); // State to track the selected tab

    // Function to handle the email to personal email address
    const handleEmailtoPersonal = () => {
        window.location.href = "mailto: umarqazii@gmail.com";
    };

    // Function to handle the email to university email address
    const handleEmailtoUniversity = () => {
        window.location.href = "mailto: i200968@nu.edu.pk";
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'phoneno':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={phoneimg} style={{borderRadius: '5px'}}  /><br/><br/>
                        <Card.Text className="CardTextContact">
                        <b>Psychologist:</b> Wajeeha Zafar
                            <br />0333-1234567 
                        </Card.Text>
                        <Button variant="dark"  onclick="window.location.href='tel:03331234567'" target="_blank" rel="noopener noreferrer" style={{marginRight:'5px'}}>Call Now</Button>
                        <Button variant="dark" onClick={() => navigator.clipboard.writeText('03331234567')}>Copy Phone Number</Button>
                    </Card.Body>
                );
            case 'hospital':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={hospitalimg}  /><br /><br/>
                        <Card.Text className="CardTextContact">
                            <b>Clinic:</b> Soch Clinic
                            <br />
                            
                        </Card.Text>
                        <Button variant="dark" href="https://sochclinics.org/wajeehazafar" target="_blank" rel="noopener noreferrer" style={{marginRight: '5px'}}>Go to Website</Button>
                        <Button variant="dark" onClick={() => navigator.clipboard.writeText('https://sochclinics.org/wajeehazafar')} >Copy Link</Button>
                    </Card.Body>
                );
            case 'faqs':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={faqsimg}  /><br/><br/>
                        <Card.Text className="CardTextContact">
                        <b>Frequently Asked Questions</b> 
                            <br />
                        </Card.Text>
                        <b><p>Q: Will the data I provide remain Confidential?</p></b>
                        <p>A: Yes, the data you provide will remain confidential and will only be accessible to the psychologist.</p>
                        <b><p>Q: How can I trust the psychologist?</p></b>
                        <p>A: The psychologist is a certified professional and has been verified by the hospital.</p>
                        <b><p>Q: How can I trust the hospital?</p></b>
                        <p>A: The hospital is a well-known and reputable organization.</p>

                        </Card.Body>
                );
            case 'chatwithus':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={chatimg}  /><br/><br/>
                        <Card.Text className="CardTextContact">
                        <b>Chat Feature is currently unavailable</b>
                            <br />
                        </Card.Text>
                        </Card.Body>
                );

            case 'gmail':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={gmailimg} /><br/><br/>
                        <Card.Text className="CardTextContact">
                            <b>Personal:</b> umarqazii983@gmail.com <br />
                            {/* Button to copy the email address */}
                            <button
                                className="btn btn-dark" // Apply Bootstrap classes
                                onClick={() => navigator.clipboard.writeText('umarqazii983@gmail.com')}
                                style={{ marginLeft: '10px' }}
                            >
                                Copy
                            </button>
                            <button
                                className="btn btn-dark" // Apply Bootstrap classes
                                onClick={handleEmailtoPersonal}
                                style={{ marginLeft: '10px' }}
                            >
                                Contact Me
                            </button>
                            <br />
                            <br />
                            <b>University:</b> i200968@nu.edu.pk <br />
                            <button
                                className="btn btn-dark" // Apply Bootstrap classes
                                onClick={() => navigator.clipboard.writeText('i200968@nu.edu.pk')}
                                style={{ marginLeft: '10px' }}
                            >
                                Copy
                            </button>
                            <button
                                className="btn btn-dark" // Apply Bootstrap classes
                                onClick={handleEmailtoUniversity}
                                style={{ marginLeft: '10px' }}
                            >
                                Contact Me
                            </button>
                             
                        </Card.Text>
                    </Card.Body>

                );

            default:
                return null;
        }
    };

    return (
        <div className="App">
            <PatientNavbar />
            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '50px' }}>Contact Us</h1>

            <div className="ContactContainer">
                <Card className="CardContact">
                    <Card.Header className="CardHeaderContact">
                        <Nav variant="tabs" defaultActiveKey="#phoneno">
                            <Nav.Item>
                                <Nav.Link href="#phoneno" onClick={() => setSelectedTab('phoneno')}>Phone No</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#hospital" onClick={() => setSelectedTab('hospital')}>Hospital</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#faqs" onClick={() => setSelectedTab('faqs')}>FAQs</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link href="#chatwithus" onClick={() => setSelectedTab('chatwithus')}>Chat with Us</Nav.Link>
                            </Nav.Item>

                            

                        </Nav>
                    </Card.Header>
                    {renderContent()} {/* Render content based on the selected tab */}
                </Card>
            </div>
        </div>
    );
}

export default Contact;
