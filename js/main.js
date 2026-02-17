/**
 * Crowdaxe Capital — Main JavaScript
 * Institutional-grade interactions and scroll management
 */

(function () {
    'use strict';

    // ─── DOM Ready ───────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initScrollReveal();
        initSmoothScroll();
    }

    // ─── Navigation ──────────────────────────────────────────────
    function initNavigation() {
        const nav = document.getElementById('mainNav');
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');

        // Scroll effect — subtle shadow on scroll
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
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

            // Close on link click (including mobile CTA)
            links.querySelectorAll('.nav__link, .nav__mobile-cta').forEach(function (link) {
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
            const scrollY = window.pageYOffset + 80;
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

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -30px 0px'
            });

            reveals.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show all immediately
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

})();
