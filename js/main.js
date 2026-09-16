/**
 * main.js — Lógica geral de UI
 * Segreto Ristorantino
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     RENDER DO MENU A PARTIR DO OBJETO DE DADOS
     Lê ETAPAS de menu-data.js e injeta no DOM com thumbnail por etapa.
     Para atualizar o menu, editar apenas js/menu-data.js.
     ========================================================================== */
  const journey = document.querySelector('.menu-journey');
  if (journey && typeof ETAPAS !== 'undefined') {
    journey.innerHTML = '';
    ETAPAS.forEach(etapa => {
      const step = document.createElement('div');
      step.className = 'menu-journey__step';

      // Miniatura: imagem real ou placeholder vazio
      const thumbHTML = etapa.imagem
        ? `<div class="menu-journey__thumb">
             <img src="${etapa.imagem}" alt="${etapa.pratos[0]}" loading="lazy">
           </div>`
        : `<div class="menu-journey__thumb menu-journey__thumb--empty" aria-hidden="true"></div>`;

      const pratosHTML = etapa.pratos
        .map(p => `<span class="menu-journey__prato">${p}</span>`)
        .join('');

      step.innerHTML = `
        ${thumbHTML}
        <div class="menu-journey__body">
          <span class="menu-journey__rotulo">${etapa.rotulo}</span>
          ${pratosHTML}
        </div>
      `;
      journey.appendChild(step);
    });
  }

  /* ==========================================================================
     HEADER SCROLL
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const scrollThreshold = 60;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ==========================================================================
     MOBILE MENU
     ========================================================================== */
  const menuBtn = document.querySelector('.site-header__menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.add('is-open');
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';

      document.body.style.overflow = 'hidden';
      if (window.appLenis) window.appLenis.stop();

      gsap.fromTo('.mobile-link',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' }
      );
    } else {
      mobileMenu.classList.remove('is-open');
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';

      document.body.style.overflow = '';
      if (window.appLenis) window.appLenis.start();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  /* ==========================================================================
     SMOOTH SCROLL (ANCHOR LINKS)
     ========================================================================== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = -80;

        if (window.appLenis) {
          window.appLenis.scrollTo(targetElement, { offset: headerOffset, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     MAP OVERLAY
     ========================================================================== */
  const mapOverlay = document.querySelector('.map-overlay');
  if (mapOverlay) {
    mapOverlay.addEventListener('click', () => {
      mapOverlay.style.pointerEvents = 'none';
      mapOverlay.style.opacity = '0';
    });
  }

  /* ==========================================================================
     LIGHTBOX DA GALERIA
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery__item[data-lightbox-src]');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (window.appLenis) window.appLenis.stop();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    if (window.appLenis) window.appLenis.start();
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.lightboxSrc;
      const alt = item.querySelector('img')?.alt || '';
      openLightbox(src, alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-active')) closeLightbox();
    });
  }

  /* ==========================================================================
     CUSTOM MAGNETIC CURSOR
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out'
      });
    });

    const interactiveElements = document.querySelectorAll('a, button, .map-overlay');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

});
