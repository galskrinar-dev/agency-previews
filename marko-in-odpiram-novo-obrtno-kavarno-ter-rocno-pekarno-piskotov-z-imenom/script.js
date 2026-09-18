document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const SELECTORS = {
        toast: '#toast',
        toastClose: '.toast-close',
        navLinks: '.nav-links',
        navActions: '.nav-actions',
        filterBtn: '.filter-btn',
        offerItem: '.offer-item',
        modal: '.modal',
        modalOpenBtn: '[data-modal-target]',
        modalCloseBtn: '[data-modal-close]',
        tabBtn: '.tab-btn',
        tabContent: '.tab-content',
        form: '.ajax-form',
        faqItem: '.faq-item',
        faqQuestion: '.faq-question'
    };

    const CLASSES = {
        active: 'active',
        open: 'open',
        hidden: 'hidden'
    };

    const initToast = () => {
        const toast = document.querySelector(SELECTORS.toast);
        if (!toast) return;

        const closeBtn = toast.querySelector(SELECTORS.toastClose);
        
        const showToast = (message, title = '') => {
            const strongEl = toast.querySelector('strong');
            const pEl = toast.querySelector('p');
            if (strongEl && title) strongEl.textContent = title;
            if (pEl && message) pEl.textContent = message;
            
            toast.classList.add(CLASSES.active);
            
            setTimeout(() => {
                hideToast();
            }, 4000);
        };

        const hideToast = () => {
            toast.classList.remove(CLASSES.active);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', hideToast);
        }

        window.showAppToast = showToast;
    };

    const initMobileMenu = () => {
        const header = document.querySelector('.site-header');
        const navContainer = document.querySelector('.nav-container');
        if (!header || !navContainer) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Preklopi meni');
        toggleBtn.innerHTML = `
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        `;
        
        navContainer.insertBefore(toggleBtn, navContainer.querySelector('.nav-actions'));

        const navLinks = document.querySelector(SELECTORS.navLinks);
        const navActions = document.querySelector(SELECTORS.navActions);

        toggleBtn.addEventListener('click', () => {
            toggleBtn.classList.toggle(CLASSES.active);
            if (navLinks) navLinks.classList.toggle(CLASSES.open);
            if (navActions) navActions.classList.toggle(CLASSES.open);
        });

        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                toggleBtn.classList.remove(CLASSES.active);
                if (navLinks) navLinks.classList.remove(CLASSES.open);
                if (navActions) navActions.classList.remove(CLASSES.open);
            });
        });
    };

    const initCategoryFilter = () => {
        const filterBtns = document.querySelectorAll(SELECTORS.filterBtn);
        const offerItems = document.querySelectorAll(SELECTORS.offerItem);

        if (!filterBtns.length || !offerItems.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove(CLASSES.active));
                btn.classList.add(CLASSES.active);

                const filterValue = btn.getAttribute('data-filter');

                offerItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        if (filterValue === 'all' || category === filterValue) {
                            item.style.display = '';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.display = 'none';
                        }
                    }, 200);
                });
            });
        });

        offerItems.forEach(item => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    };

    const initModals = () => {
        const openBtns = document.querySelectorAll(SELECTORS.modalOpenBtn);
        const modals = document.querySelectorAll(SELECTORS.modal);

        if (!modals.length) return;

        const openModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add(CLASSES.active);
                document.body.style.overflow = 'hidden';
            }
        };

        const closeModal = (modal) => {
            modal.classList.remove(CLASSES.active);
            document.body.style.overflow = '';
        };

        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-modal-target');
                if (targetId) openModal(targetId);
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.matches(SELECTORS.modalCloseBtn) || e.target.closest(SELECTORS.modalCloseBtn)) {
                    closeModal(modal);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains(CLASSES.active)) {
                        closeModal(modal);
                    }
                });
            }
        });

        const tabBtns = document.querySelectorAll(SELECTORS.tabBtn);
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest(SELECTORS.modal);
                if (!modal) return;

                const targetTab = btn.getAttribute('data-tab');

                modal.querySelectorAll(SELECTORS.tabBtn).forEach(b => b.classList.remove(CLASSES.active));
                modal.querySelectorAll(SELECTORS.tabContent).forEach(c => c.classList.remove(CLASSES.active));

                btn.classList.add(CLASSES.active);
                const content = modal.querySelector(`#${targetTab}`);
                if (content) content.classList.add(CLASSES.active);
            });
        });
    };

    const initForms = () => {
        const forms = document.querySelectorAll(SELECTORS.form);

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const modal = form.closest(SELECTORS.modal);
                if (modal) {
                    modal.classList.remove(CLASSES.active);
                    document.body.style.overflow = '';
                }

                if (typeof window.showAppToast === 'function') {
                    window.showAppToast('Vaše naročilo/rezervacija je bila uspešno oddana!', 'Uspešno oddano!');
                }

                form.reset();
            });
        });
    };

    const initFaq = () => {
        const faqItems = document.querySelectorAll(SELECTORS.faqItem);

        faqItems.forEach(item => {
            const question = item.querySelector(SELECTORS.faqQuestion);
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains(CLASSES.active);

                faqItems.forEach(i => i.classList.remove(CLASSES.active));

                if (!isActive) {
                    item.classList.add(CLASSES.active);
                }
            });
        });
    };

    initToast();
    initMobileMenu();
    initCategoryFilter();
    initModals();
    initForms();
    initFaq();
});