// =============================================================================
// 🎨 BIO PAGE - MAIN SCRIPT
// Genera dinamicamente il contenuto dalla configurazione
// =============================================================================

// Typing Effect for Profile Name
function typingEffect(element, text, speed = 80) {
    let displayedText = '';
    let currentIndex = 0;

    element.innerHTML = '';

    function typeCharacter() {
        if (currentIndex < text.length) {
            displayedText += text[currentIndex];
            element.innerHTML = displayedText + '<span class="cursor">_</span>';
            currentIndex++;
            setTimeout(typeCharacter, speed);
        } else {
            element.innerHTML = displayedText;
        }
    }

    typeCharacter();
}

// =============================================================================
// 📝 FUNZIONI DI GENERAZIONE CONTENUTO
// =============================================================================

/**
 * Genera la sezione profilo
 */
function generateProfile(profile) {
    const profileSection = document.getElementById('profile-section');

    profileSection.innerHTML = `
        <div class="profile-image-wrapper">
            <img src="${profile.image}" alt="${profile.name}" class="profile-image">
        </div>
        <h1 class="profile-name">${profile.name}</h1>
        <p class="profile-bio">${profile.bio}</p>
    `;
}

/**
 * Genera le icone social
 */
function generateSocialIcons(socials) {
    const socialContainer = document.getElementById('social-icons');

    socialContainer.innerHTML = socials.map(social => `
        <a href="${social.url}"
           target="_blank"
           rel="noopener noreferrer"
           class="social-icon ${social.cssClass}"
           aria-label="${social.name}">
            <i class="${social.icon}"></i>
        </a>
    `).join('');
}

/**
 * Genera un singolo link card
 */
function createLinkCard(link) {
    const badge = link.badge ? `<span class="discount-badge">${link.badge}</span>` : '';
    const styleClass = link.style || 'default';

    return `
        <a href="${link.url}"
           target="_blank"
           rel="noopener noreferrer"
           class="link-card ${styleClass}">
            <div class="link-icon">
                <i class="${link.icon}"></i>
            </div>
            <div class="link-content">
                <h3 class="link-title">${link.title}</h3>
                <p class="link-description">${link.description}</p>
            </div>
            ${badge}
            <i class="fas fa-chevron-right link-arrow"></i>
        </a>
    `;
}

/**
 * Genera tutte le sezioni di link
 */
function generateSections(sections) {
    const sectionsContainer = document.getElementById('sections-container');

    sectionsContainer.innerHTML = sections.map(section => `
        <div class="${section.id}-section">
            <h2 class="section-title">${section.title}</h2>
            ${section.links.map(link => createLinkCard(link)).join('')}
        </div>
    `).join('');
}

/**
 * Genera il footer
 */
function generateFooter(footerText) {
    const footer = document.getElementById('footer');
    footer.innerHTML = `<p>${footerText}</p>`;
}

/**
 * Aggiorna i meta tags
 */
function updateMetaTags(meta) {
    document.title = meta.title;
    document.getElementById('page-title').textContent = meta.title;
    document.getElementById('meta-description').content = meta.description;
    document.getElementById('meta-author').content = meta.author;
    document.getElementById('meta-og-title').content = meta.title;
    document.getElementById('meta-og-description').content = meta.description;
}

// =============================================================================
// 🚀 INIZIALIZZAZIONE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Verifica che CONFIG sia caricato
    if (typeof CONFIG === 'undefined') {
        console.error('❌ CONFIG non trovato! Assicurati che config.js sia caricato.');
        return;
    }

    // 1. Aggiorna meta tags
    updateMetaTags(CONFIG.settings.meta);

    // 2. Genera profilo
    generateProfile(CONFIG.profile);

    // 3. Genera social icons
    generateSocialIcons(CONFIG.socials);

    // 4. Genera sezioni di link
    generateSections(CONFIG.sections);

    // 5. Genera footer
    generateFooter(CONFIG.settings.footerText);

    // 6. Applica effetto typing al nome
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        const nameText = profileName.textContent;
        typingEffect(profileName, nameText, CONFIG.settings.typingSpeed);
    }

    // ==========================================================================
    // 🎭 ANIMAZIONI E INTERAZIONI
    // ==========================================================================

    // Intersection Observer per animazioni scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Osserva tutti i link cards
    const cards = document.querySelectorAll('.link-card');
    cards.forEach(card => observer.observe(card));

    // Track click sui link (utile per analytics)
    const links = document.querySelectorAll('.link-card, .social-icon');
    links.forEach(link => {
        link.addEventListener('click', () => {
            const linkTitle = link.querySelector('.link-title')?.textContent ||
                             link.getAttribute('aria-label') ||
                             'Unknown';
            const linkUrl = link.getAttribute('href');

            console.log('🔗 Link clicked:', {
                title: linkTitle,
                url: linkUrl,
                timestamp: new Date().toISOString()
            });

            // Se vuoi integrare Google Analytics:
            /*
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Link',
                    'event_label': linkTitle,
                    'value': linkUrl
                });
            }
            */
        });
    });

    // Smooth scroll (per eventuali anchor)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Effetto parallax leggero allo scroll
    let lastScrollY = window.scrollY;
    const background = document.querySelector('.background-gradient');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (background) {
            background.style.transform = `translateY(${scrollY * 0.3}px)`;
        }

        lastScrollY = scrollY;
    }, { passive: true });

    // Effetto hover 3D sui card
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Preload immagine profilo per performance
    const profileImage = document.querySelector('.profile-image');
    if (profileImage && profileImage.complete) {
        profileImage.classList.add('loaded');
    } else if (profileImage) {
        profileImage.addEventListener('load', () => {
            profileImage.classList.add('loaded');
        });
    }

    // ==========================================================================
    // 🎮 EASTER EGGS
    // ==========================================================================

    // Konami code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }

    // Aggiungi animazione rainbow per easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Bio Page caricata con successo!');
});

// =============================================================================
// 🛠️ UTILITY FUNCTIONS
// =============================================================================

// Service Worker per PWA (opzionale)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Decommentare per attivare PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(err => console.log('SW registration failed'));
    });
}

// Funzione per copiare link negli appunti
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link copiato!');
        });
    }
}

// Mostra notifiche toast
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-color);
        color: var(--bg-color);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 0 20px var(--accent-glow);
        animation: slideUp 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}