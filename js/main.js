/**
 * Crowdaxe Capital — Main JavaScript
 * Institutional-grade interactions and scroll animations
 */

(function () {
  'use strict';

  // ─── DOM Ready ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initChartAnimation();
    initCounterAnimation();
  }

  // ─── Navigation ──────────────────────────────────────────────
  function initNavigation() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        const isOpen = links.classList.contains('open');
        links.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      // Close on link click
      links.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', function () {
          links.classList.remove('open');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Active state on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
      const scrollY = window.pageYOffset + 100;
      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector('.nav__link[href="#' + id + '"]');
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            link.style.color = 'var(--text-primary)';
            link.style.fontWeight = '600';
          } else {
            link.style.color = '';
            link.style.fontWeight = '';
          }
        }
      });
    }, { passive: true });
  }

  // ─── Scroll Reveal ───────────────────────────────────────────
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    // Use IntersectionObserver for performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ─── Smooth Scroll ──────────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.getElementById('mainNav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ─── Chart Bar Animation ────────────────────────────────────
  function initChartAnimation() {
    const chartPlaceholder = document.querySelector('.dashboard__chart-placeholder');
    if (!chartPlaceholder) return;

    const bars = chartPlaceholder.querySelectorAll('.dashboard__chart-bar');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Animate bars
            bars.forEach(function (bar, index) {
              const originalHeight = bar.style.height;
              bar.style.height = '0%';
              bar.style.transition = 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ' + (index * 80) + 'ms';

              setTimeout(function () {
                bar.style.height = originalHeight;
              }, 100);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(chartPlaceholder);
    }
  }

  // ─── Counter Animation ──────────────────────────────────────
  function initCounterAnimation() {
    const metrics = document.querySelectorAll('.hero__metric-value');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();

            // Only animate numeric values
            if (/^\d+$/.test(text)) {
              const target = parseInt(text, 10);
              animateCounter(el, 0, target, 1200);
            }

            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      metrics.forEach(function (metric) {
        observer.observe(metric);
      });
    }
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Table Row Hover Accessibility ──────────────────────────
  const tableRows = document.querySelectorAll('.structures__table tbody tr');
  tableRows.forEach(function (row) {
    row.setAttribute('tabindex', '0');
    row.addEventListener('focus', function () {
      this.style.background = 'rgba(184, 150, 62, 0.05)';
    });
    row.addEventListener('blur', function () {
      this.style.background = '';
    });
  });

})();
