document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const MOBILE_BREAKPOINT = 768;

    const createElement = (tag, className = '', innerHTML = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    };

    const initMobileMenu = () => {
        const headerContainer = document.querySelector('.header-container');
        const mainNav = document.querySelector('.main-nav');
        const headerActions = document.querySelector('.header-actions');

        if (!headerContainer || !mainNav) return;

        const hamburger = createElement('button', 'mobile-toggle', `
            <span class="sr-only">Odpri meni</span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        `);
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Preklopi navigacijo');

        const navWrapper = createElement('div', 'mobile-nav-wrapper');
        navWrapper.appendChild(mainNav.cloneNode(true));
        if (headerActions) {
            navWrapper.appendChild(headerActions.cloneNode(true));
        }

        document.body.appendChild(navWrapper);
        headerContainer.appendChild(hamburger);

        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !hamburger.classList.contains('active');
            hamburger.classList.toggle('active', isOpen);
            navWrapper.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen.toString());
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        hamburger.addEventListener('click', () => toggleMenu());

        navWrapper.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('button')) {
                toggleMenu(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                toggleMenu(false);
            }
        });
    };

    const initCategoryFilter = () => {
        const filterContainer = document.querySelector('.category-filters') || document.querySelector('[data-filter-container]');
        const items = document.querySelectorAll('.service-item, [data-category]');

        if (!filterContainer || items.length === 0) return;

        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-filter], .filter-btn');
            if (!btn) return;

            const filterValue = btn.getAttribute('data-filter') || btn.textContent.trim().toLowerCase();

            filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || filterValue === 'vse' || category === filterValue;

                if (shouldShow) {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    };

    const initModals = () => {
        const openTriggers = document.querySelectorAll('[data-modal-target]');
        const modals = document.querySelectorAll('.modal, [id$="-modal"]');

        const closeModal = (modal) => {
            if (!modal) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const openModal = (modalId) => {
            const modal = document.getElementById(modalId) || document.querySelector(`.${modalId}`) || document.querySelector(`[id="${modalId}"]`);
            if (!modal) return;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            const firstInput = modal.querySelector('input, button, textarea');
            if (firstInput) firstInput.focus();
        };

        openTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-modal-target');
                openModal(targetId);
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('[data-modal-close]') || e.target.classList.contains('modal-close')) {
                    closeModal(modal);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => closeModal(modal));
            }
        });

        const tabContainers = document.querySelectorAll('.modal-tabs, [data-tabs]');
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('button, [data-tab-target]');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetSelector = tab.getAttribute('data-tab-target') || tab.getAttribute('href');
                    const modalContent = tab.closest('.modal, body');
                    
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    if (targetSelector) {
                        const targetContents = modalContent.querySelectorAll('.tab-content, [data-tab-content]');
                        targetContents.forEach(content => {
                            const isMatch = content.id === targetSelector.replace('#', '') || content.getAttribute('data-tab-content') === targetSelector;
                            content.style.display = isMatch ? 'block' : 'none';
                        });
                    }
                });
            });
        });
    };

    const initToast = () => {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const closeBtn = toast.querySelector('.toast-close');
        const textSpan = toast.querySelector('.toast-text');
        let timeoutId;

        const showToast = (message, duration = 4000) => {
            if (textSpan && message) textSpan.textContent = message;
            toast.classList.add('active');
            toast.setAttribute('aria-hidden', 'false');

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                hideToast();
            }, duration);
        };

        const hideToast = () => {
            toast.classList.remove('active');
            toast.setAttribute('aria-hidden', 'true');
            clearTimeout(timeoutId);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', hideToast);
        }

        window.showAppToast = showToast;
    };

    const initForms = () => {
        const forms = document.querySelectorAll('form, .booking-form, .contact-form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.dataset.originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Pošiljanje...';
                }

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = submitBtn.dataset.originalText || 'Oddaj';
                    }

                    form.reset();

                    const modal = form.closest('.modal, [id$="-modal"]');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }

                    if (typeof window.showAppToast === 'function') {
                        window.showAppToast('Uspešno oddano!', 4000);
                    }
                }, 800);
            });
        });
    };

    const initAccordion = () => {
        const accordions = document.querySelectorAll('.faq-item, .accordion-item, [data-accordion]');

        accordions.forEach(item => {
            const trigger = item.querySelector('.faq-question, .accordion-trigger, h3, header');
            const content = item.querySelector('.faq-answer, .accordion-content');

            if (!trigger || !content) return;

            if (!content.style.maxHeight) {
                content.style.maxHeight = '0px';
                content.style.overflow = 'hidden';
                content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
            }

            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                accordions.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.faq-answer, .accordion-content');
                        if (otherContent) otherContent.style.maxHeight = '0px';
                    }
                });

                item.classList.toggle('active', !isActive);
                if (!isActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0px';
                }
            });
        });
    };

    initMobileMenu();
    initCategoryFilter();
    initModals();
    initToast();
    initForms();
    initAccordion();
});