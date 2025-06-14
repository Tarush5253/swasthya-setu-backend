// File: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {protect} = require('../middleware/auth.js')

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/verify', protect, authController.verify);

module.exports = router;