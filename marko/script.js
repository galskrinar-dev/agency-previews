// Agency OS Interactive Script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Pošiljam...';

            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.textContent = 'Oddaj povpraševanje';
                feedback.style.color = '#16a34a';
                feedback.textContent = '✓ Vaše povpraševanje je bilo uspešno oddano! Kmalu vas kontaktiramo.';
            }, 800);
        });
    }
});
