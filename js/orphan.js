/* ============================================
   صفحة كفالة الأيتام - Orphan Page JavaScript
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

    // ---- ORPHAN STATS COUNTER ----
    const orphanStatsSection = document.getElementById('orphanStats');
    if (orphanStatsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.orphan-stats__number').forEach(counter => {
                        const target = +counter.dataset.target;
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;
                        const update = () => {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.floor(current).toLocaleString('ar-EG');
                                requestAnimationFrame(update);
                            } else {
                                counter.textContent = target.toLocaleString('ar-EG') + '+';
                            }
                        };
                        update();
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(orphanStatsSection);
    }

    // ---- ORPHAN FILTER ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const orphanCards = document.querySelectorAll('.orphan-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            orphanCards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.country === filter;
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

    // ---- SPONSORSHIP CALCULATOR ----
    let orphanQty = 1;
    let planPrice = 50;
    let durationMonths = 1;

    const qtyEl = document.getElementById('orphanQty');
    const calcMonthly = document.getElementById('calcMonthly');
    const calcTotal = document.getElementById('calcTotal');
    const calcDonateBtn = document.getElementById('calcDonateBtn');

    function updateCalc() {
        const monthly = orphanQty * planPrice;
        const total = monthly * durationMonths;
        if (calcMonthly) calcMonthly.textContent = '$' + monthly.toLocaleString();
        if (calcTotal) calcTotal.textContent = '$' + total.toLocaleString();
        if (calcDonateBtn) calcDonateBtn.href = `donate.html?amount=${total}&monthly=${monthly}`;
    }

    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'increase') {
                orphanQty = Math.min(orphanQty + 1, 20);
            } else {
                orphanQty = Math.max(orphanQty - 1, 1);
            }
            if (qtyEl) qtyEl.textContent = orphanQty;
            updateCalc();
        });
    });

    // Plan buttons
    document.querySelectorAll('.calc-plan-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.calc-plan-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            planPrice = +btn.dataset.price;
            updateCalc();
        });
    });

    // Duration buttons
    document.querySelectorAll('.calc-dur-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.calc-dur-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            durationMonths = +btn.dataset.months;
            updateCalc();
        });
    });

    // ---- FAQ ACCORDION ----
    document.querySelectorAll('.faq-item__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) item.classList.add('active');
        });
    });

    // ---- LOAD MORE ORPHANS ----
    const loadMoreBtn = document.getElementById('loadMoreOrphans');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showModal('قريبًا!', 'يتم تحميل المزيد من بيانات الأيتام من قاعدة البيانات...');
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
