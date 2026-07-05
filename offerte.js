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
