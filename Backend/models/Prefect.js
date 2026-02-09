const mongoose = require('mongoose');

const prefectSchema = new mongoose.Schema({
  studentId: {
    type: String,  // Changed from ObjectId to String to match Student model
    ref: 'student',  // Changed to lowercase 'student' to match your model
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: [
      'Head Prefect',
      'Deputy Head Prefect',
      'Sports Prefect',
      'Library Prefect',
      'Discipline Prefect',
      'Cultural Prefect',
      'Academic Prefect',
      'Social Service Prefect'
    ]
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false  // Optional - null if currently serving
  },
  responsibilities: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Create index to prevent duplicate student as prefect (optional)
prefectSchema.index({ studentId: 1 }, { unique: true });

module.exports = mongoose.model('Prefect', prefectSchema);

