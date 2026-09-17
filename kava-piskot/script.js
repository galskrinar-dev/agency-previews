document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    class KavaPiskotApp {
        constructor() {
            this.initFilter();
            this.initModal();
            this.initForms();
            this.initAccordion();
            this.initMobileMenu();
        }

        initFilter() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const items = document.querySelectorAll('.bento-item');

            if (!filterButtons.length || !items.length) return;

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const category = button.dataset.category;

                    items.forEach(item => {
                        const itemCategory = item.dataset.category;
                        
                        if (category === 'vse' || itemCategory === category) {
                            item.style.display = 'block';
                            requestAnimationFrame(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            });
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }

        initModal() {
            const modal = document.querySelector('#reservation-modal');
            const openTriggers = document.querySelectorAll('[data-open-modal]');
            const closeTriggers = document.querySelectorAll('[data-close-modal]');
            const tabButtons = document.querySelectorAll('.modal-tab-btn');
            const forms = document.querySelectorAll('.modal-form');

            if (!modal) return;

            const toggleModal = (isOpen) => {
                if (isOpen) {
                    modal.classList.add('is-open');
                    document.body.style.overflow = 'hidden';
                } else {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            };

            openTriggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetForm = trigger.dataset.modalTarget || 'reservation';
                    this.switchModalTab(targetForm, tabButtons, forms);
                    toggleModal(true);
                });
            });

            closeTriggers.forEach(trigger => {
                trigger.addEventListener('click', () => toggleModal(false));
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) toggleModal(false);
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                    toggleModal(false);
                }
            });

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetForm = button.dataset.tab;
                    this.switchModalTab(targetForm, tabButtons, forms);
                });
            });
        }

        switchModalTab(targetName, tabButtons, forms) {
            tabButtons.forEach(btn => {
                if (btn.dataset.tab === targetName) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            forms.forEach(form => {
                if (form.dataset.formName === targetName) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        }

        initForms() {
            const forms = document.querySelectorAll('form');

            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const modal = document.querySelector('#reservation-modal');
                    if (modal && modal.classList.contains('is-open')) {
                        modal.classList.remove('is-open');
                        document.body.style.overflow = '';
                    }

                    form.reset();
                    this.showToast('Uspešno oddano!');
                });
            });
        }

        showToast(message) {
            const existingToast = document.querySelector('.kp-toast');
            if (existingToast) existingToast.remove();

            const toast = document.createElement('div');
            toast.className = 'kp-toast';
            toast.textContent = message;
            
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#2c1810',
                color: '#fdfbf7',
                padding: '16px 24px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: '9999',
                opacity: '0',
                transform: 'translateY(20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                fontFamily: 'inherit',
                fontSize: '1rem',
                fontWeight: '500'
            });

            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 4000);
        }

        initAccordion() {
            const accordionItems = document.querySelectorAll('.faq-item');

            if (!accordionItems.length) return;

            accordionItems.forEach(item => {
                const header = item.querySelector('.faq-header');
                const content = item.querySelector('.faq-content');

                if (!header || !content) return;

                content.style.maxHeight = '0px';
                content.style.overflow = 'hidden';
                content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

                header.addEventListener('click', () => {
                    const isOpen = item.classList.contains('is-open');

                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('is-open')) {
                            otherItem.classList.remove('is-open');
                            const otherContent = otherItem.querySelector('.faq-content');
                            if (otherContent) otherContent.style.maxHeight = '0px';
                        }
                    });

                    if (isOpen) {
                        item.classList.remove('is-open');
                        content.style.maxHeight = '0px';
                    } else {
                        item.classList.add('is-open');
                        content.style.maxHeight = `${content.scrollHeight}px`;
                    }
                });
            });
        }

        initMobileMenu() {
            const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
            const mobileDrawer = document.querySelector('[data-mobile-drawer]');
            const drawerClose = document.querySelector('[data-drawer-close]');
            const drawerLinks = document.querySelectorAll('[data-drawer-link]');

            if (!menuToggle || !mobileDrawer) return;

            const toggleDrawer = (isOpen) => {
                if (isOpen) {
                    mobileDrawer.classList.add('is-open');
                    document.body.style.overflow = 'hidden';
                } else {
                    mobileDrawer.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            };

            menuToggle.addEventListener('click', () => toggleDrawer(true));
            
            if (drawerClose) {
                drawerClose.addEventListener('click', () => toggleDrawer(false));
            }

            drawerLinks.forEach(link => {
                link.addEventListener('click', () => toggleDrawer(false));
            });

            mobileDrawer.addEventListener('click', (e) => {
                if (e.target === mobileDrawer) toggleDrawer(false);
            });
        }
    }

    new KavaPiskotApp();
});