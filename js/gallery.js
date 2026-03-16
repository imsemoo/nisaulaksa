/* =============================================
   GALLERY PAGE — JavaScript
   نساء الأقصى الدولية — معرض الصور
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // PRELOADER
    // =============================================
    const preloader = document.getElementById('preloader');
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
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
    window.addEventListener('scroll', updateScrollProgress);

    // =============================================
    // NAVBAR — Sticky on scroll
    // =============================================
    const navbar = document.getElementById('navbar');
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
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close on link click
        const navLinks = navMenu.querySelectorAll('a');
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
    const backToTop = document.getElementById('backToTop');
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
    // STATS COUNTER ANIMATION (IntersectionObserver)
    // =============================================
    var statsSection = document.querySelector('.gallery-stats');
    var statNumbers = document.querySelectorAll('.gallery-stats__number[data-target]');
    var statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;
        statNumbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var duration = 1800;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out quad
                var eased = 1 - (1 - progress) * (1 - progress);
                var current = Math.floor(eased * target);
                el.textContent = current;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(step);
        });
    }

    if (statsSection && statNumbers.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // =============================================
    // GALLERY FILTER
    // =============================================
    var filterBtns = document.querySelectorAll('.gallery-filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active state
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            // Fade out all items first
            galleryItems.forEach(function (item) {
                item.classList.add('fade-out');
                item.classList.remove('fade-in');
            });

            // After fade out, show/hide and fade in
            setTimeout(function () {
                galleryItems.forEach(function (item) {
                    var cat = item.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        item.classList.remove('hide');
                        // Trigger reflow for animation
                        void item.offsetWidth;
                        item.classList.remove('fade-out');
                        item.classList.add('fade-in');
                    } else {
                        item.classList.add('hide');
                        item.classList.remove('fade-out');
                        item.classList.remove('fade-in');
                    }
                });
            }, 300);
        });
    });

    // =============================================
    // LIGHTBOX
    // =============================================
    var lightbox = document.getElementById('lightbox');
    var lightboxImage = document.getElementById('lightboxImage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentLightboxIndex = 0;

    function getVisibleItems() {
        var items = [];
        galleryItems.forEach(function (item) {
            if (!item.classList.contains('hide')) {
                items.push(item);
            }
        });
        return items;
    }

    function openLightbox(index) {
        var visible = getVisibleItems();
        if (index < 0 || index >= visible.length) return;
        currentLightboxIndex = index;

        var item = visible[index];
        var title = item.querySelector('.gallery-item__overlay h4');
        var placeholderIcon = item.querySelector('.gallery-item__placeholder i');

        // Set lightbox image placeholder
        lightboxImage.innerHTML = '';
        var icon = document.createElement('i');
        icon.className = placeholderIcon ? placeholderIcon.className : 'fas fa-image';
        lightboxImage.appendChild(icon);

        // Set caption
        lightboxCaption.textContent = title ? title.textContent : '';

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        var visible = getVisibleItems();
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) {
            currentLightboxIndex = visible.length - 1;
        } else if (currentLightboxIndex >= visible.length) {
            currentLightboxIndex = 0;
        }
        openLightbox(currentLightboxIndex);
    }

    // Open lightbox on gallery item click
    galleryItems.forEach(function (item) {
        var wrap = item.querySelector('.gallery-item__wrap');
        if (wrap) {
            wrap.addEventListener('click', function (e) {
                e.preventDefault();
                var visible = getVisibleItems();
                var idx = visible.indexOf(item);
                if (idx !== -1) {
                    openLightbox(idx);
                }
            });
        }
    });

    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function (e) {
            e.stopPropagation();
            closeLightbox();
        });
    }

    // Prev/Next
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            navigateLightbox(1); // RTL: prev = right = next in array for RTL
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function (e) {
            e.stopPropagation();
            navigateLightbox(-1); // RTL: next = left = prev in array for RTL
        });
    }

    // Click overlay background to close
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            // RTL: right arrow = prev
            navigateLightbox(-1);
        } else if (e.key === 'ArrowLeft') {
            // RTL: left arrow = next
            navigateLightbox(1);
        }
    });

    // Touch swipe for lightbox on mobile
    var touchStartX = 0;
    var touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe right (RTL: next)
                    navigateLightbox(1);
                } else {
                    // Swipe left (RTL: prev)
                    navigateLightbox(-1);
                }
            }
        }, { passive: true });
    }

});
