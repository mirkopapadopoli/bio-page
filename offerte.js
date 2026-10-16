// =============================================================================
// 🛍️ OFFERTE.JS — Landing "Affari al Volo"
// Dati: offers.json. Conversione primaria: click sull'offerta (link affiliato).
// La CTA Telegram si adatta alla fonte del traffico (?src=):
//   ads → Telegram in alto + sticky bar (l'iscritto vale più di un click singolo)
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
const SEARCH_MIN_STORES = 12;

// Aggiorna questo numero manualmente (o collegalo a un endpoint reale).
const MEMBER_COUNT_LABEL = '15.200+';

const SRC = (new URLSearchParams(window.location.search).get('src') || 'organic').toLowerCase();

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

// Promo da mostrare in card: quella dello store scout, oppure il codice
// sconto Metapic (offer.code) se non c'è una promo.
function promoOf(offer) {
    const p = offer.promo;
    if (p && p.title && !(p.until && endOfDay(p.until) < new Date())) return p;
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
        <p>Usiamo cookie tecnici e, con il tuo consenso, cookie di misurazione (Meta Pixel, Google Ads) per capire quali offerte funzionano meglio. <a href="privacy.html">Privacy & Cookie Policy</a>.</p>
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

function track(eventName, params = {}) {
    params = { src: SRC, ...params };
    console.log('[track]', eventName, params);

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

function telegramCard(placement, title, sub) {
    return `
        <aside class="tg-card">
            <div class="tg-card-text">
                <strong>${title}</strong>
                <span>${sub}</span>
            </div>
            <a href="${telegramUrl()}" class="tg-btn" data-tg="${placement}" target="_blank" rel="noopener noreferrer">Entra gratis</a>
        </aside>`;
}

function renderTelegramTop() {
    if (SRC !== 'ads') return;
    document.getElementById('tg-top').innerHTML = telegramCard(
        'top',
        '🔔 Ricevi le promo ogni mattina su Telegram',
        `${MEMBER_COUNT_LABEL} iscritti · gratis · esci quando vuoi`
    );
}

function promoCard(offer) {
    const brand = brandOf(offer);
    const p = promoOf(offer);
    const until = p.until ? `<span class="chip-until">⏱ ${untilLabel(p.until)}</span>` : '';
    const detail = p.detail ? `<p class="promo-detail">${escapeHtml(p.detail)}</p>` : '';
    const code = offer.code ? `
            <button class="promo-code" data-code="${escapeHtml(offer.code)}" data-brand="${escapeHtml(brand)}">
                <span class="promo-code-value">${escapeHtml(offer.code)}</span>
                <span class="promo-code-label">Copia codice</span>
            </button>` : '';
    const verified = p.verified_at ? `<p class="promo-verified">✓ ${verifiedLabel(p.verified_at)} sul sito di ${escapeHtml(brand)}</p>` : '';

    return `
        <article class="promo-card" data-category="${escapeHtml(offer.category)}" data-search="${escapeHtml((brand + ' ' + p.title).toLowerCase())}">
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

function renderPromos() {
    const promos = activeOffers().filter(hasActivePromo);
    const list = document.getElementById('promo-list');
    const sub = document.getElementById('intro-sub');

    if (!promos.length) {
        list.innerHTML = '';
        sub.textContent = 'Le promo del giorno arrivano a breve: intanto ecco i negozi partner.';
        return;
    }

    sub.textContent = `${promos.length} ${promos.length === 1 ? 'promo attiva' : 'promo attive'} oggi, prese dai siti dei negozi e controllate ogni mattina.`;

    const cards = promos.map(promoCard);
    if (showTelegram() && SRC !== 'ads') {
        const at = Math.min(TELEGRAM_AFTER_PROMO, cards.length);
        cards.splice(at, 0, telegramCard(
            'inline',
            '🔔 Vuoi queste promo ogni mattina?',
            `Le mandiamo su Telegram a ${MEMBER_COUNT_LABEL} iscritti. Gratis.`
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
        <a href="${telegramUrl()}" data-tg="sticky" target="_blank" rel="noopener noreferrer">🔔 Promo ogni mattina su Telegram · Entra gratis</a>
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
            <h1>Ops, le offerte non si caricano 😅</h1>
            <p>Le trovi tutte sul canale Telegram, aggiornate ogni giorno.</p>
            <a href="${FALLBACK_TELEGRAM}" class="tg-btn" data-tg="fallback" target="_blank" rel="noopener noreferrer">Apri il canale</a>
        </div>`;
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', async () => {
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
