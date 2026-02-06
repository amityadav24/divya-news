// Breaking News Ticker System
(function () {
    'use strict';

    let currentLang = 'ne';
    let breakingNewsData = [];

    // Load breaking news from API
    async function loadBreakingNews() {
        try {
            const API_URL = window.API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/breaking-news`);

            if (!response.ok) {
                throw new Error('Failed to load breaking news');
            }

            const data = await response.json();
            breakingNewsData = data.breakingNews || [];
            updateTicker();
        } catch (error) {
            console.error('Error loading breaking news:', error);
            // Fallback to default message
            const ticker = document.getElementById('breakingNewsTicker');
            if (ticker) {
                ticker.textContent = currentLang === 'ne'
                    ? 'नेपालमा नयाँ सरकार गठन • अर्थतन्त्रमा सुधारका संकेत • खेलकुदमा नेपालको उपलब्धि'
                    : 'New government formed in Nepal • Signs of economic improvement • Nepal\'s achievement in sports';
            }
        }
    }

    // Update ticker with current language
    function updateTicker() {
        const ticker = document.getElementById('breakingNewsTicker');
        if (!ticker) return;

        if (breakingNewsData.length === 0) {
            ticker.textContent = currentLang === 'ne'
                ? 'कुनै ब्रेकिङ न्यूज छैन'
                : 'No breaking news';
            return;
        }

        // Combine all breaking news with bullet separator
        const newsText = breakingNewsData
            .map(news => news.text[currentLang])
            .join(' • ');

        ticker.textContent = newsText;
    }

    // Listen for language changes
    window.addEventListener('languageChanged', function (e) {
        currentLang = e.detail.language;
        updateTicker();
    });

    // Initialize
    function init() {
        currentLang = window.DivyaNewsLang ? window.DivyaNewsLang.getCurrentLanguage() : 'ne';
        loadBreakingNews();

        // Refresh breaking news every 5 minutes
        setInterval(loadBreakingNews, 5 * 60 * 1000);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.BreakingNewsTicker = {
        refresh: loadBreakingNews
    };

})();
