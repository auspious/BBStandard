/**
 * Crowdaxe Capital — Main JavaScript
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initDropdowns();
        initTabs();
        initScrollReveal();
        initSmoothScroll();
        initActiveNavLink();
    }

    // ─── Navigation scroll + mobile toggle ───────────────────────
    function initNavigation() {
        const nav = document.getElementById('mainNav');
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');

        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.pageYOffset > 40);
        }, { passive: true });

        if (toggle && links) {
            toggle.addEventListener('click', function () {
                const isOpen = links.classList.contains('open');
                links.classList.toggle('open');
                toggle.classList.toggle('active');
                toggle.setAttribute('aria-expanded', String(!isOpen));
                document.body.style.overflow = isOpen ? '' : 'hidden';
            });

            // Close menu on plain (non-dropdown parent) link click
            links.querySelectorAll('.nav__dropdown-link, .nav__mobile-cta').forEach(function (link) {
                link.addEventListener('click', function () { closeMobileMenu(links, toggle); });
            });
            links.querySelectorAll('.nav__item:not(.nav__item--dropdown) > .nav__link').forEach(function (link) {
                link.addEventListener('click', function () { closeMobileMenu(links, toggle); });
            });
        }
    }

    function closeMobileMenu(links, toggle) {
        links.classList.remove('open');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
        document.querySelectorAll('.nav__item--dropdown').forEach(function (d) {
            d.classList.remove('mobile-open');
            d.classList.remove('open');
            var tb = d.querySelector('.nav__dropdown-toggle');
            if (tb) tb.setAttribute('aria-expanded', 'false');
        });
    }

    // ─── Dropdown nav (keyboard-accessible + mobile click + desktop hover) ───
    function initDropdowns() {
        document.querySelectorAll('.nav__item--dropdown').forEach(function (item) {
            var triggerBtn = item.querySelector('.nav__dropdown-toggle');
            var dropdown = item.querySelector('.nav__dropdown');
            if (!triggerBtn || !dropdown) return;

            triggerBtn.setAttribute('aria-haspopup', 'true');
            triggerBtn.setAttribute('aria-expanded', 'false');

            function openDropdown() {
                item.classList.add('open');
                triggerBtn.setAttribute('aria-expanded', 'true');
            }

            function closeDropdown() {
                item.classList.remove('open');
                item.classList.remove('mobile-open');
                triggerBtn.setAttribute('aria-expanded', 'false');
            }

            function toggleDropdown() {
                if (item.classList.contains('open') || item.classList.contains('mobile-open')) {
                    closeDropdown();
                } else {
                    document.querySelectorAll('.nav__item--dropdown').forEach(function (d) {
                        d.classList.remove('open');
                        d.classList.remove('mobile-open');
                        var tb = d.querySelector('.nav__dropdown-toggle');
                        if (tb) tb.setAttribute('aria-expanded', 'false');
                    });
                    openDropdown();
                }
            }

            // Desktop: hover syncs ARIA
            item.addEventListener('mouseenter', function () {
                if (window.innerWidth > 768) openDropdown();
            });
            item.addEventListener('mouseleave', function () {
                if (window.innerWidth > 768) closeDropdown();
            });

            // Toggle button click (mobile + keyboard)
            triggerBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
            });

            // Keyboard on toggle button
            triggerBtn.addEventListener('keydown', function (e) {
                var links = Array.from(dropdown.querySelectorAll('.nav__dropdown-link'));
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown();
                    if ((item.classList.contains('open') || item.classList.contains('mobile-open')) && links.length) {
                        setTimeout(function () { links[0].focus(); }, 50);
                    }
                } else if (e.key === 'Escape') {
                    closeDropdown();
                    triggerBtn.focus();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    openDropdown();
                    if (links.length) setTimeout(function () { links[0].focus(); }, 50);
                }
            });

            // Keyboard inside dropdown list
            dropdown.addEventListener('keydown', function (e) {
                var links = Array.from(dropdown.querySelectorAll('.nav__dropdown-link'));
                var idx = links.indexOf(document.activeElement);
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeDropdown();
                    triggerBtn.focus();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (idx < links.length - 1) links[idx + 1].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (idx > 0) links[idx - 1].focus();
                    else { closeDropdown(); triggerBtn.focus(); }
                } else if (e.key === 'Tab') {
                    closeDropdown();
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav__item--dropdown')) {
                document.querySelectorAll('.nav__item--dropdown').forEach(function (d) {
                    d.classList.remove('open');
                    d.classList.remove('mobile-open');
                    var tb = d.querySelector('.nav__dropdown-toggle');
                    if (tb) tb.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    // ─── Tabs ─────────────────────────────────────────────────────
    function initTabs() {
        document.querySelectorAll('[data-tabs]').forEach(function (group) {
            const buttons = group.querySelectorAll('.tab__btn');
            const panels = group.querySelectorAll('.tab__panel');

            buttons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const target = this.dataset.tab;
                    buttons.forEach(function (b) { b.classList.remove('active'); });
                    panels.forEach(function (p) { p.classList.remove('active'); });
                    this.classList.add('active');
                    const panel = group.querySelector('#' + target);
                    if (panel) panel.classList.add('active');
                });
            });
        });

        // Hash-based tab activation (e.g. platform.html#debt)
        var hash = window.location.hash;
        if (hash) {
            var panel = document.querySelector(hash + '.tab__panel');
            if (panel) {
                var group = panel.closest('[data-tabs]');
                if (group) {
                    group.querySelectorAll('.tab__btn').forEach(function (b) { b.classList.remove('active'); });
                    group.querySelectorAll('.tab__panel').forEach(function (p) { p.classList.remove('active'); });
                    var id = hash.substring(1);
                    var btn = group.querySelector('[data-tab="' + id + '"]');
                    if (btn) btn.classList.add('active');
                    panel.classList.add('active');
                    setTimeout(function () {
                        var nav = document.getElementById('mainNav');
                        var offset = nav ? nav.offsetHeight + 16 : 80;
                        var top = panel.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }, 150);
                }
            }
        }
    }

    // ─── Scroll Reveal ───────────────────────────────────────────
    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
            reveals.forEach(function (el) { observer.observe(el); });
        } else {
            reveals.forEach(function (el) { el.classList.add('visible'); });
        }
    }

    // ─── Smooth Scroll ──────────────────────────────────────────
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (!target) return;
                e.preventDefault();
                var nav = document.getElementById('mainNav');
                var offset = nav ? nav.offsetHeight + 16 : 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    // ─── Highlight active page in nav ───────────────────────────
    function initActiveNavLink() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav__link, .nav__dropdown-link').forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var page = href.split('#')[0].split('/').pop();
            if (page && page === currentPage) {
                link.classList.add('active');
                var parentItem = link.closest('.nav__item--dropdown');
                if (parentItem) {
                    var parentLink = parentItem.querySelector(':scope > .nav__link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        });
    }

})();
