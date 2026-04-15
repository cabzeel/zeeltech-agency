const express = require('express');
const router = express.Router();
const { login, logout, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/protect');

router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', verifyToken, getMe);

module.exports = router;
