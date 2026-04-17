// ============================================
// PROJECT DETAIL PAGE — NOORA STYLE
// ============================================
(function () {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId || typeof projectsData === 'undefined') {
        window.location.href = 'projects.html';
        return;
    }

    const currentIndex = projectsData.findIndex(p => p.id === projectId);
    const project = projectsData[currentIndex];

    if (!project) {
        window.location.href = 'projects.html';
        return;
    }

    // Page title
    document.title = project.title + ' — Nguyễn Ngọc Quý Tiên Nguyễn';

    // Tags
    const tagsContainer = document.getElementById('projectTags');
    project.tag.split('/').forEach(t => {
        const span = document.createElement('span');
        span.className = 'case-tag';
        span.textContent = t.trim();
        tagsContainer.appendChild(span);
    });

    // Title, desc, meta
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectDesc').textContent = project.desc || '';
    document.getElementById('metaClient').textContent = project.brand;
    document.getElementById('metaType').textContent = project.tag.split('/')[0].trim();
    document.getElementById('metaDate').textContent = 'Q2 2025';

    // Hero image (always use first image as cover)
    const heroContainer = document.getElementById('projectHero');
    if (project.images.length > 0) {
        const heroImg = document.createElement('img');
        heroImg.src = project.images[0];
        heroImg.alt = project.title + ' — Cover';
        heroImg.loading = 'eager';
        heroContainer.appendChild(heroImg);
        heroContainer.style.cursor = 'pointer';
        heroContainer.dataset.index = 0;
    }

    // Hero caption
    const captions = project.captions || [];
    if (captions[0]) {
        const heroCaption = document.createElement('p');
        heroCaption.className = 'project-img-caption';
        heroCaption.textContent = captions[0];
        heroContainer.parentNode.appendChild(heroCaption);
    }

    // Gallery
    const imagesContainer = document.getElementById('projectImages');

    // Gallery images first (remaining images after hero)
    if (project.images.length > 1) {
        project.images.slice(1).forEach((src, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'project-img-wrap';
            wrapper.dataset.index = i + 1;

            const img = document.createElement('img');
            img.src = src;
            img.alt = project.title + ' - Image ' + (i + 2);
            img.loading = 'lazy';

            wrapper.appendChild(img);

            // Caption under each gallery image
            if (captions[i + 1]) {
                const caption = document.createElement('p');
                caption.className = 'project-img-caption';
                caption.textContent = captions[i + 1];
                wrapper.appendChild(caption);
            }

            imagesContainer.appendChild(wrapper);
        });
    }

    // Gallery videos (after all images)
    const allVideos = [];
    if (project.heroVideo) allVideos.push(project.heroVideo);
    if (project.videos) allVideos.push(...project.videos);
    if (allVideos.length > 0) {
        allVideos.forEach((src, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'project-video-wrap';

            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.preload = 'metadata';

            wrapper.appendChild(video);
            imagesContainer.appendChild(wrapper);
        });
    }

    // Prev / Next navigation
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : projectsData.length - 1;
    const nextIndex = currentIndex < projectsData.length - 1 ? currentIndex + 1 : 0;
    const prevProject = projectsData[prevIndex];
    const nextProject = projectsData[nextIndex];

    document.getElementById('prevProject').href = 'project.html?id=' + prevProject.id;
    document.getElementById('prevTitle').textContent = prevProject.title;
    document.getElementById('nextProject').href = 'project.html?id=' + nextProject.id;
    document.getElementById('nextTitle').textContent = nextProject.title;

    // More projects (3 random, not current)
    const moreContainer = document.getElementById('moreProjects');
    const others = projectsData.filter((_, i) => i !== currentIndex);
    const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 3);

    shuffled.forEach(p => {
        const card = document.createElement('a');
        card.href = 'project.html?id=' + p.id;
        card.className = 'case-card';

        const tags = p.tag.split('/').map(t =>
            '<span class="case-tag">' + t.trim() + '</span>'
        ).join('');

        card.innerHTML = `
            <div class="case-image"><img src="${p.images[0]}" alt="${p.title}" loading="lazy"></div>
            <div class="case-info">
                <div class="case-tags">${tags}</div>
                <h3>${p.title}</h3>
            </div>
        `;
        moreContainer.appendChild(card);
    });

    // ============================================
    // LIGHTBOX
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    let currentLightboxIndex = 0;

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = project.images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) currentLightboxIndex = project.images.length - 1;
        if (currentLightboxIndex >= project.images.length) currentLightboxIndex = 0;
        lightboxImg.src = project.images[currentLightboxIndex];
    }

    // Hero image click for lightbox
    heroContainer.addEventListener('click', () => {
        openLightbox(0);
    });

    // Gallery image clicks for lightbox
    imagesContainer.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.project-img-wrap');
        if (wrapper) {
            openLightbox(parseInt(wrapper.dataset.index));
        }
    });

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
    document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Reveal animation for images
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                imgObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    // Reveal animation for hero image
    if (heroContainer) {
        heroContainer.style.opacity = '0';
        heroContainer.style.transform = 'translateY(24px)';
        heroContainer.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        imgObserver.observe(heroContainer);
    }

    // Reveal animation for gallery images
    document.querySelectorAll('.project-img-wrap').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
        imgObserver.observe(el);
    });
})();
