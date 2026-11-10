// =============================================================================
// 🛍️ OFFERTE.JS — Landing "Affari al Volo"
// Dati: offers.json. Conversione primaria: click sull'offerta (link affiliato).
// La CTA Telegram si adatta alla fonte del traffico (?src=):
//   ads → sticky bar Telegram; card Telegram in alto solo per le ad di
//         retargeting (utm_content con "telegram"), per le altre dopo la 2ª promo:
//         chi arriva da un'ad "codice sconto" deve vedere subito un codice
//   tg  → nessuna CTA Telegram (sono già iscritti)
//   altro/assente (bio Instagram) → offerte prima, Telegram dopo la 3ª promo
//
// offer.promo (opzionale, compilato dallo store scout):
//   { title: "-30% sopra 79€ a carrello", detail: "...", until: "2026-10-20",
//     verified_at: "2026-10-16T09:00:00+02:00" }
// Le offerte con promo attiva diventano card grandi; le altre vanno nella
// lista compatta "Altri negozi partner".
// =============================================================================

const CATEGORY_LABELS = {
    moda: 'Moda',
    beauty: 'Beauty',
    tech: 'Tech',
    casa: 'Casa',
    famiglia: 'Famiglia',
    marketplace: 'Marketplace',
    altro: 'Altro'
};

const STICKY_DISMISS_KEY = 'aav-sticky-dismissed';
const COOKIE_CONSENT_KEY = 'aav-cookie-consent';
const FALLBACK_TELEGRAM = 'https://t.me/affarialvoloo';
const TELEGRAM_AFTER_PROMO = 3;
const TELEGRAM_AFTER_PROMO_ADS = 2;
const SEARCH_MIN_STORES = 12;


const PARAMS = new URLSearchParams(window.location.search);
const SRC = (PARAMS.get('src') || 'organic').toLowerCase();
// Nelle ads Meta l'URL porta utm_campaign={{campaign.name}} e
// utm_content={{ad.name}}: li inoltriamo in ogni evento per sapere quale
// campagna e quale grafica portano i click sulle offerte.
const AD_PARAMS = Object.fromEntries(['utm_campaign', 'utm_content']
    .map(k => [k, (PARAMS.get(k) || '').slice(0, 100)])
    .filter(([, v]) => v));

let DATA = null;
let currentCategory = 'all';
let currentSearchTerm = '';

// ---------- HELPERS ----------

function endOfDay(iso) {
    return new Date(iso + 'T23:59:59');
}

function isExpired(offer) {
    return Boolean(offer.expiry) && endOfDay(offer.expiry) < new Date();
}

// I testi delle promo Metapic a volte contengono note per i creator
// ("⚠️ NON promovibile nella bio/caption ⚠️"): non vanno mostrate al pubblico,
// e un'offerta con quel divieto non va promossa come promo in card.
const RESTRICTED = /non\s+promovibil/i;
const CODE_IN_TEXT = /codice:?\s+([A-Z0-9][A-Z0-9_-]{2,})/;

function isRestricted(offer) {
    const p = offer.promo || {};
    return RESTRICTED.test(`${p.title || ''} ${p.detail || ''}`);
}

function cleanDetail(detail) {
    return String(detail || '').split('\n')
        .filter(line => !line.includes('⚠') && !RESTRICTED.test(line))
        .join('\n').trim();
}

// Codice da copiare: quello Metapic, oppure quello scritto nel testo della
// promo ("Codice: HALLOWEEN"), così ha comunque il pulsante "Copia".
function codeOf(offer) {
    if (offer.code) return offer.code;
    const p = offer.promo || {};
    const m = `${p.title || ''}\n${p.detail || ''}`.match(CODE_IN_TEXT);
    return m ? m[1] : null;
}

// Promo da mostrare in card: quella dello store scout, oppure il codice
// sconto Metapic (offer.code) se non c'è una promo.
function promoOf(offer) {
    if (isRestricted(offer)) return null;
    const p = offer.promo;
    if (p && p.title && !(p.until && endOfDay(p.until) < new Date())) {
        return { ...p, detail: cleanDetail(p.detail) };
    }
    if (offer.code) {
        return {
            title: offer.discount ? `${offer.discount} con codice` : 'Codice sconto riservato',
            until: offer.expiry || null
        };
    }
    return null;
}

function hasActivePromo(offer) {
    return promoOf(offer) !== null;
}

function activeOffers() {
    return DATA.offers.filter(o => !isExpired(o));
}

function telegramUrl() {
    return (DATA && DATA.telegram) || FALLBACK_TELEGRAM;
}

function showTelegram() {
    return SRC !== 'tg';
}

function formatShortDate(iso) {
    return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// "Michael Kors IT" → "Michael Kors"; "Abbigliamento ... | Prénatal" → "Prénatal"
function brandOf(offer) {
    const title = offer.brand || offer.title;
    const separator = title.includes('|') ? '|' : (title.includes(' - ') ? ' - ' : null);
    let brand = title;
    if (separator) {
        brand = title.split(separator).map(p => p.trim()).reduce((a, b) => b.length < a.length ? b : a);
    }
    return brand.replace(/_/g, ' ').replace(/\.(it|com|net|org|eu)$/i, '')
        // Suffissi di mercato dei nomi Metapic: "adidas IT NEW", "MANGO ( IT)", "Shein IT"
        .replace(/\s*\(\s*IT\s*\)$/i, '').replace(/\s+(IT|Italia|Italy)(\s+NEW)?$/i, '').trim();
}

// "Verificata oggi alle 9:00" / "Verificata il 14 ott"
function verifiedLabel(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const today = new Date().toDateString() === d.toDateString();
    const time = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return today ? `Verificata oggi alle ${time}` : `Verificata il ${formatShortDate(iso)}`;
}

function untilLabel(iso) {
    const days = Math.round((endOfDay(iso) - new Date()) / 86400000);
    if (days <= 0) return 'Scade oggi';
    if (days === 1) return 'Scade domani';
    if (days <= 6) return `Ancora ${days} giorni`;
    return `Fino al ${formatShortDate(iso)}`;
}

// Favicon di Google su uno shortlink (mpic.link, mtpc.se) = sempre il globo generico
const GENERIC_ICON = /domain=[^&]*\.(mpic\.link|mtpc\.se)/;

function logoHtml(offer, brand, size) {
    const initial = escapeHtml(brand.charAt(0).toUpperCase());
    const icon = offer.icon && !GENERIC_ICON.test(offer.icon) ? offer.icon : '';
    // Senza logo vero (o se non carica) resta l'iniziale del brand
    return `
        <span class="logo logo-${size}" data-initial="${initial}">
            ${icon ? `<img src="${icon}" alt="" width="64" height="64" loading="lazy" onload="this.classList.add('loaded')" onerror="this.remove()">` : ''}
        </span>`;
}

// ---------- COOKIE CONSENT + TRACKING ----------

function getCookieConsent() {
    try { return localStorage.getItem(COOKIE_CONSENT_KEY); } catch { return null; }
}

function setCookieConsent(value) {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch { /* storage bloccato */ }
}

function renderCookieBanner() {
    const consent = getCookieConsent();
    if (consent) {
        if (consent === 'accepted') loadTrackingScripts();
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <p>Cookie tecnici sempre; cookie di misurazione (Meta Pixel, Google Ads) solo col tuo consenso. <a href="privacy.html">Privacy</a></p>
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

function loadTrackingScripts() {
    const tracking = (window.CONFIG && window.CONFIG.tracking) || {};

    if (tracking.metaPixelId && typeof fbq !== 'function') {
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', tracking.metaPixelId);
        fbq('track', 'PageView');
    }

    if (tracking.googleAdsId && typeof gtag !== 'function') {
        const gtagSrc = document.createElement('script');
        gtagSrc.async = true;
        gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${tracking.googleAdsId}`;
        document.head.appendChild(gtagSrc);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', tracking.googleAdsId);
    }
}

// Contatore anonimo nostro (netlify/functions/track.mjs): parte sempre, anche
// senza consenso, perché non usa cookie né identificativi. Pixel e gtag sotto
// restano legati al consenso del banner.
function countEvent(eventName, params) {
    if (!navigator.sendBeacon) return;
    try {
        navigator.sendBeacon('/api/track', JSON.stringify({ e: eventName, ...params }));
    } catch { /* il conteggio non deve mai bloccare la pagina */ }
}

function track(eventName, params = {}) {
    params = { src: SRC, ...AD_PARAMS, ...params };
    console.log('[track]', eventName, params);
    countEvent(eventName, params);

    if (typeof fbq === 'function') {
        if (eventName === 'join_telegram') fbq('track', 'Lead', params);
        else if (eventName === 'click_offer') fbq('trackCustom', 'ClickOffer', params);
        else if (eventName === 'copy_code') fbq('trackCustom', 'CopyCode', params);
    }
    if (typeof gtag === 'function') gtag('event', eventName, params);
}

// Delegation: [data-tg] = CTA Telegram, [data-offer] = click su offerta.
// I link affiliati sono <a> veri: funzionano anche con JS lento o bloccato.
function setupClickTracking() {
    document.addEventListener('click', e => {
        const tg = e.target.closest('[data-tg]');
        if (tg) return track('join_telegram', { placement: tg.dataset.tg });
        const code = e.target.closest('.promo-code');
        if (code) return copyCode(code);
        const offer = e.target.closest('[data-offer]');
        if (offer) track('click_offer', {
            brand: offer.dataset.offer, category: offer.dataset.cat, placement: offer.dataset.place
        });
    });
}

async function copyCode(btn) {
    const valueEl = btn.querySelector('.promo-code-value');
    const labelEl = btn.querySelector('.promo-code-label');
    try {
        await navigator.clipboard.writeText(btn.dataset.code);
        labelEl.textContent = 'Copiato ✓';
    } catch {
        // Clipboard non disponibile: seleziona il codice per la copia manuale
        const range = document.createRange();
        range.selectNodeContents(valueEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        labelEl.textContent = 'Tieni premuto per copiare';
    }
    track('copy_code', { brand: btn.dataset.brand });
    setTimeout(() => { labelEl.textContent = 'Copia codice'; }, 2000);
}

// ---------- RENDERING ----------

function renderTopbar() {
    const updated = DATA && DATA.updated
        ? `<span class="topbar-updated"><span class="dot" aria-hidden="true"></span>Aggiornato ${formatShortDate(DATA.updated)}</span>`
        : '';
    document.getElementById('topbar').innerHTML = `
        <div class="topbar-inner">
            <span class="topbar-brand">
                <img src="img/affarialvolo-logo.png" alt="" width="36" height="29">
                Affari al Volo
            </span>
            ${updated}
        </div>`;
}

const PLANE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z"/><path d="m10 13 4.5-4.5"/></svg>`;

function telegramCard(placement, title, sub) {
    return `
        <aside class="tg-card">
            <span class="tg-icon">${PLANE_ICON}</span>
            <div class="tg-card-text">
                <strong>${title}</strong>
                <span>${sub}</span>
            </div>
            <a href="${telegramUrl()}" class="tg-btn" data-tg="${placement}" target="_blank" rel="noopener noreferrer">Entra gratis</a>
        </aside>`;
}

function isTelegramAd() {
    return SRC === 'ads' && /telegram/i.test(AD_PARAMS.utm_content || '');
}

function renderTelegramTop() {
    if (!isTelegramAd()) return;
    document.getElementById('tg-top').innerHTML = telegramCard(
        'top',
        'Le promo ogni mattina su Telegram',
        'Gratis · niente spam · esci quando vuoi'
    );
}

function promoCard(offer) {
    const brand = brandOf(offer);
    const p = promoOf(offer);
    const until = p.until ? `<span class="chip-until">${untilLabel(p.until)}</span>` : '';
    const detail = p.detail ? `<p class="promo-detail">${escapeHtml(p.detail)}</p>` : '';
    const value = codeOf(offer);
    const code = value ? `
            <button class="promo-code" data-code="${escapeHtml(value)}" data-brand="${escapeHtml(brand)}">
                <span class="promo-code-value">${escapeHtml(value)}</span>
                <span class="promo-code-label">Copia codice</span>
            </button>` : '';
    const verified = p.verified_at ? `<p class="promo-verified">✓ ${verifiedLabel(p.verified_at)} sul sito di ${escapeHtml(brand)}</p>` : '';

    return `
        <article class="promo-card" id="${promoId(offer)}" data-category="${escapeHtml(offer.category)}" data-search="${escapeHtml((brand + ' ' + p.title).toLowerCase())}">
            <header class="promo-head">
                ${logoHtml(offer, brand, 'md')}
                <span class="promo-brand">${escapeHtml(brand)}</span>
                ${until}
            </header>
            <h2 class="promo-title">${escapeHtml(p.title)}</h2>
            ${detail}
            ${code}
            <a class="promo-cta" href="${offer.url}" target="_blank" rel="sponsored noopener"
               data-offer="${escapeHtml(brand)}" data-cat="${escapeHtml(offer.category)}" data-place="promo">
                Vai alla promo su ${escapeHtml(brand)} <span aria-hidden="true">→</span>
            </a>
            ${verified}
        </article>`;
}

// Hero: le promo attive come card che fluttuano sopra il titolo (la
// "costellazione" di DESIGN.MD). Non abbiamo foto prodotto: ogni card è
// logo + negozio + sconto. Un tap porta alla card della promo, non al negozio,
// così chi arriva vede codice e condizioni prima di uscire.
const HERO_MAX = 5;

function promoId(offer) {
    return 'promo-' + brandOf(offer).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function discountOf(offer) {
    const m = promoOf(offer).title.match(/-?\s?\d+\s?%/);
    return m ? '-' + m[0].replace(/[-\s]/g, '') : 'Promo';
}

function renderHero(promos) {
    const hero = document.getElementById('hero');
    if (promos.length < 3) return;
    hero.innerHTML = promos.slice(0, HERO_MAX).map((o, i) => `
        <a class="float-card float-${i}" href="#${promoId(o)}" tabindex="-1">
            ${logoHtml(o, brandOf(o), 'sm')}
            <span class="float-text">
                <span class="float-brand">${escapeHtml(brandOf(o))}</span>
                <span class="float-off">${escapeHtml(discountOf(o))}</span>
            </span>
        </a>`).join('');
    hero.classList.add('visible');
}

function renderPromos() {
    // Prima le promo con un codice da copiare: è quello che promettono le ads
    const promos = activeOffers().filter(hasActivePromo)
        .sort((a, b) => Boolean(codeOf(b)) - Boolean(codeOf(a)));
    const list = document.getElementById('promo-list');
    const sub = document.getElementById('intro-sub');

    if (!promos.length) {
        list.innerHTML = '';
        sub.textContent = 'Le promo del giorno arrivano a breve: intanto ecco i negozi partner.';
        return;
    }

    renderHero(promos);
    sub.textContent = `${promos.length} ${promos.length === 1 ? 'promo attiva' : 'promo attive'} oggi, prese dai siti dei negozi e controllate ogni mattina.`;

    const cards = promos.map(promoCard);
    if (showTelegram() && !isTelegramAd()) {
        const after = SRC === 'ads' ? TELEGRAM_AFTER_PROMO_ADS : TELEGRAM_AFTER_PROMO;
        const at = Math.min(after, cards.length);
        cards.splice(at, 0, telegramCard(
            'inline',
            'Vuoi queste promo ogni mattina?',
            'Te le mandiamo ogni mattina sul canale Telegram. Gratis.'
        ));
    }
    list.innerHTML = cards.join('');
}

function storeRow(offer) {
    const brand = brandOf(offer);
    return `
        <a class="store" href="${offer.url}" target="_blank" rel="sponsored noopener"
           data-category="${escapeHtml(offer.category)}" data-search="${escapeHtml((brand + ' ' + offer.title).toLowerCase())}"
           data-offer="${escapeHtml(brand)}" data-cat="${escapeHtml(offer.category)}" data-place="list">
            ${logoHtml(offer, brand, 'sm')}
            <span class="store-name">${escapeHtml(brand)}</span>
            <span class="store-arrow" aria-hidden="true">→</span>
        </a>`;
}

function renderStores() {
    // Un negozio per brand: offers.json può contenere più link allo stesso negozio
    const seen = new Set();
    const stores = activeOffers().filter(o => !hasActivePromo(o)).filter(o => {
        const key = brandOf(o).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    const section = document.getElementById('stores');
    if (!stores.length) return;

    const search = stores.length >= SEARCH_MIN_STORES ? `
        <label class="search">
            <span class="sr-only">Cerca un negozio</span>
            <input type="search" id="store-search" placeholder="Cerca un negozio…" autocomplete="off">
            <span class="search-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></svg></span>
        </label>` : '';

    section.innerHTML = `
        <h2 id="stores-title" class="stores-title">Altri negozi partner</h2>
        <p class="stores-sub">Nessuna promo attiva oggi, ma il link ci aiuta a tenere gratis questa pagina.</p>
        ${search}
        <div class="store-grid">${stores.map(storeRow).join('')}</div>
        <p id="stores-empty" class="stores-empty" hidden>Nessun negozio trovato.</p>`;

    const input = document.getElementById('store-search');
    if (input) input.addEventListener('input', () => {
        currentSearchTerm = input.value.trim().toLowerCase();
        applyFilters();
    });
}

function renderCategoryFilters() {
    const offers = activeOffers();
    const cats = [...new Set(offers.map(o => o.category))]
        .sort((a, b) => (a === 'altro') - (b === 'altro'));
    const nav = document.getElementById('category-filters');
    if (cats.length < 2) return;

    const chip = (cat, label) =>
        `<button class="chip${cat === currentCategory ? ' active' : ''}" data-category="${cat}" aria-pressed="${cat === currentCategory}">${label}</button>`;

    nav.innerHTML = chip('all', 'Tutte') + cats.map(c => chip(c, CATEGORY_LABELS[c] || c)).join('');
    nav.addEventListener('click', e => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        nav.querySelectorAll('.chip').forEach(x => {
            x.classList.toggle('active', x === btn);
            x.setAttribute('aria-pressed', x === btn);
        });
        currentCategory = btn.dataset.category;
        applyFilters();
    });
}

function applyFilters() {
    const items = document.querySelectorAll('.promo-card, .store');
    let visibleStores = 0;
    items.forEach(el => {
        const okCat = currentCategory === 'all' || el.dataset.category === currentCategory;
        const okSearch = !currentSearchTerm || el.dataset.search.includes(currentSearchTerm);
        const visible = okCat && okSearch;
        el.hidden = !visible;
        if (visible && el.classList.contains('store')) visibleStores++;
    });
    const empty = document.getElementById('stores-empty');
    if (empty) empty.hidden = visibleStores > 0;
}

function initialCategory() {
    const cat = new URLSearchParams(window.location.search).get('cat');
    const present = new Set(activeOffers().map(o => o.category));
    return cat && present.has(cat) ? cat : 'all';
}

function renderStickyBar() {
    if (SRC !== 'ads') return;
    try { if (localStorage.getItem(STICKY_DISMISS_KEY)) return; } catch { /* ignora */ }

    const bar = document.getElementById('telegram-sticky');
    bar.innerHTML = `
        <a href="${telegramUrl()}" data-tg="sticky" target="_blank" rel="noopener noreferrer">Promo ogni mattina su Telegram · Entra gratis →</a>
        <button class="sticky-close" aria-label="Chiudi">✕</button>
    `;
    bar.classList.add('visible');
    bar.querySelector('.sticky-close').addEventListener('click', () => {
        try { localStorage.setItem(STICKY_DISMISS_KEY, '1'); } catch { /* ignora */ }
        bar.classList.remove('visible');
    });
}

function renderFooter() {
    const tg = showTelegram()
        ? `<a href="${telegramUrl()}" data-tg="footer" target="_blank" rel="noopener noreferrer">Canale Telegram</a>` : '';
    document.getElementById('offerte-footer').innerHTML = `
        <p>Questa pagina contiene link di affiliazione: se acquisti tramite questi link potremmo ricevere una commissione, senza costi aggiuntivi per te. Le promo sono riportate dai siti dei negozi: condizioni e scadenze valgono come indicate dal negozio.</p>
        <nav class="footer-links">
            ${tg}
            <a href="privacy.html">Privacy & Cookie</a>
            <a href="https://beacons.ai/mirkopapadopoli/mediakit" target="_blank" rel="noopener noreferrer">Media Kit</a>
        </nav>
        <p class="footer-sign">Un progetto di Mirko Papadopoli</p>`;
}

function renderFallback() {
    document.querySelector('.page').innerHTML = `
        <div class="fallback">
            <h1>Le offerte non si caricano</h1>
            <p>Le trovi tutte sul canale Telegram, aggiornate ogni giorno.</p>
            <a href="${FALLBACK_TELEGRAM}" class="tg-btn" data-tg="fallback" target="_blank" rel="noopener noreferrer">Apri il canale</a>
        </div>`;
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', async () => {
    if (SRC === 'ads') document.body.classList.add('src-ads');
    countEvent('page_view', { src: SRC, ...AD_PARAMS });
    renderCookieBanner();
    setupClickTracking();
    renderTopbar();

    try {
        const res = await fetch('offers.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        DATA = await res.json();
    } catch (err) {
        console.error('offers.json non raggiungibile:', err);
        renderFallback();
        renderFooter();
        return;
    }

    currentCategory = initialCategory();
    renderTopbar();
    renderTelegramTop();
    renderCategoryFilters();
    renderPromos();
    renderStores();
    applyFilters();
    renderStickyBar();
    renderFooter();
    document.body.classList.add('ready');
});
