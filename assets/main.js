(function() {
    'use strict';

    // State management
    const $body = document.body;
    const $modal = document.getElementById('form-modal');
    const $modalTitle = document.getElementById('form-modal-title');
    const $modalMessage = document.getElementById('form-modal-message');
    const $modalClose = document.getElementById('form-modal-close');
    const $privacySection = document.getElementById('privacy');
    const $homeSection = document.getElementById('home');
    const sections = document.querySelectorAll('main > section');

    // Remove loading state
    window.addEventListener('load', () => {
        setTimeout(() => {
            $body.classList.remove('is-loading');
            $body.classList.add('is-ready');
        }, 100);
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Modal functions
    function showModal(title, message, isError) {
        $modalTitle.textContent = title;
        $modalMessage.textContent = message;
        $modalTitle.style.color = isError ? '#ff4b4b' : 'var(--color-accent)';
        $modal.style.display = 'flex';
    }

    $modalClose.onclick = () => $modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === $modal) $modal.style.display = 'none';
    };

    // Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Sending...';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                mode: 'no-cors'
            }).then(() => {
                showModal('Success!', 'Thank you for your message! We will get back to you soon.', false);
                form.reset();
                button.disabled = false;
                button.textContent = originalText;
            }).catch(() => {
                showModal('Error', 'Oops! There was an error sending your message. Please try again later.', true);
                button.disabled = false;
                button.textContent = originalText;
            });
        });
    }

    // Hash change handling (for Privacy section)
    function handleHashChange() {
        const hash = window.location.hash;
        if (hash === '#privacy') {
            sections.forEach(s => {
                if (s.id !== 'privacy') s.style.display = 'none';
            });
            $privacySection.classList.remove('hidden');
            $privacySection.style.display = 'block';
            $privacySection.classList.add('is-visible');
            window.scrollTo(0, 0);
        } else {
            sections.forEach(s => {
                if (s.id !== 'privacy') s.style.display = 'block';
            });
            $privacySection.classList.add('hidden');
            $privacySection.style.display = 'none';
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on load

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#privacy') return; // Handled by hashchange

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                history.pushState(null, null, href);
            }
        });
    });

    // Silktide banner landmark fix
    const silktideObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.id === 'stcm-wrapper') {
                    node.setAttribute('role', 'complementary');
                    node.setAttribute('aria-label', 'Cookie Consent');
                }
            });
        });
    });
    silktideObserver.observe(document.body, { childList: true });

})();
