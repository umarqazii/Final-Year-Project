const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let patientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String},
}, {
    collection: 'patients' // Explicitly setting the collection name
  });

let medicalRecordSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  GAD7Score: { type: Number, required: true },
  
  question1Emotion: { type: String },
  question1Sentiment: { type: String },
  question2Emotion: { type: String },
  question2Sentiment: { type: String },
  question3Emotion: { type: String },
  question3Sentiment: { type: String },
  question4Emotion: { type: String },
  question4Sentiment: { type: String },
  question5Emotion: { type: String },
  question5Sentiment: { type: String },
  question6Emotion: { type: String },
  question6Sentiment: { type: String },
  question7Emotion: { type: String },
  question7Sentiment: { type: String },
  question8Emotion: { type: String },
  question8Sentiment: { type: String },
  question9Emotion: { type: String },
  question9Sentiment: { type: String },
  question10Emotion: { type: String },
  question10Sentiment: { type: String },
}, {
    collection: 'medicalRecords' // Explicitly setting the collection name
  });
  

  module.exports = {
    Patient: mongoose.model('Patient', patientSchema),
    MedicalRecord: mongoose.model('MedicalRecord', medicalRecordSchema),
  };
  

// let userSchema = new Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// }, {
//   collection: 'users' // Explicitly setting the collection name
// });



// let requestSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   productName: { type: String, required: true },
//   version: { type: String, required: true },
//   description: { type: String, required: true },
// }, {
//   collection: 'requests' // Explicitly setting the collection name
// });

// let productSchema = new Schema({
//   userId: { type: String, required: true },
//   productName: { type: String, required: true },
//   version: { type: String, required: true },
//   description: { type: String, required: true },
//   licenseKey: { type: String, required: true },
//   activationStatus: { type: String, required: true },
// }, {
//   collection: 'products' // Explicitly setting the collection name
// });

// // Only export once and include all models
// module.exports = {
//   Request: mongoose.model('Request', requestSchema),
//   User: mongoose.model('User', userSchema),
//   Product: mongoose.model('Product', productSchema),
// };
