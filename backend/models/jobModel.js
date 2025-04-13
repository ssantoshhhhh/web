const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
    company: String,
    location: String,
    salary: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
