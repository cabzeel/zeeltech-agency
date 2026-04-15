const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getSubscribers, deleteSubscriber, sendNewsletter } = require('../controllers/subscriberController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Protected
router.get('/', verifyToken, authorize('users', 'read'), getSubscribers);
router.post('/send-newsletter', verifyToken, authorize('users', 'create'), sendNewsletter);
router.delete('/:id', verifyToken, authorize('users', 'delete'), deleteSubscriber);

module.exports = router;
