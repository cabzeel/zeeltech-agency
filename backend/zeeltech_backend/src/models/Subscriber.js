const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subscriberSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'unsubscribed'],
        default: 'active'
    }
}, { timestamps: true });

const Subscriber = model('Subscriber', subscriberSchema);
module.exports = Subscriber;