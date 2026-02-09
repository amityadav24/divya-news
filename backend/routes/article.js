const express = require('express');
const router = express.Router();
const News = require('../models/News');
const fs = require('fs');
const path = require('path');

// Serve article page with dynamic Open Graph meta tags
router.get(['/:id', '/.html'], async (req, res) => { // Modified route path to handle both /article/:id and /article.html
    try {
        // Get article ID from params or query
        let articleId = req.params.id;
        if (articleId && articleId.endsWith('.html')) {
            // If the route is /article.html, then the ID should come from query
            articleId = req.query.id;
        } else if (!articleId) {
            // If no ID in params (e.g., /article.html without :id), check query
            articleId = req.query.id;
        }

        if (!articleId) {
            return res.status(400).send('Article ID is required');
        }

        const article = await News.findById(articleId);

        if (!article) {
            return res.status(404).send('Article not found');
        }

        // Read the article.html template
        const htmlPath = path.join(__dirname, '../../frontend/article.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Get the article data
        const title = article.title.ne || article.title.en;
        const description = (article.description.ne || article.description.en).substring(0, 200);
        const image = article.images && article.images.length > 0 ? article.images[0] : article.image;

        // Determine the base URL
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const url = `${protocol}://${host}/article/${articleId}`;

        // Convert relative image URL to absolute
        const imageUrl = image.startsWith('http')
            ? image
            : `${protocol}://${host}${image.startsWith('/') ? '' : '/'}${image}`;

        // Add cache-busting parameter to force Facebook to refresh the image
        const cacheBustingImageUrl = imageUrl.includes('?')
            ? `${imageUrl}&v=${Date.now()}`
            : `${imageUrl}?v=${Date.now()}`;

        // Replace meta tags with article-specific data
        html = html.replace(
            /<meta property="og:title" content="[^"]*">/,
            `<meta property="og:title" content="${title.replace(/"/g, '&quot;') || ''}">`
        );
        html = html.replace(
            /<meta property="og:description" content="[^"]*">/,
            `<meta property="og:description" content="${description.replace(/"/g, '&quot;') || ''}">`
        );
        html = html.replace(
            /<meta property="og:image" content="[^"]*">/,
            `<meta property="og:image" content="${cacheBustingImageUrl || ''}">`
        );
        html = html.replace(
            /<meta property="og:url" content="[^"]*">/,
            `<meta property="og:url" content="${url || ''}">`
        );
        html = html.replace(
            /<meta name="twitter:title" content="[^"]*">/,
            `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;') || ''}">`
        );
        html = html.replace(
            /<meta name="twitter:description" content="[^"]*">/,
            `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;') || ''}">`
        );
        html = html.replace(
            /<meta name="twitter:image" content="[^"]*">/,
            `<meta name="twitter:image" content="${cacheBustingImageUrl || ''}">`
        );
        html = html.replace(
            /<meta name="description" content="[^"]*">/,
            `<meta name="description" content="${description.replace(/"/g, '&quot;') || ''}">`
        );
        html = html.replace(
            /<title>[^<]*<\/title>/,
            `<title>${title.replace(/</g, '&lt;').replace(/>/g, '&gt;') || ''} - Divya News</title>`
        );

        res.send(html);
    } catch (error) {
        console.error('Error serving article:', error);
        res.status(500).send('Error loading article');
    }
});

module.exports = router;
