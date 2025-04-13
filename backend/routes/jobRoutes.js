const express = require('express');
const { createJob, getAllJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);

module.exports = router;
