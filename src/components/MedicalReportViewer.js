import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function MedicalReportViewer({ medicalInfo }) {
  
  const divideEmotionsByQuestion = (emotionsArray) => {
    const dividedEmotions = [];
    let group = emotionsArray.length / 10;
    for (let i = 0; i < emotionsArray.length; i += group) {
      dividedEmotions.push(emotionsArray.slice(i, i + group));
    }
    return dividedEmotions;
  };

  // State to hold emotion frequencies
  const [emotionFrequencies, setEmotionFrequencies] = useState({});
  const [heartRateChartData, setHeartRateChartData] = useState([]);
  const [oxygenLevelChartData, setOxyLevelChartData] = useState([]);

  // Function to calculate emotion frequencies
  const calculateEmotionFrequencies = (emotionsArray) => {
    const frequencies = {};
    emotionsArray.forEach(emotion => {
      if (emotion !== null && emotion !== undefined) {
        frequencies[emotion] = (frequencies[emotion] || 0) + 1;
      }
    });
    return frequencies;
  };

  useEffect(() => {
    // Calculate emotion frequencies when medicalInfo changes
    if (medicalInfo && medicalInfo.emotionsArray) {
      const frequencies = calculateEmotionFrequencies(medicalInfo.emotionsArray);
      setEmotionFrequencies(frequencies);
    }
    // Extract heart rate data for the line chart
    if (medicalInfo && medicalInfo.HeartRate) {
      setHeartRateChartData(medicalInfo.HeartRate);
    }
    // Extract oxygen level data for the line chart
    if (medicalInfo && medicalInfo.OxygenLevel) {
      setOxyLevelChartData(medicalInfo.OxygenLevel);
    }
  }, [medicalInfo]);

  // Data for the bar chart
  const emotionDataPoints = Object.keys(emotionFrequencies).map(emotion => ({
    label: emotion,
    y: emotionFrequencies[emotion]
  }));

  // Options for the bar chart
  const emotionOptions = {
    animationEnabled: true,
    title: {
      text: "Emotion Frequency"
    },
    axisX: {
      title: "Emotion",
      reversed: true
    },
    axisY: {
      title: "Frequency"
    },
    data: [{
      type: "column",
      dataPoints: emotionDataPoints
    }]
  };

  // Data for the line chart
  const heartRateDataPoints = heartRateChartData.map((heartRate, index) => ({
    x: index + 1,
    y: heartRate
  }));

  const oxygenLevelDataPoints = oxygenLevelChartData.map((oxygenLevel, index) => ({
    x: index + 1,
    y: oxygenLevel
  }));

  // Options for the line chart
  const heartRateOptions = {
    animationEnabled: true,
    title: {
      text: "Heart Rate"
    },
    axisX: {
      title: "Question Number"
    },
    axisY: {
      title: "Heart Rate"
    },
    data: [{
      type: "line",
      dataPoints: heartRateDataPoints
    }]
  };

  // Options for the line chart
  const oxygenLevelOptions = {
    animationEnabled: true,
    title: {
      text: "Oxygen Level"
    },
    axisX: {
      title: "Question Number"
    },
    axisY: {
      title: "Oxygen Level"
    },
    data: [{
      type: "line",
      dataPoints: oxygenLevelDataPoints
    }]
  };

  return (
    <div style={{ background: 'white', width: '50%', margin: '0 auto', borderRadius: '10px' }}>
      <h2>Medical Report</h2>
      {medicalInfo && (
        <div>
          <p><b>Patient Name: {medicalInfo.patientName}</b></p>
          <p>GAD Score: {medicalInfo.GADscore}</p>
          {/* Divide emotions array into groups of 15 */}
          {divideEmotionsByQuestion(medicalInfo.emotionsArray).map((questionEmotions, index) => (
            <div key={index}>
              <p><b>Question {index + 1} Emotions:</b> <br></br>{questionEmotions.join(', ')}</p>
            </div>
          ))}
          {/* horizontal line */}
          <hr />
          <p><b>Sentiment:</b> {medicalInfo.Sentiment}</p>
          <hr />
          {/* Display the bar chart */}
          {Object.keys(emotionFrequencies).length > 0 && (
            <CanvasJSChart options={emotionOptions} />
          )}
          <hr />
          {/* Display the line chart */}
          {heartRateChartData.length > 0 && (
            <CanvasJSChart options={heartRateOptions} />
          )}
<hr />
          {oxygenLevelChartData.length > 0 && (
            <CanvasJSChart options={oxygenLevelOptions} />
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalReportViewer;
