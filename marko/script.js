document.addEventListener('DOMContentLoaded', () => {
    // 5. Mobilni meni toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });

        // Zapri meni ob kliku na povezave v njem
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 1. Filtriranje kategorij ponudbe s preklapljanjem aktivnega gumba in gladkim prikazom
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceItems = document.querySelectorAll('.service-item');

    if (filterButtons.length > 0 && serviceItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Odstrani aktiven razred z vseh gumbov in ga dodaj trenutnemu
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-[#d4af37]', 'text-black');
                    btn.classList.add('bg-[#141418]', 'text-zinc-400');
                });
                button.classList.remove('bg-[#141418]', 'text-zinc-400');
                button.classList.add('active', 'bg-[#d4af37]', 'text-black');

                const filterValue = button.getAttribute('data-filter');

                serviceItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    // Gladka tranzicija skrivanja/prikazovanja
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
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

    // 2. Modal za naročilo / rezervacijo: odpiranje na klik gumba, zapiranje, preklapljanje zavihkov
    const modal = document.getElementById('booking-modal') || document.getElementById('modal');
    const openModalButtons = document.querySelectorAll('.open-modal, [data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-modal, [data-modal-close]');
    const tabButtons = document.querySelectorAll('.modal-tab');
    const tabContents = document.querySelectorAll('.modal-tab-content');

    if (modal) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0', 'pointer-events-none');
                }, 10);
            });
        });

        const closeModalFunc = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };

        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeModalFunc);
        });

        // Zapri ob kliku izven modalnega okna
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalFunc();
            }
        });

        // Zapri ob tipki Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModalFunc();
            }
        });
    }

    // Preklapljanje zavihkov v modalu
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active', 'border-[#d4af37]', 'text-white'));
                button.classList.add('active', 'border-[#d4af37]', 'text-white');

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

    // 3. Oddaja obrazca: ob submitu prikaže Toast obvestilo 'Uspešno oddano!' za 4 sekunde
    const forms = document.querySelectorAll('form');
    let toastTimeout;

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ustvari ali poišči obstoječi toast za obvestila
            let toast = document.getElementById('dynamic-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'dynamic-toast';
                toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-32 opacity-0 transition-all duration-500 ease-out bg-[#141418] border border-[#d4af37]/30 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4 max-w-md';
                toast.innerHTML = `
                    <div class="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
                    <div class="flex-1 text-sm">
                        <span class="font-semibold block text-white">Uspešno oddano!</span>
                        <span class="text-zinc-400">Vaša zahteva je bila uspešno poslana. Kmalu vas kontaktiramo.</span>
                    </div>
                `;
                document.body.appendChild(toast);
            }

            // Prikaži toast
            clearTimeout(toastTimeout);
            toast.classList.remove('translate-y-32', 'opacity-0');

            // Skrij po 4 sekundah
            toastTimeout = setTimeout(() => {
                toast.classList.add('translate-y-32', 'opacity-0');
            }, 4000);

            // Počisti obrazec in zapri modal, če obstaja
            form.reset();
            if (modal && !modal.classList.contains('hidden')) {
                setTimeout(() => {
                    modal.classList.add('opacity-0', 'pointer-events-none');
                    setTimeout(() => modal.classList.add('hidden'), 300);
                }, 1000);
            }
        });
    });

    // 4. FAQ harmonika: klik na vprašanje razpre odgovor
    const faqItems = document.querySelectorAll('.faq-item, .faq-question');

    faqItems.forEach(item => {
        const questionBtn = item.classList.contains('faq-question') ? item : item.querySelector('.faq-question');
        const answer = item.classList.contains('faq-item') ? item.querySelector('.faq-answer') : item.nextElementSibling;
        const icon = questionBtn ? questionBtn.querySelector('svg, span') : null;

        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isOpen = !answer.classList.contains('hidden');

                // Zapri vse ostale FAQ elemente (opcijsko, za lepši UX harmonike)
                document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
                document.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));

                if (!isOpen) {
                    answer.classList.remove('hidden');
                    questionBtn.setAttribute('aria-expanded', 'true');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                } else {
                    answer.classList.add('hidden');
                    questionBtn.setAttribute('aria-expanded', 'false');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
});