const express = require('express');
const Employer = require('../models/employerModel');  // Import Employer model
const Job = require('../models/jobModel');            // Import Job model
const authMiddleware = require('../middleware/authMiddleware');  // Import auth middleware

const router = express.Router();

// POST a new job (Employer only)
router.post('/post-job', authMiddleware.protect, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { title, description, location, salary } = req.body;
  const employerId = req.user._id;

  const newJob = new Job({
    title,
    description,
    location,
    salary,
    employer: employerId,
  });

  try {
    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error posting job', error });
  }
});

// GET applications for a job (Employer view)
router.get('/job-applications/:jobId', authMiddleware.protect, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).populate('applications');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job.applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});

module.exports = router;
