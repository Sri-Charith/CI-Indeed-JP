const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getAdminJobs
} = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin Only Routes
router.post('/', protect, adminOnly, createJob);
router.get('/admin/all', protect, adminOnly, getAdminJobs);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;
