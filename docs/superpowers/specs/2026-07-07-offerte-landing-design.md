# Design: offerte.html → Landing ADV "Affari al Volo"

**Data:** 2026-07-07
**Branch:** feature/landing-offerte
**Stato:** approvato in brainstorming, in attesa di review finale

## Contesto e obiettivo

`offerte.html` riceverà traffico ADV a pagamento (campagne Meta generiche, in futuro verticali per categoria). Oggi la pagina è una directory generica di ~25 link affiliati Metapic brandizzata "Mirko Papadopoli".

Decisioni strategiche prese:
1. **Business separato dal personal brand.** Il volto e il nome di Mirko escono dal frontend (i canali personali trattano tech, non affiliazione). Brand: **Affari al Volo** (`@affarialvoloo`), già attivo come canale Telegram alimentato dal bot in `/Users/mirkopapadopoli/Code/BotTelegram`.
2. **Funnel Telegram-first.** Su traffico freddo faceless, il click affiliato one-shot non ripaga il CPC. Conversione primaria = iscrizione al canale (rimonetizzabile ogni giorno a costo zero); click affiliato = conversione secondaria immediata.
3. **Dati separati dal codice** (`offers.json`), così un futuro agente giornaliero potrà aggiornare offerte e codici da Metapic senza toccare codice (progetto successivo, fuori scope qui).

Diagnosi CRO/offer che motiva il design: value proposition vaga, zero prova sociale, codici sconto (l'hook più forte) sepolti tra 25 card identiche, nessuna urgenza, nessuna cattura del 95%+ che non compra al primo click.

## Architettura

Stack invariato: HTML/CSS/JS vanilla, nessun build step, deploy Netlify.

```
offers.json  ← dati offerte (estratti da config.js sezione "deals")
offerte.html ← markup sezioni statiche
offerte.css  ← stili (estensione di quelli esistenti)
offerte.js   ← fetch offers.json, rendering, filtri, tracking
config.js    ← resta per index.html; la sezione deals viene duplicata
               in offers.json (fonte di verità per la landing)
```

Nota transitoria: `index.html` continua a leggere i deals da `config.js`. La duplicazione è accettata finché l'agente Metapic non diventerà l'unica fonte; a quel punto anche index potrà leggere `offers.json`.

## Struttura della pagina (top → bottom)

### 1. Hero compatto (max ~30% viewport mobile)
- Logo/nome **Affari al Volo** (riuso asset copertina dal repo BotTelegram)
- Headline: "Offerte e codici sconto verificati, ogni giorno"
- Sottotitolo con numeri concreti: conteggio offerte reale + "Aggiornato il {data}" generata da JS (freshness)
- **CTA primaria: "🔔 Entra nel canale gratis" → https://t.me/affarialvoloo**
- Trust strip: loghi dei brand noti presenti in pagina (Adidas, Samsung, Levi's, KIKO, …) — la prova sociale al posto del volto
- Rebrand completo di title, meta description, OG tags (via "Mirko Papadopoli")

### 2. Sezione "Top con codice sconto"
- 3-4 card grandi, prima della griglia, per le offerte con `code` (es. Charlotte Tilbury DARLING15, Prenatal SAVETEN)
- Codice copiabile un tap: bottone "Copia codice" → clipboard → feedback "Copiato ✓" → apertura link affiliato
- Scadenza mostrata se presente nel dato (`expiry`) — scarcity reale, mai timer finti
- Selezione pilotata da `featured: true` in offers.json

### 3. Griglia offerte con filtri
- Filtri categoria esistenti invariati
- **`?cat=<categoria>` nell'URL preseleziona il filtro** (message match per campagne verticali: una landing, N campagne)
- Search: spostata sotto i filtri e nascosta su mobile via CSS (friction inutile per traffico freddo)

### 4. Cattura Telegram
- Blocco inline dopo le top offerte: "Le offerte migliori le pubblichiamo prima sul canale" + CTA
- **Sticky bottom bar mobile** con CTA canale, dismissibile (stato in localStorage)

### 5. Footer
- Disclaimer affiliazione invariato
- "Un progetto di Mirko Papadopoli" discreto + link Media Kit
- Link "Torna alla bio page" rimosso o de-enfatizzato (la landing è un funnel, non una pagina del sito personale)

## Schema offers.json

```json
{
  "updated": "2026-07-07",
  "offers": [
    {
      "title": "Charlotte Tilbury IT",
      "description": "…",
      "icon": "https://…",
      "url": "https://charlotte-tilbury-it.mtpc.se/6207589",
      "category": "beauty",
      "code": "DARLING15",
      "discount": "-15% extra",
      "expiry": "2026-07-31",
      "featured": true
    }
  ]
}
```

Campi `code`, `discount`, `expiry`, `featured` opzionali. `badge` attuale sostituito da `code`/`discount` strutturati (rendering li compone). Offerte con `expiry` passata: nascoste automaticamente dal rendering.

## Tracking

- Eventi separati: `click_offer` (esistente) e **`join_telegram`** (nuovo) su Meta Pixel (`fbq('track', 'Lead', …)` vs evento custom `Subscribe`) e gtag
- Le campagne si ottimizzano su `join_telegram` come conversione primaria
- Copia-codice tracciata come `copy_code` (proxy di intento forte)

## Gestione errori

- `offers.json` non raggiungibile → fallback: messaggio invito al canale Telegram (il funnel primario resta vivo)
- Icone brand (favicon Google) già lazy-loaded; nessun cambiamento
- Clipboard API non disponibile → fallback selezione testo del codice

## Testing

- Verifica manuale end-to-end (skill /verify): rendering, filtri, `?cat=`, copia codice, sticky bar, eventi tracking in console
- Test su viewport mobile (il traffico ADV sarà ~90% mobile)
- Lighthouse: la pagina deve restare leggera (niente framework, niente immagini pesanti nel hero)

## Campagna Meta (progetto 2 — dopo landing live)

Strategia era-Andromeda: targeting broad (solo Italia, no interest-stacking), la segmentazione la fanno le creative con keyword identitarie per categoria ("sconti sneakers", "codici beauty", …) puntate su `?cat=` corrispondente. Struttura: 1 campagna CBO, 1 adset broad, 5-10 creative statiche. Budget ingresso 10-20€/giorno, scaling +20% ogni 3-5 giorni. Headline mirroring: la headline vincente delle ads diventa l'H1 della landing.

**Misurazione iscrizioni Telegram** (Meta non vede i join in-app):
- Livello base: evento `join_telegram` al click verso t.me (proxy)
- Livello target: **invite link Telegram dedicati per campagna/adset**; il bot (già admin del canale, repo BotTelegram) legge gli eventi join per invite link → CPA reale per iscritto. Opzionale: rimando dei join a Meta via Conversions API per ottimizzare sull'iscrizione vera
- Implicazione per la landing: l'URL del canale in pagina deve essere configurabile (per usare invite link tracciati al posto del link pubblico)

Dettagli operativi (creative brief, copy, setup Ads Manager, regole kill/scale) → piano implementativo separato.

## Fuori scope (progetti successivi)

1. **Agente Metapic giornaliero**: estrazione campagne/codici da Metapic (verificare prima API/feed vs scraping dashboard), matching con offers.json, validazione (nessun codice inventato), commit+push → deploy Netlify, anteprima su Telegram per approvazione umana nel primo periodo. Sinergia: stesso JSON alimenta i post del canale.
2. Dominio dedicato al brand
3. Contatore iscritti live nel hero
4. Exit-intent popup
5. A/B test formali (hero, top-codici vs griglia pura, sticky vs inline)
