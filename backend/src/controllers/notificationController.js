const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const filter = { recipient: req.user._id };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.status(200).json({ success: true, count: notifications.length, total, unreadCount, data: notifications });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }, { new: true }
    );
    if (!notification) { const e = new Error('Notification not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: notification });
  } catch (error) { next(error); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) { next(error); }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    if (!notification) { const e = new Error('Notification not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) { next(error); }
};

exports.deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (error) { next(error); }
};
