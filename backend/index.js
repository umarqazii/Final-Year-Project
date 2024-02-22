const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { Patient, MedicalRecord } = require('./Models/Database');
const nodemailer = require('nodemailer');
require("dotenv").config();

app.use(cors());
app.use(express.json());

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

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// ----------------------------------Store GAD7 Score----------------------------------

app.post('/gadScore', (req, res) => {
  const { gadScore } = req.body;
  const newMedicalRecord = new MedicalRecord({ patientId: userID, GAD7Score: gadScore });
  newMedicalRecord.save()
    .then(() => {
      res.status(200).json({ message: 'GAD7 Score added successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});



