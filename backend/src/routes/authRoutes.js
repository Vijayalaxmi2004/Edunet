const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/users', authMiddleware, authController.getAllUsers);

module.exports = router;
