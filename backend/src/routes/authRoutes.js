const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
} = require('../controllers/authController');

// User Routes
router.post('/user/signup', registerUser);
router.post('/user/login', loginUser);

// Admin Routes
router.post('/admin/signup', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;
