import React from 'react';

function MedicalReportViewer({ medicalInfo }) {
  
  const divideEmotionsByQuestion = (emotionsArray) => {
    const dividedEmotions = [];
    let group=emotionsArray.length/10;
    for (let i = 0; i < emotionsArray.length; i += group) {
      dividedEmotions.push(emotionsArray.slice(i, i + group));
    }
    return dividedEmotions;
  };

  return (
    <div style={{background: 'white', width: '50%', margin: '0 auto', borderRadius: '10px'}}>
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
          <p><b>Sentiment:</b> {medicalInfo.Sentiment}</p>
        </div>
      )}
    </div>
  );
}

export default MedicalReportViewer;
