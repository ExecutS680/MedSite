document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. МОБИЛЬНОЕ МЕНЮ
     ========================================================================== */
  const burgerBtn = document.querySelector('.burger-btn');
  const drawer = document.querySelector('.drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer__close');
  const drawerLinks = document.querySelectorAll('.drawer__link');
  
  if (drawer) {
    drawer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    drawer.style.transform = 'translateX(100%)';
    drawer.setAttribute('aria-hidden', 'true');
  }
  
  if (drawerOverlay) {
    drawerOverlay.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s';
    drawerOverlay.style.opacity = '0';
    drawerOverlay.style.visibility = 'hidden';
  }

  const openDrawer = () => {
    if (burgerBtn) {
      burgerBtn.classList.add('burger-btn--active');
      burgerBtn.setAttribute('aria-expanded', 'true');
    }
    if (drawer) {
      drawer.classList.add('drawer--active');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.style.transform = 'translateX(0)';
    }
    if (drawerOverlay) {
      drawerOverlay.classList.add('drawer-overlay--active');
      drawerOverlay.style.opacity = '1';
      drawerOverlay.style.visibility = 'visible';
    }
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (burgerBtn) {
      burgerBtn.classList.remove('burger-btn--active');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
    if (drawer) {
      drawer.classList.remove('drawer--active');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.style.transform = 'translateX(100%)';
    }
    if (drawerOverlay) {
      drawerOverlay.classList.remove('drawer-overlay--active');
      drawerOverlay.style.opacity = '0';
      drawerOverlay.style.visibility = 'hidden';
    }
    document.body.style.overflow = '';
  };

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = drawer && drawer.classList.contains('drawer--active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }
  
  drawerLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      closeDrawer();
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            smoothScrollTo(targetElement);
          }
        }, 300);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('drawer--active')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     2. ПЛАВНЫЙ СКРОЛЛ
     ========================================================================== */
  const smoothScrollTo = (targetElement) => {
    if (!targetElement) return;
    
    if (drawer && drawer.classList.contains('drawer--active')) {
      closeDrawer();
    }
    
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 800;
    let startTime = null;
    
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        smoothScrollTo(targetElement);
      }
    });
  });

  /* ==========================================================================
     3. ПЛАВНЫЙ АККОРДЕОН
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion__header');
    const body = item.querySelector('.accordion__body');
    
    if (header && body) {
      body.removeAttribute('hidden');
      body.style.maxHeight = '0';
      body.style.opacity = '0';
      body.style.overflow = 'hidden';
      body.style.padding = '0 20px';
      body.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('accordion__item--active');
        
        accordionItems.forEach((i) => {
          const h = i.querySelector('.accordion__header');
          const b = i.querySelector('.accordion__body');
          
          i.classList.remove('accordion__item--active');
          if (h) h.setAttribute('aria-expanded', 'false');
          if (b) {
            b.style.maxHeight = '0';
            b.style.opacity = '0';
            b.style.padding = '0 20px';
          }
        });
        
        if (!isActive) {
          item.classList.add('accordion__item--active');
          header.setAttribute('aria-expanded', 'true');
          
          requestAnimationFrame(() => {
            const contentHeight = body.scrollHeight;
            body.style.maxHeight = contentHeight + 40 + 'px';
            body.style.opacity = '1';
            body.style.padding = '0 20px 20px 20px';
          });
        }
      });
      
      header.setAttribute('aria-expanded', 'false');
    }
  });

  /* ==========================================================================
     4. АНИМАЦИЯ ЧИСЕЛ
     ========================================================================== */
  const animateNumber = (el) => {
    if (!el || el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutExpo(progress);
      const currentVal = Math.floor(target * easeProgress);

      el.textContent = prefix + currentVal.toLocaleString('ru-RU') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString('ru-RU') + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((counter) => {
    setTimeout(() => animateNumber(counter), 500);
  });

  /* ==========================================================================
     5. ПОКАЗ ЭЛЕМЕНТОВ
     ========================================================================== */
  const fadeElements = document.querySelectorAll('.fade-in, .reveal-on-scroll');
  
  fadeElements.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  /* ==========================================================================
     6. ПАРАЛЛАКС
     ========================================================================== */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
  let parallaxInitialized = false;

  const initParallax = () => {
    if (parallaxLayers.length === 0 || prefersReducedMotion) return;
    
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      parallaxLayers.forEach((layer) => {
        layer.style.transform = 'none';
      });
      parallaxInitialized = false;
      return;
    }
    
    if (parallaxInitialized) return;
    
    let ticking = false;
    let currentY = window.pageYOffset;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      currentY += (scrolled - currentY) * 0.1;
      
      parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.15;
        const yPos = -(currentY * speed);
        layer.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
      });

      ticking = false;
    };

    const requestParallax = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', requestParallax, { passive: true });
    updateParallax();
    parallaxInitialized = true;
  };

  initParallax();
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        parallaxLayers.forEach((layer) => {
          layer.style.transform = 'none';
        });
        parallaxInitialized = false;
      } else if (!parallaxInitialized) {
        initParallax();
      }
    }, 250);
  });

  /* ==========================================================================
     7. КАЛЬКУЛЯТОР
     ========================================================================== */
  const calcForm = document.getElementById('calc-form');
  const calcService = document.getElementById('calc-service');
  const calcCount = document.getElementById('calc-count');
  const calcOptions = document.querySelectorAll('.calc-option');
  const calcTotal = document.getElementById('calc-total');

  const animateValue = (element, targetValue) => {
    const startValue = parseInt(element.dataset.currentValue, 10) || 0;
    const duration = 500;
    const startTime = performance.now();
    
    const easeOutCubic = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);
      
      element.textContent = currentValue.toLocaleString('ru-RU') + ' ₽';
      element.dataset.currentValue = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = targetValue.toLocaleString('ru-RU') + ' ₽';
        element.dataset.currentValue = targetValue;
      }
    };
    
    requestAnimationFrame(update);
  };

  const calculateTotal = () => {
    if (!calcService || !calcCount || !calcTotal) return;
    
    const servicePrice = parseInt(calcService.value, 10) || 0;
    const count = parseInt(calcCount.value, 10) || 1;
    const validCount = Math.max(1, Math.min(10, count));
    
    if (count !== validCount) {
      calcCount.value = validCount;
    }
    
    let optionsPrice = 0;
    calcOptions.forEach((option) => {
      if (option.checked) {
        optionsPrice += parseInt(option.value, 10) || 0;
      }
    });
    
    const total = (servicePrice * validCount) + optionsPrice;
    animateValue(calcTotal, total);
  };

  if (calcForm && calcService && calcCount && calcTotal) {
    calcService.addEventListener('change', calculateTotal);
    calcCount.addEventListener('input', calculateTotal);
    calcOptions.forEach((option) => {
      option.addEventListener('change', calculateTotal);
    });
    
    calcTotal.dataset.currentValue = parseInt(calcService.value, 10) || 0;
    calcTotal.textContent = (parseInt(calcService.value, 10) || 0).toLocaleString('ru-RU') + ' ₽';
  }

  /* ==========================================================================
     8. COOKIE BANNER
     ========================================================================== */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieDeclineBtn = document.getElementById('cookie-decline');

  const showCookieBanner = () => {
    if (cookieBanner) {
      cookieBanner.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
      cookieBanner.style.transform = 'translateY(0)';
      cookieBanner.style.opacity = '1';
      cookieBanner.classList.add('cookie-banner--visible');
    }
  };

  const hideCookieBanner = () => {
    if (cookieBanner) {
      cookieBanner.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
      cookieBanner.style.transform = 'translateY(150%)';
      cookieBanner.style.opacity = '0';
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 500);
    }
  };

  if (cookieBanner) {
    cookieBanner.style.transform = 'translateY(150%)';
    cookieBanner.style.opacity = '0';
    
    let cookieConsent = null;
    let localStorageAvailable = true;
    
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      cookieConsent = localStorage.getItem('cookie_consent');
    } catch (e) {
      localStorageAvailable = false;
    }

    if (!cookieConsent && localStorageAvailable) {
      setTimeout(showCookieBanner, 1500);
    } else {
      cookieBanner.style.display = 'none';
    }

    if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', () => {
        try {
          localStorage.setItem('cookie_consent', 'accepted');
        } catch (e) {
          // localStorage недоступен
        }
        hideCookieBanner();
      });
    }

    if (cookieDeclineBtn) {
      cookieDeclineBtn.addEventListener('click', () => {
        try {
          localStorage.setItem('cookie_consent', 'declined');
        } catch (e) {
          // localStorage недоступен
        }
        hideCookieBanner();
      });
    }
  }

  /* ==========================================================================
     9. ВАЛИДАЦИЯ ФОРМ
     ========================================================================== */
  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    if (form.id === 'calc-form') return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach((input) => {
        const group = input.closest('.form-group') || input.parentElement;
        const errorEl = group ? group.querySelector('.form-error') : null;
        
        if (group) {
          group.classList.remove('form-group--error');
        }
        if (errorEl) {
          errorEl.textContent = '';
        }

        if (!input.value.trim()) {
          isValid = false;
          if (group) {
            group.classList.add('form-group--error');
          }
          if (errorEl) {
            errorEl.textContent = 'Обязательное поле';
          }
          if (!firstInvalid) firstInvalid = input;
        } else if (input.type === 'text' || input.type === 'tel') {
          input.value = sanitizeInput(input.value);
        }
      });

      const statusEl = form.querySelector('.form-status');
      if (isValid) {
        if (statusEl) {
          statusEl.className = 'form-status form-status--success';
          statusEl.textContent = 'Заявка успешно отправлена!';
          statusEl.setAttribute('role', 'alert');
        }
        form.reset();
      } else {
        if (statusEl) {
          statusEl.className = 'form-status form-status--error';
          statusEl.textContent = 'Пожалуйста, заполните все обязательные поля.';
          statusEl.setAttribute('role', 'alert');
        }
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
    
    form.querySelectorAll('input, select, textarea').forEach((input) => {
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (group) {
          if (input.hasAttribute('required') && !input.value.trim()) {
            group.classList.add('form-group--error');
          } else {
            group.classList.remove('form-group--error');
          }
        }
      });
    });
  });

  /* ==========================================================================
     10. ХОВЕР-ЭФФЕКТЫ
     ========================================================================== */
  const cards = document.querySelectorAll('.service-card, .promo-card');
  
  cards.forEach((card) => {
    card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease';
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.08)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
    });
  });

  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach((btn) => {
    btn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease';
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
    });
  });

  /* ==========================================================================
     11. МОБИЛЬНЫЕ ФИКСЫ
     ========================================================================== */
  const applyMobileFixes = () => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      document.body.classList.add('mobile-view');
      
      const mapIframes = document.querySelectorAll('.map-wrap iframe');
      mapIframes.forEach((iframe) => {
        if (!iframe.dataset.originalHeight) {
          iframe.dataset.originalHeight = iframe.style.height || '380px';
        }
        iframe.style.height = '250px';
      });
      
      const inputs = document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea');
      inputs.forEach((input) => {
        input.style.fontSize = '16px';
        input.style.minHeight = '44px';
      });
      
    } else {
      document.body.classList.remove('mobile-view');
      
      const mapIframes = document.querySelectorAll('.map-wrap iframe');
      mapIframes.forEach((iframe) => {
        if (iframe.dataset.originalHeight) {
          iframe.style.height = iframe.dataset.originalHeight;
          delete iframe.dataset.originalHeight;
        }
      });
      
      const inputs = document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea');
      inputs.forEach((input) => {
        input.style.fontSize = '';
        input.style.minHeight = '';
      });
    }
  };

  applyMobileFixes();
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(applyMobileFixes, 250);
  });
}); 
