# Landing "Affari al Volo" (offerte.html) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trasformare `offerte.html` da directory generica brandizzata "Mirko Papadopoli" a landing ADV faceless "Affari al Volo" con funnel Telegram-first e dati in `offers.json`.

**Architecture:** Sito statico vanilla (HTML/CSS/JS, zero build, deploy Netlify). I dati offerte escono da `config.js` e vanno in `offers.json` (fonte di verità per la landing; `config.js` resta invariato per `index.html`). `offerte.js` fa fetch del JSON, renderizza hero/top-codici/griglia/CTA Telegram e traccia gli eventi.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla (ES2020: fetch, async/await, URLSearchParams, Clipboard API), Meta Pixel + gtag già gestiti da `config.js` → `window.CONFIG.tracking`.

**Spec di riferimento:** `docs/superpowers/specs/2026-07-07-offerte-landing-design.md`

## Global Constraints

- Nessun framework, nessun build step, nessuna nuova dipendenza.
- Brand frontend: **Affari al Volo** — il nome "Mirko Papadopoli" appare SOLO nel footer come "Un progetto di Mirko Papadopoli".
- Canale Telegram: `https://t.me/affarialvoloo` — MA l'URL deve essere letto da `offers.json` campo `telegram` (configurabile per invite link tracciati).
- Headline hero esatta: `Offerte e codici sconto verificati, ogni giorno`.
- CTA Telegram esatta: `🔔 Entra nel canale gratis`.
- Nessun timer/scarcity finto: la scadenza si mostra solo se presente il campo `expiry`.
- Offerte con `expiry` passata: nascoste dal rendering.
- Eventi tracking: `join_telegram` (fbq `Lead` + gtag), `click_offer` (fbq custom `ClickOffer` + gtag), `copy_code` (fbq custom + gtag).
- `config.js` NON si tocca (resta per index.html e per gli ID tracking `window.CONFIG.tracking`).
- Non c'è test framework nel repo: la verifica è `node --check`, `node -e` per il JSON, server locale + browser. `fetch('offers.json')` NON funziona da `file://` — servire sempre con `python3 -m http.server`.

---

### Task 1: Asset logo + offers.json

**Files:**
- Create: `img/affarialvolo-logo.png` (copiato da `/Users/mirkopapadopoli/Code/BotTelegram/data/logo.png`)
- Create: `offers.json`

**Interfaces:**
- Produces: `offers.json` con schema `{ updated: string ISO-date, telegram: string URL, trustBrands: string[] domini, offers: Offer[] }` dove `Offer = { title, description, icon, url, category, code?, discount?, expiry?, featured? }`. `offerte.js` (Task 4) consuma esattamente questi nomi campo. Il logo è referenziato come `img/affarialvolo-logo.png` in Task 4.

- [ ] **Step 1: Copia il logo**

```bash
cp "/Users/mirkopapadopoli/Code/BotTelegram/data/logo.png" img/affarialvolo-logo.png
```

- [ ] **Step 2: Crea offers.json**

Contenuto completo (i 30 deal estratti da `config.js` sezione `deals`; i vecchi `badge` diventano campi strutturati `code`/`discount`; Charlotte Tilbury e Prenatal marcate `featured` perché hanno un codice):

```json
{
  "updated": "2026-07-07",
  "telegram": "https://t.me/affarialvoloo",
  "trustBrands": ["adidas.it", "samsung.com", "levi.com", "kikocosmetics.com", "notino.it", "zalando.it"],
  "offers": [
    {
      "title": "Charlotte Tilbury IT",
      "description": "-15% extra e spedizione gratuita sul make-up Charlotte Tilbury",
      "icon": "https://www.google.com/s2/favicons?domain=charlottetilbury.com&sz=128",
      "url": "https://charlotte-tilbury-it.mtpc.se/6207589",
      "category": "beauty",
      "code": "DARLING15",
      "discount": "-15% extra",
      "featured": true
    },
    {
      "title": "Prenatal IT",
      "description": "Abbigliamento, accessori e prodotti per neonati e bambini",
      "icon": "https://www.google.com/s2/favicons?domain=prenatal.it&sz=128",
      "url": "https://prenatal-it.mtpc.se/6271619",
      "category": "famiglia",
      "code": "SAVETEN",
      "featured": true
    },
    {
      "title": "Turbo VPN – Protezione Online",
      "description": "72% di sconto sul piano Gold 27 mesi – solo €3,33/mese",
      "icon": "https://www.google.com/s2/favicons?domain=turbovpn.com&sz=128",
      "url": "https://grfpr.com/c/exe221unkp36ba321f24ddf84d4c0b/",
      "category": "tech",
      "discount": "-72%"
    },
    {
      "title": "Boardmix – Whiteboard AI",
      "description": "Lifetime deal: mappe mentali, flowchart e 100+ agenti AI",
      "icon": "https://www.google.com/s2/favicons?domain=boardmix.com&sz=128",
      "url": "https://axavl.com/c/3tevoaw5qq36ba321f24d12233f6f4/",
      "category": "tech",
      "discount": "Lifetime deal"
    },
    {
      "title": "AliExpress IT",
      "description": "Offerte selezionate su AliExpress",
      "icon": "https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128",
      "url": "https://aliexpress-it.mtpc.se/6203629",
      "category": "marketplace"
    },
    {
      "title": "Marionnaud",
      "description": "Profumi, Make up, Trattamenti Viso e Corpo",
      "icon": "https://www.google.com/s2/favicons?domain=marionnaud.it&sz=128",
      "url": "https://marionnaud.mtpc.se/6171483",
      "category": "beauty"
    },
    {
      "title": "PcComponentes.it",
      "description": "Negozio online di computer e tecnologia",
      "icon": "https://www.google.com/s2/favicons?domain=pccomponentes.it&sz=128",
      "url": "https://pc-componentes-it.mtpc.se/6141649",
      "category": "tech"
    },
    {
      "title": "QVC Italia",
      "description": "Bellezza, Moda, Casa ed Elettronica",
      "icon": "https://www.google.com/s2/favicons?domain=qvc.it&sz=128",
      "url": "https://qvc.mtpc.se/6123714",
      "category": "marketplace"
    },
    {
      "title": "Samsung IT – Galaxy S26 Ultra",
      "description": "Acquista Galaxy S26 Ultra – Prezzi e offerte",
      "icon": "https://www.google.com/s2/favicons?domain=samsung.com&sz=128",
      "url": "https://samsung-it.mtpc.se/6165130",
      "category": "tech"
    },
    {
      "title": "JD Sports Italia",
      "description": "Shop online di scarpe e abbigliamento sportivo",
      "icon": "https://www.google.com/s2/favicons?domain=jdsports.it&sz=128",
      "url": "https://jd-sports-it.mtpc.se/6162304",
      "category": "moda"
    },
    {
      "title": "Mango Italia",
      "description": "Moda donna e uomo – stile contemporaneo",
      "icon": "https://www.google.com/s2/favicons?domain=mango.com&sz=128",
      "url": "https://mango-it.mtpc.se/6161172",
      "category": "moda"
    },
    {
      "title": "Foot Locker Italy",
      "description": "Sneaker iconiche e abbigliamento sportivo",
      "icon": "https://www.google.com/s2/favicons?domain=footlocker.it&sz=128",
      "url": "https://footlocker.mtpc.se/6161153",
      "category": "moda"
    },
    {
      "title": "Acqua di Marzamemi",
      "description": "Fragranze di nicchia ispirate alla Sicilia",
      "icon": "https://www.google.com/s2/favicons?domain=acquadimarzamemi.com&sz=128",
      "url": "https://acqua-di-marzamemi.mtpc.se/6147237",
      "category": "beauty"
    },
    {
      "title": "LeLang Advanced Skin Care",
      "description": "Skincare avanzata per una pelle luminosa e giovane",
      "icon": "https://www.google.com/s2/favicons?domain=lelangcare.com&sz=128",
      "url": "https://lelang-skincare.mtpc.se/6147235",
      "category": "beauty"
    },
    {
      "title": "Adidas Italia",
      "description": "Sport, streetwear e stile – il meglio di Adidas",
      "icon": "https://www.google.com/s2/favicons?domain=adidas.it&sz=128",
      "url": "https://adidas-it-new.mtpc.se/6141152",
      "category": "moda"
    },
    {
      "title": "Michael Kors Italia",
      "description": "Borse, accessori e moda di lusso accessibile",
      "icon": "https://www.google.com/s2/favicons?domain=michaelkors.com&sz=128",
      "url": "https://michael-kors-it.mtpc.se/6141124",
      "category": "moda"
    },
    {
      "title": "KIKO Milano",
      "description": "Make up occhi, viso e labbra e cura della pelle",
      "icon": "https://www.google.com/s2/favicons?domain=kikocosmetics.com&sz=128",
      "url": "https://kiko-milano-it.mtpc.se/6125968",
      "category": "beauty"
    },
    {
      "title": "THE B'S – Moda Lusso",
      "description": "Abbigliamento e accessori di lusso 2026",
      "icon": "https://www.google.com/s2/favicons?domain=thebs.com&sz=128",
      "url": "https://thebs.mtpc.se/6124875",
      "category": "moda"
    },
    {
      "title": "Levi's Italia",
      "description": "Il denim più iconico al mondo con sconti esclusivi",
      "icon": "https://www.google.com/s2/favicons?domain=levi.com&sz=128",
      "url": "https://levis-it.mtpc.se/6123691",
      "category": "moda"
    },
    {
      "title": "New Balance Italia",
      "description": "Scarpe e abbigliamento tecnico per sport e lifestyle",
      "icon": "https://www.google.com/s2/favicons?domain=newbalance.it&sz=128",
      "url": "https://new-balance-it.mtpc.se/6123685",
      "category": "moda"
    },
    {
      "title": "Notino Italia",
      "description": "Profumi, skincare e beauty dai migliori brand",
      "icon": "https://www.google.com/s2/favicons?domain=notino.it&sz=128",
      "url": "https://notino-it.mtpc.se/6125311",
      "category": "beauty"
    },
    {
      "title": "Westwing Outlet",
      "description": "Mobili, decorazioni e tessili per la casa a prezzi scontati",
      "icon": "https://www.google.com/s2/favicons?domain=westwing.it&sz=128",
      "url": "https://westwing-it.mtpc.se/6121136",
      "category": "casa"
    },
    {
      "title": "Westwing – Nuove Offerte",
      "description": "Altre promozioni su arredi, decorazioni e tessili",
      "icon": "https://www.google.com/s2/favicons?domain=westwing.it&sz=128",
      "url": "https://westwing-it.mtpc.se/6188613",
      "category": "casa"
    },
    {
      "title": "Dorelan IT",
      "description": "Materassi, cuscini e sistemi letto Dorelan",
      "icon": "https://www.google.com/s2/favicons?domain=dorelan.com&sz=128",
      "url": "https://dorelan.mtpc.se/6208895",
      "category": "casa"
    },
    {
      "title": "Privé by Zalando IT",
      "description": "Moda e accessori di brand premium a prezzi scontati",
      "icon": "https://www.google.com/s2/favicons?domain=prive.zalando.it&sz=128",
      "url": "https://prive-by-zalando-it.mtpc.se/6273752",
      "category": "moda"
    },
    {
      "title": "Etrusca Gioielli",
      "description": "Gioielli artigianali italiani in oro e argento",
      "icon": "https://www.google.com/s2/favicons?domain=etruscagioielli.it&sz=128",
      "url": "https://etrusca-gioielli.mtpc.se/6282922",
      "category": "moda"
    },
    {
      "title": "Lenovo Italia – Laptop e Notebook",
      "description": "IdeaPad, ThinkPad, Yoga, Legion e tutta la gamma notebook",
      "icon": "https://www.google.com/s2/favicons?domain=lenovo.com&sz=128",
      "url": "https://bednari.com/c/6iia5dppfe36ba321f24cc01b591a8/",
      "category": "tech"
    },
    {
      "title": "ChicMe – Moda Donna",
      "description": "Abbigliamento femminile trendy a prezzi accessibili",
      "icon": "https://www.google.com/s2/favicons?domain=chicme.com&sz=128",
      "url": "https://rzekl.com/c/gf807z8tar36ba321f24312b8f391a/",
      "category": "moda"
    },
    {
      "title": "Alibaba.com – Sourcing Globale B2B",
      "description": "Milioni di prodotti, EU Local Stock, Trade Assurance",
      "icon": "https://www.google.com/s2/favicons?domain=alibaba.com&sz=128",
      "url": "https://rzekl.com/c/pm1aev55cl36ba321f24219aa26f6f/",
      "category": "marketplace"
    },
    {
      "title": "AliExpress Best Deals",
      "description": "Le migliori offerte selezionate su AliExpress",
      "icon": "https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128",
      "url": "https://fas.st/0vFRv",
      "category": "marketplace"
    }
  ]
}
```

- [ ] **Step 3: Verifica JSON valido e completo**

```bash
node -e "
const d = require('./offers.json');
console.assert(d.offers.length === 30, 'attesi 30 offer, trovati ' + d.offers.length);
console.assert(d.telegram.startsWith('https://t.me/'), 'telegram URL mancante');
console.assert(d.offers.filter(o => o.featured && o.code).length === 2, 'attese 2 featured con code');
console.assert(d.offers.every(o => o.title && o.url && o.category && o.icon && o.description), 'campi obbligatori mancanti');
console.log('offers.json OK');
"
```

Expected: `offers.json OK` senza assertion failure.

- [ ] **Step 4: Verifica il logo copiato**

```bash
file img/affarialvolo-logo.png
```

Expected: output contiene `PNG image data`.

- [ ] **Step 5: Commit**

```bash
git add offers.json img/affarialvolo-logo.png
git commit -m "feat: add offers.json data source and Affari al Volo logo asset"
```

---

### Task 2: Rebrand e nuovo markup offerte.html

**Files:**
- Modify: `offerte.html` (riscrittura completa)

**Interfaces:**
- Produces: container con id `offerte-hero`, `offerte-featured`, `category-filters`, `offerte-grid`, `telegram-inline`, `telegram-sticky`, `offerte-footer`, input `offerte-search-input`, bottone `offerte-search-clear`. `offerte.js` (Task 4) seleziona esattamente questi id. Classi CSS usate da Task 3.
- Consumes: niente da task precedenti (i container sono vuoti, riempiti da JS).

- [ ] **Step 1: Riscrivi offerte.html**

Contenuto completo:

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Affari al Volo: offerte e codici sconto verificati ogni giorno su moda, beauty, tech, casa e altro. Entra gratis nel canale Telegram.">

    <meta property="og:title" content="Affari al Volo | Offerte e codici sconto verificati, ogni giorno">
    <meta property="og:description" content="Sconti e codici verificati su moda, beauty, tech, casa e altro. Le migliori offerte le pubblichiamo prima sul canale Telegram.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="img/affarialvolo-logo.png">

    <title>Affari al Volo | Offerte e codici sconto verificati, ogni giorno</title>

    <link rel="icon" type="image/png" href="img/affarialvolo-logo.png">
    <link rel="apple-touch-icon" href="img/affarialvolo-logo.png">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="offerte.css">
</head>
<body>
    <div id="offerte-hero"></div>

    <div class="offerte-container">
        <section id="offerte-featured" class="offerte-featured"></section>

        <section id="telegram-inline" class="telegram-inline"></section>

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

    <div id="telegram-sticky" class="telegram-sticky"></div>

    <footer id="offerte-footer" class="offerte-footer"></footer>

    <script src="config.js"></script>
    <script src="offerte.js"></script>
</body>
</html>
```

Note: `config.js` resta caricato SOLO per `window.CONFIG.tracking` (ID Meta Pixel / gtag). Il blocco `telegram-inline` sta subito dopo `#offerte-featured` come da spec ("blocco inline dopo le top offerte").

- [ ] **Step 2: Verifica assenza brand personale nel markup**

```bash
grep -ci "mirko" offerte.html
```

Expected: `0`.

- [ ] **Step 3: Verifica id presenti**

```bash
for id in offerte-hero offerte-featured category-filters offerte-grid telegram-inline telegram-sticky offerte-footer offerte-search-input; do grep -q "id=\"$id\"" offerte.html && echo "$id OK" || echo "$id MANCANTE"; done
```

Expected: 8 righe `... OK`, nessun `MANCANTE`.

- [ ] **Step 4: Commit**

```bash
git add offerte.html
git commit -m "feat: rebrand offerte.html to Affari al Volo with funnel sections"
```

---

### Task 3: Stili nuove sezioni in offerte.css

**Files:**
- Modify: `offerte.css` (append nuove sezioni + media query search mobile)

**Interfaces:**
- Consumes: classi markup Task 2.
- Produces: classi `hero-logo`, `hero-trust`, `featured-heading`, `featured-grid`, `featured-card`, `featured-card-body`, `featured-code-btn`, `featured-code`, `featured-code-label`, `featured-expiry`, `telegram-inline`, `telegram-cta`, `telegram-sticky`, `telegram-sticky.visible`, `sticky-close`, `offerte-fallback` usate dal rendering in Task 4.

- [ ] **Step 1: Append stili a offerte.css**

Aggiungi in fondo al file (dopo la sezione RESPONSIVE esistente):

```css
/* ---------- HERO: LOGO + TRUST STRIP ---------- */

.hero-logo {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    margin-bottom: 14px;
}

.hero-trust {
    display: flex;
    gap: 14px;
    justify-content: center;
    align-items: center;
    margin-top: 28px;
    opacity: 0.9;
}

.hero-trust img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #fff;
    padding: 3px;
}

/* ---------- TOP CON CODICE SCONTO ---------- */

.offerte-featured {
    margin-bottom: 28px;
}

.featured-heading {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 14px;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.featured-card {
    background: var(--offerte-surface);
    border: 2px solid var(--offerte-primary);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 4px 16px rgba(214, 61, 61, 0.12);
}

.featured-card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
}

.featured-expiry {
    font-size: 12px;
    font-weight: 600;
    color: var(--offerte-badge-text);
}

.featured-code-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    border: 2px dashed var(--offerte-primary);
    background: var(--offerte-badge-bg);
    border-radius: 10px;
    padding: 12px 16px;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s ease;
}

.featured-code-btn:hover {
    background: #ffd9d9;
}

.featured-code {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 1px;
    color: var(--offerte-text);
}

.featured-code-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--offerte-primary-dark);
    white-space: nowrap;
}

/* ---------- BLOCCO TELEGRAM INLINE ---------- */

.telegram-inline {
    margin-bottom: 28px;
}

.telegram-inline-box {
    background: linear-gradient(135deg, #229ed9, #1b7fb0);
    color: #fff;
    border-radius: 16px;
    padding: 24px 20px;
    text-align: center;
}

.telegram-inline-box p {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 14px;
}

.telegram-cta {
    display: inline-block;
    background: #fff;
    color: #1b7fb0;
    font-weight: 800;
    padding: 12px 26px;
    border-radius: 999px;
    text-decoration: none;
    font-size: 15px;
    transition: transform 0.15s ease;
}

.telegram-cta:hover {
    transform: translateY(-2px);
}

/* ---------- STICKY BOTTOM BAR (mobile) ---------- */

.telegram-sticky {
    display: none;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: #229ed9;
    color: #fff;
    padding: 10px 44px 10px 14px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
}

.telegram-sticky.visible {
    display: flex;
}

.telegram-sticky a {
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
}

.sticky-close {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 18px;
    cursor: pointer;
    padding: 6px;
}

/* ---------- FALLBACK ---------- */

.offerte-fallback {
    background: var(--offerte-surface);
    border-radius: 16px;
    padding: 48px 24px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: center;
}

/* ---------- RESPONSIVE: SEARCH NASCOSTA + STICKY SOLO MOBILE ---------- */

@media (min-width: 769px) {
    .telegram-sticky.visible {
        display: none;
    }
}

@media (max-width: 768px) {
    .offerte-search-wrapper {
        display: none;
    }

    body {
        padding-bottom: 56px;
    }
}
```

- [ ] **Step 2: Verifica classi presenti**

```bash
for cls in hero-logo hero-trust featured-card featured-code-btn telegram-inline-box telegram-sticky sticky-close offerte-fallback; do grep -q "\.$cls" offerte.css && echo "$cls OK" || echo "$cls MANCANTE"; done
```

Expected: 8 righe `... OK`.

- [ ] **Step 3: Commit**

```bash
git add offerte.css
git commit -m "feat: add styles for featured codes, Telegram CTAs and sticky bar"
```

---

### Task 4: Riscrittura offerte.js

**Files:**
- Modify: `offerte.js` (riscrittura completa)

**Interfaces:**
- Consumes: `offers.json` (schema Task 1), id DOM (Task 2), classi CSS (Task 3), `window.CONFIG.tracking` da `config.js`.
- Produces: pagina funzionante; nessun altro task consuma API da qui.

- [ ] **Step 1: Riscrivi offerte.js**

Contenuto completo:

```javascript
// =============================================================================
// 🛍️ OFFERTE.JS — Landing "Affari al Volo" per traffico ADV
// Dati: offers.json (fonte di verità). Conversione primaria: join Telegram.
// =============================================================================

const CATEGORY_LABELS = {
    moda: 'Moda & Accessori',
    beauty: 'Beauty & Skincare',
    tech: 'Tech & Elettronica',
    casa: 'Casa & Arredamento',
    famiglia: 'Famiglia',
    marketplace: 'Marketplace'
};

const STICKY_DISMISS_KEY = 'aav-sticky-dismissed';
const FALLBACK_TELEGRAM = 'https://t.me/affarialvoloo';

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

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
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
    const offers = activeOffers();
    const trust = (DATA.trustBrands || []).map(domain =>
        `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" alt="${domain}" loading="lazy">`
    ).join('');

    document.getElementById('offerte-hero').innerHTML = `
        <div class="hero">
            <img src="img/affarialvolo-logo.png" alt="Affari al Volo" class="hero-logo">
            <h1 class="hero-title">Offerte e codici sconto verificati, ogni giorno</h1>
            <p class="hero-subtitle">${offers.length} offerte attive · Aggiornato il ${formatDate(DATA.updated)}</p>
            <a href="${telegramUrl()}" class="hero-cta" data-tg="hero" target="_blank" rel="noopener noreferrer">🔔 Entra nel canale gratis</a>
            <div class="hero-trust">${trust}</div>
        </div>
    `;
}

function createFeaturedCard(offer) {
    const discount = offer.discount ? `<span class="offer-card-badge">${escapeHtml(offer.discount)}</span>` : '';
    const expiry = offer.expiry ? `<span class="featured-expiry">Scade il ${formatDate(offer.expiry)}</span>` : '';

    return `
        <div class="featured-card">
            <div class="offer-card-icon"><img src="${offer.icon}" alt="${escapeHtml(offer.title)}" loading="lazy"></div>
            <div class="featured-card-body">
                <h3 class="offer-card-title">${escapeHtml(offer.title)}</h3>
                <p class="offer-card-description">${escapeHtml(offer.description)}</p>
                ${discount}${expiry}
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
        btn.addEventListener('click', () => copyCode(btn));
    });
}

async function copyCode(btn) {
    const { code, title, category, url } = btn.dataset;

    try {
        await navigator.clipboard.writeText(code);
    } catch {
        // Fallback: seleziona il testo del codice per copia manuale
        const range = document.createRange();
        range.selectNodeContents(btn.querySelector('.featured-code'));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    btn.querySelector('.featured-code-label').textContent = 'Copiato ✓';
    track('copy_code', { brand: title, category: category });
    setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 600);
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

function createOfferCard(offer) {
    const badgeText = offer.code ? `CODICE: ${offer.code}` : offer.discount;
    const badge = badgeText ? `<span class="offer-card-badge">${escapeHtml(badgeText)}</span>` : '';

    return `
        <div class="offer-card" data-category="${offer.category}"
            data-title="${escapeHtml(offer.title.toLowerCase())}"
            data-description="${escapeHtml(offer.description.toLowerCase())}">
            <div class="offer-card-icon"><img src="${offer.icon}" alt="${escapeHtml(offer.title)}" loading="lazy"></div>
            <h3 class="offer-card-title">${escapeHtml(offer.title)}</h3>
            <p class="offer-card-description">${escapeHtml(offer.description)}</p>
            ${badge}
            <button class="offer-card-cta" data-brand="${escapeHtml(offer.title)}" data-cat="${offer.category}" data-url="${offer.url}">
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
            <p>Le offerte migliori le pubblichiamo prima sul canale 👀</p>
            <a href="${telegramUrl()}" class="telegram-cta" data-tg="inline" target="_blank" rel="noopener noreferrer">🔔 Entra nel canale gratis</a>
        </div>
    `;
}

function renderStickyBar() {
    if (localStorage.getItem(STICKY_DISMISS_KEY)) return;

    const bar = document.getElementById('telegram-sticky');
    bar.innerHTML = `
        <a href="${telegramUrl()}" data-tg="sticky" target="_blank" rel="noopener noreferrer">🔔 Offerte ogni giorno su Telegram — Entra gratis</a>
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
    loadTrackingScripts();
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
```

- [ ] **Step 2: Verifica sintassi**

```bash
node --check offerte.js
```

Expected: nessun output (exit 0).

- [ ] **Step 3: Smoke test rendering con server locale**

```bash
python3 -m http.server 8899 --directory . > /dev/null 2>&1 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8899/offers.json | head -c 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8899/offerte.html
kill $SERVER_PID
```

Expected: primi 200 char del JSON + `200`.

- [ ] **Step 4: Commit**

```bash
git add offerte.js
git commit -m "feat: rewrite offerte.js with offers.json, featured codes and Telegram funnel"
```

---

### Task 5: Verifica end-to-end nel browser

**Files:**
- Nessuna modifica prevista (solo fix se la verifica trova problemi).

**Interfaces:**
- Consumes: tutto quanto prodotto nei Task 1-4.

- [ ] **Step 1: Avvia server locale**

```bash
python3 -m http.server 8899 --directory . > /dev/null 2>&1 &
```

- [ ] **Step 2: Verifica browser (skill /verify o claude-in-chrome), viewport mobile ~390px**

Checklist da osservare su `http://localhost:8899/offerte.html`:
1. Hero: logo Affari al Volo, headline esatta, conteggio offerte (30), data aggiornamento, CTA Telegram, trust strip 6 loghi.
2. Sezione "⚡ Top con codice sconto" con 2 card (Charlotte Tilbury DARLING15, Prenatal SAVETEN).
3. Click "Copia codice" → label diventa "Copiato ✓", console mostra `[track] copy_code`, si apre il link affiliato.
4. Filtri categoria funzionanti; `http://localhost:8899/offerte.html?cat=beauty` preseleziona pill Beauty e filtra la griglia.
5. Search nascosta a viewport ≤768px, visibile a desktop.
6. Sticky bottom bar visibile su mobile; ✕ la chiude; reload → resta chiusa (localStorage); su desktop non appare.
7. Click CTA Telegram (hero/inline/sticky) → console `[track] join_telegram` con placement corretto.
8. Click "Vedi offerta" su una card → console `[track] click_offer`.
9. Footer: disclaimer, "Un progetto di Mirko Papadopoli", Media Kit. Nessun link "Torna alla bio page".
10. Fallback: `mv offers.json offers.json.bak`, reload → messaggio + CTA canale; poi `mv offers.json.bak offers.json`.
11. Nessun errore in console (a parte eventuali favicon di terze parti).

- [ ] **Step 3: Ferma il server**

```bash
kill %1 2>/dev/null || pkill -f "http.server 8899"
```

- [ ] **Step 4: Commit di eventuali fix**

```bash
git add -A offerte.html offerte.css offerte.js offers.json
git commit -m "fix: adjustments from end-to-end verification" # solo se ci sono fix
```

---

## Fuori scope (ribadito dalla spec)

- Agente Metapic giornaliero, dominio dedicato, contatore iscritti, exit-intent, A/B test.
- Campagna Meta (progetto 2): piano separato dopo landing live.
- Modifiche a `config.js` / `index.html` / `script.js` (le modifiche uncommitted esistenti a config.js/script.js sono di un lavoro precedente e non vanno toccate né committate da questo piano).
