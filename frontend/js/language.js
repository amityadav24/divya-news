// Language Toggle System for Divya News
// Handles switching between Nepali and English without page reload

(function () {
    'use strict';

    // Language state
    let currentLanguage = 'ne';

    // Initialize language on page load
    function initLanguage() {
        const savedLang = localStorage.getItem('divyaNewsLang') || 'ne';
        setLanguage(savedLang);
    }

    // Set language for all elements with data attributes
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updateContent(lang);
    }

    // Update all translatable content
    function updateContent(lang) {
        currentLanguage = lang;
        const elements = document.querySelectorAll('[data-ne][data-en]');

        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'ne' ? 'ne' : 'en';

        // Update body class for font
        if (lang === 'ne') {
            document.body.classList.add('nepali');
            document.body.classList.remove('english'); // Ensure 'english' is removed
        } else {
            document.body.classList.add('english'); // Ensure 'english' is added
            document.body.classList.remove('nepali');
        }

        // Update language toggle button text
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const toggleText = langToggle.querySelector('span');
            if (toggleText) {
                // Show opposite language name
                toggleText.textContent = lang === 'ne' ? 'English' : 'नेपाली';
            }
        }

        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }



    // Toggle between languages
    function toggleLanguage() {
        const newLang = currentLanguage === 'ne' ? 'en' : 'ne';
        setLanguage(newLang);
    }

    // Get current language
    function getCurrentLanguage() {
        return currentLanguage;
    }

    // Setup event listeners
    function setupEventListeners() {
        const langToggleBtn = document.getElementById('langToggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', toggleLanguage);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLanguage();
            setupEventListeners();
        });
    } else {
        initLanguage();
        setupEventListeners();
    }

    // Export functions to window object for use in other scripts
    window.DivyaNewsLang = {
        setLanguage: setLanguage,
        toggleLanguage: toggleLanguage,
        getCurrentLanguage: getCurrentLanguage
    };

})();
