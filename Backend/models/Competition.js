// models/Competition.js
const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
});

const competitionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  participants: [participantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically set year from date before saving
competitionSchema.pre('save', function(next) {
  if (this.date) {
    this.year = new Date(this.date).getFullYear();
  }
  next();
});

module.exports = mongoose.model('Competition', competitionSchema);