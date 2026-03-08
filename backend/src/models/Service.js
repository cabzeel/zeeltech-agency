const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const serviceSchema = new Schema({
    imgUrl: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: [true, 'service must have a title'],
        trim: true,
    },

    subDescription: {
        type: String,
        minlength: 30,
        maxlength: 150,
        required: true,
        trim: true
    },

    order: {
        type: Number,
        required: true,
    }, 

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },

    fullDescription: {
        type: String,
        minlength: 150,
        maxlength: 1000,
        trim: true,
        required: [true, 'full description required']
    },

    process: [
        {
            title: {
                type: String,
                required: true,
                trim: true
            },

            description: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],

    tools: {
        type: [String],
        default: []
    },

    relatedProjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    
    }],

    cta: {
        type: String,
        required: true,
        trim: true
    }

}, {timestamps: true});

const Service = model('Service', serviceSchema);
module.exports = Service