const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'blog must have a title'],
        trim: true,
        maxlength: 150
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    coverImage: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    content: {
        type: String,
        required: [true, 'blog content is required']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    readTime: {
        type: Number
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    publishedAt: {
        type: Date
    }
}, { timestamps: true });

const Blog = model('Blog', blogSchema);
module.exports = Blog;