import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [completed1, setCompleted1] = useState(false);
  const [frameResponses, setFrameResponses] = useState([]);
  const [transcriptResponse, setTranscriptResponse] = useState('');

  useEffect(() => {
    let recognition; // Declare recognition variable in outer scope
    let frameCount = 0; // Counter for received responses

    const captureAndSendFrame = async () => {
      const imageSrc = webcamRef.current.getScreenshot();

      try {
        const response = await axios.post('http://localhost:5000/save-and-analyze-frame', { frame: imageSrc });
        const emotion = response.data.emotion;
        setFrameResponses(prevResponses => [...prevResponses, emotion]); // Add emotion to responses array
        frameCount++; // Increment counter
        if (frameCount === 6) setCompleted(true); // Check if all responses are received
      } catch (error) {
        console.error('Error sending frame to backend:', error);
      }
    };

    const startSpeechRecognition = () => {
      recognition = new window.webkitSpeechRecognition(); // Assign recognition in outer scope
      recognition.lang = 'en-US'; // Set language to English (United States)
      recognition.continuous = true;

      let accumulatedTranscript = ''; // Variable to accumulate the transcript

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        accumulatedTranscript += transcript; // Accumulate the transcript
        console.log('Accumulated Transcript:', accumulatedTranscript); // Log accumulated transcript
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setTranscript(accumulatedTranscript); // Update state with the accumulated transcript
        console.log('Final Transcript:', accumulatedTranscript); // Log final transcript

        // Send transcript to backend after 30 seconds
        setTimeout(() => {
          sendTranscriptToBackend(accumulatedTranscript);
        }, 30000);
      };

      recognition.start();
    };

    const sendTranscriptToBackend = async (transcript) => {
      // Send transcript to backend
      try {
        const response = await axios.post('http://localhost:5000/save-transcript', { transcript: transcript });
        const sentiment = response.data.sentiment;
        setTranscriptResponse(sentiment); // Set transcript response
        setCompleted1(true); // Set completed to true
      } catch (error) {
        console.error('Error sending transcript to backend:', error);
      }
    };

    const intervalId = setInterval(() => {
      captureAndSendFrame();
    }, 5000); // Capture frame and send it every 5 seconds

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId); // Stop capturing frames
      webcamRef.current.stream.getTracks().forEach(track => track.stop()); // Stop the webcam stream
      if (recognition) recognition.stop(); // Stop speech recognition if it's defined
    }, 30000); // Stop after 30 seconds

    startSpeechRecognition();
    

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      if (recognition) recognition.stop(); // Stop recognition if it's defined
      // Display frameResponses in the console
        console.log("Frame Responses after timeout:", frameResponses);
    };
  }, []); // Run only once when component mounts

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
      />
      {(completed && completed1) ? (
        <div>
          <div>Frames Responses: {frameResponses.join(', ')}</div>
          <div>Transcript Response: {transcriptResponse}</div>
          <div>Analysis completed.</div>
        </div>
      ) : null}
    </>
  );
};

export default WebcamCapture;
