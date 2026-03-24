/* ============================================
   نساء الأقصى الدولية - Enhanced JavaScript v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }
    // Hide on page load (with small delay for smoothness)
    window.addEventListener('load', () => setTimeout(hidePreloader, 400));
    // Fallback if load already fired
    if (document.readyState === 'complete') setTimeout(hidePreloader, 400);
    // Force hide after 2 seconds max regardless of load state
    setTimeout(hidePreloader, 2000);

    // ---- AOS ----
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });

    // ---- SCROLL PROGRESS BAR ----
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = percent + '%';
    }

    // ---- HERO SWIPER ----
    new Swiper('.hero-swiper', {
        loop: true, speed: 1200,
        autoplay: { delay: 5000, disableOnInteraction: false },
        effect: 'fade', fadeEffect: { crossFade: true },
        pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
    });

    // ---- CONFERENCES SWIPER ----
    new Swiper('.conferences-swiper', {
        slidesPerView: 1, spaceBetween: 25, loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: '.conferences-swiper .swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 } },
    });

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

    // Mobile mega menu toggle
    document.querySelectorAll('.navbar__menu .has-mega > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = link.parentElement;
                // Close other open megas
                document.querySelectorAll('.has-mega.open').forEach(el => {
                    if (el !== parent) el.classList.remove('open');
                });
                parent.classList.toggle('open');
            }
        });
    });
    // Close mobile nav on link click
    document.querySelectorAll('.navbar__menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active') && !link.parentElement.classList.contains('has-mega')) toggleNav();
        });
    });
    // Close mega menus on link click inside mega
    document.querySelectorAll('.mega-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleNav();
        });
    });

    // ---- ACTIVE NAV ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.navbar__menu a').forEach(a => a.classList.remove('active'));
                const navLink = document.querySelector(`.navbar__menu a[href="#${id}"]`);
                if (navLink) navLink.classList.add('active');
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => navObserver.observe(s));

    // ---- DONATION STRIP AMOUNTS ----
    const amountPills = document.querySelectorAll('.strip-pill');
    const customAmount = document.getElementById('customAmount');
    const donateImpact = document.getElementById('donateImpact');

    function updateImpact(amount, impact) {
        if (donateImpact && impact) {
            donateImpact.innerHTML = `<i class="fas fa-lightbulb"></i><span>تبرعك بـ $${amount} يكفي لـ <strong>${impact}</strong></span>`;
        }
    }

    amountPills.forEach(btn => {
        btn.addEventListener('click', () => {
            amountPills.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (customAmount) customAmount.value = btn.dataset.amount;
            updateImpact(btn.dataset.amount, btn.dataset.impact);
        });
    });

    if (customAmount) {
        customAmount.addEventListener('input', () => {
            amountPills.forEach(b => b.classList.remove('active'));
            if (donateImpact && customAmount.value) {
                donateImpact.innerHTML = `<i class="fas fa-lightbulb"></i><span>تبرعك بـ $${customAmount.value} سيصنع فرقاً حقيقياً</span>`;
            }
        });
    }

    // Donate button
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
        donateBtn.addEventListener('click', () => {
            const amount = (customAmount && customAmount.value) || document.querySelector('.strip-pill.active')?.dataset.amount || '50';
            showModal('شكراً لتبرعك!', `سيتم تحويلك لصفحة الدفع بمبلغ $${amount}`);
        });
    }

    // ---- STATS COUNTER + RINGS ----
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate numbers
                entry.target.querySelectorAll('.stats__number').forEach(counter => {
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

                // Animate rings
                entry.target.querySelectorAll('.stats__ring-fill').forEach(ring => {
                    const percent = +ring.dataset.percent;
                    const circumference = 2 * Math.PI * 45; // r=45
                    const offset = circumference - (percent / 100) * circumference;
                    ring.style.strokeDasharray = circumference;
                    ring.style.strokeDashoffset = circumference;
                    setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);

    // ---- PROGRESS BAR ANIMATION ----
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.progress-bar__fill').forEach(fill => {
                    const width = fill.dataset.width || fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => { fill.style.width = width; }, 200);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const campaignsSection = document.querySelector('.campaigns');
    if (campaignsSection) progressObserver.observe(campaignsSection);

    // ---- PROJECT FILTER ----
    const tabBtns = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            projectCards.forEach((card, i) => {
                const show = tab === 'all' || card.dataset.category.includes(tab);
                card.classList.toggle('hide', !show);
                if (show) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 80);
                }
            });
        });
    });

    // ---- FORM VALIDATION + SUBMISSION ----
    function validateField(input) {
        const group = input.closest('.form-group');
        if (!group) return true;
        const isRequired = input.hasAttribute('required');
        const val = input.value.trim();
        if (isRequired && !val) {
            group.classList.add('has-error');
            group.classList.remove('is-valid');
            return false;
        }
        if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            group.classList.add('has-error');
            group.classList.remove('is-valid');
            return false;
        }
        group.classList.remove('has-error');
        if (val) group.classList.add('is-valid');
        return true;
    }

    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const g = input.closest('.form-group');
            if (g && g.classList.contains('has-error')) validateField(input);
        });
    });

    function handleFormSubmit(form, btn, successTitle, successMsg) {
        if (!form || !btn) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll('input, textarea, select').forEach(input => {
                if (!validateField(input)) valid = false;
            });
            if (!valid) return;
            btn.classList.add('is-loading');
            btn.disabled = true;
            setTimeout(() => {
                btn.classList.remove('is-loading');
                btn.disabled = false;
                showModal(successTitle, successMsg);
                form.reset();
                form.querySelectorAll('.form-group').forEach(g => g.classList.remove('is-valid'));
            }, 1200);
        });
    }

    handleFormSubmit(
        document.getElementById('volunteerForm'),
        document.getElementById('volSubmitBtn'),
        'تم إرسال طلبك بنجاح!',
        'شكراً لرغبتك في التطوع معنا. سنتواصل معك قريباً.'
    );
    handleFormSubmit(
        document.getElementById('contactForm'),
        document.getElementById('ctSubmitBtn'),
        'تم إرسال رسالتك!',
        'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.'
    );
    const newsletter = document.querySelector('.footer__newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            showModal('تم الاشتراك!', 'شكراً لاشتراكك في نشرتنا البريدية.');
            newsletter.reset();
        });
    }

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

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
