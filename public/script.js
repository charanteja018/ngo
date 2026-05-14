document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar & Mobile Menu ---
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 0';
        }
    });

    mobileToggle.addEventListener('click', () => {
        // Simple toggle for mobile view demonstration
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => observer.observe(el));


    // --- Animated Counters ---
    const counters = document.querySelectorAll('.counter');
    const counterSection = document.querySelector('.impact-stats');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    // Increment step
                    const inc = target / 100;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target.toLocaleString() + '+';
                    }
                };
                updateCount();
            });
        }
    }, { threshold: 0.5 });

    if (counterSection) {
        counterObserver.observe(counterSection);
    }


    // --- Form Submission Handling ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // UI feedback
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            formStatus.className = 'form-status';
            formStatus.innerText = '';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, message })
                });

                const data = await response.json();

                if (response.ok) {
                    formStatus.innerText = data.message;
                    formStatus.classList.add('status-success');
                    contactForm.reset();
                } else {
                    formStatus.innerText = data.error || 'Failed to send message. Please try again.';
                    formStatus.classList.add('status-error');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formStatus.innerText = 'A network error occurred. Please try again.';
                formStatus.classList.add('status-error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Send Message';
            }
        });
    }
});
