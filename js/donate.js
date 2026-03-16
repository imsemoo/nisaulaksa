/* ============================================
   صفحة التبرع / الدفع - Donation Page JavaScript
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

    document.querySelectorAll('.navbar__menu .has-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { e.preventDefault(); link.parentElement.classList.toggle('open'); }
        });
    });

    // ---- STATE ----
    let currentAmount = 50;
    let currentCurrency = 'USD';
    let currentSymbol = '$';
    let currentFrequency = 'once';
    let currentDonationType = 'general';

    const donationTypeLabels = {
        general: 'تبرع عام',
        zakat: 'زكاة',
        orphan: 'كفالة يتيم',
        emergency: 'إغاثة عاجلة'
    };

    const frequencyLabels = {
        once: 'مرة واحدة',
        monthly: 'شهري'
    };

    const currencyLabels = {
        USD: 'دولار أمريكي',
        TRY: 'ليرة تركية',
        EUR: 'يورو'
    };

    // ---- READ URL PARAMS ----
    const params = new URLSearchParams(window.location.search);
    if (params.get('amount')) {
        currentAmount = parseInt(params.get('amount'));
    }
    if (params.get('currency')) {
        currentCurrency = params.get('currency');
    }
    if (params.get('plan')) {
        currentDonationType = 'orphan';
    }

    // ---- UPDATE UI ----
    function updateSummary() {
        // Submit button
        const submitAmount = document.getElementById('submitAmount');
        if (submitAmount) submitAmount.textContent = currentSymbol + currentAmount.toLocaleString();

        // Sidebar summary
        const summaryType = document.getElementById('summaryType');
        const summaryFreq = document.getElementById('summaryFreq');
        const summaryCurrency = document.getElementById('summaryCurrency');
        const summaryTotal = document.getElementById('summaryTotal');

        if (summaryType) summaryType.textContent = donationTypeLabels[currentDonationType] || 'تبرع عام';
        if (summaryFreq) summaryFreq.textContent = frequencyLabels[currentFrequency] || 'مرة واحدة';
        if (summaryCurrency) summaryCurrency.textContent = currencyLabels[currentCurrency] || currentCurrency;
        if (summaryTotal) summaryTotal.textContent = currentSymbol + currentAmount.toLocaleString();

        // Update all currency signs
        document.querySelectorAll('.currency-sign').forEach(el => {
            el.textContent = currentSymbol;
        });

        // Update suffix
        const suffix = document.querySelector('.input-group__suffix');
        if (suffix) suffix.textContent = currentCurrency;
    }

    // ---- DONATION TYPE ----
    document.querySelectorAll('.donation-type').forEach(type => {
        type.addEventListener('click', () => {
            document.querySelectorAll('.donation-type').forEach(t => t.classList.remove('active'));
            type.classList.add('active');
            currentDonationType = type.dataset.type;
            updateSummary();
        });
    });

    // ---- CURRENCY TOGGLE ----
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCurrency = btn.dataset.currency;
            currentSymbol = btn.dataset.symbol;
            updateSummary();
        });
    });

    // ---- FREQUENCY TOGGLE ----
    document.querySelectorAll('.freq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFrequency = btn.dataset.freq;
            updateSummary();
        });
    });

    // ---- AMOUNT SELECTION ----
    const amountBtns = document.querySelectorAll('.checkout-amount-btn');
    const customAmount = document.getElementById('checkoutCustomAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAmount = parseInt(btn.dataset.amount);
            if (customAmount) customAmount.value = '';
            updateSummary();
        });
    });

    if (customAmount) {
        customAmount.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            const val = parseInt(customAmount.value);
            if (val > 0) {
                currentAmount = val;
            }
            updateSummary();
        });
    }

    // ---- GIFT CHECKBOX ----
    const isGift = document.getElementById('isGift');
    const giftFields = document.getElementById('giftFields');
    if (isGift && giftFields) {
        isGift.addEventListener('change', () => {
            giftFields.style.display = isGift.checked ? 'block' : 'none';
        });
    }

    // ---- PAYMENT METHOD TOGGLE ----
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');

            const value = method.querySelector('input').value;
            const cardFields = document.getElementById('cardFields');
            const bankInfo = document.getElementById('bankInfo');

            if (cardFields) cardFields.style.display = value === 'card' ? 'block' : 'none';
            if (bankInfo) bankInfo.style.display = value === 'bank' ? 'block' : 'none';
        });
    });

    // ---- CARD NUMBER FORMATTING ----
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // ---- EXPIRY FORMATTING ----
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // ---- COPY BUTTONS ----
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
    });

    // ---- SUBMIT DONATION ----
    const submitBtn = document.getElementById('submitDonation');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const name = document.getElementById('donorName').value.trim();
            const email = document.getElementById('donorEmail').value.trim();
            const phone = document.getElementById('donorPhone').value.trim();

            if (!name || !email || !phone) {
                showModal('يرجى إكمال البيانات', 'من فضلك أدخل اسمك وبريدك الإلكتروني ورقم هاتفك للمتابعة.', 'warning');
                return;
            }

            if (currentAmount < 1) {
                showModal('خطأ في المبلغ', 'يرجى تحديد مبلغ صحيح للتبرع.', 'warning');
                return;
            }

            // Simulate processing
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-lock"></i><span>إتمام التبرع بقيمة <strong>${currentSymbol}${currentAmount.toLocaleString()}</strong></span>`;
                showModal(
                    'شكرًا لتبرعك الكريم!',
                    `تم استلام تبرعك بقيمة ${currentSymbol}${currentAmount.toLocaleString()} بنجاح.\nسيصلك إيصال على بريدك الإلكتروني: ${email}`,
                    'success'
                );
            }, 2000);
        });
    }

    // ---- NEWSLETTER ----
    const newsletter = document.querySelector('.footer__newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            showModal('تم الاشتراك!', 'شكراً لاشتراكك في نشرتنا البريدية.', 'success');
            newsletter.reset();
        });
    }

    // ---- MODAL HELPER ----
    function showModal(title, message, type = 'success') {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();

        const iconClass = type === 'success' ? 'fa-check' : 'fa-exclamation-triangle';
        const iconBg = type === 'success' ? '#f0faf4' : '#fff8f0';
        const iconColor = type === 'success' ? '#27ae60' : '#f27721';

        const el = document.createElement('div');
        el.className = 'modal-overlay';
        el.innerHTML = `
            <div class="modal">
                <div class="modal__icon" style="background:${iconBg};color:${iconColor}"><i class="fas ${iconClass}"></i></div>
                <h3>${title}</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <button class="btn btn--primary" onclick="this.closest('.modal-overlay').remove()">حسناً</button>
            </div>`;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('active'));
        el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
    }

    // ---- INITIAL UPDATE ----
    // Set active amount button based on URL param
    if (params.get('amount')) {
        const targetAmount = parseInt(params.get('amount'));
        amountBtns.forEach(b => {
            b.classList.remove('active');
            if (parseInt(b.dataset.amount) === targetAmount) {
                b.classList.add('active');
            }
        });
    }

    // Set donation type from URL
    if (params.get('plan')) {
        document.querySelectorAll('.donation-type').forEach(t => {
            t.classList.remove('active');
            if (t.dataset.type === 'orphan') t.classList.add('active');
        });
    }

    updateSummary();
});
