const mongoose = require('mongoose');

const breakingNewsSchema = new mongoose.Schema({
    text: {
        ne: {
            type: String,
            required: [true, 'Nepali text is required'],
            trim: true,
            maxlength: [200, 'Breaking news text cannot exceed 200 characters']
        },
        en: {
            type: String,
            required: [true, 'English text is required'],
            trim: true,
            maxlength: [200, 'Breaking news text cannot exceed 200 characters']
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
breakingNewsSchema.index({ active: 1, priority: -1, createdAt: -1 });

module.exports = mongoose.model('BreakingNews', breakingNewsSchema);
