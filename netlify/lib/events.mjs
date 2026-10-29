// =============================================================================
// Contatore anonimo degli eventi della landing offerte (senza consenso)
//
// Ogni evento è una chiave vuota in Netlify Blobs: tutti i dati stanno nel nome
// della chiave (giorno/evento/fonte/campagna/ad/negozio/id), così le
// statistiche si calcolano con un solo list() senza leggere i valori.
// Niente IP, user agent, cookie o identificativi: solo conteggi aggregabili,
// per questo non serve il consenso (dati anonimi, prima parte).
// =============================================================================

export const EVENTS = ['page_view', 'click_offer', 'copy_code', 'join_telegram'];
export const FIELDS = ['src', 'utm_campaign', 'utm_content', 'brand'];
export const MAX_BODY = 1024;

// Testo libero ridotto a un'etichetta corta e innocua (niente "/" che
// romperebbe la chiave, niente dati lunghi incollati nell'URL).
export function clean(value) {
    if (typeof value !== 'string') return '';
    return value.normalize('NFKC')
        .replace(/[^\p{L}\p{N} .&'+_-]/gu, '')
        .trim()
        .slice(0, 60);
}

// Body della richiesta → evento valido, o null se da scartare.
export function parseEvent(raw) {
    if (typeof raw !== 'string' || raw.length > MAX_BODY) return null;
    let data;
    try { data = JSON.parse(raw); } catch { return null; }
    if (!data || !EVENTS.includes(data.e)) return null;
    const event = { e: data.e };
    for (const f of FIELDS) event[f] = clean(data[f]);
    return event;
}

export function buildKey(event, now = new Date(), rand = Math.random()) {
    const day = now.toISOString().slice(0, 10);
    const id = `${now.getTime()}-${rand.toString(36).slice(2, 8)}`;
    const parts = [day, event.e, ...FIELDS.map(f => event[f] || '-')];
    return [...parts.map(encodeURIComponent), id].join('/');
}

export function parseKey(key) {
    const parts = key.split('/');
    if (parts.length !== 2 + FIELDS.length + 1) return null;
    const [day, e, ...rest] = parts.map(decodeURIComponent);
    const event = { day, e };
    FIELDS.forEach((f, i) => { event[f] = rest[i] === '-' ? '' : rest[i]; });
    return event;
}

// Chiavi → conteggi per ad (fonte + campagna + nome ad) e per negozio.
export function aggregate(keys) {
    const byAd = new Map();
    const byBrand = new Map();
    for (const key of keys) {
        const ev = parseKey(key);
        if (!ev) continue;
        const adKey = [ev.src, ev.utm_campaign, ev.utm_content].join('|');
        if (!byAd.has(adKey)) {
            byAd.set(adKey, {
                src: ev.src, utm_campaign: ev.utm_campaign, utm_content: ev.utm_content,
                ...Object.fromEntries(EVENTS.map(e => [e, 0]))
            });
        }
        byAd.get(adKey)[ev.e] += 1;
        if (ev.e === 'click_offer' && ev.brand) {
            byBrand.set(ev.brand, (byBrand.get(ev.brand) || 0) + 1);
        }
    }
    return {
        by_ad: [...byAd.values()].sort((a, b) => b.page_view - a.page_view),
        click_offer_by_brand: Object.fromEntries([...byBrand].sort((a, b) => b[1] - a[1]))
    };
}

// Giorni da "from" a "to" inclusi (YYYY-MM-DD), al massimo 92.
export function daysBetween(from, to) {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(from) || !re.test(to)) return [];
    const days = [];
    const d = new Date(from + 'T00:00:00Z');
    const end = new Date(to + 'T00:00:00Z');
    while (d <= end && days.length < 92) {
        days.push(d.toISOString().slice(0, 10));
        d.setUTCDate(d.getUTCDate() + 1);
    }
    return days;
}
