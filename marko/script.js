document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Offer Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const offerItems = document.querySelectorAll('.offer-item');

    if (filterButtons.length > 0 && offerItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active classes from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-cyan-500', 'text-black');
                    btn.classList.add('bg-[#111827]', 'text-gray-300');
                });

                // Add active classes to clicked button
                button.classList.add('active', 'bg-cyan-500', 'text-black');
                button.classList.remove('bg-[#111827]', 'text-gray-300');

                const filterValue = button.getAttribute('data-filter');

                offerItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    // Smooth transition reset
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        if (filterValue === 'all' || category === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
    }

    // 3. Modal for Order / Reservation & Tabs Switching
    const modal = document.getElementById('order-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const tabButtons = document.querySelectorAll('.modal-tab-btn');
    const tabContents = document.querySelectorAll('.modal-tab-content');

    const toggleModal = (show) => {
        if (!modal) return;
        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.remove('opacity-0');
            }, 10);
        } else {
            modal.classList.add('opacity-0');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(true);
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleModal(false);
        });
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                toggleModal(false);
            }
        });
    }

    // Modal Tabs
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('border-cyan-500', 'text-cyan-400'));
                button.classList.add('border-cyan-500', 'text-cyan-400');

                tabContents.forEach(content => {
                    if (content.getAttribute('id') === targetTab) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }

    // 4. Form Submission & Toast Notification
    const orderForm = document.getElementById('order-form');
    const toast = document.getElementById('toast');

    const showToast = (message = 'Uspešno oddano!') => {
        if (!toast) return;

        // Update toast message if needed
        const messageEl = toast.querySelector('.toast-message');
        if (messageEl) {
            messageEl.textContent = message;
        }

        toast.classList.remove('translate-y-24', 'opacity-0');

        setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 4000);
    };

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you could add AJAX/Fetch submission logic
            
            toggleModal(false);
            showToast('Uspešno oddano!');
            orderForm.reset();
        });
    }

    // 5. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');
                const isOpen = !answer.classList.contains('hidden');

                // Close all other FAQs (optional, comment out if multiple should stay open)
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.nextElementSibling.classList.add('hidden');
                        const otherIcon = q.querySelector('.faq-icon');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                        q.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    answer.classList.add('hidden');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    answer.classList.remove('hidden');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
});