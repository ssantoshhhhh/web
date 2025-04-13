const mongoose = require('mongoose');

// Define Employer Schema
const employerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'employer',  // Default role for this model
  },
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',  // Reference to the Job model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Employer Model
const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
