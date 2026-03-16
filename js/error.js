/* ============================================
   error.js — 404 Error Page JavaScript
   نساء الأقصى الدولية
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 500);
        });
        // Fallback: hide preloader after 4 seconds regardless
        setTimeout(function () {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.pointerEvents = 'none';
                setTimeout(function () {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 4000);
    }

    // ---- AOS (Animate on Scroll) ----
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // ---- SCROLL PROGRESS BAR ----
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // ---- NAVBAR SCROLL EFFECT ----
    const navbar = document.getElementById('navbar');
    if (navbar) {
        function handleNavbarScroll() {
            if (window.scrollY > 60) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }
        }
        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll();
    }

    // ---- MOBILE NAVIGATION ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu on link click
        var menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // ---- DROPDOWN MENUS (MOBILE) ----
    var dropdownParents = document.querySelectorAll('.has-dropdown > a');
    dropdownParents.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                var parent = this.parentElement;
                parent.classList.toggle('dropdown-open');
                // Close other dropdowns
                dropdownParents.forEach(function (other) {
                    if (other !== trigger) {
                        other.parentElement.classList.remove('dropdown-open');
                    }
                });
            }
        });
    });

    // ---- BACK TO TOP BUTTON ----
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
    document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;

            var hash = href;
            if (href.indexOf('#') !== -1) {
                hash = '#' + href.split('#')[1];
            }

            var target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- NEWSLETTER FORM ----
    var newsletterForms = document.querySelectorAll('.footer__newsletter');
    newsletterForms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var emailInput = form.querySelector('input[type="email"]');
            var email = emailInput ? emailInput.value.trim() : '';

            if (!email || !isValidEmail(email)) {
                showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }

            showToast('تم الاشتراك بنجاح! شكراً لك', 'success');
            if (emailInput) emailInput.value = '';
        });
    });

    // ---- EMAIL VALIDATION ----
    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ---- TOAST NOTIFICATION HELPER ----
    function showToast(message, type) {
        // Remove existing toast
        var existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast-notification toast-notification--' + (type || 'info');
        toast.innerHTML =
            '<div class="toast-notification__content">' +
            '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle') + '"></i>' +
            '<span>' + message + '</span>' +
            '</div>';

        toast.style.cssText =
            'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);' +
            'background:#fff;padding:14px 24px;border-radius:12px;z-index:10000;' +
            'box-shadow:0 4px 24px rgba(0,0,0,0.15);opacity:0;transition:all 0.4s ease;' +
            'font-size:0.95rem;max-width:90%;';

        if (type === 'success') {
            toast.style.borderRight = '4px solid #27ae60';
        } else if (type === 'error') {
            toast.style.borderRight = '4px solid #e74c3c';
        } else {
            toast.style.borderRight = '4px solid #3498db';
        }

        var content = toast.querySelector('.toast-notification__content');
        if (content) {
            content.style.cssText = 'display:flex;align-items:center;gap:10px;';
        }
        var icon = toast.querySelector('i');
        if (icon) {
            if (type === 'success') icon.style.color = '#27ae60';
            else if (type === 'error') icon.style.color = '#e74c3c';
            else icon.style.color = '#3498db';
        }

        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function () {
                if (toast.parentNode) toast.remove();
            }, 400);
        }, 3500);
    }

    // ---- MODAL HELPER ----
    function showModal(title, message) {
        // Remove existing modal if any
        var existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();

        var el = document.createElement('div');
        el.className = 'modal-overlay';
        el.innerHTML =
            '<div class="modal">' +
            '<div class="modal__icon"><i class="fas fa-info-circle"></i></div>' +
            '<h3>' + title + '</h3>' +
            '<p>' + message + '</p>' +
            '<button class="btn btn--primary" onclick="this.closest(\'.modal-overlay\').remove()">حسناً</button>' +
            '</div>';
        document.body.appendChild(el);
        requestAnimationFrame(function () {
            el.classList.add('active');
        });

        // Close on backdrop click
        el.addEventListener('click', function (e) {
            if (e.target === el) el.remove();
        });
    }

    // Close modal on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            var activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.remove();
            }
        }
    });

    // ===========================================================
    //  ERROR PAGE SPECIFIC FUNCTIONALITY
    // ===========================================================

    // ---- ERROR SEARCH FORM ----
    var errorSearch = document.getElementById('errorSearch');
    if (errorSearch) {
        errorSearch.addEventListener('submit', function (e) {
            e.preventDefault();
            showModal(
                'البحث قيد التطوير',
                'ميزة البحث قيد التطوير حالياً. يمكنك تصفح الموقع من خلال الروابط المتاحة.'
            );
        });
    }

    // ---- ANIMATE 404 NUMBERS: SUBTLE PULSE ON LOAD ----
    var errorNumbers = document.querySelectorAll('.error-illustration__number');
    if (errorNumbers.length > 0) {
        // Small delay to let the page settle, then add pulse class
        setTimeout(function () {
            errorNumbers.forEach(function (num) {
                num.classList.add('animate');
            });
        }, 800);
    }

    // ---- AUTO-REDIRECT SUGGESTION TOAST (INFORMATIONAL ONLY) ----
    setTimeout(function () {
        // Only show if still on the 404 page (user hasn't navigated away)
        var errorSection = document.querySelector('.error-section');
        if (!errorSection) return;

        // Remove any existing redirect toast
        var existingToast = document.querySelector('.error-toast');
        if (existingToast) existingToast.remove();

        var toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML =
            '<i class="fas fa-clock"></i>' +
            '<span>سيتم توجيهك للصفحة الرئيسية...</span>';
        document.body.appendChild(toast);

        // Show with animation
        requestAnimationFrame(function () {
            toast.classList.add('visible');
        });

        // Auto-hide after 5 seconds (informational only, no actual redirect)
        setTimeout(function () {
            toast.classList.remove('visible');
            setTimeout(function () {
                if (toast.parentNode) toast.remove();
            }, 400);
        }, 5000);

    }, 30000); // Show after 30 seconds

});
