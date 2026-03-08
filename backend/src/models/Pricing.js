const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pricingSchema = new Schema({
    name: {
        type: String,
        enum: ['Basic', 'Pro', 'Advanced', 'Premium'],
        required: [true, 'pricing tier must have a name'],
        unique: true,
        trim: true
    },

    priceRange: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },

    features: {
        type: [String],
        required: true,
        default: []
    },

    cta: {
        type: String,
        required: true,
        trim: true
    },

    isPopular: {
        type: Boolean,
        default: false
    },

    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

    order: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Pricing = model('Pricing', pricingSchema);
module.exports = Pricing;