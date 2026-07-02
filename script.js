(function () {
  'use strict';

  const SERVICE_LABELS = {
    portrait: 'Портретна сесія',
    wedding: 'Весільне фотографування',
    family: 'Сімейна сесія',
    print: 'Друк та оформлення',
    mug: 'Друк на чашках',
    other: 'Інше'
  };

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const scrollTopBtn = document.getElementById('scrollTop');
  const toast = document.getElementById('toast');
  const orderForm = document.getElementById('orderForm');
  const phoneInput = document.getElementById('phone');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    window.setTimeout(() => {
      toast.classList.remove('show');
      window.setTimeout(() => {
        toast.hidden = true;
      }, 400);
    }, 4500);
  }

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  }

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';

    let normalized = digits;
    if (normalized.startsWith('380')) {
      normalized = normalized.slice(0, 12);
    } else if (normalized.startsWith('80')) {
      normalized = '3' + normalized.slice(0, 11);
    } else if (normalized.startsWith('0')) {
      normalized = '38' + normalized.slice(0, 10);
    } else {
      normalized = normalized.slice(0, 12);
    }

    if (normalized.length <= 3) return '+' + normalized;
    if (normalized.length <= 5) {
      return '+' + normalized.slice(0, 3) + ' (' + normalized.slice(3);
    }
    if (normalized.length <= 8) {
      return '+' + normalized.slice(0, 3) + ' (' + normalized.slice(3, 5) + ') ' + normalized.slice(5);
    }
    if (normalized.length <= 10) {
      return '+' + normalized.slice(0, 3) + ' (' + normalized.slice(3, 5) + ') ' + normalized.slice(5, 8) + '-' + normalized.slice(8);
    }
    return '+' + normalized.slice(0, 3) + ' (' + normalized.slice(3, 5) + ') ' + normalized.slice(5, 8) + '-' + normalized.slice(8, 10) + '-' + normalized.slice(10, 12);
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    const error = field.parentElement.querySelector('.form-error');
    if (error) error.remove();
  }

  function setFieldError(field, message) {
    field.classList.add('error');
    let error = field.parentElement.querySelector('.form-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'form-error';
      field.parentElement.appendChild(error);
    }
    error.textContent = message;
  }

  function validateForm() {
    let valid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const type = document.getElementById('type');
    const description = document.getElementById('description');

    [name, phone, type, description].forEach(clearFieldError);

    if (!name.value.trim()) {
      setFieldError(name, "Введіть ваше ім'я");
      valid = false;
    }

    const phoneDigits = phone.value.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setFieldError(phone, 'Введіть коректний номер телефону');
      valid = false;
    }

    if (!type.value) {
      setFieldError(type, 'Оберіть тип послуги');
      valid = false;
    }

    if (!description.value.trim()) {
      setFieldError(description, 'Опишіть ваш проект');
      valid = false;
    }

    return valid;
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
  }

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    navbar?.classList.toggle('scrolled', scrolled);
    if (scrollTopBtn) scrollTopBtn.hidden = window.scrollY < 400;
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  if (phoneInput) {
    phoneInput.addEventListener('input', (event) => {
      event.target.value = formatPhone(event.target.value);
    });
  }

  orderForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value.trim();
    const serviceLabel = SERVICE_LABELS[type] || type;

    const message = [
      'Нове замовлення FN Print',
      '',
      "Ім'я: " + name,
      'Телефон: ' + phone,
      'Email: ' + (email || 'не вказано'),
      'Послуга: ' + serviceLabel,
      'Опис: ' + description
    ].join('\n');

    const telegramUrl = 'https://t.me/fnprint?text=' + encodeURIComponent(message);
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');

    showToast('Дякуємо, ' + name + '! Замовлення прийнято — ми зв\'яжемося з вами найближчим часом.');
    orderForm.reset();
  });

  [document.getElementById('name'), document.getElementById('phone'), document.getElementById('type'), document.getElementById('description')].forEach((field) => {
    field?.addEventListener('input', () => clearFieldError(field));
    field?.addEventListener('change', () => clearFieldError(field));
  });
})();
