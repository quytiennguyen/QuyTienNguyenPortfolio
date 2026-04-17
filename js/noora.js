// ============================================
// NOORA — MAIN JS
// ============================================

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal, .about-section, .benefits-section, .case-studies, .methodology-section, .services-section');

function addRevealClass(el) {
    el.querySelectorAll('.section-label, .section-heading, .section-subtext, .about-grid, .about-text-large, .about-detail, .benefits-grid, .cs-subtext-row, .method-steps, .method-actions, .services-content, .stats-row, .benefit-card, .case-card, .method-step, .stat-item').forEach(child => {
        if (!child.classList.contains('reveal')) {
            child.classList.add('reveal');
        }
    });
}

revealElements.forEach(el => addRevealClass(el));

const allReveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Stagger children
            const parent = entry.target.closest('.benefits-grid, .cases-grid, .method-steps, .stats-row');
            if (parent) {
                const siblings = Array.from(parent.querySelectorAll('.reveal'));
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = (idx * 0.06) + 's';
            }
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

allReveals.forEach(el => revealObserver.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            // Close mobile menu if open
            const overlay = document.getElementById('mobileOverlay');
            const toggle = document.getElementById('navToggle');
            if (overlay && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile menu toggle
(function() {
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('mobileOverlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close on clicking a link inside overlay
    overlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();

// Card hover tilt
document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
        card.style.transform = `translateY(-5px) perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
    });
});

// Auto-play/pause videos on scroll
(function() {
    const videos = document.querySelectorAll('.case-card video, .project-img-wrap video');
    if (!videos.length) return;

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });

    videos.forEach(v => videoObserver.observe(v));
})();
