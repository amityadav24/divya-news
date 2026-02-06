const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const BreakingNews = require('../models/BreakingNews');

// @route   GET /api/breaking-news
// @desc    Get active breaking news
// @access  Public
router.get('/', async (req, res) => {
    try {
        const breakingNews = await BreakingNews.find({ active: true })
            .sort({ priority: -1, createdAt: -1 })
            .limit(5)
            .select('-__v');

        res.json({
            success: true,
            count: breakingNews.length,
            breakingNews
        });
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching breaking news'
        });
    }
});

// @route   POST /api/breaking-news
// @desc    Create breaking news
// @access  Private (Admin only)
router.post('/',
    auth,
    [
        body('text.ne').trim().notEmpty().withMessage('Nepali text is required')
            .isLength({ max: 200 }).withMessage('Nepali text cannot exceed 200 characters'),
        body('text.en').trim().notEmpty().withMessage('English text is required')
            .isLength({ max: 200 }).withMessage('English text cannot exceed 200 characters'),
        body('priority').optional().isInt({ min: 0, max: 10 }).withMessage('Priority must be between 0 and 10')
    ],
    async (req, res) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { text, priority, active } = req.body;

            const breakingNews = new BreakingNews({
                text,
                priority: priority || 0,
                active: active !== undefined ? active : true,
                createdBy: req.admin.id
            });

            await breakingNews.save();

            res.status(201).json({
                success: true,
                message: 'Breaking news created successfully',
                breakingNews
            });
        } catch (error) {
            console.error('Error creating breaking news:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while creating breaking news'
            });
        }
    }
);

// @route   PUT /api/breaking-news/:id
// @desc    Update breaking news
// @access  Private (Admin only)
router.put('/:id',
    auth,
    [
        body('text.ne').optional().trim().notEmpty()
            .isLength({ max: 200 }).withMessage('Nepali text cannot exceed 200 characters'),
        body('text.en').optional().trim().notEmpty()
            .isLength({ max: 200 }).withMessage('English text cannot exceed 200 characters'),
        body('priority').optional().isInt({ min: 0, max: 10 }).withMessage('Priority must be between 0 and 10')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const breakingNews = await BreakingNews.findById(req.params.id);

            if (!breakingNews) {
                return res.status(404).json({
                    success: false,
                    message: 'Breaking news not found'
                });
            }

            const { text, priority, active } = req.body;

            if (text) breakingNews.text = text;
            if (priority !== undefined) breakingNews.priority = priority;
            if (active !== undefined) breakingNews.active = active;

            await breakingNews.save();

            res.json({
                success: true,
                message: 'Breaking news updated successfully',
                breakingNews
            });
        } catch (error) {
            console.error('Error updating breaking news:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating breaking news'
            });
        }
    }
);

// @route   DELETE /api/breaking-news/:id
// @desc    Delete breaking news
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const breakingNews = await BreakingNews.findById(req.params.id);

        if (!breakingNews) {
            return res.status(404).json({
                success: false,
                message: 'Breaking news not found'
            });
        }

        await breakingNews.deleteOne();

        res.json({
            success: true,
            message: 'Breaking news deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting breaking news:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting breaking news'
        });
    }
});

module.exports = router;
