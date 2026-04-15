const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        unique: true,
        trim: true,
        
    },

    description: {
        type: String,
        minlength: 20
    },

    type: {
        type: String,
        required: true,
        enum: ['blog', 'project', 'both'],
        default: 'both'
    }
}, {timestamps: true});

const Category = model('Category', categorySchema);
module.exports = Category;