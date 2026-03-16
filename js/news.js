/* ============================================
   صفحة الأخبار - News Pages JavaScript
   Works for both news.html and news-single.html
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

    // ---- SHARE BUTTONS (Single Article Page) ----
    const copyBtn = document.querySelector('.share-btn--copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                copyBtn.classList.add('copied');
                const icon = copyBtn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fas fa-check';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    icon.className = originalClass;
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = window.location.href;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                copyBtn.classList.add('copied');
                const icon = copyBtn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fas fa-check';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    icon.className = originalClass;
                }, 2000);
            });
        });
    }

    // Share button links (open in new window)
    document.querySelectorAll('.share-btn--facebook').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        });
    });

    document.querySelectorAll('.share-btn--twitter').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
        });
    });

    document.querySelectorAll('.share-btn--whatsapp').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
        });
    });

    // ---- NEWSLETTER FORMS ----
    const footerNewsletter = document.querySelector('.footer__newsletter');
    if (footerNewsletter) {
        footerNewsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            showModal('تم الاشتراك!', 'شكراً لاشتراكك في نشرتنا البريدية.');
            footerNewsletter.reset();
        });
    }

    const ctaNewsletter = document.querySelector('.news-cta__form');
    if (ctaNewsletter) {
        ctaNewsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            showModal('تم الاشتراك!', 'شكراً لاشتراكك في نشرتنا البريدية. ستصلك آخر الأخبار والتحديثات.');
            ctaNewsletter.reset();
        });
    }

    // ---- SIDEBAR SEARCH ----
    const searchWidget = document.querySelector('.search-widget');
    if (searchWidget) {
        searchWidget.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = searchWidget.querySelector('input');
            if (input.value.trim()) {
                showModal('بحث', `نتائج البحث عن: "${input.value.trim()}" — هذه الميزة قيد التطوير.`);
            }
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
