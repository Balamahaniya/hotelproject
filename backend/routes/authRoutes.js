const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// @route   POST /auth/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /auth/login
// @desc    Authenticate user and return status
router.post('/login', login);

module.exports = router;
