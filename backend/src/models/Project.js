const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
    coverImage: {
        type: String,
        required: true
    },

    images: {
        type: [String],
        default: []
    },

    title: {
        type: String,
        required: [true, 'project must have a title'],
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    timeline: {
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date
        }
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }],

    clientName: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ['ongoing', 'completed', 'on-hold'],
        default: 'ongoing'
    },

    order: {
        type: Number,
        default: 0
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    problem: {
        type: String,
        required: true,
        trim: true
    },

    solution: {
        type: String,
        required: true,
        trim: true
    },

    results: [
        {
            metric: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ],

    cta: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });

const Project = model('Project', projectSchema);
module.exports = Project;