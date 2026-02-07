// Article Page Script for Divya News
// Handles loading and displaying full article with image gallery

(function () {
    'use strict';

    let articleData = null;
    let currentLang = localStorage.getItem('language') || 'ne';
    let currentImageIndex = 0;
    let images = [];

    // Category translations
    const categoryTranslations = {
        politics: { ne: 'राजनीति', en: 'Politics' },
        society: { ne: 'समाज', en: 'Society' },
        business: { ne: 'व्यापार', en: 'Business' },
        sports: { ne: 'खेलकुद', en: 'Sports' },
        technology: { ne: 'प्रविधि', en: 'Technology' }
    };

    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        window.location.href = 'news.html';
        return;
    }

    // Load article data
    async function loadArticle() {
        try {
            const API_URL = window.API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/news/${articleId}`);

            if (!response.ok) {
                throw new Error('Article not found');
            }

            articleData = await response.json();
            renderArticle();
            loadRelatedNews();
            updateMetaTags();
        } catch (error) {
            console.error('Error loading article:', error);
            document.getElementById('articleTitle').textContent = 'Article not found';
            document.getElementById('articleContent').innerHTML = '<p>Sorry, this article could not be loaded.</p>';
        }
    }

    // Render article
    function renderArticle() {
        if (!articleData) return;

        // Set title
        document.getElementById('articleTitle').textContent = articleData.title[currentLang];
        document.title = `${articleData.title[currentLang]} - Divya News`;

        // Set category
        const categoryName = categoryTranslations[articleData.category][currentLang];
        document.getElementById('articleCategory').textContent = categoryName;
        document.getElementById('breadcrumbCategory').textContent = categoryName;

        // Set date
        const date = new Date(articleData.createdAt);
        document.getElementById('articleDate').textContent = date.toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Set views
        document.getElementById('articleViews').textContent = articleData.views || 0;

        // Set content
        const content = articleData.description[currentLang];
        document.getElementById('articleContent').innerHTML = content.split('\n').map(p => `<p>${p}</p>`).join('');

        // Setup image gallery
        setupImageGallery();
    }

    // Setup image gallery
    function setupImageGallery() {
        images = articleData.images && articleData.images.length > 0 ? articleData.images : [articleData.image];

        if (!images || images.length === 0) {
            document.getElementById('imageGallery').style.display = 'none';
            return;
        }

        // Set main image
        document.getElementById('mainImage').src = images[0];
        document.getElementById('mainImage').alt = articleData.title[currentLang];

        // Show/hide image counter
        if (images.length > 1) {
            document.getElementById('imageCounter').style.display = 'block';
            document.getElementById('totalImages').textContent = images.length;
            createThumbnails();
        } else {
            document.getElementById('imageCounter').style.display = 'none';
            document.getElementById('thumbnailStrip').style.display = 'none';
        }
    }

    // Create thumbnails
    function createThumbnails() {
        const thumbnailStrip = document.getElementById('thumbnailStrip');
        thumbnailStrip.innerHTML = '';

        images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="Image ${index + 1}">`;
            thumbnail.onclick = () => changeMainImage(index);
            thumbnailStrip.appendChild(thumbnail);
        });
    }

    // Change main image
    window.changeMainImage = function (index) {
        currentImageIndex = index;
        document.getElementById('mainImage').src = images[index];
        document.getElementById('currentImageNum').textContent = index + 1;

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    };

    // Lightbox functions
    window.openLightbox = function (index) {
        currentImageIndex = index;
        document.getElementById('lightboxImage').src = images[index];
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.changeImage = function (direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = images.length - 1;
        if (currentImageIndex >= images.length) currentImageIndex = 0;

        document.getElementById('lightboxImage').src = images[currentImageIndex];
        changeMainImage(currentImageIndex);
    };

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });

    // Close lightbox on background click
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    // Social sharing functions
    window.shareOnFacebook = function () {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    window.shareOnTwitter = function () {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(articleData.title[currentLang]);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    };

    window.shareOnWhatsApp = function () {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(articleData.title[currentLang]);
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
    };

    window.copyLink = function () {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert(currentLang === 'ne' ? 'लिंक प्रतिलिपि गरियो!' : 'Link copied!');
        });
    };

    // Load related news
    async function loadRelatedNews() {
        try {
            const API_URL = window.API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/news?category=${articleData.category}&limit=4`);

            if (!response.ok) return;

            const data = await response.json();
            const relatedNews = data.news.filter(news => news._id !== articleId).slice(0, 3);

            renderRelatedNews(relatedNews);
        } catch (error) {
            console.error('Error loading related news:', error);
        }
    }

    // Render related news
    function renderRelatedNews(news) {
        const relatedGrid = document.getElementById('relatedNews');

        if (!news || news.length === 0) {
            relatedGrid.innerHTML = '<p>No related news found.</p>';
            return;
        }

        relatedGrid.innerHTML = news.map(item => {
            const image = item.images && item.images.length > 0 ? item.images[0] : item.image;
            const title = item.title[currentLang];
            const category = categoryTranslations[item.category][currentLang];

            return `
                <a href="article.html?id=${item._id}" class="news-card">
                    <div class="news-image">
                        <img src="${image}" alt="${title}">
                        <span class="category-badge">${category}</span>
                    </div>
                    <div class="news-content">
                        <h3>${title}</h3>
                    </div>
                </a>
            `;
        }).join('');
    }

    // Update meta tags for SEO
    function updateMetaTags() {
        if (!articleData) return;

        const title = articleData.title[currentLang];
        const description = articleData.description[currentLang].substring(0, 160);
        const image = images[0];
        const url = window.location.href;

        // Update Open Graph tags
        document.querySelector('meta[property="og:title"]').content = title;
        document.querySelector('meta[property="og:description"]').content = description;
        document.querySelector('meta[property="og:image"]').content = image;
        document.querySelector('meta[property="og:url"]').content = url;
        document.querySelector('meta[name="description"]').content = description;
    }

    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
        currentLang = e.detail.language;
        if (articleData) {
            renderArticle();
        }
    });

    // Initialize
    loadArticle();

})();
