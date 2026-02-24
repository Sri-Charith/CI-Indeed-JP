const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    getApplicationById
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Shared routes
router.get('/:id', protect, getApplicationById);

// User routes
router.post('/', protect, applyToJob);
router.get('/my/all', protect, getMyApplications);

// Admin routes
router.get('/job/:jobId', protect, adminOnly, getJobApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
