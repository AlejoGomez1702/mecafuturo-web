/* ============================================
   MECAFUTURO S.A.S - App JavaScript
   ============================================ */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1500);
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
function handleNavbarScroll() {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ---- MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ---- BACK TO TOP ---- */
const backTopBtn = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  if (backTopBtn) {
    backTopBtn.classList.toggle('show', window.scrollY > 500);
  }
}, { passive: true });

if (backTopBtn) {
  backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- ANIMATED COUNTERS ---- */
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const from = 0;
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(from + (target - from) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(update);
}

const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 2200, suffix);
      });
      metricsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const metricsSection = document.getElementById('metrics');
if (metricsSection) metricsObserver.observe(metricsSection);

/* ---- PARALLAX HERO ---- */
const heroGlow1 = document.querySelector('.hero-glow-1');
const heroGlow2 = document.querySelector('.hero-glow-2');
const mascota = document.querySelector('.parallax-layer');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroGlow1) heroGlow1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (heroGlow2) heroGlow2.style.transform = `translateY(${scrollY * -0.1}px)`;
  if (mascota) mascota.style.transform = `translateY(${scrollY * 0.08}px)`;
}, { passive: true });

/* ---- GALLERY LIGHTBOX ---- */
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => {
    const title = item.dataset.title || `Proyecto ${i + 1}`;
    const emoji = item.querySelector('.gallery-emoji')?.textContent || '';
    if (lightboxContent) {
      lightboxContent.innerHTML = `
        <div style="font-size:8rem;text-align:center;line-height:1">${emoji}</div>
        <p style="margin-top:1.5rem;font-weight:700;font-size:1.1rem;color:white;">${title}</p>
      `;
    }
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- FORM VALIDATION ---- */
const contactForm = document.getElementById('contact-form');

function showError(input, msg) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.form-error-msg');
  if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
}

function clearError(input) {
  input.classList.remove('error');
  const errEl = input.parentElement.querySelector('.form-error-msg');
  if (errEl) errEl.classList.remove('show');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9\s\+\-\(\)]{7,15}$/.test(phone);
}

if (contactForm) {
  const inputs = contactForm.querySelectorAll('.form-input, .form-textarea, .form-select');
  inputs.forEach(input => input.addEventListener('input', () => clearError(input)));

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const phone = contactForm.querySelector('#phone');
    const service = contactForm.querySelector('#service');
    const message = contactForm.querySelector('#message');

    if (!name.value.trim() || name.value.trim().length < 3) {
      showError(name, 'Por favor ingresa tu nombre completo'); valid = false;
    }
    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Ingresa un correo electrónico válido'); valid = false;
    }
    if (phone && phone.value.trim() && !isValidPhone(phone.value)) {
      showError(phone, 'Ingresa un número de teléfono válido'); valid = false;
    }
    if (!service || !service.value) {
      showError(service, 'Selecciona un servicio'); valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 20) {
      showError(message, 'El mensaje debe tener al menos 20 caracteres'); valid = false;
    }

    if (!valid) return;

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Enviando...`;
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    contactForm.reset();
    showToast('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
  });
}

/* ---- TOAST ---- */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---- SERVICES HOVER EFFECT (mouse tracking glow) ---- */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

/* ---- NAVBAR ACTIVE LINK ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ---- TYPED EFFECT HERO ---- */
const typedEl = document.getElementById('typed-text');
if (typedEl) {
  const words = ['Maquinaria Pesada', 'Equipos Industriales', 'Motores y Sistemas', 'Hidráulica Avanzada'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);

    let delay = deleting ? 60 : 100;
    if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }

    setTimeout(type, delay);
  }
  setTimeout(type, 1000);
}

/* ---- WHATSAPP FLOATING ---- */
const waBtn = document.querySelector('.whatsapp-btn');
if (waBtn) {
  const tooltip = document.createElement('span');
  tooltip.style.cssText = `
    position:absolute;right:70px;background:rgba(0,0,0,0.85);color:white;
    font-size:.8rem;padding:.4rem .85rem;border-radius:8px;white-space:nowrap;
    opacity:0;transition:opacity .3s;pointer-events:none;font-family:Inter,sans-serif;
    border:1px solid rgba(255,255,255,.1);
  `;
  tooltip.textContent = '¡Escríbenos por WhatsApp!';
  waBtn.style.position = 'relative';
  waBtn.appendChild(tooltip);
  waBtn.addEventListener('mouseenter', () => tooltip.style.opacity = '1');
  waBtn.addEventListener('mouseleave', () => tooltip.style.opacity = '0');
}

/* ---- INIT CSS ANIMATION on .animate-spin ---- */
const style = document.createElement('style');
style.textContent = `@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin .8s linear infinite}`;
document.head.appendChild(style);

/* ---- TESTIMONIALS SLIDER (mobile) ---- */
let testimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalCards = testimonialCards.length;

function nextTestimonial() {
  if (window.innerWidth > 768) return;
  testimonialIndex = (testimonialIndex + 1) % totalCards;
}

setInterval(nextTestimonial, 5000);

console.log('%c MECAFUTURO S.A.S ', 'background:#F5C400;color:#000;font-weight:800;font-size:1rem;padding:4px 8px;border-radius:4px;');
console.log('%c Web desarrollada con excelencia industrial', 'color:#F5C400;font-size:.85rem;');
