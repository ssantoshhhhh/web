const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['Employer', 'JobFinder'], required: true },
    otp: String,
    isVerified: { type: Boolean, default: false },
    profile: {
        skills: [String],
        experience: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
