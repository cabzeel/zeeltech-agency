const express = require('express');
const router = express.Router();
const { submitContact, getContacts, getContact, updateContactStatus, replyContact, deleteContact } = require('../controllers/contactController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.post('/', submitContact);

// Protected (admin only)
router.get('/', verifyToken, authorize('users', 'read'), getContacts);
router.get('/:id', verifyToken, authorize('users', 'read'), getContact);
router.put('/:id/status', verifyToken, authorize('users', 'update'), updateContactStatus);
router.post('/:id/reply', verifyToken, authorize('users', 'update'), replyContact);
router.delete('/:id', verifyToken, authorize('users', 'delete'), deleteContact);

module.exports = router;
