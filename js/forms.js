/* ============================================
   صفحات النماذج - Forms Pages JavaScript
   Volunteer, Contact & FAQ
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

    // ---- NAVBAR SCROLL BEHAVIOR + BACK TO TOP ----
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

    // ---- MOBILE NAV TOGGLE + OVERLAY ----
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
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });

    document.querySelectorAll('.navbar__menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleNav();
        });
    });

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
    document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            let hash = href;
            if (href.includes('#')) {
                hash = '#' + href.split('#')[1];
            }

            const target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- FAQ ACCORDION TOGGLE ----
    document.querySelectorAll('.faq-item__header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ---- FAQ CATEGORY FILTER ----
    const faqFilterBtns = document.querySelectorAll('.faq-filter-btn');
    const faqItems = document.querySelectorAll('.faq-item[data-category]');
    const faqCatCards = document.querySelectorAll('.faq-cat-card[data-cat]');

    function filterFAQ(filter) {
        // Update active button
        faqFilterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.faq-filter-btn[data-filter="${filter}"]`)?.classList.add('active');

        // Update active category card
        faqCatCards.forEach(c => c.classList.remove('active'));
        document.querySelector(`.faq-cat-card[data-cat="${filter}"]`)?.classList.add('active');

        // Filter FAQ items with staggered animation
        faqItems.forEach((item, i) => {
            const show = filter === 'all' || item.dataset.category === filter;
            item.classList.remove('active');

            if (show) {
                item.classList.remove('hidden');
                item.style.opacity = '0';
                item.style.transform = 'translateY(12px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.35s cubic-bezier(0.4,0,0.2,1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, i * 60);
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Filter button clicks
    faqFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterFAQ(btn.dataset.filter);
        });
    });

    // Category card clicks
    faqCatCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.cat;
            filterFAQ(cat);

            // Scroll to FAQ accordion section
            const faqSection = document.getElementById('faqAccordion');
            if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- VOLUNTEER FORM VALIDATION & SUBMIT ----
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const name = volunteerForm.querySelector('[name="name"]');
            const email = volunteerForm.querySelector('[name="email"]');
            const phone = volunteerForm.querySelector('[name="phone"]');

            if (!name.value.trim()) {
                name.focus();
                return;
            }
            if (!email.value.trim() || !email.validity.valid) {
                email.focus();
                return;
            }
            if (!phone.value.trim()) {
                phone.focus();
                return;
            }

            showModal('تم الإرسال بنجاح!', 'شكراً لتقديم طلب التطوع. سنتواصل معك قريباً إن شاء الله.');
            volunteerForm.reset();
        });
    }

    // ---- CONTACT FORM VALIDATION & SUBMIT ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const name = contactForm.querySelector('[name="name"]');
            const email = contactForm.querySelector('[name="email"]');
            const message = contactForm.querySelector('[name="message"]');

            if (!name.value.trim()) {
                name.focus();
                return;
            }
            if (!email.value.trim() || !email.validity.valid) {
                email.focus();
                return;
            }
            if (!message.value.trim()) {
                message.focus();
                return;
            }

            showModal('تم الإرسال بنجاح!', 'شكراً لتواصلك معنا. سنرد على استفسارك في أقرب وقت.');
            contactForm.reset();
        });
    }

    // ---- NEWSLETTER FORM ----
    const newsletter = document.querySelector('.footer__newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletter.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                showModal('تم الاشتراك!', 'شكراً لاشتراكك في نشرتنا البريدية.');
                newsletter.reset();
            }
        });
    }

    // ---- MODAL HELPER FUNCTION ----
    function showModal(title, message) {
        // Remove existing modal if any
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

        // Close on backdrop click
        el.addEventListener('click', (e) => {
            if (e.target === el) el.remove();
        });
    }

});
