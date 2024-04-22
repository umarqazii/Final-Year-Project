const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { PythonShell } = require('python-shell');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const { Patient, PatientEvaluation, Emotions } = require('./Models/Database');

const nodemailer = require('nodemailer');
require("dotenv").config();

app.use(cors());
app.use(express.json());
const upload = multer();

//mongoose.connect('mongodb://127.0.0.1:27017/FYP', {});

mongoose.connect(process.env.MONG_URI)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => console.log(err));

// ----------------------------------Functions to Set username and password----------------------------------

function setUsername(firstName, lastName) {
  firstName = firstName.toLowerCase();
  lastName = lastName.toLowerCase();
  //3 random alphanumeric characters
  let randomString = Math.random().toString(36).substr(2, 3);
  let username = firstName + lastName + randomString;
  return username;
  
}

function setPassword() {
  const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumericCharacters.length);
    password += alphanumericCharacters.charAt(randomIndex);
  }
  return password;
}


// ----------------------------------Register route (used for signup purpose)----------------------------------
app.post('/register-patient', (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  // const username = setUsername(firstName, lastName);
  // const password = setPassword();
  const username = firstName.toLowerCase();
  const password = firstName.toLowerCase();
  const newUser = new Patient({ firstName, lastName, email, phoneNumber, username, password });
  newUser.save()
    .then(() => {
      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'umarqazii983@gmail.com',
      //     pass: 'lgjp cxmz eqgf fgnk'
      //   }
      // });
      // const mailOptions = {
      //   from: 'umarqazii983@gmail.com',
      //   to: email,
      //   subject: 'Credentials for your account',
      //   text: `Your username is "${username}" and password is "${password}"`
      // };
      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
      res.status(200).json({ message: 'Patient added successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
  
});

let userID = '';
let FirstName = '';

let HeartRate = [];
let OxygenLevel = [];

// ----------------------------------Login route (used to check if the person is registered)----------------------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;


  // Check if it's the psychologist
  if (username === 'psy' && password === 'psy') {
    return res.status(200).json({ isPsychologist: true, message: 'Psy login successful' });
  }

  // Check the database for a matching user
  Patient.findOne({ username: username, password: password })
    .then(user => {
      if (user) {
        // User found, consider it a successful login
        userID = user._id;
        return res.status(200).json({ isPsychologist: false, token: 'yourAuthToken', user: user, message: 'Login successful' });
      } else {
        // No matching user found in the database
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// ----------------------------------Get First Name----------------------------------
app.get('/getFirstName', (req, res) => {
  Patient.findById(userID)
    .then(user => {
      if (user) {
        // User found, consider it a successful login
        FirstName = user.firstName;
        return res.status(200).json(FirstName);
      } else {
        // No matching user found in the database
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// ----------------------------------Get Patient List----------------------------------
app.get('/all-patients', (req, res) => {
  Patient.find()
    .then(patients => {
      res.status(200).json(patients);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// ----------------------------------Random Questions----------------------------------
// function generateRandomQuestions() {
//   const getRandomPercentage = () => Math.floor(Math.random() * 101);
//   const getRandomSentiment = () => ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)];
//   const getRandomNumber = () => Math.floor(Math.random() * 101);

//   const questions = {
//     q1percentageHappiness: getRandomPercentage(),
//     q1percentageSadness: getRandomPercentage(),
//     q1percentageAnger: getRandomPercentage(),
//     q1percentageFear: getRandomPercentage(),
//     q1percentageNeutral: getRandomPercentage(),
//     q1Sentiment: getRandomSentiment(),
//     q1HeartRate: getRandomNumber(),
//     q1OxygenLevel: getRandomNumber(),
//     q2percentageHappiness: getRandomPercentage(),
//     q2percentageSadness: getRandomPercentage(),
//     q2percentageAnger: getRandomPercentage(),
//     q2percentageFear: getRandomPercentage(),
//     q2percentageNeutral: getRandomPercentage(),
//     q2Sentiment: getRandomSentiment(),
//     q2HeartRate: getRandomNumber(),
//     q2OxygenLevel: getRandomNumber(),
//     q3percentageHappiness: getRandomPercentage(),
//     q3percentageSadness: getRandomPercentage(),
//     q3percentageAnger: getRandomPercentage(),
//     q3percentageFear: getRandomPercentage(),
//     q3percentageNeutral: getRandomPercentage(),
//     q3Sentiment: getRandomSentiment(),
//     q3HeartRate: getRandomNumber(),
//     q3OxygenLevel: getRandomNumber(),
//     q4percentageHappiness: getRandomPercentage(),
//     q4percentageSadness: getRandomPercentage(),
//     q4percentageAnger: getRandomPercentage(),
//     q4percentageFear: getRandomPercentage(),
//     q4percentageNeutral: getRandomPercentage(),
//     q4Sentiment: getRandomSentiment(),
//     q4HeartRate: getRandomNumber(),
//     q4OxygenLevel: getRandomNumber(),
//     q5percentageHappiness: getRandomPercentage(),
//     q5percentageSadness: getRandomPercentage(),
//     q5percentageAnger: getRandomPercentage(),
//     q5percentageFear: getRandomPercentage(),
//     q5percentageNeutral: getRandomPercentage(),
//     q5Sentiment: getRandomSentiment(),
//     q5HeartRate: getRandomNumber(),
//     q5OxygenLevel: getRandomNumber(),
//     q6percentageHappiness: getRandomPercentage(),
//     q6percentageSadness: getRandomPercentage(),
//     q6percentageAnger: getRandomPercentage(),
//     q6percentageFear: getRandomPercentage(),
//     q6percentageNeutral: getRandomPercentage(),
//     q6Sentiment: getRandomSentiment(),
//     q6HeartRate: getRandomNumber(),
//     q6OxygenLevel: getRandomNumber(),
//     q7percentageHappiness: getRandomPercentage(),
//     q7percentageSadness: getRandomPercentage(),
//     q7percentageAnger: getRandomPercentage(),
//     q7percentageFear: getRandomPercentage(),
//     q7percentageNeutral: getRandomPercentage(),
//     q7Sentiment: getRandomSentiment(),
//     q7HeartRate: getRandomNumber(),
//     q7OxygenLevel: getRandomNumber(),
//     q8percentageHappiness: getRandomPercentage(),
//     q8percentageSadness: getRandomPercentage(),
//     q8percentageAnger: getRandomPercentage(),
//     q8percentageFear: getRandomPercentage(),
//     q8percentageNeutral: getRandomPercentage(),
//     q8Sentiment: getRandomSentiment(),
//     q8HeartRate: getRandomNumber(),
//     q8OxygenLevel: getRandomNumber(),
//     q9percentageHappiness: getRandomPercentage(),
//     q9percentageSadness: getRandomPercentage(),
//     q9percentageAnger: getRandomPercentage(),
//     q9percentageFear: getRandomPercentage(),
//     q9percentageNeutral: getRandomPercentage(),
//     q9Sentiment: getRandomSentiment(),
//     q9HeartRate: getRandomNumber(),
//     q9OxygenLevel: getRandomNumber(),
//     q10percentageHappiness: getRandomPercentage(),
//     q10percentageSadness: getRandomPercentage(),
//     q10percentageAnger: getRandomPercentage(),
//     q10percentageFear: getRandomPercentage(),
//     q10percentageNeutral: getRandomPercentage(),
//     q10Sentiment: getRandomSentiment(),
//     q10HeartRate: getRandomNumber(),
//     q10OxygenLevel: getRandomNumber()
//   };

//   return questions;
// }

// ----------------------------------Generate 10 random values for Heart Rate and Oxygen Level----------------------------------
function generateRandomValues() {
  for (let i = 0; i < 10; i++) {
    HeartRate.push(Math.floor(Math.random() * (120 - 60 + 1)) + 60);
    OxygenLevel.push(Math.floor(Math.random() * (120 - 80 + 1)) + 80);
  }
}

let GADscore = 0;
// ----------------------------------Store GAD7 Score----------------------------------
app.post('/gadScore', async (req, res) => {
  try {
    // const {gadscore} = req.body;
    // GADscore = gadscore;
    GADscore = req.body.GADscore;
    generateRandomValues();
    res.status(200).json({ message: 'GAD7 stored to variable successfully' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// app.post('/gadScore', async (req, res) => {
//   try {
//     const { GADscore } = req.body;
// //    const questions = generateRandomQuestions();
//     const patientID = userID;
//     // if patientID is already present in the database, update the GAD7 score
//     if (await PatientEvaluation.findOne({
//       patientID: userID
//     })) {
//       await PatientEvaluation.findOneAndUpdate({ patientID: userID }, { GADscore: req.body.GADscore });
//       return res.status(200).json({ message: 'GAD7 Score updated successfully' });
//     }
//     else {
//       const newMedicalRecord = new PatientEvaluation({ patientID, GADscore, questions, hasAnxiety: true });
//     await newMedicalRecord.save();
//     res.status(200).json({ message: 'GAD7 Score added successfully' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// -----------------------Patient Evaluation----------------------------------
// Endpoint to handle POST requests to view report
app.post('/view-report', async (req, res) => {
  const { patientID } = req.body;

  try {
    // Search the database for the patient with the provided ID
    const patientReport = await Emotions.findOne({ patientID: patientID });
    
    //from the Patient collection, find the patient Name with the provided ID
    const patientName = await Patient.findOne({ _id: patientID });

    if (!patientReport) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    //search the database for the patient with the provided ID and return only the patient name
    res.status(200).json({ patientName: patientName.firstName, GADscore: patientReport.GADscore, emotionsArray: patientReport.emotionsArray, Sentiment: patientReport.Sentiment, HeartRate: patientReport.HeartRate, OxygenLevel: patientReport.OxygenLevel, hasAnxiety: patientReport.hasAnxiety});

    // Send the GADscore in the response
    //res.status(200).json({ GADscore: patient.GADscore });
    // Send the entire patient object in the response
    //res.status(200).json(patientReport);
    
    


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------------------Storing Emotions---------------------------------
app.post('/sendingEmotions', (req, res) => {
  const { frameResponses, transcriptResponse } = req.body;
  //const newEmotions = new Emotions({ patientID: userID, emotionsArray: frameResponses, Sentiment: transcriptResponse });
  const newEmotions = new Emotions({ patientID: userID, GADscore: GADscore, emotionsArray: frameResponses, Sentiment: transcriptResponse, HeartRate: HeartRate, OxygenLevel: OxygenLevel });
  newEmotions.save()
    .then(() => {
      res.status(200).json({ message: 'Emotions added successfully' });
      // Clear the arrays
      HeartRate = [];
      OxygenLevel = [];
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

let SensorData = 0;

app.get('/sensorDataStore', (req, res) => {
  console.log(req.query);
  SensorData = req.query.heartrate | 0;
  res.status(200).json({ message: 'Sensor data added successfully', data: req.query.heartrate });
});

app.get('/sensorDataGet', (req, res) => {
  res.status(200).json({ data: SensorData });
});


app.listen(2000, () => {
  console.log('Server is running on port 2000');
});


// ----------------------------------Process Video----------------------------------
// const { exec } = require('child_process');
// app.post('/process-video', upload.single('video'), (req, res) => {
//   try {
//     const videoData = req.file.buffer;
//     const videoPath = './temp/video.mp4'; // Corrected path
//     const outputvideoPath = './temp/outputvideo.mp4'; // Corrected path

//     // Ensure that the directory exists
//     const tempDir = 'temp';
//     if (!fs.existsSync(tempDir)) {
//       fs.mkdirSync(tempDir, { recursive: true });
//     }

//     fs.writeFileSync(videoPath, videoData);

//     const ffmpegCommand = `ffmpeg -i ${videoPath} -c copy ${outputvideoPath}`;

// // Execute the FFmpeg command
// exec(ffmpegCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error('FFmpeg error:', error);
//     return;
//   }
// });

//     //fs.writeFileSync(videoPath, videoData);


//     let options = {

//       scriptPath: 'C:\\Users\\Sys\\Desktop\\Final-Year-Project\\backend',
      
//     };
    
//     PythonShell.run('python_script.py', options, function (err, results) {
//       if (err) throw err;
//       console.log('results: %j', results);
//     });
  
//   } catch (error) {
//     console.error('Error processing video:', error);
//   }
// } );