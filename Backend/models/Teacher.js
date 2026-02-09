const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', '']
  },
  address: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true  // Enable this if you want it required
  },
  postalcode: {
    type: String,
    required: true  // Enable this if you want it required
  },
  policeName: {
    type: String,
    required: true  // Enable this if you want it required
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  qualification: {
    type: String
  },
  experience: {
    type: Number  // in years
  },
  subject: {
    type: String,
    required: true
  },
  joinedDate: {
    type: Date
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Visiting', '']
  },
  salary: {
    type: Number
  },
  nic: {
    type: String,  // CHANGED FROM Number TO String
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  bankNumber: {
    type: String,  // Keep as String to preserve leading zeros
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords for login
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);