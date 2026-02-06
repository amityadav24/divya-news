// Component Loader for Divya News
// Loads header and footer components dynamically

(function () {
    'use strict';

    // Load HTML component
    async function loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    // Load all components
    async function loadComponents() {
        // Load header
        await loadComponent('header-component', 'includes/header.html');

        // Load footer
        await loadComponent('footer-component', 'includes/footer.html');

        // Reinitialize scripts after components are loaded
        if (window.DivyaNewsLang) {
            window.DivyaNewsLang.setLanguage(window.DivyaNewsLang.getCurrentLanguage());
        }

        // Trigger custom event to notify that components are loaded
        window.dispatchEvent(new Event('componentsLoaded'));
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }

})();
