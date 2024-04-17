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

  // const questionSchema = new Schema({
  //   question: { type: Number, required: true },
  //   percentageHappiness: { type: Number },
  //   percentageSadness: { type: Number },
  //   percentageAnger: { type: Number },
  //   percentageFear: { type: Number },
  //   percentageNeutral: { type: Number },
  //   positiveSentiment: { type: Number },
  //   negativeSentiment: { type: Number },
  //   avgHeartRate: { type: Number },
  //   avgOxygenLevel: { type: Number },
  // });

let patientEvaluation = new Schema({
  patientID: { type: Schema.Types.ObjectId, ref: 'Patient'},
  GADscore: { type: Number },
  questions: {
    q1percentageHappiness: { type: Number },
    q1percentageSadness: { type: Number },
    q1percentageAnger: { type: Number },
    q1percentageFear: { type: Number },
    q1percentageNeutral: { type: Number },
    q1Sentiment: { type: String },
    q1HeartRate: { type: Number },
    q1OxygenLevel: { type: Number },
    q2percentageHappiness: { type: Number },
    q2percentageSadness: { type: Number },
    q2percentageAnger: { type: Number },
    q2percentageFear: { type: Number },
    q2percentageNeutral: { type: Number },
    q2Sentiment: { type: String },
    q2HeartRate: { type: Number },
    q2OxygenLevel: { type: Number },
    q3percentageHappiness: { type: Number },
    q3percentageSadness: { type: Number },
    q3percentageAnger: { type: Number },
    q3percentageFear: { type: Number },
    q3percentageNeutral: { type: Number },
    q3Sentiment: { type: String },
    q3HeartRate: { type: Number },
    q3OxygenLevel: { type: Number },
    q4percentageHappiness: { type: Number },
    q4percentageSadness: { type: Number },
    q4percentageAnger: { type: Number },
    q4percentageFear: { type: Number },
    q4percentageNeutral: { type: Number },
    q4Sentiment: { type: String },
    q4HeartRate: { type: Number },
    q4OxygenLevel: { type: Number },
    q5percentageHappiness: { type: Number },
    q5percentageSadness: { type: Number },
    q5percentageAnger: { type: Number },
    q5percentageFear: { type: Number },
    q5percentageNeutral: { type: Number },
    q5Sentiment: { type: String },
    q5HeartRate: { type: Number },
    q5OxygenLevel: { type: Number },
    q6percentageHappiness: { type: Number },
    q6percentageSadness: { type: Number },
    q6percentageAnger: { type: Number },
    q6percentageFear: { type: Number },
    q6percentageNeutral: { type: Number },
    q6Sentiment: { type: String },
    q6HeartRate: { type: Number },
    q6OxygenLevel: { type: Number },
    q7percentageHappiness: { type: Number },
    q7percentageSadness: { type: Number },
    q7percentageAnger: { type: Number },
    q7percentageFear: { type: Number },
    q7percentageNeutral: { type: Number },
    q7Sentiment: { type: String },
    q7HeartRate: { type: Number },
    q7OxygenLevel: { type: Number },
    q8percentageHappiness: { type: Number },
    q8percentageSadness: { type: Number },
    q8percentageAnger: { type: Number },
    q8percentageFear: { type: Number },
    q8percentageNeutral: { type: Number },
    q8Sentiment: { type: String },
    q8HeartRate: { type: Number },
    q8OxygenLevel: { type: Number },
    q9percentageHappiness: { type: Number },
    q9percentageSadness: { type: Number },
    q9percentageAnger: { type: Number },
    q9percentageFear: { type: Number },
    q9percentageNeutral: { type: Number },
    q9Sentiment: { type: String },
    q9HeartRate: { type: Number },
    q9OxygenLevel: { type: Number },
    q10percentageHappiness: { type: Number },
    q10percentageSadness: { type: Number },
    q10percentageAnger: { type: Number },
    q10percentageFear: { type: Number },
    q10percentageNeutral: { type: Number },
    q10Sentiment: { type: String },
    q10HeartRate: { type: Number },
    q10OxygenLevel: { type: Number },

  },
  hasAnxiety: { type: Boolean},
}, {
  collection: 'patientEvaluations'
});

let patientReport = new Schema({
  patientID: { type: Schema.Types.ObjectId, ref: 'Patient'},
  GADscore: { type: Number },
  questions:{
    Q1: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q2: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q3: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q4: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q5: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q6: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q7: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q8: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q9: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    },
    Q10: {
      percentageHappiness: { type: Number },
      percentageSadness: { type: Number },
      percentageAnger: { type: Number },
      percentageFear: { type: Number },
      percentageNeutral: { type: Number },
      Sentiment: { type: String },
      HeartRate: { type: Number },
      OxygenLevel: { type: Number },
    }

  },
  hasAnxiety: { type: Boolean},
}, {
  collection: 'patientReports'
});

let Emotions = new Schema({
  patientID: { type: Schema.Types.ObjectId, ref: 'Patient', unique: true},
  GADscore: { type: Number },
  emotionsArray: { type: Array },
  Sentiment: { type: String },
  HeartRate: { type: Array },
  OxygenLevel: { type: Array },
  hasAnxiety: { type: String},
}, {
  collection: 'emotions'
});

let EncodedImages = new Schema({
  patientID: { type: Schema.Types.ObjectId, ref: 'Patient'},
  encodedImages: { type: Array },
}, {
  collection: 'encodedImages'
});
  

  module.exports = {
    Patient: mongoose.model('Patient', patientSchema),
    PatientEvaluation: mongoose.model('PatientEvaluation', patientEvaluation),
    PatientReport: mongoose.model('PatientReport', patientReport),
    Emotions: mongoose.model('Emotions', Emotions),
    EncodedImages: mongoose.model('EncodedImages', EncodedImages),
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
