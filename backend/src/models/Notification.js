const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['comment', 'contact', 'subscriber', 'system'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    link: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Notification = model('Notification', notificationSchema);
module.exports = Notification;