/**
 * LITTLE CANVAS — MAIN JAVASCRIPT
 * Handles Navigation, Dark Mode, RTL, Custom Cursor, Accordions, Pricing, and Countdown
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header with smooth hysteresis & RAF throttling
  const header = document.querySelector('.header-main');
  if (header) {
    let ticking = false;
    const updateHeaderScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 40) {
        if (!header.classList.contains('is-scrolled')) {
          header.classList.add('is-scrolled');
        }
      } else if (scrollY < 10) {
        if (header.classList.contains('is-scrolled')) {
          header.classList.remove('is-scrolled');
        }
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateHeaderScroll();
  }

  // 2. Mobile Menu & Home Dropdown Navigation
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const homeDropdownWrapper = document.querySelector('.nav-dropdown-wrapper');
  const homeToggleLink = document.querySelector('.nav-dropdown-toggle');

  if (mobileToggle && navMenu) {
    const closeMobileMenu = () => {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (homeDropdownWrapper) homeDropdownWrapper.classList.remove('open');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', willOpen);
      mobileToggle.classList.toggle('active', willOpen);
      mobileToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close button inside mobile drawer
    const mobileCloseBtn = navMenu.querySelector('.mobile-menu-close');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
      });
    }

    // Close mobile menu when clicking nav links
    navMenu.querySelectorAll('.nav-link:not(.nav-dropdown-toggle), .dropdown-item-card, .mobile-nav-cta a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Dropdown click & keyboard accessibility
  if (homeDropdownWrapper && homeToggleLink) {
    homeToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      homeDropdownWrapper.classList.toggle('open');
    });
  }

  // 3. Dark Mode Toggle with localStorage
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('littleCanvasTheme');

  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons(true);
  } else if (storedTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcons(false);
  } else {
    // If no preference stored yet, respect the initial data-theme from markup
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    updateThemeIcons(isDark);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('littleCanvasTheme', 'light');
        updateThemeIcons(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('littleCanvasTheme', 'dark');
        updateThemeIcons(true);
      }
    });
  });

  function updateThemeIcons(isDark) {
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = isDark 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>' 
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // 4. RTL Mode Toggle with localStorage
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const currentDir = localStorage.getItem('littleCanvasDir') || 'ltr';

  if (currentDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('littleCanvasDir', 'ltr');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('littleCanvasDir', 'rtl');
      }
    });
  });

  // 5. Custom cursor removed per user request

  // 6. Pricing Monthly / Yearly Switch
  const pricingSwitch = document.querySelector('.pricing-switch');
  if (pricingSwitch) {
    const starterPrice = document.querySelector('[data-price="starter"]');
    const creativePrice = document.querySelector('[data-price="creative"]');
    const proPrice = document.querySelector('[data-price="pro"]');

    pricingSwitch.addEventListener('click', () => {
      pricingSwitch.classList.toggle('yearly');
      const isYearly = pricingSwitch.classList.contains('yearly');

      if (starterPrice && creativePrice && proPrice) {
        if (isYearly) {
          starterPrice.textContent = '₹0';
          creativePrice.textContent = '₹1,999'; // discounted from ₹2,499
          proPrice.textContent = '₹3,599';     // discounted from ₹4,499
          document.querySelectorAll('.pricing-period').forEach(el => el.textContent = '/mo billed annually');
        } else {
          starterPrice.textContent = '₹0';
          creativePrice.textContent = '₹2,499';
          proPrice.textContent = '₹4,499';
          document.querySelectorAll('.pricing-period').forEach(el => el.textContent = '/month');
        }
      }
    });
  }

  // 7. FAQ Accordion
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.faq-item');
      const wasOpen = parent.classList.contains('open');

      // Close all others in group
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));

      if (!wasOpen) {
        parent.classList.add('open');
      }
    });
  });

  // 8. Launch Countdown Timer (Coming Soon page)
  const countdownDays = document.getElementById('count-days');
  const countdownHours = document.getElementById('count-hours');
  const countdownMinutes = document.getElementById('count-minutes');
  const countdownSeconds = document.getElementById('count-seconds');

  if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownDays.textContent = String(days).padStart(2, '0');
        countdownHours.textContent = String(hours).padStart(2, '0');
        countdownMinutes.textContent = String(minutes).padStart(2, '0');
        countdownSeconds.textContent = String(seconds).padStart(2, '0');
      }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 9. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
