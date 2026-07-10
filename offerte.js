// =============================================================================
// 🛍️ OFFERTE.JS — Landing "Affari al Volo" per traffico ADV
// Dati: offers.json (fonte di verità). Conversione primaria: join Telegram.
// =============================================================================

const CATEGORY_LABELS = {
    moda: 'Moda &amp; Accessori',
    beauty: 'Beauty &amp; Skincare',
    tech: 'Tech &amp; Elettronica',
    casa: 'Casa &amp; Arredamento',
    famiglia: 'Famiglia',
    marketplace: 'Marketplace'
};

const STICKY_DISMISS_KEY = 'aav-sticky-dismissed';
const COOKIE_CONSENT_KEY = 'aav-cookie-consent';
const FALLBACK_TELEGRAM = 'https://t.me/affarialvoloo';

// Aggiorna questo numero manualmente (o collegalo a un endpoint reale) per
// mostrare la prova sociale in hero, blocco inline e sticky bar.
const MEMBER_COUNT_LABEL = '15.200+';

let DATA = null;
let currentCategory = 'all';
let currentSearchTerm = '';

// ---------- HELPERS ----------

function isExpired(offer) {
    if (!offer.expiry) return false;
    return new Date(offer.expiry + 'T23:59:59') < new Date();
}

function activeOffers() {
    return DATA.offers.filter(o => !isExpired(o));
}

function telegramUrl() {
    return (DATA && DATA.telegram) || FALLBACK_TELEGRAM;
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatShortDate(iso) {
    return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ---------- COOKIE CONSENT ----------

function getCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
}

function setCookieConsent(value) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
}

function renderCookieBanner() {
    if (getCookieConsent()) {
        if (getCookieConsent() === 'accepted') loadTrackingScripts();
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <p>Usiamo cookie tecnici e, previo tuo consenso, cookie di misurazione (Meta Pixel, Google Ads) per capire quali offerte funzionano meglio. Leggi la <a href="privacy.html">Privacy & Cookie Policy</a>.</p>
        <div class="cookie-banner-actions">
            <button id="cookie-reject" class="cookie-btn cookie-btn-reject">Rifiuta</button>
            <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accetta</button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', () => {
        setCookieConsent('accepted');
        banner.remove();
        loadTrackingScripts();
    });
    document.getElementById('cookie-reject').addEventListener('click', () => {
        setCookieConsent('rejected');
        banner.remove();
    });
}

// ---------- TRACKING ----------

function loadTrackingScripts() {
    const tracking = (window.CONFIG && window.CONFIG.tracking) || {};

    if (tracking.metaPixelId) {
        const fbScript = document.createElement('script');
        fbScript.textContent = `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${tracking.metaPixelId}');
            fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
    }

    if (tracking.googleAdsId) {
        const gtagSrc = document.createElement('script');
        gtagSrc.async = true;
        gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${tracking.googleAdsId}`;
        document.head.appendChild(gtagSrc);

        const gtagInit = document.createElement('script');
        gtagInit.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${tracking.googleAdsId}');
        `;
        document.head.appendChild(gtagInit);
    }
}

function track(eventName, params = {}) {
    const tracking = (window.CONFIG && window.CONFIG.tracking) || {};
    console.log('[track]', eventName, params);

    if (tracking.metaPixelId && typeof fbq === 'function') {
        if (eventName === 'join_telegram') {
            fbq('track', 'Lead', params);
        } else if (eventName === 'click_offer') {
            fbq('trackCustom', 'ClickOffer', params);
        } else if (eventName === 'copy_code') {
            fbq('trackCustom', 'CopyCode', params);
        }
    }

    if (tracking.googleAdsId && typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
}

// Delegation: ogni elemento con data-tg="<placement>" è una CTA Telegram
function setupTelegramTracking() {
    document.addEventListener('click', e => {
        const cta = e.target.closest('[data-tg]');
        if (cta) track('join_telegram', { placement: cta.dataset.tg });
    });
}

// ---------- RENDERING ----------

function renderHero() {
    document.getElementById('offerte-hero').innerHTML = `
        <div class="hero">
            <div class="hero-inner">
                <img src="img/affarialvolo-logo.png" alt="Affari al Volo" class="hero-logo">
                <div class="hero-social-proof">🔥 ${MEMBER_COUNT_LABEL} persone già iscritte</div>
                <h1 class="hero-title">Offerte e codici sconto verificati, ogni giorno</h1>
                <div class="hero-cta-row">
                    <a href="${telegramUrl()}" class="hero-cta" data-tg="hero" target="_blank" rel="noopener noreferrer">🔔 Entra gratis nel canale</a>
                    <a href="#offerte-grid" class="hero-cta-secondary">Vedi le offerte di oggi ↓</a>
                </div>
                <div class="hero-trust-strip">
                    <span>✅ Codici verificati ogni giorno</span>
                    <span>🚫 Niente spam</span>
                </div>
            </div>
        </div>
    `;
}

function createFeaturedCard(offer) {
    const discount = offer.discount ? `<span class="offer-card-badge">${escapeHtml(offer.discount)}</span>` : '';
    const expiry = offer.expiry ? `<span class="featured-expiry">Scade il ${formatShortDate(offer.expiry)}</span>` : '';

    return `
        <div class="featured-card">
            <div class="featured-card-header">
                <div class="offer-card-icon"><img src="${offer.icon}" alt="${escapeHtml(offer.title)}" loading="lazy"></div>
                <h3 class="offer-card-title">${escapeHtml(offer.title)}</h3>
            </div>
            <div class="featured-card-body">
                <p class="offer-card-description">${escapeHtml(offer.description)}</p>
                <div class="featured-meta-row">${discount}${expiry}</div>
            </div>
            <button class="featured-code-btn"
                data-code="${escapeHtml(offer.code)}"
                data-title="${escapeHtml(offer.title)}"
                data-category="${offer.category}"
                data-url="${offer.url}">
                <span class="featured-code">${escapeHtml(offer.code)}</span>
                <span class="featured-code-label">Copia codice</span>
            </button>
        </div>
    `;
}

function renderFeatured() {
    const featured = activeOffers().filter(o => o.featured && o.code);
    const section = document.getElementById('offerte-featured');

    if (!featured.length) {
        section.innerHTML = '';
        return;
    }

    section.innerHTML = `
        <h2 class="featured-heading">⚡ Top con codice sconto</h2>
        <div class="featured-grid">${featured.map(createFeaturedCard).join('')}</div>
    `;

    section.querySelectorAll('.featured-code-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const { url } = btn.dataset;
            copyCode(
                btn,
                btn.querySelector('.featured-code'),
                btn.querySelector('.featured-code-label'),
                () => setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 600)
            );
        });
    });
}

async function copyCode(btn, codeEl, labelEl, onCopied) {
    const { code, title, category } = btn.dataset;

    try {
        await navigator.clipboard.writeText(code);
    } catch {
        // Fallback: seleziona il testo del codice per copia manuale
        const range = document.createRange();
        range.selectNodeContents(codeEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    const originalLabel = labelEl.textContent;
    labelEl.textContent = 'Copiato ✓';
    track('copy_code', { brand: title, category: category });
    if (onCopied) {
        onCopied();
    } else {
        setTimeout(() => { labelEl.textContent = originalLabel; }, 1500);
    }
}

function initialCategory() {
    const cat = new URLSearchParams(window.location.search).get('cat');
    const present = new Set(activeOffers().map(o => o.category));
    return cat && present.has(cat) ? cat : 'all';
}

function renderCategoryFilters() {
    const categoriesPresent = [...new Set(activeOffers().map(o => o.category))];
    const nav = document.getElementById('category-filters');

    const pill = (cat, label) => {
        const active = cat === currentCategory ? ' active' : '';
        return `<button class="category-pill${active}" data-category="${cat}">${label}</button>`;
    };

    nav.innerHTML = pill('all', 'Tutte') + categoriesPresent.map(cat =>
        pill(cat, CATEGORY_LABELS[cat] || cat)
    ).join('');

    nav.querySelectorAll('.category-pill').forEach(p => {
        p.addEventListener('click', () => {
            nav.querySelectorAll('.category-pill').forEach(x => x.classList.remove('active'));
            p.classList.add('active');
            currentCategory = p.dataset.category;
            applyFilters();
        });
    });
}

function extractBrand(title) {
    const separator = title.includes('|') ? '|' : (title.includes(':') ? ':' : null);
    let brand = title;
    if (separator) {
        const parts = title.split(separator).map(p => p.trim());
        brand = parts.reduce((a, b) => b.length < a.length ? b : a);
    }
    return brand.replace(/\.(it|com|net|org|eu)$/i, '');
}

function createOfferCard(offer) {
    const brand = offer.brand || extractBrand(offer.title);
    let badge;
    if (offer.code) {
        badge = `
            <button class="offer-card-badge offer-card-code-btn"
                data-code="${escapeHtml(offer.code)}" data-brand="${escapeHtml(brand)}" data-category="${offer.category}">
                <span class="offer-card-code-text">CODICE: ${escapeHtml(offer.code)}</span>
                <span class="offer-card-code-label">Copia</span>
            </button>
        `;
    } else {
        badge = offer.discount ? `<span class="offer-card-badge">${escapeHtml(offer.discount)}</span>` : '';
    }
    const expiry = offer.expiry ? `<span class="featured-expiry">Scade il ${formatShortDate(offer.expiry)}</span>` : '';

    return `
        <div class="offer-card" data-category="${offer.category}"
            data-title="${escapeHtml(offer.title.toLowerCase())}"
            data-description="${escapeHtml(offer.description.toLowerCase())}">
            <div class="offer-card-header">
                <div class="offer-card-icon"><img src="${offer.icon}" alt="${escapeHtml(brand)}" loading="lazy"></div>
                <span class="offer-card-brand">${escapeHtml(brand)}</span>
            </div>
            <h3 class="offer-card-title">${escapeHtml(offer.title)}</h3>
            <p class="offer-card-description">${escapeHtml(offer.description)}</p>
            <div class="offer-card-meta-row">${badge}${expiry}</div>
            <button class="offer-card-cta" data-brand="${escapeHtml(brand)}" data-cat="${offer.category}" data-url="${offer.url}">
                Vedi offerta <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

function renderGrid() {
    const grid = document.getElementById('offerte-grid');
    grid.innerHTML = activeOffers().map(createOfferCard).join('');

    grid.querySelectorAll('.offer-card-cta').forEach(btn => {
        btn.addEventListener('click', () => {
            track('click_offer', { brand: btn.dataset.brand, category: btn.dataset.cat });
            window.open(btn.dataset.url, '_blank', 'noopener,noreferrer');
        });
    });

    grid.querySelectorAll('.offer-card-code-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            copyCode(
                btn,
                btn.querySelector('.offer-card-code-text'),
                btn.querySelector('.offer-card-code-label')
            );
        });
    });
}

function applyFilters() {
    document.querySelectorAll('.offer-card').forEach(card => {
        const matchesCategory = currentCategory === 'all' || card.dataset.category === currentCategory;
        const matchesSearch = !currentSearchTerm ||
            card.dataset.title.includes(currentSearchTerm) ||
            card.dataset.description.includes(currentSearchTerm);
        card.classList.toggle('hidden', !(matchesCategory && matchesSearch));
    });
}

function setupSearch() {
    const input = document.getElementById('offerte-search-input');
    const clearBtn = document.getElementById('offerte-search-clear');

    input.addEventListener('input', () => {
        currentSearchTerm = input.value.trim().toLowerCase();
        clearBtn.style.display = currentSearchTerm ? 'block' : 'none';
        applyFilters();
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        currentSearchTerm = '';
        clearBtn.style.display = 'none';
        applyFilters();
    });
}

function renderTelegramInline() {
    document.getElementById('telegram-inline').innerHTML = `
        <div class="telegram-inline-box">
            <p>👀 Le offerte migliori le pubblichiamo prima sul canale</p>
            <p class="telegram-inline-subtext">Unisciti a ${MEMBER_COUNT_LABEL} persone che risparmiano ogni giorno</p>
            <a href="${telegramUrl()}" class="telegram-cta" data-tg="inline" target="_blank" rel="noopener noreferrer">🔔 Entra nel canale gratis</a>
        </div>
    `;
}

function renderStickyBar() {
    if (localStorage.getItem(STICKY_DISMISS_KEY)) return;

    const bar = document.getElementById('telegram-sticky');
    bar.innerHTML = `
        <a href="${telegramUrl()}" data-tg="sticky" target="_blank" rel="noopener noreferrer">🔔 ${MEMBER_COUNT_LABEL} iscritti su Telegram — Entra gratis</a>
        <button class="sticky-close" aria-label="Chiudi">✕</button>
    `;
    bar.classList.add('visible');

    bar.querySelector('.sticky-close').addEventListener('click', () => {
        localStorage.setItem(STICKY_DISMISS_KEY, '1');
        bar.classList.remove('visible');
    });
}

function renderFooter() {
    document.getElementById('offerte-footer').innerHTML = `
        <p class="offerte-disclaimer">Questa pagina contiene link di affiliazione. Se acquisti tramite questi link potremmo ricevere una piccola commissione, senza costi aggiuntivi per te.</p>
        <div class="offerte-footer-links">
            <span class="offerte-disclaimer">Un progetto di Mirko Papadopoli</span>
            <a href="https://beacons.ai/mirkopapadopoli/mediakit" target="_blank" rel="noopener noreferrer">Media Kit</a>
            <a href="privacy.html">Privacy & Cookie</a>
        </div>
    `;
}

function renderFallback() {
    document.querySelector('.offerte-container').innerHTML = `
        <div class="offerte-fallback">
            <h2>Ops, le offerte non si caricano 😅</h2>
            <p>Nessun problema: le trovi tutte sul nostro canale Telegram, aggiornate ogni giorno.</p>
            <a href="${FALLBACK_TELEGRAM}" class="hero-cta" data-tg="fallback" target="_blank" rel="noopener noreferrer">🔔 Entra nel canale gratis</a>
        </div>
    `;
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', async () => {
    renderCookieBanner();
    setupTelegramTracking();

    try {
        const res = await fetch('offers.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        DATA = await res.json();
    } catch (err) {
        console.error('offers.json non raggiungibile:', err);
        renderFallback();
        return;
    }

    currentCategory = initialCategory();
    renderHero();
    renderFeatured();
    renderCategoryFilters();
    renderGrid();
    applyFilters();
    setupSearch();
    renderTelegramInline();
    renderStickyBar();
    renderFooter();
});
