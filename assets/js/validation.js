/**
 * LITTLE CANVAS — FORM VALIDATION & UI FEEDBACK SYSTEM
 * Contact Form, Auth Validation, Password Strength Meter, and Animated Toasts
 */

// Global Toast Notification Helper
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-alert toast-${type}`;
  
  const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-circle' : 'info');
  toast.innerHTML = `
    <i data-lucide="${icon}" style="color: ${type === 'success' ? '#48D597' : '#FF5C8A'}; flex-shrink: 0;"></i>
    <div style="font-weight: 700; font-size: 0.95rem;">${message}</div>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => toast.classList.add('show'), 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. CONTACT FORM VALIDATION ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = contactForm.querySelector('#contact-name');
      const email = contactForm.querySelector('#contact-email');
      const phone = contactForm.querySelector('#contact-phone');
      const age = contactForm.querySelector('#contact-age');
      const course = contactForm.querySelector('#contact-course');
      const message = contactForm.querySelector('#contact-message');

      // Helper validator
      const validateField = (input, condition) => {
        if (!condition) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      };

      if (name) validateField(name, name.value.trim().length >= 2);
      if (email) validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      if (phone) validateField(phone, phone.value.trim().length >= 7);
      if (age) validateField(age, age.value.trim() !== '');
      if (course) validateField(course, course.value.trim() !== '');
      if (message) validateField(message, message.value.trim().length >= 5);

      if (isValid) {
        contactForm.reset();
        window.showToast('🎉 Thank you! Your trial class inquiry has been received. Our team will contact you within 24 hours.', 'success');
      } else {
        window.showToast('Please check the required fields highlighted in red.', 'error');
      }
    });
  }

  // --- 2. AUTHENTICATION FORMS VALIDATION ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#login-email');
      const password = loginForm.querySelector('#login-password');
      let isValid = true;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email?.classList.add('is-invalid');
        isValid = false;
      } else {
        email?.classList.remove('is-invalid');
      }

      if (!password || password.value.length < 6) {
        password?.classList.add('is-invalid');
        isValid = false;
      } else {
        password?.classList.remove('is-invalid');
      }

      if (isValid) {
        window.showToast('Welcome back to Little Canvas! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '../admin/dashboard.html';
        }, 1200);
      } else {
        window.showToast('Invalid email or password. Please try again.', 'error');
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('#reg-name');
      const email = registerForm.querySelector('#reg-email');
      const pass = registerForm.querySelector('#reg-password');
      const confirmPass = registerForm.querySelector('#reg-confirm-password');
      const terms = registerForm.querySelector('#reg-terms');
      let isValid = true;

      if (!name || name.value.trim().length < 2) {
        name?.classList.add('is-invalid');
        isValid = false;
      } else name?.classList.remove('is-invalid');

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email?.classList.add('is-invalid');
        isValid = false;
      } else email?.classList.remove('is-invalid');

      if (!pass || pass.value.length < 6) {
        pass?.classList.add('is-invalid');
        isValid = false;
      } else pass?.classList.remove('is-invalid');

      if (!confirmPass || confirmPass.value !== pass?.value) {
        confirmPass?.classList.add('is-invalid');
        isValid = false;
      } else confirmPass?.classList.remove('is-invalid');

      if (terms && !terms.checked) {
        terms.parentElement.style.color = '#FF3366';
        isValid = false;
      } else if (terms) {
        terms.parentElement.style.color = 'inherit';
      }

      if (isValid) {
        window.showToast('Account created successfully! Welcome aboard 🎨', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      } else {
        window.showToast('Please fix the highlighted fields to continue.', 'error');
      }
    });
  }

  // --- 3. PASSWORD STRENGTH METER ---
  const regPasswordInput = document.getElementById('reg-password');
  const strengthBarFill = document.querySelector('.strength-bar-fill');
  const strengthText = document.getElementById('strength-text');

  if (regPasswordInput && strengthBarFill) {
    regPasswordInput.addEventListener('input', () => {
      const val = regPasswordInput.value;
      let score = 0;

      if (val.length >= 6) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (val.length === 0) {
        strengthBarFill.style.width = '0%';
        if (strengthText) strengthText.textContent = '';
      } else if (score <= 1) {
        strengthBarFill.style.width = '25%';
        strengthBarFill.style.backgroundColor = '#FF5C8A';
        if (strengthText) {
          strengthText.textContent = 'Weak';
          strengthText.style.color = '#FF5C8A';
        }
      } else if (score === 2 || score === 3) {
        strengthBarFill.style.width = '65%';
        strengthBarFill.style.backgroundColor = '#FFD93D';
        if (strengthText) {
          strengthText.textContent = 'Good';
          strengthText.style.color = '#FFD93D';
        }
      } else {
        strengthBarFill.style.width = '100%';
        strengthBarFill.style.backgroundColor = '#48D597';
        if (strengthText) {
          strengthText.textContent = 'Strong';
          strengthText.style.color = '#48D597';
        }
      }
    });
  }

  // --- 4. MODALS HELPER ---
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) targetModal.style.display = 'flex';
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.style.display = 'none';
    });
  });
});
