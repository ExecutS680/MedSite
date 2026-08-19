document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. МОБИЛЬНОЕ МЕНЮ (Drawer & Burger)
     ========================================================================== */
  const burgerBtn = document.querySelector('.burger-btn');
  const drawer = document.querySelector('.drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer__close');
  const drawerLinks = document.querySelectorAll('.drawer__link');
  
  // Начальное состояние drawer
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

  function openDrawer() {
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
  }

  function closeDrawer() {
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
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = drawer && drawer.classList.contains('drawer--active');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('drawer--active')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     2. ПЛАВНЫЙ СКРОЛЛ (ЕДИНЫЙ ОБРАБОТЧИК)
     ========================================================================== */
  function smoothScrollTo(targetElement) {
    if (!targetElement) return;
    
    // Закрываем мобильное меню если открыто
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
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing easeInOutCubic
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }

  // ЕДИНЫЙ обработчик для всех якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
     3. ПЛАВНЫЙ АККОРДЕОН (FAQ)
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const body = item.querySelector('.accordion__body');
    
    if (header && body) {
      // Начальное состояние
      body.removeAttribute('hidden');
      body.style.maxHeight = '0';
      body.style.opacity = '0';
      body.style.overflow = 'hidden';
      body.style.padding = '0 20px';
      body.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('accordion__item--active');
        
        // Закрываем все с анимацией
        accordionItems.forEach(i => {
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
        
        // Открываем текущий
        if (!isActive) {
          item.classList.add('accordion__item--active');
          header.setAttribute('aria-expanded', 'true');
          
          // Пересчитываем высоту
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
     4. ПЛАВНАЯ АНИМАЦИЯ ПЕРЕСЧЕТА ЦИФР
     ========================================================================== */
  function animateNumber(el) {
    if (!el || el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutExpo(progress);
      const currentVal = Math.floor(target * easeProgress);

      el.textContent = `${prefix}${currentVal.toLocaleString('ru-RU')}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toLocaleString('ru-RU')}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  // Запускаем анимацию чисел
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    setTimeout(() => animateNumber(counter), 500);
  });

  /* ==========================================================================
     5. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ
     ========================================================================== */
  const fadeElements = document.querySelectorAll('.fade-in, .reveal-on-scroll');
  
  fadeElements.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  /* ==========================================================================
     6. ПАРАЛЛАКС ЭФФЕКТ (С ПРОВЕРКОЙ REDUCED MOTION)
     ========================================================================== */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');

  if (parallaxLayers.length > 0 && !prefersReducedMotion) {
    let ticking = false;
    let currentY = window.pageYOffset;

    function updateParallax() {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      
      // Плавное сглаживание
      currentY += (scrolled - currentY) * 0.1;
      
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.15;
        const yPos = -(currentY * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      ticking = false;
    }

    function requestParallax() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
    
    // Начальная позиция
    updateParallax();
  }

  /* ==========================================================================
     7. КАЛЬКУЛЯТОР СТОИМОСТИ
     ========================================================================== */
  const calcForm = document.getElementById('calc-form');
  const calcService = document.getElementById('calc-service');
  const calcCount = document.getElementById('calc-count');
  const calcOptions = document.querySelectorAll('.calc-option');
  const calcTotal = document.getElementById('calc-total');

  function calculateTotal() {
    if (!calcService || !calcCount || !calcTotal) return;
    
    const servicePrice = parseInt(calcService.value) || 0;
    const count = parseInt(calcCount.value) || 1;
    const validCount = Math.max(1, Math.min(10, count));
    
    if (count !== validCount) {
      calcCount.value = validCount;
    }
    
    let optionsPrice = 0;
    calcOptions.forEach(option => {
      if (option.checked) {
        optionsPrice += parseInt(option.value) || 0;
      }
    });
    
    const total = (servicePrice * validCount) + optionsPrice;
    animateValue(calcTotal, total);
  }

  function animateValue(element, targetValue) {
    const startValue = parseInt(element.dataset.currentValue) || 0;
    const duration = 500;
    const startTime = performance.now();
    
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    
    function update(currentTime) {
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
    }
    
    requestAnimationFrame(update);
  }

  if (calcForm && calcService && calcCount && calcTotal) {
    calcService.addEventListener('change', calculateTotal);
    calcCount.addEventListener('input', calculateTotal);
    calcOptions.forEach(option => {
      option.addEventListener('change', calculateTotal);
    });
    
    // Начальное значение
    calcTotal.dataset.currentValue = parseInt(calcService.value) || 0;
    calcTotal.textContent = (parseInt(calcService.value) || 0).toLocaleString('ru-RU') + ' ₽';
  }

  /* ==========================================================================
     8. COOKIE BANNER (С ПРАВИЛЬНОЙ АНИМАЦИЕЙ)
     ========================================================================== */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieDeclineBtn = document.getElementById('cookie-decline');

  function showCookieBanner() {
    if (cookieBanner) {
      cookieBanner.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
      cookieBanner.style.transform = 'translateY(0)';
      cookieBanner.style.opacity = '1';
      cookieBanner.classList.add('cookie-banner--visible');
    }
  }

  function hideCookieBanner() {
    if (cookieBanner) {
      cookieBanner.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
      cookieBanner.style.transform = 'translateY(150%)';
      cookieBanner.style.opacity = '0';
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 500);
    }
  }

  if (cookieBanner) {
    // Начальное состояние
    cookieBanner.style.transform = 'translateY(150%)';
    cookieBanner.style.opacity = '0';
    
    let cookieConsent = null;
    try {
      cookieConsent = localStorage.getItem('cookie_consent');
    } catch (e) {
      console.warn('localStorage недоступен');
    }

    if (!cookieConsent) {
      setTimeout(showCookieBanner, 1500);
    } else {
      cookieBanner.style.display = 'none';
    }

    if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', () => {
        try {
          localStorage.setItem('cookie_consent', 'accepted');
        } catch (e) {
          console.warn('localStorage недоступен');
        }
        hideCookieBanner();
      });
    }

    if (cookieDeclineBtn) {
      cookieDeclineBtn.addEventListener('click', () => {
        try {
          localStorage.setItem('cookie_consent', 'declined');
        } catch (e) {
          console.warn('localStorage недоступен');
        }
        hideCookieBanner();
      });
    }
  }

  /* ==========================================================================
     9. ВАЛИДАЦИЯ ФОРМ (С ЗАЩИТОЙ ОТ XSS)
     ========================================================================== */
  const forms = document.querySelectorAll('form');

  function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
  }

  forms.forEach(form => {
    if (form.id === 'calc-form') return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const group = input.closest('.form-group') || input.parentElement;
        const errorEl = group?.querySelector('.form-error');
        
        group?.classList.remove('form-group--error');
        if (errorEl) errorEl.textContent = '';

        if (!input.value.trim()) {
          isValid = false;
          group?.classList.add('form-group--error');
          if (errorEl) errorEl.textContent = 'Обязательное поле';
          if (!firstInvalid) firstInvalid = input;
        } else if (input.type === 'text' || input.type === 'tel') {
          // Санитизация ввода
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
        firstInvalid?.focus();
      }
    });
    
    // Живая валидация
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (input.hasAttribute('required') && !input.value.trim()) {
          group?.classList.add('form-group--error');
        } else {
          group?.classList.remove('form-group--error');
        }
      });
    });
  });

  /* ==========================================================================
     10. ПЛАВНЫЕ ХОВЕР-ЭФФЕКТЫ (ТОЛЬКО ДЛЯ РАЗРЕШЕННЫХ СЕКЦИЙ)
     ========================================================================== */
  // Карточки (кроме забронированных секций)
  const cards = document.querySelectorAll('.service-card, .promo-card');
  
  cards.forEach(card => {
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

  // Кнопки
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    btn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease';
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
    });
  });
    /* ==========================================================================
     11. ХОВЕР-ЭФФЕКТЫ ДЛЯ БЛОГА
     ========================================================================== */
  // Карточки блога
  const blogCards = document.querySelectorAll('.blog-card, .post-card, .article-card');
  
  blogCards.forEach(card => {
    // Базовая настройка
    card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease';
    card.style.cursor = 'pointer';
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    
    // Ховер эффекты
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
      card.style.borderColor = 'var(--color-accent)';
      
      // Затемнение изображения если есть
      const img = card.querySelector('img, .img-placeholder');
      if (img) {
        img.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        img.style.transform = 'scale(1.05)';
      }
      
      // Появление стрелки или иконки если есть
      const icon = card.querySelector('.blog-card__icon, .post-card__icon, .article-card__icon');
      if (icon) {
        icon.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        icon.style.transform = 'translateX(5px)';
        icon.style.opacity = '1';
      }
      
      // Подчеркивание заголовка
      const title = card.querySelector('h3, h4, .blog-card__title, .post-card__title, .article-card__title');
      if (title) {
        title.style.transition = 'color 0.3s ease';
        title.style.color = 'var(--color-primary)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
      card.style.borderColor = 'var(--color-border)';
      
      // Возврат изображения
      const img = card.querySelector('img, .img-placeholder');
      if (img) {
        img.style.transform = 'scale(1)';
      }
      
      // Возврат иконки
      const icon = card.querySelector('.blog-card__icon, .post-card__icon, .article-card__icon');
      if (icon) {
        icon.style.transform = 'translateX(0)';
        icon.style.opacity = '0.7';
      }
      
      // Возврат заголовка
      const title = card.querySelector('h3, h4, .blog-card__title, .post-card__title, .article-card__title');
      if (title) {
        title.style.color = 'var(--color-text)';
      }
    });
  });

  // Кнопки "Читать далее" в блоге
  const readMoreLinks = document.querySelectorAll('.blog-card__link, .post-card__link, .article-card__link, .read-more');
  
  readMoreLinks.forEach(link => {
    link.style.transition = 'color 0.3s ease, padding-right 0.3s ease';
    
    link.addEventListener('mouseenter', () => {
      link.style.color = 'var(--color-accent)';
      link.style.paddingRight = '10px';
      
      // Если есть стрелка
      const arrow = link.querySelector('.arrow, .icon');
      if (arrow) {
        arrow.style.transition = 'transform 0.3s ease';
        arrow.style.transform = 'translateX(3px)';
      }
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.color = 'var(--color-primary)';
      link.style.paddingRight = '0';
      
      const arrow = link.querySelector('.arrow, .icon');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
      }
    });
  });

  // Теги и категории в блоге
  const blogTags = document.querySelectorAll('.blog-tag, .post-tag, .article-tag, .category-tag');
  
  blogTags.forEach(tag => {
    tag.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease';
    
    tag.addEventListener('mouseenter', () => {
      tag.style.backgroundColor = 'var(--color-accent)';
      tag.style.color = '#FFF';
      tag.style.transform = 'translateY(-2px)';
    });
    
    tag.addEventListener('mouseleave', () => {
      tag.style.backgroundColor = '#F0EADF';
      tag.style.color = 'var(--color-primary-hover)';
      tag.style.transform = 'translateY(0)';
    });
  });

  // Дата и мета-информация
  const blogMeta = document.querySelectorAll('.blog-date, .post-date, .article-date, .blog-meta');
  
  blogMeta.forEach(meta => {
    meta.style.transition = 'color 0.3s ease';
    
    meta.addEventListener('mouseenter', () => {
      meta.style.color = 'var(--color-accent)';
    });
    
    meta.addEventListener('mouseleave', () => {
      meta.style.color = 'var(--color-text-muted)';
    });
  });

  // Пагинация в блоге
  const paginationLinks = document.querySelectorAll('.pagination__link, .pagination a');
  
  paginationLinks.forEach(link => {
    link.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease';
    
    link.addEventListener('mouseenter', () => {
      if (!link.classList.contains('pagination__link--active')) {
        link.style.backgroundColor = 'var(--color-primary)';
        link.style.color = '#FFF';
        link.style.transform = 'translateY(-2px)';
      }
    });
    
    link.addEventListener('mouseleave', () => {
      if (!link.classList.contains('pagination__link--active')) {
        link.style.backgroundColor = 'transparent';
        link.style.color = 'var(--color-text)';
        link.style.transform = 'translateY(0)';
      }
    });
  });

  // Секция комментариев
  const commentCards = document.querySelectorAll('.comment-card, .comment');
  
  commentCards.forEach(comment => {
    comment.style.transition = 'background-color 0.3s ease, transform 0.3s ease';
    
    comment.addEventListener('mouseenter', () => {
      comment.style.backgroundColor = '#F9F8F6';
      comment.style.transform = 'translateX(5px)';
    });
    
    comment.addEventListener('mouseleave', () => {
      comment.style.backgroundColor = '#FFF';
      comment.style.transform = 'translateX(0)';
    });
  });

  
});