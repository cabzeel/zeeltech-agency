const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    guestName: {
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    guestEmail: {
        type: String,
        required: [true, 'email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    content: {
        type: String,
        required: [true, 'comment cannot be empty'],
        trim: true,
        minlength: 2,
        maxlength: 500
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Comment = model('Comment', commentSchema);
module.exports = Comment;