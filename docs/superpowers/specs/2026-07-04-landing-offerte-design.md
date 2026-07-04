# Design: Landing Page "Offerte" dedicata per ADS

**Data:** 2026-07-04
**Stato:** Approvato

## Contesto

Il repo `bio-page` è una bio-link personale (Linktree-style) renderizzata client-side: `index.html` è statico, `config.js` contiene tutti i dati (profilo, social, sezioni di link), `script.js` legge `window.CONFIG` e genera il markup a runtime. Esiste già una sezione tab "🔥 Migliori Offerte Selezionate" (`id: "deals"`) con 30 link affiliati verso vari brand (moda, beauty, tech, casa, ecc.), oggi presentata come lista piatta con ricerca testuale.

L'obiettivo è estrarre questa sezione in una landing page indipendente, ottimizzata per traffico a pagamento (Meta/Google Ads): deve massimizzare CTR sui link e supportare vendite, con tracking e struttura da vera landing page (non solo lista link).

## Obiettivo

- Pagina dedicata `/offerte` da usare come destination URL per campagne ADS.
- Massimizzare CTR verso le offerte + supportare conversioni.
- Categorizzazione per navigabilità (Moda&Accessori, Beauty&Skincare, Tech&Elettronica, Casa&Arredamento, Famiglia, Marketplace).
- Tracking Meta Pixel + Google Ads su ogni click-out.
- Disclaimer di trasparenza affiliazione in footer (sempre visibile).
- Non deve introdurre regressioni sulla bio page esistente (`index.html` invariato).

## Architettura

Approccio: **pagina separata nello stesso repo**, non sottodominio né repo a parte — riusa il deploy Netlify esistente, niente setup DNS aggiuntivo, path `/offerte` è sufficiente per UTM/ADS destination URL.

File nuovi:
- `offerte.html` — markup statico della landing (hero, filtri, griglia, footer), stessa struttura minimale di `index.html` (contenitori vuoti popolati via JS).
- `offerte.js` — logica di rendering: legge `window.CONFIG.sections` (sezione `deals`), raggruppa per categoria, gestisce filtri, search, tracking click.
- `offerte.css` — stile dedicato per questa landing, volutamente diverso dal tema dark/cyberpunk della bio page (nuova identità visiva pensata per conversione ADS, non deve necessariamente coincidere con lo stile del sito principale).

File modificati:
- `config.js`:
  - ogni oggetto in `sections.deals.links` guadagna un campo `category` (uno tra: `moda`, `beauty`, `tech`, `casa`, `famiglia`, `marketplace`).
  - nuovo blocco top-level `tracking: { metaPixelId: "", googleAdsId: "" }` — placeholder vuoti, l'utente inserisce i propri ID.

`index.html`/`script.js` restano invariati: la sezione tab "Offerte" sulla bio page continua a funzionare come oggi, ignorando il campo `category` extra (nessuna regressione).

Fonte dati unica: `config.js`. Aggiungere una nuova offerta in futuro la rende visibile automaticamente sia sulla bio page che sulla landing, basta impostare la sua `category`.

## Categorizzazione offerte esistenti (mappatura da applicare)

| Categoria | Brand |
|---|---|
| Moda & Accessori | JD Sports, Mango, Foot Locker, Adidas, Michael Kors, THE B'S, Levi's, New Balance, Privé by Zalando, ChicMe, Etrusca Gioielli |
| Beauty & Skincare | Marionnaud, Acqua di Marzamemi, LeLang, KIKO Milano, Notino, Charlotte Tilbury |
| Tech & Elettronica | PcComponentes, Samsung Galaxy S26 Ultra, Lenovo, Turbo VPN, Boardmix |
| Casa & Arredamento | Westwing Outlet, Westwing Nuove Offerte, Dorelan |
| Famiglia | Prenatal |
| Marketplace | AliExpress IT, AliExpress Best Deals, QVC Italia, Alibaba.com |

## Layout della landing (top → bottom)

1. **Hero**: headline forte + sottotitolo trust ("30+ offerte verificate, aggiornate ogni settimana"), CTA che scrolla alla griglia.
2. **Filtri categoria** (pill/tab): Tutte + le 6 categorie sopra. Click filtra la griglia senza reload pagina.
3. **Search bar**: stessa logica di ricerca già presente sulla bio page (match su titolo + descrizione), applicata sopra il set filtrato per categoria.
4. **Griglia offerte**: card con icona/favicon brand, nome, descrizione, badge sconto/codice sconto se presente (riusa il campo `badge` già esistente in config), bottone CTA esplicito "Vedi offerta →". Click sul bottone (non su tutta la card) per poter trackare l'evento in modo pulito e aumentare la percezione di CTA chiara.
5. **Footer**: disclaimer di trasparenza affiliazione (testo fisso, sempre visibile) + link Media Kit / social.

## Tracking

- `config.js.tracking.metaPixelId` e `.googleAdsId`: se valorizzati, `offerte.html` carica gli script Meta Pixel / gtag.js corrispondenti; se vuoti, nessuno script viene iniettato (nessun errore console).
- Ogni click sul bottone CTA di un'offerta, prima di aprire il link (in nuova tab), spara:
  - `fbq('track', 'Lead', { content_name: <brand> })` (se pixel configurato)
  - `gtag('event', 'click_offer', { brand: <brand>, category: <category> })` (se Ads/GA4 configurato)
- Se nessun tracking è configurato, i click funzionano comunque normalmente (nessuna dipendenza bloccante).

## SEO / Meta

`offerte.html` ha i propri tag `<title>`, meta description e Open Graph, distinti da quelli della bio page (es. "Le migliori offerte selezionate | Mirko Papadopoli" invece del title generico della bio), per rendere la pagina un buon destination URL per ADS e condivisibile autonomamente.

## Disclaimer trasparenza

Testo fisso in footer, sempre visibile (non in un modal o link nascosto):

> "Questa pagina contiene link di affiliazione. Se acquisti tramite questi link potrei ricevere una piccola commissione, senza costi aggiuntivi per te."

## Fuori scope (non richiesto ora)

- Sottodominio dedicato o repo separato.
- Sezioni editoriali curate manualmente ("Top offerte", "Novità") — si userà categorizzazione + filtri invece.
- A/B testing tra varianti di landing.
- Backend/CMS per gestire le offerte — restano in `config.js` come oggi.

## Testing

- Verifica manuale in browser: caricamento `offerte.html`, filtro per ogni categoria, search, badge visibili, click CTA apre link corretto in nuova tab.
- Verifica che con `tracking` vuoto non ci siano errori console (nessuno script Pixel/gtag caricato).
- Verifica responsive mobile (traffico ADS è prevalentemente mobile).
- Verifica che `index.html` e la sezione "Offerte" della bio page continuino a funzionare invariati.
