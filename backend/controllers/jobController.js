const Job = require('../models/jobModel');

// Create Job
exports.createJob = async (req, res) => {
    const { title, description, company, location, salary } = req.body;
    try {
        const job = new Job({ title, description, company, location, salary, postedBy: req.user.id });
        await job.save();
        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Failed to post job', error });
    }
};

// Get All Jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch jobs', error });
    }
};

// Get Job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};
