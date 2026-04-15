const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/protect');

router.use(verifyToken);

router.get('/', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.delete('/clear-all', deleteAllNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
