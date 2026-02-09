const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const studentSchema = new Schema({
       _id: {
        type: String,   // use String instead of ObjectId
        required: true,
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    dateBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
   
    },
    mJobs: {
        type: String,
  
    },
    fatherName: {
        type: String,
    },
    fJobs: {
        type: String,
    },
    guardiansName: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    rejisteredDate: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }

},{ timestamps: true });

module.exports = mongoose.model(
    "student", studentSchema);  