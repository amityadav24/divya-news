// News Rendering System for Divya News
// Handles loading and displaying news from MongoDB API

(function () {
    'use strict';

    let newsData = [];
    let currentLang = 'ne';

    // Category translations
    const categoryTranslations = {
        politics: { ne: 'राजनीति', en: 'Politics' },
        society: { ne: 'समाज', en: 'Society' },
        business: { ne: 'व्यापार', en: 'Business' },
        sports: { ne: 'खेलकुद', en: 'Sports' },
        technology: { ne: 'प्रविधि', en: 'Technology' }
    };

    // Load news data from MongoDB API
    async function loadNews() {
        try {
            // Fetch from backend API (uses config.js)
            const API_URL = window.API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/news`);

            if (!response.ok) {
                throw new Error('Failed to load news data');
            }

            const data = await response.json();
            newsData = data.news || data; // Handle both formats

            // Check if we're on news.html page (has newsContainer)
            const newsContainer = document.getElementById('newsContainer');
            if (newsContainer) {
                // Check URL parameters for category filter
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category');

                if (category) {
                    // Set active filter button
                    const filterBtn = document.querySelector(`[data-category="${category}"]`);
                    if (filterBtn) {
                        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                        filterBtn.classList.add('active');
                    }
                    // Render filtered news
                    renderNewsPage(category);
                } else {
                    // Render all news
                    renderNewsPage('all');
                }
            } else {
                // Render sections for homepage
                renderAllSections();
            }
        } catch (error) {
            console.error('Error loading news:', error);
            // Fallback to news.json if API fails
            try {
                const fallbackResponse = await fetch('js/news.json');
                if (fallbackResponse.ok) {
                    newsData = await fallbackResponse.json();
                    renderAllSections();
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    }

    // Get current language
    function updateCurrentLang() {
        currentLang = window.DivyaNewsLang ? window.DivyaNewsLang.getCurrentLanguage() : 'ne';
    }

    // Format date using B.S. calendar
    function formatDate(newsItem) {
        // Use createdAt from MongoDB timestamps
        const dateString = newsItem.createdAt || newsItem.date || new Date().toISOString();
        const date = new Date(dateString);

        // Use B.S. date converter if available
        if (window.NepaliDateConverter) {
            const bsDate = window.NepaliDateConverter.getShortBsDate(date);
            return currentLang === 'ne' ? bsDate.nepali : bsDate.english;
        }

        // Fallback to A.D. if converter not loaded
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (currentLang === 'ne') {
            const months = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन',
                'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }

    // Create news card HTML
    function createNewsCard(news, isSmall = false) {
        const title = news.title[currentLang];
        const description = news.description[currentLang];
        const category = categoryTranslations[news.category][currentLang];
        const date = formatDate(news); // Pass entire news object

        if (isSmall) {
            return `
                <div class="news-card-small">
                    <img src="${news.image}" alt="${title}" loading="lazy">
                    <div class="news-card-small-content">
                        <h4>${title}</h4>
                        <div class="news-meta">
                            <span><i class="fas fa-clock"></i> ${date}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <a href="article.html?id=${news._id}" class="news-card">
                <div class="news-image">
                    <img src="${news.image}" alt="${title}" loading="lazy">
                    <span class="category-badge">${category}</span>
                </div>
                <div class="news-content">
                    <h3>${title}</h3>
                    <p>${description.substring(0, 150)}...</p>
                    <div class="news-meta">
                        <span><i class="fas fa-clock"></i> ${date}</span>
                        <span><i class="fas fa-eye"></i> ${news.views || 0}</span>
                    </div>
                </div>
            </a>
        `;
    }

    // Create featured news HTML
    function createFeaturedNews(news) {
        const title = news.title[currentLang];
        const description = news.description[currentLang];
        const category = categoryTranslations[news.category][currentLang];
        const date = formatDate(news); // Pass entire news object

        return `
            <img src="${news.image}" alt="${title}">
            <div class="featured-overlay">
                <span class="category-badge">${category}</span>
                <h2>${title}</h2>
                <p>${description.substring(0, 200)}...</p>
                <div class="news-meta">
                    <span><i class="fas fa-clock"></i> ${date}</span>
                    <span><i class="fas fa-eye"></i> ${news.views || Math.floor(Math.random() * 5000) + 1000}</span>
                </div>
            </div>
        `;
    }

    // Render featured news section
    function renderFeaturedNews() {
        const featuredContainer = document.getElementById('featuredNews');
        if (!featuredContainer) return;

        const featured = newsData.find(news => news.featured) || newsData[0];
        if (featured) {
            featuredContainer.innerHTML = createFeaturedNews(featured);
        }
    }

    // Render trending news section
    function renderTrendingNews() {
        const trendingContainer = document.getElementById('trendingNews');
        if (!trendingContainer) return;

        const trending = newsData.slice(1, 4);
        trendingContainer.innerHTML = trending.map(news => createNewsCard(news, true)).join('');
    }

    // Render latest news section
    function renderLatestNews() {
        const latestContainer = document.getElementById('latestNews');
        if (!latestContainer) return;

        const latest = newsData.slice(0, 6);
        latestContainer.innerHTML = latest.map(news => createNewsCard(news)).join('');
    }

    // Render category news
    function renderCategoryNews(category, containerId, limit = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categoryNews = newsData.filter(news => news.category === category).slice(0, limit);
        container.innerHTML = categoryNews.map(news => createNewsCard(news)).join('');
    }

    // Render all news sections
    function renderAllSections() {
        updateCurrentLang();
        renderFeaturedNews();
        renderTrendingNews();
        renderLatestNews();
        renderCategoryNews('politics', 'politicsNews');
        renderCategoryNews('sports', 'sportsNews');
    }

    // Render news page with filters
    function renderNewsPage(filterCategory = null) {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        updateCurrentLang();

        let filteredNews = newsData;
        if (filterCategory && filterCategory !== 'all') {
            filteredNews = newsData.filter(news => news.category === filterCategory);
        }

        newsContainer.innerHTML = filteredNews.map(news => createNewsCard(news)).join('');
    }

    // Setup category filters
    function setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                // Get category and filter news
                const category = this.getAttribute('data-category');
                renderNewsPage(category);
            });
        });
    }

    // Listen for language changes
    window.addEventListener('languageChanged', function (e) {
        currentLang = e.detail.language;
        renderAllSections();

        // Re-render news page if on news.html
        const newsContainer = document.getElementById('newsContainer');
        if (newsContainer) {
            const activeFilter = document.querySelector('.filter-btn.active');
            const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
            renderNewsPage(category);
        }
    });

    // Initialize
    function init() {
        setupCategoryFilters();
        loadNews(); // Handles URL params after data loads
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for external use
    window.DivyaNewsRenderer = {
        renderNewsPage: renderNewsPage,
        renderAllSections: renderAllSections
    };

})();
