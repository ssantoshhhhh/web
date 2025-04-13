const Application = require('../models/applicationModel');

// Apply for a Job
exports.applyForJob = async (req, res) => {
    try {
        const application = new Application({ jobId: req.body.jobId, applicantId: req.user.id });
        await application.save();
        res.status(201).json({ message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Application failed', error });
    }
};

// View My Applications
exports.viewMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id }).populate('jobId', 'title company');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};
