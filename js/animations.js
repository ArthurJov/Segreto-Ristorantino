/**
 * animations.js — Coreografia GSAP + ScrollTrigger
 * Segreto Ristorantino
 */

class AppAnimations {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.prefersReducedMotion) {
      // Sem animação: tornar tudo visível imediatamente
      document.querySelectorAll(
        '.hero__service-line, .hero__subtitle, .hero__ctas, .hero__scroll-indicator, ' +
        '.manifesto__img-wrapper, .menu-journey__step, .gallery__item, .js-fade-up'
      ).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    window.addEventListener('preloader-done', () => {
      this.playHeroAnimations();

      setTimeout(() => {
        this.initScrollAnimations();
      }, 400);
    });
  }

  playHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Texto de serviço (versalete discreto acima do título)
    const serviceLine = document.querySelector('.hero__service-line');
    if (serviceLine) {
      tl.to(serviceLine, { y: 0, opacity: 1, duration: 0.7 }, 0.1);
    }

    // 2. Título com text mask
    const maskInners = document.querySelectorAll('.hero__title .js-mask-inner');
    if (maskInners.length) {
      tl.to(maskInners, {
        y: '0%',
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out'
      }, 0.2);
    }

    // 3. Subtítulo
    const subtitle = document.querySelector('.hero__subtitle');
    if (subtitle) {
      tl.to(subtitle, { y: 0, opacity: 1, duration: 0.7 }, 0.55);
    }

    // 4. CTA único
    const ctas = document.querySelector('.hero__ctas');
    if (ctas) {
      tl.to(ctas, { y: 0, opacity: 1, duration: 0.6 }, 0.75);
    }

    // 5. Scroll indicator
    const indicator = document.querySelector('.hero__scroll-indicator');
    if (indicator) {
      tl.to(indicator, { opacity: 1, duration: 0.4 }, 1.1);
    }
  }

  initScrollAnimations() {
    // 1. Parallax Hero
    const heroImg = document.querySelector('.hero__bg-img');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: -16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // 2. Fade-up genérico
    const fadeElements = document.querySelectorAll('section:not(#hero) .js-fade-up');
    fadeElements.forEach(el => {
      gsap.fromTo(el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 87%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 3. A Casa — imagem parallax e revelação
    const manifestoImg = document.querySelector('.manifesto__img-wrapper');
    if (manifestoImg) {
      gsap.to(manifestoImg, {
        scale: 1.0,
        opacity: 1,
        filter: 'brightness(1) grayscale(0)',
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: manifestoImg,
          start: 'top 82%'
        }
      });

      const imgInner = manifestoImg.querySelector('img');
      if (imgInner) {
        gsap.fromTo(imgInner,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: manifestoImg,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    }

    // 4. Separador A Casa
    const separator = document.querySelector('.manifesto__separator');
    if (separator) {
      gsap.to(separator, {
        width: '100%',
        duration: 0.9,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: separator,
          start: 'top 87%'
        }
      });
    }

    // 5. Percurso do Menu — steps sequenciais
    const menuSteps = document.querySelectorAll('.menu-journey__step');
    if (menuSteps.length) {
      gsap.to(menuSteps, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.menu-journey',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    // 6. Galeria — reveal individual
    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach(item => {
      gsap.to(item, {
        scale: 1.0,
        opacity: 1,
        filter: 'brightness(1) grayscale(0)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 87%'
        }
      });
    });

    ScrollTrigger.refresh();
  }
}

window.appAnimations = new AppAnimations();
