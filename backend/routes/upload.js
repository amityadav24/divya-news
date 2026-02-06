const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'), false);
        }
    }
});

/**
 * @route   POST /api/upload/image
 * @desc    Upload image to Cloudinary
 * @access  Private (Admin only)
 */
router.post('/image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'divya-news/images',
                    resource_type: 'image',
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(req.file.buffer);
        });

        res.json({
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            message: 'Failed to upload image',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   POST /api/upload/video
 * @desc    Upload video to Cloudinary
 * @access  Private (Admin only)
 */
router.post('/video', auth, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'divya-news/videos',
                    resource_type: 'video',
                    transformation: [
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(req.file.buffer);
        });

        res.json({
            message: 'Video uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({
            message: 'Failed to upload video',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   DELETE /api/upload/:publicId
 * @desc    Delete file from Cloudinary
 * @access  Private (Admin only)
 */
router.delete('/:publicId', auth, async (req, res) => {
    try {
        const publicId = req.params.publicId.replace(/-/g, '/');

        // Try deleting as image first, then video
        let result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'not found') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }

        if (result.result === 'ok') {
            res.json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ message: 'Failed to delete file' });
    }
});

module.exports = router;
