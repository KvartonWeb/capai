// ========== CAP.AI Main Script ==========

document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initHeader();
    initSlider();
    initLanguageSwitcher();
    initMobileMenu();
    initModals();
    initPricingToggle();
    initCounters();
    initSmoothScroll();
});

// ========== AOS (Animate On Scroll) ==========
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
    });
}

// ========== Header Scroll Effect ==========
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ========== Hero Slider ==========
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function goToSlide(index) {
        slides.forEach(slide => {
            slide.classList.add('hidden');
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.style.width = '2rem';
            dot.style.background = 'rgba(255,255,255,0.2)';
        });

        slides[index].classList.remove('hidden');
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        dots[index].style.width = '3rem';
        dots[index].style.background = '#3B82F6';
        currentSlide = index;
    }

    // Dot click
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
            resetAutoSlide();
        });
    });

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }, 6000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Pause on hover
    const heroSection = document.getElementById('heroSlider');
    heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    heroSection.addEventListener('mouseleave', startAutoSlide);
}

// ========== Language Switcher ==========
function initLanguageSwitcher() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langArrow = document.getElementById('langArrow');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentFlag = document.getElementById('currentFlag');
    const currentLang = document.getElementById('currentLang');
    const currentCurrency = document.getElementById('currentCurrency');

    let isOpen = false;

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        langDropdown.classList.toggle('hidden', !isOpen);
        langArrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0)';
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            const flag = option.dataset.flag;
            const currency = option.dataset.currency;

            currentFlag.src = `https://flagcdn.com/w40/${flag}.png`;
            currentLang.textContent = flag.toUpperCase();
            currentCurrency.textContent = currency;

            // Update all currency symbols on the page
            document.querySelectorAll('.currency-symbol').forEach(el => {
                el.textContent = currency;
            });

            // Store selection
            localStorage.setItem('capai_lang', lang);
            localStorage.setItem('capai_currency', currency);
            localStorage.setItem('capai_flag', flag);

            // Close dropdown
            isOpen = false;
            langDropdown.classList.add('hidden');
            langArrow.style.transform = 'rotate(0)';
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        if (isOpen) {
            isOpen = false;
            langDropdown.classList.add('hidden');
            langArrow.style.transform = 'rotate(0)';
        }
    });

    // Restore saved language
    const savedLang = localStorage.getItem('capai_lang');
    const savedCurrency = localStorage.getItem('capai_currency');
    const savedFlag = localStorage.getItem('capai_flag');

    if (savedLang && savedCurrency && savedFlag) {
        currentFlag.src = `https://flagcdn.com/w40/${savedFlag}.png`;
        currentLang.textContent = savedFlag.toUpperCase();
        currentCurrency.textContent = savedCurrency;
        document.querySelectorAll('.currency-symbol').forEach(el => {
            el.textContent = savedCurrency;
        });
    }
}

// ========== Mobile Menu ==========
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    let isMenuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileMenu.classList.toggle('hidden', !isMenuOpen);
        mobileMenuBtn.innerHTML = isMenuOpen
            ? '<i class="fas fa-times text-xl"></i>'
            : '<i class="fas fa-bars text-xl"></i>';
    });

    // Close menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        });
    });
}

// ========== Modals ==========
function initModals() {
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnMobile = document.getElementById('loginBtnMobile');

    loginBtn.addEventListener('click', openLoginModal);
    loginBtnMobile.addEventListener('click', () => {
        // Close mobile menu first
        document.getElementById('mobileMenu').classList.add('hidden');
        document.getElementById('mobileMenuBtn').innerHTML = '<i class="fas fa-bars text-xl"></i>';
        openLoginModal();
    });

    // Login form submit (demo)
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Show company selector for demo
        const companySelector = document.getElementById('companySelector');
        if (companySelector.classList.contains('hidden')) {
            companySelector.classList.remove('hidden');
            companySelector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Simulate login
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.classList.add('btn-loading');
            setTimeout(() => {
                submitBtn.classList.remove('btn-loading');
                alert('წარმატებით შესვლა! (დემო)');
                closeLoginModal();
            }, 1500);
        }
    });

    // Registration form submit
    document.getElementById('registrationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        setTimeout(() => {
            submitBtn.classList.remove('btn-loading');
            alert('წარმატებით დარეგისტრირდით! (დემო)');
            closeRegistrationModal();
        }, 1500);
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeRegistrationModal();
        }
    });
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // Reset company selector
    document.getElementById('companySelector').classList.add('hidden');
}

function openRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ========== Password Toggle ==========
function togglePassword(btn) {
    const input = btn.parentElement.querySelector('input');
    const icon = btn.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========== Pricing Toggle ==========
function initPricingToggle() {
    // Check if already set
}

let isYearly = false;

function togglePricing() {
    isYearly = !isYearly;
    const toggle = document.getElementById('pricingToggle');
    const circle = document.getElementById('pricingToggleCircle');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');

    if (isYearly) {
        toggle.classList.add('yearly');
        circle.style.transform = 'translateX(1.75rem)';
        monthlyLabel.classList.add('text-gray-400');
        monthlyLabel.classList.remove('text-white');
        yearlyLabel.classList.remove('text-gray-400');
        yearlyLabel.classList.add('text-white');
        monthlyPrices.forEach(el => el.classList.add('hidden'));
        yearlyPrices.forEach(el => el.classList.remove('hidden'));
    } else {
        toggle.classList.remove('yearly');
        circle.style.transform = 'translateX(0)';
        monthlyLabel.classList.remove('text-gray-400');
        monthlyLabel.classList.add('text-white');
        yearlyLabel.classList.add('text-gray-400');
        yearlyLabel.classList.remove('text-white');
        monthlyPrices.forEach(el => el.classList.remove('hidden'));
        yearlyPrices.forEach(el => el.classList.add('hidden'));
    }
}

// ========== Counter Animation ==========
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const observerOptions = {
        threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.counter);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();
    const originalText = el.textContent;
    const suffix = originalText.includes('%') ? '%' : '+';

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easedProgress * target);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(update);
}

// ========== Video Player ==========
function playVideo() {
    const placeholder = document.getElementById('videoPlaceholder');
    const videoFrame = document.getElementById('videoFrame');

    // Replace with actual video URL when available
    // Example YouTube embed:
    // videoFrame.src = 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1';
    
    // For demo, show a message
    placeholder.innerHTML = `
        <div class="text-center p-8">
            <div class="w-16 h-16 mx-auto bg-cap-accent/20 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-film text-2xl text-cap-accent"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">ვიდეო მალე დაემატება</h3>
            <p class="text-gray-400 text-sm">CAP.AI პრეზენტაციის ვიდეო მომზადების პროცესშია</p>
        </div>
    `;

    // When actual video URL is ready, uncomment:
    // placeholder.classList.add('hidden');
    // videoFrame.classList.remove('hidden');
}

// ========== Smooth Scroll ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
