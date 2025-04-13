const express = require('express');
const Job = require('../models/jobModel'); // Import Job model
const Application = require('../models/applicationModel'); // Import Application model
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// GET available jobs (for seekers to search and view)
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().lean(); // Use lean() for better performance
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// POST an application (Job Seeker applying for a job)
router.post('/apply-job/:jobId', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const seekerId = req.user?._id; // Ensure req.user exists

    if (!seekerId) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if seeker has already applied for this job
    const existingApplication = await Application.findOne({ job: jobId, seeker: seekerId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      seeker: seekerId,
      status: 'pending'
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for job', error: error.message });
  }
});

// GET job applications status (Job Seeker dashboard)
router.get('/application-status', authMiddleware, async (req, res) => {
  try {
    const seekerId = req.user?._id; // Ensure req.user exists

    if (!seekerId) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const applications = await Application.find({ seeker: seekerId })
      .populate('job', 'title company location') // Populate job details with selected fields
      .lean();

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications status', error: error.message });
  }
});

module.exports = router;
