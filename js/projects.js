/* ============================================
   صفحة المشاريع - Projects Page JavaScript
   Handles both projects.html and project-single.html
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

    // ---- PROJECTS FILTER (projects.html) ----
    const filterBtns = document.querySelectorAll('.proj-filter-btn');
    const campaignCards = document.querySelectorAll('.campaign-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                campaignCards.forEach((card, i) => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.classList.toggle('hide', !show);
                    if (show) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 60);
                    }
                });
            });
        });
    }

    // ---- ANIMATE PROGRESS BARS ON SCROLL ----
    const progressBars = document.querySelectorAll('.progress-bar__fill');
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const target = fill.dataset.width;
                    if (target) {
                        fill.style.width = target + '%';
                    }
                    progressObserver.unobserve(fill);
                }
            });
        }, { threshold: 0.3 });

        progressBars.forEach(bar => {
            bar.style.width = '0%';
            progressObserver.observe(bar);
        });
    }

    // ---- DONATION WIDGET (project-single.html) ----
    const amountBtns = document.querySelectorAll('.donation-amount-btn');
    const customInput = document.querySelector('.donation-custom input');
    const donationForm = document.querySelector('.donation-widget');

    if (amountBtns.length > 0) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (customInput) {
                    customInput.value = '';
                }
            });
        });

        if (customInput) {
            customInput.addEventListener('focus', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
            });
        }
    }

    const donateSubmit = document.querySelector('.donation-submit');
    if (donateSubmit) {
        donateSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            let amount = '';
            const activeBtn = document.querySelector('.donation-amount-btn.active');
            if (activeBtn) {
                amount = activeBtn.dataset.amount;
            } else if (customInput && customInput.value) {
                amount = customInput.value;
            }

            if (amount) {
                showModal('شكراً لتبرعك!', 'سيتم توجيهك لإتمام التبرع بمبلغ $' + amount);
            } else {
                showModal('اختر مبلغاً', 'الرجاء اختيار مبلغ التبرع أو إدخال مبلغ مخصص.');
            }
        });
    }

    // ---- SHARE BUTTONS (project-single.html) ----
    const copyBtn = document.querySelector('.share-btn--copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showModal('تم النسخ!', 'تم نسخ رابط المشروع بنجاح.');
            }).catch(() => {
                showModal('نسخ الرابط', window.location.href);
            });
        });
    }

    const shareFacebook = document.querySelector('.share-btn--facebook');
    if (shareFacebook) {
        shareFacebook.addEventListener('click', () => {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
        });
    }

    const shareTwitter = document.querySelector('.share-btn--twitter');
    if (shareTwitter) {
        shareTwitter.addEventListener('click', () => {
            window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(document.title), '_blank');
        });
    }

    const shareWhatsapp = document.querySelector('.share-btn--whatsapp');
    if (shareWhatsapp) {
        shareWhatsapp.addEventListener('click', () => {
            window.open('https://wa.me/?text=' + encodeURIComponent(document.title + ' ' + window.location.href), '_blank');
        });
    }

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
