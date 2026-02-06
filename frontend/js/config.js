// API Configuration
// Update this file when deploying to production

const API_CONFIG = {
    // Development
    development: {
        baseURL: 'http://localhost:5000/api'
    },

    // Production (update after deploying backend to Vercel)
    // Replace 'YOUR-BACKEND-URL' with your actual Vercel backend URL
    // Example: 'https://divya-news-api.vercel.app/api'
    production: {
        baseURL: 'https://divyanews.vercel.app/api'
    }
};

// Auto-detect environment
const ENV = window.location.hostname === 'localhost' || window.location.hostname === '' ? 'development' : 'production';
const API_URL = API_CONFIG[ENV].baseURL;

// Export for use in other files
window.API_URL = API_URL;

// Log current environment (for debugging)
console.log(`🌐 Environment: ${ENV}`);
console.log(`🔗 API URL: ${API_URL}`);
