/* ============================================
   pages.js — Shared JS for all pages
   نساء الأقصى الدولية
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ----- Preloader ----- */
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

    /* ----- AOS (Animate on Scroll) ----- */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    /* ----- Scroll Progress Bar ----- */
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    /* ----- Navbar Scroll Effect ----- */
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
        handleNavbarScroll(); // Run on load
    }

    /* ----- Mobile Navigation ----- */
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

    /* ----- Dropdown menus (mobile) ----- */
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

    /* ----- Back to Top Button ----- */
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

    /* ----- Newsletter Form ----- */
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

            // Simulate subscription
            showToast('تم الاشتراك بنجاح! شكراً لك', 'success');
            if (emailInput) emailInput.value = '';
        });
    });

    /* ----- Email Validation ----- */
    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /* ----- Toast Notification Helper ----- */
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

        // Toast styles
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

        // Animate in
        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Auto-remove after 3.5 seconds
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function () {
                if (toast.parentNode) toast.remove();
            }, 400);
        }, 3500);
    }

    /* ----- Modal Helper ----- */
    window.openModal = function (modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close modal on backdrop click
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            var activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    /* ----- Donation Success: Read URL Params ----- */
    if (window.location.pathname.includes('donation-success')) {
        var params = new URLSearchParams(window.location.search);

        var trxId = params.get('trx') || params.get('transaction_id');
        var amount = params.get('amount');
        var date = params.get('date');

        if (trxId) {
            var trxEl = document.getElementById('trxId');
            if (trxEl) trxEl.textContent = '#' + trxId;
        }

        if (amount) {
            var amountEl = document.getElementById('trxAmount');
            if (amountEl) {
                // Format the amount with currency
                var currency = params.get('currency') || '$';
                amountEl.textContent = currency + parseFloat(amount).toFixed(2);
            }
        }

        if (date) {
            var dateEl = document.getElementById('trxDate');
            if (dateEl) {
                // Try to format date nicely in Arabic
                try {
                    var d = new Date(date);
                    var formatted = d.toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    dateEl.textContent = formatted;
                } catch (err) {
                    dateEl.textContent = date;
                }
            }
        }
    }

});
