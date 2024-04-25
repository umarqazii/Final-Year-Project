const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();


app.use(cors());
app.use(express.json());
const upload = multer();


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
  console.log('Sensor Server is running on port 2000');
});

