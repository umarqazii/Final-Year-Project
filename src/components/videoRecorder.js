import React, { useState } from 'react';
import axios from 'axios';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const mediaRecorder = new MediaRecorder(stream);

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setVideoBlob(blob);
      };

      mediaRecorder.start();
      setStream(stream);
      setMediaRecorder(mediaRecorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const uploadVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob);

      await axios.post('http://localhost:5000/process-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={uploadVideo} disabled={!videoBlob}>
        Upload Video
      </button>
    </div>
  );
};

export default VideoRecorder;
