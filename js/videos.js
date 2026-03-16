/* =============================================
   VIDEOS PAGE — JavaScript
   نساء الأقصى الدولية — الفيديو
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // PRELOADER
    // =============================================
    var preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 500);
        });
        // Fallback: hide after 4s
        setTimeout(function () {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                preloader.style.display = 'none';
            }
        }, 4000);
    }

    // =============================================
    // AOS (Animate On Scroll)
    // =============================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 80
        });
    }

    // =============================================
    // SCROLL PROGRESS BAR
    // =============================================
    var scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
    window.addEventListener('scroll', updateScrollProgress);

    // =============================================
    // NAVBAR — Sticky on scroll
    // =============================================
    var navbar = document.getElementById('navbar');
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.pageYOffset > 80) {
            navbar.classList.add('navbar--sticky');
        } else {
            navbar.classList.remove('navbar--sticky');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // =============================================
    // MOBILE NAV TOGGLE
    // =============================================
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close on link click
        var navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // =============================================
    // BACK TO TOP
    // =============================================
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // SMOOTH SCROLL for anchor links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =============================================
    // NEWSLETTER FORM (prevent default)
    // =============================================
    var newsletterForm = document.querySelector('.footer__newsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = this.querySelector('input[type="email"]');
            if (input && input.value.trim()) {
                var btn = this.querySelector('button');
                var origHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = '#22c55e';
                input.value = '';
                setTimeout(function () {
                    btn.innerHTML = origHTML;
                    btn.style.color = '';
                }, 2500);
            }
        });
    }

    // =============================================
    // VIDEO FILTER
    // =============================================
    var filterBtns = document.querySelectorAll('.vid-filter-btn');
    var vidCards = document.querySelectorAll('.vid-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active state
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            // Fade out all items first
            vidCards.forEach(function (card) {
                card.classList.add('fade-out');
                card.classList.remove('fade-in');
            });

            // After fade out, show/hide and fade in
            setTimeout(function () {
                vidCards.forEach(function (card) {
                    var cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.classList.remove('hide');
                        // Trigger reflow for animation
                        void card.offsetWidth;
                        card.classList.remove('fade-out');
                        card.classList.add('fade-in');
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('fade-out');
                        card.classList.remove('fade-in');
                    }
                });
            }, 300);
        });
    });

    // =============================================
    // VIDEO MODAL
    // =============================================
    var vidModal = document.getElementById('vidModal');
    var vidModalClose = document.getElementById('vidModalClose');

    function openVideoModal() {
        if (!vidModal) return;
        vidModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!vidModal) return;
        vidModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open modal from vid-card play buttons
    vidCards.forEach(function (card) {
        var playBtn = card.querySelector('.vid-card__play');
        if (playBtn) {
            playBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openVideoModal();
            });
        }

        // Also open on thumbnail click
        var thumbnail = card.querySelector('.vid-thumbnail__placeholder');
        if (thumbnail) {
            thumbnail.addEventListener('click', function () {
                openVideoModal();
            });
        }
    });

    // Open modal from featured video thumbnail
    var featuredThumbnail = document.querySelector('.vid-featured-card__thumbnail .vid-thumbnail__placeholder');
    if (featuredThumbnail) {
        featuredThumbnail.addEventListener('click', function () {
            openVideoModal();
        });
    }

    var featuredPlay = document.querySelector('.vid-featured-card__thumbnail .vid-thumbnail__play');
    if (featuredPlay) {
        featuredPlay.addEventListener('click', function () {
            openVideoModal();
        });
    }

    // Open modal from featured "Watch Now" button
    var featuredBtn = document.querySelector('.vid-featured-btn');
    if (featuredBtn) {
        featuredBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openVideoModal();
        });
    }

    // Close modal on X button
    if (vidModalClose) {
        vidModalClose.addEventListener('click', function (e) {
            e.stopPropagation();
            closeVideoModal();
        });
    }

    // Close modal on overlay click
    if (vidModal) {
        vidModal.addEventListener('click', function (e) {
            if (e.target === vidModal) {
                closeVideoModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (!vidModal || !vidModal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });

});