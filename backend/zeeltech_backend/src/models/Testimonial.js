const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name must be provided'],
        trim: true,
        minlength: 3,
        maxlength: 30
    },

    position : {
        type: String,
        required: true,
        trim: true
    },

    company: {
        type: String,
        required: true,
        trim: true
    },

    testimonialText: {
        type: String,
        trim: true,
        required: true
    },

    imgUrl : {
        type: String,
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    rating : {
        type: Number,
        min: 1,
        max: 5
    },

    isFeatured: {
        type: Boolean,
        default: false 
    },

    websiteUrl: {
        type: String,
        
    }
}, {timestamps: true});

const Testimonial = model('Testimonial', testimonialSchema);
module.exports = Testimonial;