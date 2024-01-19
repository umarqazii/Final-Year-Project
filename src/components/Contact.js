import React, { useState } from "react";
import PatientNavbar from "./PatientNavbar";
import { Card, Nav, Button } from 'react-bootstrap';
import '../Contact.css';
import githubimg from '../assets/github.png';
import linkedinimg from '../assets/linkedin.png';
import facebookimg from '../assets/fb.png';
import instagramimg from '../assets/insta.png';
import gmailimg from '../assets/gmail.png';
function Contact() {
    const [selectedTab, setSelectedTab] = useState('github'); // State to track the selected tab

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
            case 'facebook':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={facebookimg}  /><br /><br/>
                        <Card.Text className="CardTextContact">
                            <b>Username:</b> Umar Qazi
                            <br />
                            
                        </Card.Text>
                        <Button variant="dark" href="https://www.facebook.com/hafiz.umarqazi.7" target="_blank" rel="noopener noreferrer" style={{marginRight: '5px'}}>Go to Facebook</Button>
                        <Button variant="dark" onClick={() => navigator.clipboard.writeText('https://www.facebook.com/hafiz.umarqazi.7')} >Copy Link</Button>
                    </Card.Body>
                );
            case 'instagram':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={instagramimg}  /><br/><br/>
                        <Card.Text className="CardTextContact">
                        <b>Username:</b> umarqazii
                            <br />
                        </Card.Text>
                        <Button variant="dark" href="https://www.instagram.com/umarqazii/" target="_blank" rel="noopener noreferrer" style={{marginRight:'5px'}}>Go to Instagram</Button>
                        <Button variant="dark" onClick={() => navigator.clipboard.writeText('https://www.instagram.com/umarqazii/')} >Copy Link</Button>
                    </Card.Body>
                );
            case 'github':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={githubimg} style={{borderRadius: '5px'}}  /><br/><br/>
                        <Card.Text className="CardTextContact">
                        <b>Username:</b> umarqazii
                            <br />
                        </Card.Text>
                        <Button variant="dark" href="https://github.com/umarqazii" target="_blank" rel="noopener noreferrer" style={{marginRight:'5px'}}>Go to GitHub</Button>
                        <Button variant="dark" onClick={() => navigator.clipboard.writeText('https://github.com/umarqazii')}>Copy Link</Button>
                    </Card.Body>
                );
            case 'linkedin':
                return (
                    <Card.Body className="CardBodyContact">
                        <Card.Img className="CardImgContact" variant="top" src={linkedinimg}  /><br/><br/>
                        <Card.Text className="CardTextContact">
                        <b>Username:</b> Umar Qazi
                            <br />
                        </Card.Text>
                        <Button variant="dark" href="https://www.linkedin.com/in/umar-qazi-61b62a24a/" target="_blank" rel="noopener noreferrer" style={{marginRight: '5px'}}>Go to LinkedIn</Button>
                        <Button variant="dark" onClick={() => navigator.clipboard.writeText('https://www.linkedin.com/in/umar-qazi-61b62a24a/')} >Copy Link</Button>
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
            <h1 style={{ fontFamily: 'Audiowide, sans-serif', color: 'white', marginTop: '50px' }}>Contact Me</h1>

            <div className="ContactContainer">
                <Card className="CardContact">
                    <Card.Header className="CardHeaderContact">
                        <Nav variant="tabs" defaultActiveKey="#github">
                            <Nav.Item>
                                <Nav.Link href="#github" onClick={() => setSelectedTab('github')}>GitHub</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link href="#linkedin" onClick={() => setSelectedTab('linkedin')}>LinkedIn</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link href="#facebook" onClick={() => setSelectedTab('facebook')}>Facebook</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#instagram" onClick={() => setSelectedTab('instagram')}>Instagram</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#gmail" onClick={() => setSelectedTab('gmail')}>Gmail</Nav.Link>
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
