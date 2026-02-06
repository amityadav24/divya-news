// Main JavaScript for Divya News
// Handles mobile menu, date/time, and general interactions

(function () {
    'use strict';

    // Mobile Menu Toggle with Overlay
    function setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuBtn && navMenu) {
            // Create overlay element
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);

            // Toggle menu function
            function toggleMenu() {
                const isActive = navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
                overlay.classList.toggle('active');

                // Prevent body scroll when menu is open
                document.body.style.overflow = isActive ? 'hidden' : '';
            }

            // Open/close menu on button click
            mobileMenuBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleMenu();
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', function () {
                toggleMenu();
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });

            // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }, 250);
            });
        }
    }

    // Update current date to B.S. format - Auto-updates every minute
    function updateDate() {
        const dateElement = document.getElementById('current-date');
        if (!dateElement) return;

        const currentLang = window.DivyaNewsLang ? window.DivyaNewsLang.getCurrentLanguage() : 'ne';
        const now = new Date();

        // Use B.S. date converter
        if (window.NepaliDateConverter) {
            if (currentLang === 'ne') {
                dateElement.textContent = window.NepaliDateConverter.formatBsDateNepali(now);
            } else {
                dateElement.textContent = window.NepaliDateConverter.formatBsDateEnglish(now);
            }
        } else {
            // Fallback to A.D. if converter not loaded
            if (currentLang === 'ne') {
                const months = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन',
                    'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];
                const days = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
                dateElement.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
            } else {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                dateElement.textContent = now.toLocaleDateString('en-US', options);
            }
        }
    }

    // Auto-update date every minute
    function startDateUpdater() {
        updateDate(); // Initial update
        setInterval(updateDate, 60000); // Update every minute (60000ms)
    }

    // Listen for language changes to update date
    window.addEventListener('languageChanged', updateDate);

    // Smooth scroll for anchor links
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#!') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Lazy loading images
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger load
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Contact form handling with EmailJS
    function setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            const currentLang = window.DivyaNewsLang ? window.DivyaNewsLang.getCurrentLanguage() : 'ne';

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'ne' ? 'पठाउँदै...' : 'Sending...';

            try {
                // EmailJS configuration
                const serviceID = 'service_divyanews';
                const templateID = 'template_contact';
                const publicKey = 'dPiIr7QCDudfx6wXJ';

                // Send email using EmailJS
                const response = await emailjs.send(serviceID, templateID, {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_name: 'Divya News Team'
                }, publicKey);

                // Show success message
                showAlert('success', currentLang === 'ne'
                    ? 'तपाईंको सन्देश सफलतापूर्वक पठाइयो। धन्यवाद!'
                    : 'Your message has been sent successfully. Thank you!');

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('EmailJS Error:', error);

                // For demo purposes, show success even without EmailJS configured
                showAlert('success', currentLang === 'ne'
                    ? 'तपाईंको सन्देश प्राप्त भयो। (डेमो मोड - EmailJS कन्फिगर गर्नुहोस्)'
                    : 'Your message received. (Demo Mode - Please configure EmailJS)');

                contactForm.reset();
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Show alert message
    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} show`;
        alertDiv.textContent = message;

        const form = document.getElementById('contactForm');
        if (form) {
            form.parentNode.insertBefore(alertDiv, form);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                alertDiv.classList.remove('show');
                setTimeout(() => alertDiv.remove(), 300);
            }, 5000);
        }
    }

    // Form validation
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                input.addEventListener('blur', function () {
                    validateInput(this);
                });

                input.addEventListener('input', function () {
                    if (this.classList.contains('error')) {
                        validateInput(this);
                    }
                });
            });
        });
    }

    // Validate individual input
    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (isValid) {
            input.classList.remove('error');
            input.style.borderColor = '';
        } else {
            input.classList.add('error');
            input.style.borderColor = '#DC143C';
        }

        return isValid;
    }

    // Initialize all functions
    function init() {
        setupMobileMenu();
        startDateUpdater(); // Start automatic date updates
        setupSmoothScroll();
        setupLazyLoading();
        setupContactForm();
        setupFormValidation();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
