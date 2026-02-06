const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/news
 * @desc    Get all published news
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, limit = 50, page = 1 } = req.query;

        const query = { published: true };
        if (category && category !== 'all') {
            query.category = category.toLowerCase();
        }

        const skip = (page - 1) * limit;

        const news = await News.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await News.countDocuments(query);

        res.json({
            news,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get news error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/news/featured
 * @desc    Get featured news
 * @access  Public
 */
router.get('/featured', async (req, res) => {
    try {
        const news = await News.find({ published: true, featured: true })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/news/:id
 * @desc    Get single news by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('author', 'username email');

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Increment views
        news.views += 1;
        await news.save();

        res.json(news);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/news
 * @desc    Create new news
 * @access  Private (Admin only)
 */
router.post('/', [
    auth,
    body('title.ne').trim().notEmpty().withMessage('Nepali title is required'),
    body('title.en').trim().notEmpty().withMessage('English title is required'),
    body('description.ne').trim().notEmpty().withMessage('Nepali description is required'),
    body('description.en').trim().notEmpty().withMessage('English description is required'),
    body('category').isIn(['politics', 'society', 'business', 'sports', 'technology']).withMessage('Invalid category'),
    body('image').trim().notEmpty().withMessage('Image is required')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newsData = {
            ...req.body,
            author: req.admin._id
        };

        const news = new News(newsData);
        await news.save();

        // Populate author info
        await news.populate('author', 'username');

        res.status(201).json({
            message: 'News published successfully',
            news
        });

    } catch (error) {
        console.error('Create news error:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   PUT /api/news/:id
 * @desc    Update news
 * @access  Private (Admin only)
 */
router.put('/:id', [
    auth,
    body('title.ne').optional().trim().notEmpty(),
    body('title.en').optional().trim().notEmpty(),
    body('description.ne').optional().trim().notEmpty(),
    body('description.en').optional().trim().notEmpty(),
    body('category').optional().isIn(['politics', 'society', 'business', 'sports', 'technology'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                news[key] = req.body[key];
            }
        });

        await news.save();
        await news.populate('author', 'username');

        res.json({
            message: 'News updated successfully',
            news
        });

    } catch (error) {
        console.error('Update news error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/news/:id
 * @desc    Delete news
 * @access  Private (Admin only)
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        await news.deleteOne();

        res.json({ message: 'News deleted successfully' });

    } catch (error) {
        console.error('Delete news error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
