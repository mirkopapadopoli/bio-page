# Landing Page "Offerte" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Estrarre la sezione "Offerte" della bio page in una landing page standalone (`offerte.html`) categorizzata, filtrata, con tracking Meta Pixel/Google Ads, pronta per traffico ADS.

**Architecture:** Sito statico esistente (no build step, no framework, no test runner). Nuovi file `offerte.html` + `offerte.js` + `offerte.css` affiancano `index.html`/`script.js`/`style.css` senza toccarli. Fonte dati unica resta `config.js`, esteso con `category` per ogni offerta e un blocco `tracking`. `offerte.js` legge `window.CONFIG.sections` (sezione `id: "deals"`), raggruppa per categoria, gestisce filtro/search/tracking client-side.

**Tech Stack:** HTML/CSS/vanilla JS, Font Awesome (già incluso via CDN in `index.html`, va incluso anche in `offerte.html`), Google Fonts JetBrains Mono/Syne (opzionali per la nuova identità visiva — vedi Task 3).

## Global Constraints

- Nessuna regressione su `index.html` / `script.js` / `style.css`: vanno letti ma non modificati (tranne l'estensione dati in `config.js`, che è additiva e retro-compatibile).
- Niente framework, niente build step, niente dipendenze npm nuove — coerente con lo stack esistente (vanilla JS, CDN per Font Awesome/Google Fonts).
- Categorie ammesse (esattamente queste 6 stringhe): `moda`, `beauty`, `tech`, `casa`, `famiglia`, `marketplace`.
- Se `config.js.tracking.metaPixelId` o `.googleAdsId` sono stringa vuota, il relativo script di tracking non deve essere iniettato e non deve comparire nessun errore in console.
- Disclaimer di trasparenza affiliazione sempre visibile in footer, testo esatto: "Questa pagina contiene link di affiliazione. Se acquisti tramite questi link potrei ricevere una piccola commissione, senza costi aggiuntivi per te."
- Questo repo non ha un test runner configurato (nessun `jest`/`vitest` in `package.json`). Le verifiche di questo piano usano `node -e` con uno stub `global.window = {}` per validare i dati di `config.js` (già verificato funzionante) e verifica manuale in browser per il rendering/UX. Non introdurre un test framework: sarebbe fuori scope per un sito statico senza build step.

---

### Task 1: Estendere `config.js` con categorie e blocco tracking

**Files:**
- Modify: `config.js:86-304` (sezione `deals`, 30 oggetti link)
- Modify: `config.js` (fine oggetto `CONFIG`, dopo `settings`, prima della chiusura `};`)

**Interfaces:**
- Produces: ogni oggetto in `CONFIG.sections.find(s => s.id === 'deals').links` ha ora anche `category: string` (uno tra `moda`, `beauty`, `tech`, `casa`, `famiglia`, `marketplace`).
- Produces: `CONFIG.tracking = { metaPixelId: string, googleAdsId: string }` (entrambi stringa vuota `""` di default).

- [ ] **Step 1: Aggiungere `category` a ognuno dei 30 oggetti in `sections.deals.links`**

Mappatura da applicare (per `title` esatto in config.js):

| title | category |
|---|---|
| AliExpress IT | marketplace |
| Marionnaud | beauty |
| PcComponentes.it | tech |
| QVC Italia | marketplace |
| Samsung IT – Galaxy S26 Ultra | tech |
| JD Sports Italia | moda |
| Mango Italia | moda |
| Foot Locker Italy | moda |
| Acqua di Marzamemi | beauty |
| LeLang Advanced Skin Care | beauty |
| Adidas Italia | moda |
| Michael Kors Italia | moda |
| KIKO Milano | beauty |
| THE B'S – Moda Lusso | moda |
| Levi's Italia | moda |
| New Balance Italia | moda |
| Notino Italia | beauty |
| Westwing Outlet | casa |
| Westwing – Nuove Offerte | casa |
| Charlotte Tilbury IT | beauty |
| Dorelan IT | casa |
| Prenatal IT | famiglia |
| Privé by Zalando IT | moda |
| Etrusca Gioielli | moda |
| Lenovo Italia – Laptop e Notebook | tech |
| ChicMe – Moda Donna | moda |
| Boardmix – Whiteboard AI | tech |
| Alibaba.com – Sourcing Globale B2B | marketplace |
| Turbo VPN – Protezione Online | tech |
| AliExpress Best Deals | marketplace |

Esempio concreto per i primi due oggetti (`config.js:90-103`), il campo `category` va aggiunto come ultima proprietà di ogni oggetto:

```javascript
{
    title: "AliExpress IT",
    description: "Offerte selezionate su AliExpress",
    icon: "https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128",
    url: "https://aliexpress-it.mtpc.se/6203629",
    style: "default",
    category: "marketplace"
},
{
    title: "Marionnaud",
    description: "Profumi, Make up, Trattamenti Viso e Corpo",
    icon: "https://www.google.com/s2/favicons?domain=marionnaud.it&sz=128",
    url: "https://marionnaud.mtpc.se/6171483",
    style: "default",
    category: "beauty"
},
```

Applicare lo stesso pattern (aggiungere `category: "<valore dalla tabella>"` come ultima riga prima della `}` di chiusura) a tutti i restanti 28 oggetti della sezione `deals`, rispettando l'ordine e i valori della tabella sopra. Per gli oggetti che hanno già un campo `badge` (Charlotte Tilbury IT, Prenatal IT, Boardmix – Whiteboard AI, Turbo VPN – Protezione Online), `category` va aggiunto dopo `badge`.

- [ ] **Step 2: Aggiungere il blocco `tracking` a `CONFIG`**

In `config.js`, subito dopo la chiusura di `settings: { ... }` (prima del `};` finale che chiude `const CONFIG = { ... }`), aggiungere:

```javascript
    settings: {
        typingSpeed: 80,
        footerText: "Made with ❤️ by Mirko Papadopoli",
        meta: {
            title: "Mirko Papadopoli | Links",
            description: "Mirko Papadopoli - Appassionato di Informatica e AI. Tutorial e consigli per semplificare la tua esperienza digitale.",
            author: "Mirko Papadopoli"
        }
    },

    tracking: {
        metaPixelId: "",
        googleAdsId: ""
    }
};
```

(Nota: la virgola dopo la chiusura di `settings: { ... }` va aggiunta, dato che ora `tracking` segue.)

- [ ] **Step 3: Verificare che `config.js` sia sintatticamente valido e i dati siano corretti**

Run:
```bash
node -e "
global.window = {};
require('./config.js');
const deals = window.CONFIG.sections.find(s => s.id === 'deals').links;
console.log('totale offerte:', deals.length);
console.log('senza categoria:', deals.filter(l => !l.category).length);
console.log('categorie uniche:', [...new Set(deals.map(l => l.category))].sort());
console.log('tracking:', JSON.stringify(window.CONFIG.tracking));
"
```

Expected output:
```
totale offerte: 30
senza categoria: 0
categorie uniche: [ 'beauty', 'casa', 'famiglia', 'marketplace', 'moda', 'tech' ]
tracking: {"metaPixelId":"","googleAdsId":""}
```

- [ ] **Step 4: Verificare che `index.html`/`script.js` non abbiano regressioni**

Run: `npm run dev` (avvia `server.js` in background), poi in un altro terminale:
```bash
curl -s http://localhost:8000/ | grep -c "sections-container"
```
Expected: `1` (la pagina si carica ancora, il markup base è invariato). Poi fermare il server (`Ctrl+C` o `kill` il processo node).

- [ ] **Step 5: Commit**

```bash
git add config.js
git commit -m "feat: add category and tracking config to deals section"
```

---

### Task 2: Creare `offerte.html` (markup + meta SEO + tracking scripts)

**Files:**
- Create: `offerte.html`

**Interfaces:**
- Consumes: `config.js` (script tag, caricato prima di `offerte.js`), `CONFIG.tracking.metaPixelId`, `CONFIG.tracking.googleAdsId`.
- Produces: contenitori DOM con questi id, che `offerte.js` (Task 4) popolerà: `#offerte-hero`, `#category-filters`, `#offerte-search-input`, `#offerte-search-clear`, `#offerte-grid`, `#offerte-footer`. Produce anche l'hook globale `window.CONFIG` (già esposto da `config.js`).

- [ ] **Step 1: Scrivere `offerte.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Le migliori offerte selezionate da Mirko Papadopoli: moda, beauty, tech, casa e molto altro. Sconti verificati, aggiornati ogni settimana.">
    <meta name="author" content="Mirko Papadopoli">

    <meta property="og:title" content="Le migliori offerte selezionate | Mirko Papadopoli">
    <meta property="og:description" content="Sconti e offerte verificate su moda, beauty, tech, casa e altro. Aggiornate ogni settimana.">
    <meta property="og:type" content="website">

    <title>Le migliori offerte selezionate | Mirko Papadopoli</title>

    <link rel="icon" type="image/png" sizes="192x192" href="img/icon-192x192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="offerte.css">
</head>
<body>
    <div id="offerte-hero"></div>

    <div class="offerte-container">
        <nav id="category-filters" class="category-filters"></nav>

        <div class="offerte-search-wrapper">
            <i class="fas fa-search offerte-search-icon"></i>
            <input
                type="text"
                id="offerte-search-input"
                class="offerte-search-input"
                placeholder="Cerca tra le offerte..."
                autocomplete="off"
            >
            <button id="offerte-search-clear" class="offerte-search-clear" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div id="offerte-grid" class="offerte-grid"></div>
    </div>

    <footer id="offerte-footer" class="offerte-footer"></footer>

    <script src="config.js"></script>
    <script src="offerte.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificare che il file sia HTML valido e i riferimenti ai file esistano**

Run:
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('offerte.html', 'utf8');
['config.js', 'offerte.js', 'offerte.css'].forEach(f => {
  if (!html.includes(f)) throw new Error('missing reference to ' + f);
});
['offerte-hero', 'category-filters', 'offerte-search-input', 'offerte-search-clear', 'offerte-grid', 'offerte-footer'].forEach(id => {
  if (!html.includes('id=\"' + id + '\"')) throw new Error('missing id ' + id);
});
console.log('offerte.html: tutti i riferimenti e gli id richiesti sono presenti');
"
```
Expected: `offerte.html: tutti i riferimenti e gli id richiesti sono presenti`

(Nota: a questo punto `offerte.js` e `offerte.css` non esistono ancora — verranno creati nei Task 3 e 4. Il browser mostrerà una pagina vuota finché non sono presenti; è atteso.)

- [ ] **Step 3: Commit**

```bash
git add offerte.html
git commit -m "feat: add offerte.html landing page markup"
```

---

### Task 3: Creare `offerte.css` (identità visiva dedicata)

**Files:**
- Create: `offerte.css`

**Interfaces:**
- Consumes: nessuna dipendenza da altri file CSS (identità visiva indipendente da `style.css`).
- Produces: classi CSS consumate da `offerte.js` (Task 4): `.hero`, `.hero-badge`, `.hero-title`, `.hero-subtitle`, `.hero-cta`, `.category-filters`, `.category-pill`, `.category-pill.active`, `.offerte-search-wrapper`, `.offerte-search-icon`, `.offerte-search-input`, `.offerte-search-clear`, `.offerte-grid`, `.offer-card`, `.offer-card-icon`, `.offer-card-icon img`, `.offer-card-title`, `.offer-card-description`, `.offer-card-badge`, `.offer-card-cta`, `.offerte-footer`, `.offerte-disclaimer`, `.offerte-footer-links`, `.offer-card.hidden`.

- [ ] **Step 1: Scrivere `offerte.css`**

```css
/* =============================================================================
   OFFERTE.CSS — Identità visiva dedicata per landing ADS
   Palette chiara, alto contrasto, CTA-focused (diversa dal tema dark della bio page)
   ============================================================================= */

:root {
    --offerte-bg: #f7f7fb;
    --offerte-surface: #ffffff;
    --offerte-text: #1a1a2e;
    --offerte-text-muted: #6b6b80;
    --offerte-primary: #ff5252;
    --offerte-primary-dark: #d63d3d;
    --offerte-accent: #2d2d6e;
    --offerte-border: #e6e6ef;
    --offerte-badge-bg: #ffe8e8;
    --offerte-badge-text: #d63d3d;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--offerte-bg);
    color: var(--offerte-text);
    line-height: 1.5;
}

/* ---------- HERO ---------- */

.hero {
    background: linear-gradient(135deg, var(--offerte-accent), #4a4a9e);
    color: #fff;
    padding: 56px 20px 72px;
    text-align: center;
}

.hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
}

.hero-title {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 800;
    margin-bottom: 12px;
}

.hero-subtitle {
    font-size: clamp(15px, 2.5vw, 18px);
    color: rgba(255, 255, 255, 0.85);
    max-width: 560px;
    margin: 0 auto 24px;
}

.hero-cta {
    display: inline-block;
    background: var(--offerte-primary);
    color: #fff;
    font-weight: 700;
    padding: 14px 32px;
    border-radius: 999px;
    text-decoration: none;
    font-size: 16px;
    transition: transform 0.15s ease, background 0.15s ease;
}

.hero-cta:hover {
    background: var(--offerte-primary-dark);
    transform: translateY(-2px);
}

/* ---------- CONTAINER ---------- */

.offerte-container {
    max-width: 1100px;
    margin: -40px auto 0;
    padding: 0 20px 60px;
    position: relative;
}

/* ---------- FILTRI CATEGORIA ---------- */

.category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    background: var(--offerte-surface);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
}

.category-pill {
    border: 1px solid var(--offerte-border);
    background: var(--offerte-surface);
    color: var(--offerte-text-muted);
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
}

.category-pill:hover {
    border-color: var(--offerte-primary);
    color: var(--offerte-primary);
}

.category-pill.active {
    background: var(--offerte-primary);
    border-color: var(--offerte-primary);
    color: #fff;
}

/* ---------- SEARCH ---------- */

.offerte-search-wrapper {
    position: relative;
    margin-bottom: 24px;
}

.offerte-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--offerte-text-muted);
}

.offerte-search-input {
    width: 100%;
    padding: 14px 44px;
    border-radius: 12px;
    border: 1px solid var(--offerte-border);
    background: var(--offerte-surface);
    font-size: 15px;
    color: var(--offerte-text);
}

.offerte-search-input:focus {
    outline: none;
    border-color: var(--offerte-primary);
}

.offerte-search-clear {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--offerte-text-muted);
    cursor: pointer;
    font-size: 15px;
}

/* ---------- GRIGLIA OFFERTE ---------- */

.offerte-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
}

.offer-card {
    background: var(--offerte-surface);
    border: 1px solid var(--offerte-border);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.offer-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.offer-card.hidden {
    display: none;
}

.offer-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--offerte-bg);
}

.offer-card-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.offer-card-title {
    font-size: 16px;
    font-weight: 700;
}

.offer-card-description {
    font-size: 14px;
    color: var(--offerte-text-muted);
    flex-grow: 1;
}

.offer-card-badge {
    display: inline-block;
    background: var(--offerte-badge-bg);
    color: var(--offerte-badge-text);
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    width: fit-content;
}

.offer-card-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--offerte-primary);
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    padding: 10px 16px;
    border-radius: 10px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.15s ease;
}

.offer-card-cta:hover {
    background: var(--offerte-primary-dark);
}

/* ---------- FOOTER ---------- */

.offerte-footer {
    background: var(--offerte-surface);
    border-top: 1px solid var(--offerte-border);
    padding: 32px 20px;
    text-align: center;
}

.offerte-disclaimer {
    font-size: 13px;
    color: var(--offerte-text-muted);
    max-width: 560px;
    margin: 0 auto 16px;
}

.offerte-footer-links {
    display: flex;
    gap: 16px;
    justify-content: center;
    font-size: 14px;
}

.offerte-footer-links a {
    color: var(--offerte-primary);
    text-decoration: none;
    font-weight: 600;
}

/* ---------- RESPONSIVE ---------- */

@media (max-width: 480px) {
    .hero {
        padding: 40px 16px 60px;
    }

    .offerte-grid {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 2: Verificare che il file sia sintatticamente valido**

Run: `node -e "require('fs').readFileSync('offerte.css', 'utf8').length > 0 && console.log('offerte.css letto correttamente')"`
Expected: `offerte.css letto correttamente`

(Verifica visiva completa avviene nel Task 5, dopo che `offerte.js` genera markup reale da testare nel browser.)

- [ ] **Step 3: Commit**

```bash
git add offerte.css
git commit -m "feat: add dedicated offerte.css visual identity"
```

---

### Task 4: Creare `offerte.js` (rendering, filtri, search, tracking)

**Files:**
- Create: `offerte.js`

**Interfaces:**
- Consumes: `window.CONFIG.sections` (trova sezione con `id === 'deals'`), `window.CONFIG.tracking.metaPixelId`, `window.CONFIG.tracking.googleAdsId`. Ogni link ha: `title`, `description`, `icon`, `url`, `style`, `category`, `badge?` (come definiti in Task 1).
- Produces: popola `#offerte-hero`, `#category-filters`, `#offerte-grid`, `#offerte-footer` definiti in Task 2. Espone `window.trackOfferClick(brand, category)` (chiamata dagli `onclick` generati nel markup delle card).

- [ ] **Step 1: Scrivere `offerte.js`**

```javascript
// =============================================================================
// 🛍️ OFFERTE.JS — Landing page dedicata per traffico ADS
// =============================================================================

const CATEGORY_LABELS = {
    moda: 'Moda & Accessori',
    beauty: 'Beauty & Skincare',
    tech: 'Tech & Elettronica',
    casa: 'Casa & Arredamento',
    famiglia: 'Famiglia',
    marketplace: 'Marketplace'
};

let currentCategory = 'all';
let currentSearchTerm = '';

function getDeals() {
    const section = window.CONFIG.sections.find(s => s.id === 'deals');
    return section ? section.links : [];
}

function isImageIcon(icon) {
    return icon && (
        icon.startsWith('http') ||
        icon.includes('.png') ||
        icon.includes('.jpg') ||
        icon.includes('.jpeg') ||
        icon.includes('.gif') ||
        icon.includes('.svg') ||
        icon.includes('.webp')
    );
}

function renderHero() {
    const deals = getDeals();
    const hero = document.getElementById('offerte-hero');
    hero.innerHTML = `
        <div class="hero">
            <span class="hero-badge">🔥 ${deals.length}+ offerte verificate</span>
            <h1 class="hero-title">Le migliori offerte, selezionate per te</h1>
            <p class="hero-subtitle">Sconti su moda, beauty, tech, casa e altro. Aggiornate ogni settimana da Mirko Papadopoli.</p>
            <a href="#offerte-grid" class="hero-cta">Scopri le offerte ↓</a>
        </div>
    `;
}

function renderCategoryFilters() {
    const deals = getDeals();
    const categoriesPresent = [...new Set(deals.map(l => l.category))];
    const nav = document.getElementById('category-filters');

    const allPill = `<button class="category-pill active" data-category="all">Tutte</button>`;
    const pills = categoriesPresent.map(cat =>
        `<button class="category-pill" data-category="${cat}">${CATEGORY_LABELS[cat] || cat}</button>`
    ).join('');

    nav.innerHTML = allPill + pills;

    nav.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            nav.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            applyFilters();
        });
    });
}

function createOfferCard(link) {
    const iconContent = isImageIcon(link.icon)
        ? `<img src="${link.icon}" alt="${link.title}" loading="lazy">`
        : `<i class="${link.icon}"></i>`;
    const badge = link.badge ? `<span class="offer-card-badge">${link.badge}</span>` : '';

    return `
        <div class="offer-card" data-category="${link.category}" data-title="${link.title.toLowerCase()}" data-description="${link.description.toLowerCase()}">
            <div class="offer-card-icon">${iconContent}</div>
            <h3 class="offer-card-title">${link.title}</h3>
            <p class="offer-card-description">${link.description}</p>
            ${badge}
            <button class="offer-card-cta" onclick="trackOfferClick('${link.title.replace(/'/g, "\\'")}', '${link.category}', '${link.url}')">
                Vedi offerta <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

function renderGrid() {
    const deals = getDeals();
    const grid = document.getElementById('offerte-grid');
    grid.innerHTML = deals.map(createOfferCard).join('');
}

function applyFilters() {
    const cards = document.querySelectorAll('.offer-card');
    cards.forEach(card => {
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

function renderFooter() {
    const footer = document.getElementById('offerte-footer');
    footer.innerHTML = `
        <p class="offerte-disclaimer">Questa pagina contiene link di affiliazione. Se acquisti tramite questi link potrei ricevere una piccola commissione, senza costi aggiuntivi per te.</p>
        <div class="offerte-footer-links">
            <a href="index.html">← Torna alla bio page</a>
            <a href="https://beacons.ai/mirkopapadopoli/mediakit" target="_blank" rel="noopener noreferrer">Media Kit</a>
        </div>
    `;
}

// ---------- TRACKING ----------

function loadTrackingScripts() {
    const tracking = window.CONFIG.tracking || {};

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

function trackOfferClick(brand, category, url) {
    const tracking = window.CONFIG.tracking || {};

    if (tracking.metaPixelId && typeof fbq === 'function') {
        fbq('track', 'Lead', { content_name: brand });
    }

    if (tracking.googleAdsId && typeof gtag === 'function') {
        gtag('event', 'click_offer', { brand: brand, category: category });
    }

    window.open(url, '_blank', 'noopener,noreferrer');
}

window.trackOfferClick = trackOfferClick;

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', () => {
    loadTrackingScripts();
    renderHero();
    renderCategoryFilters();
    renderGrid();
    setupSearch();
    renderFooter();
});
```

- [ ] **Step 2: Verificare che `offerte.js` sia sintatticamente valido**

Run: `node --check offerte.js`
Expected: nessun output (exit code 0 = sintassi valida).

- [ ] **Step 3: Verificare la logica di raggruppamento categorie in isolamento (senza DOM)**

Run:
```bash
node -e "
global.window = {};
require('./config.js');
const deals = window.CONFIG.sections.find(s => s.id === 'deals').links;
const categoriesPresent = [...new Set(deals.map(l => l.category))];
console.log('categorie presenti nella griglia:', categoriesPresent.sort());
if (categoriesPresent.length !== 6) throw new Error('attese 6 categorie, trovate ' + categoriesPresent.length);
console.log('OK: 6 categorie confermate');
"
```
Expected:
```
categorie presenti nella griglia: [ 'beauty', 'casa', 'famiglia', 'marketplace', 'moda', 'tech' ]
OK: 6 categorie confermate
```

- [ ] **Step 4: Commit**

```bash
git add offerte.js
git commit -m "feat: add offerte.js rendering, filters, search and tracking logic"
```

---

### Task 5: Verifica end-to-end in browser (manuale)

**Files:** nessuno (solo verifica, nessuna modifica).

**Interfaces:**
- Consumes: `offerte.html`, `offerte.js`, `offerte.css`, `config.js` (tutti i task precedenti).

- [ ] **Step 1: Avviare il server locale**

Run: `npm run dev` (avvia `server.js`, di norma su `http://localhost:8000`).

- [ ] **Step 2: Aprire `http://localhost:8000/offerte.html` nel browser e verificare manualmente:**

- Hero visibile con conteggio "30+ offerte verificate" e headline.
- Pills categoria visibili: Tutte, Moda & Accessori, Beauty & Skincare, Tech & Elettronica, Casa & Arredamento, Famiglia, Marketplace.
- Click su ogni pill filtra correttamente la griglia (es. "Famiglia" mostra solo Prenatal IT).
- Search "kiko" mostra solo KIKO Milano; clear search ripristina tutte le card della categoria attiva.
- Badge visibili su Charlotte Tilbury IT ("CODICE SCONTO: DARLING15"), Prenatal IT ("CODICE SAVETEN"), Boardmix ("LIFETIME DEAL"), Turbo VPN ("-72%").
- Click su "Vedi offerta" apre l'URL corretto in una nuova tab.
- Footer mostra il disclaimer esatto e i link "← Torna alla bio page" / "Media Kit".
- Aprire la console DevTools: nessun errore (con `tracking.metaPixelId`/`googleAdsId` vuoti, nessuno script Pixel/gtag viene caricato, nessun errore `fbq is not defined`).
- Ridurre la finestra a larghezza mobile (~375px): griglia diventa colonna singola, hero e filtri restano leggibili.

- [ ] **Step 3: Verificare che `index.html` non abbia regressioni**

Aprire `http://localhost:8000/index.html`, verificare che la tab "🔥 Migliori Offerte Selezionate" mostri ancora tutti i 30 link come prima (il campo `category` extra non deve alterare il rendering esistente).

- [ ] **Step 4: Fermare il server locale**

Terminare il processo `node server.js` (Ctrl+C nel terminale dove è stato avviato con `npm run dev`).

- [ ] **Step 5: Commit finale (se durante la verifica sono emerse piccole correzioni)**

Se il Task 5 non ha richiesto modifiche a nessun file, questo step si salta. Se sono emerse correzioni minori (es. un typo, un colore da aggiustare), applicarle e:

```bash
git add offerte.html offerte.js offerte.css config.js
git commit -m "fix: address issues found during manual browser verification"
```

---

## Note per l'attivazione del tracking (post-implementazione)

Il `metaPixelId` e il `googleAdsId` in `config.js` sono vuoti di default. Per attivare il tracking sulle campagne ADS, modificare `config.js`:

```javascript
tracking: {
    metaPixelId: "1234567890123456",   // Pixel ID da Meta Events Manager
    googleAdsId: "AW-1234567890"       // Conversion ID da Google Ads / GA4
}
```

Nessuna altra modifica a codice è necessaria: `offerte.js` inietta gli script automaticamente appena questi ID sono valorizzati.
