/* ============================================
   صفحة المركز الإعلامي - Media Center JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 600);
    });
    if (document.readyState === 'complete') {
        setTimeout(() => preloader.classList.add('hidden'), 600);
    }

    // ---- AOS ----
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });

    // ---- SCROLL PROGRESS BAR ----
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }

    // ---- NAVBAR ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('visible', scrollY > 500);
        updateScrollProgress();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ---- MOBILE NAV ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    navToggle.addEventListener('click', toggleNav);
    overlay.addEventListener('click', toggleNav);

    // Mobile dropdowns
    document.querySelectorAll('.navbar__menu .has-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { e.preventDefault(); link.parentElement.classList.toggle('open'); }
        });
    });
    document.querySelectorAll('.navbar__menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => { if (navMenu.classList.contains('active')) toggleNav(); });
    });

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // ---- MEDIA TABS ----
    const tabBtns = document.querySelectorAll('.media-tabs__btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.tab;

            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active panel
            tabPanels.forEach(panel => panel.classList.remove('active'));
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');

                // Re-init AOS for newly visible elements
                setTimeout(() => AOS.refresh(), 100);
            }
        });
    });

    // ---- LIGHTBOX ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
    const lightboxOverlay = lightbox ? lightbox.querySelector('.lightbox__overlay') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox__prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox__next') : null;

    let galleryItems = [];
    let currentIndex = 0;

    function initGallery() {
        galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        });
    }

    function openLightbox() {
        if (!lightbox || galleryItems.length === 0) return;

        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        if (!galleryItems[currentIndex]) return;

        const item = galleryItems[currentIndex];
        const caption = item.querySelector('.gallery-item__overlay span');
        const placeholder = item.querySelector('.gallery-item__placeholder');

        // Copy the gradient background from the gallery item
        if (placeholder && lightboxImage) {
            const bgStyle = placeholder.getAttribute('style') || '';
            lightboxImage.setAttribute('style', bgStyle);
        }

        if (lightboxCaption && caption) {
            lightboxCaption.textContent = caption.textContent;
        }

        if (lightboxCounter) {
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }

    // Lightbox event listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') nextImage();   // RTL: left arrow = next
        if (e.key === 'ArrowRight') prevImage();  // RTL: right arrow = prev
    });

    // Initialize gallery
    initGallery();

    // ---- VIDEO CARD CLICK ----
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.video-card__info h3');
            if (title) {
                showModal('قريبًا!', 'سيتم تشغيل الفيديو: ' + title.textContent);
            }
        });
    });

    // ---- PRESS DOWNLOAD CLICK ----
    document.querySelectorAll('.press-card__btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('قريبًا!', 'سيتم تحميل الملف قريبًا إن شاء الله.');
        });
    });

    // ---- NEWSLETTER FORM ----
    const newsletter = document.querySelector('.footer__newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            showModal('تم الاشتراك!', 'شكراً لاشتراكك في نشرتنا البريدية.');
            newsletter.reset();
        });
    }

    // ---- MODAL HELPER ----
    function showModal(title, message) {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();
        const el = document.createElement('div');
        el.className = 'modal-overlay';
        el.innerHTML = `
            <div class="modal">
                <div class="modal__icon"><i class="fas fa-check"></i></div>
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="btn btn--primary" onclick="this.closest('.modal-overlay').remove()">حسناً</button>
            </div>`;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('active'));
        el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
    }
});
