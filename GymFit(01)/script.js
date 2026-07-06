/* ═══════════════════════════════════════════
   GYMFIT — script.js
   DecodeLabs Full Stack Internship 2026
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════
     1. HAMBURGER MENU TOGGLE (Mobile Nav)
  ════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked (mobile UX)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    const clickedInsideNav = navLinks.contains(e.target) || hamburger.contains(e.target);
    if (!clickedInsideNav && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close menu automatically if window is resized to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });


  /* ════════════════════════════════════════
     2. STICKY HEADER SHADOW ON SCROLL
  ════════════════════════════════════════ */
  const header = document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run once on load


  /* ════════════════════════════════════════
     3. SCROLL REVEAL ANIMATIONS
     Adds .reveal to sections, then fades them
     in via IntersectionObserver as they enter view
  ════════════════════════════════════════ */
  const revealTargets = document.querySelectorAll(
    '.class-card, .trainer-card, .plan-card, .testi-card, .schedule-wrapper, .join-wrapper'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // No IntersectionObserver support OR reduced motion preferred
    revealTargets.forEach(el => el.classList.add('visible'));
  }


  /* ════════════════════════════════════════
     4. MEMBERSHIP FORM VALIDATION
  ════════════════════════════════════════ */
  const form = document.getElementById('joinForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: (value) => {
        if (!value.trim()) return 'Please enter your full name.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Please enter your email.';
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    plan: {
      input: document.getElementById('plan'),
      error: document.getElementById('planError'),
      validate: (value) => {
        if (!value) return 'Please select a membership plan.';
        return '';
      }
    }
  };

  function showError(fieldKey, message) {
    const { input, error } = fields[fieldKey];
    error.textContent = message;
    input.classList.toggle('is-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(fieldKey) {
    const { input, validate } = fields[fieldKey];
    const message = validate(input.value);
    showError(fieldKey, message);
    return message === '';
  }

  // Live validation: clear error as user types/selects
  Object.keys(fields).forEach(key => {
    const { input } = fields[key];
    input.addEventListener('blur', () => validateField(key));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(key);
    });
    input.addEventListener('change', () => {
      if (input.classList.contains('is-error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const results = Object.keys(fields).map(key => validateField(key));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      // Focus the first invalid field for accessibility
      const firstInvalidKey = Object.keys(fields).find(key =>
        fields[key].input.classList.contains('is-error')
      );
      if (firstInvalidKey) fields[firstInvalidKey].input.focus();
      formSuccess.hidden = true;
      return;
    }

    // Simulate submission (Project 2 will POST this to /api/members)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      formSuccess.hidden = false;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send My Enquiry';

      // Clear any leftover error states after reset
      Object.keys(fields).forEach(key => showError(key, ''));

      // Hide success message after a while
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    }, 900);
  });


  /* ════════════════════════════════════════
     5. ACTIVE NAV LINK ON SCROLL (bonus UX)
  ════════════════════════════════════════ */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navAnchors.forEach(anchor => {
      anchor.classList.toggle('active-link', anchor.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

});