const Application = require('../models/applicationModel');

// View Applicants for Employer
exports.viewApplicants = async (req, res) => {
    try {
        const applications = await Application.find({}).populate('applicantId', 'name email').populate('jobId', 'title');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch applications', error });
    }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = status;
        await application.save();
        res.status(200).json({ message: 'Application status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};
