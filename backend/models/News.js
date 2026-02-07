const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        ne: {
            type: String,
            required: [true, 'Nepali title is required'],
            trim: true
        },
        en: {
            type: String,
            required: [true, 'English title is required'],
            trim: true
        }
    },
    description: {
        ne: {
            type: String,
            required: [true, 'Nepali description is required']
        },
        en: {
            type: String,
            required: [true, 'English description is required']
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['politics', 'society', 'business', 'sports', 'technology'],
            message: '{VALUE} is not a valid category'
        },
        lowercase: true
    },
    images: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        trim: true
    },
    video: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
newsSchema.index({ category: 1, createdAt: -1 });
newsSchema.index({ published: 1, createdAt: -1 });
newsSchema.index({ featured: 1 });

// Virtual for formatted date
newsSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

module.exports = mongoose.model('News', newsSchema);
