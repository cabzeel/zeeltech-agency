const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'message is required'],
        trim: true,
        minlength: 20
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied', 'archived'],
        default: 'unread'
    },
    repliedAt: {
        type: Date
    }
}, { timestamps: true });

const Contact = model('Contact', contactSchema);
module.exports = Contact;