# offerte.html — landing "Affari al Volo"

Pagina di offerte affiliate (link Metapic). **Conversione primaria: il click sull'offerta.** L'iscrizione al canale Telegram è l'azione secondaria, tranne per il traffico a pagamento.

## Struttura

1. **Topbar** sticky: logo e "Aggiornato <data>" (da `offers.json.updated`).
2. **Intro**: "Le promo attive oggi" e il numero di promo attive.
3. **Chip categorie** in una riga scorrevole (solo le categorie presenti, "Altro" per ultima).
4. **Card promo**: una per ogni offerta con `promo` attiva. Brand, promo in grande, dettaglio, scadenza, CTA unica "Vai alla promo su <brand>", "Verificata oggi alle …".
5. **Altri negozi partner**: lista compatta a 2 colonne (3 su desktop) delle offerte senza promo, un negozio per brand. Ricerca solo da 12 negozi in su.
6. **Footer**: disclaimer affiliazione e link.

I link affiliati sono `<a rel="sponsored">` veri, non `window.open`: funzionano anche se il JS è lento o bloccato e si possono aprire con un tap lungo.

## Dati: `offers.json`

Campi esistenti invariati (`title`, `url`, `icon`, `category`, `code`, `discount`, `expiry`, `featured`). Due campi nuovi, opzionali:

```json
{
  "brand": "Marionnaud",
  "promo": {
    "title": "-30% sopra 79€ a carrello",
    "detail": "In più Cozy Season: fino a -50% su una selezione.",
    "until": "2026-10-20",
    "verified_at": "2026-10-16T09:00:00+02:00"
  }
}
```

- `promo` e `code` li compila l'**agente Metapic** di BotTelegram dalla campagna attiva del brand (codice ufficiale, promo, scadenza; `docs/metapic-agent.md` in quel repo), dopo approvazione su Telegram. In futuro anche lo **store scout** (`docs/store-scout.md`) per le promo lette dal sito del negozio.
- L'**ordine** delle offerte in `offers.json` è quello della pagina: l'agente mette prima i negozi pagati a click, poi quelli con codice o promo. Una promo con `until` passato viene ignorata e il negozio torna nella lista compatta.
- Un'offerta senza `promo` ma con `code` (codice Metapic) diventa comunque una card: titolo "<discount> con codice" (o "Codice sconto riservato"), riquadro con il codice e il tasto "Copia codice" (evento `copy_code`), scadenza da `expiry`.
- `brand`: se manca, viene ricavato dal titolo ("Michael Kors IT" → "Michael Kors", "… | Prénatal" → "Prénatal").
- Le icone favicon di shortlink (`*.mpic.link`, `*.mtpc.se`) sono sempre il globo generico: al loro posto si mostra l'iniziale del brand.

## Fonte del traffico: `?src=`

| `src` | Telegram | Perché |
|---|---|---|
| `ads` | Card in alto + sticky bar | Il click pagato vale di più se diventa un iscritto, monetizzabile ogni giorno |
| `tg` | Nessuna CTA | Sono già iscritti |
| assente / altro (bio IG) | Una card dopo la 3ª promo + link nel footer | Prima le offerte |

Usare `offerte.html?src=ads` negli annunci Meta, `?src=ig` in bio, `?src=tg` nei post del canale. `src` viene passato in ogni evento di tracking. Negli annunci Meta l'URL completo è:

- **URL del sito web:** `https://profile.mirkopapadopoli.com/offerte.html?src=ads`
- **Parametri URL** (sezione "Monitoraggio" dell'ad): `utm_campaign={{campaign.name}}&utm_content={{ad.name}}`

Formato e campo verificati sulla guida Meta "Specifiche per i parametri URL dinamici" (business/help/2360940870872492). `utm_source`/`utm_medium` non servono: Meta li aggiunge da sé. I nomi valgono come al momento della pubblicazione: rinominare un'ad dopo non cambia il valore. Meta sostituisce i segnaposto con i nomi reali; la pagina passa `utm_campaign` e `utm_content` (se presenti, max 100 caratteri) in ogni evento, così in Gestione eventi si vede quale campagna e quale grafica hanno portato ogni `ClickOffer`, `CopyCode` e `Lead`. Per questo i nomi delle ad devono dire la grafica (es. `nota-feed`, `fondatore-story`). `?cat=<categoria>` preseleziona un filtro.

## Tracking e consenso

- Pixel: **`1363279862594624`** ("Offerte al Volo Pixel", portfolio "Offerte al volo Landing", account pubblicitario "offerte al volo" `1043631244729743`, Pagina "Offertealvoloo"), in `config.js` → `tracking.metaPixelId`. Il 17/10/2026 è stato sostituito per errore con `1607797131071875` (creato su un altro portfolio) e ripristinato lo stesso giorno: gli eventi di quel pomeriggio sono finiti sul Pixel sbagliato.

- Meta Pixel e Google Ads si caricano **solo dopo "Accetta"** sul banner cookie (GDPR). Prima il Pixel partiva nell'`<head>` senza consenso.
- Eventi: `click_offer` (`brand`, `category`, `placement` = `promo` | `list`, `src`) → Meta `ClickOffer`; `join_telegram` (`placement`, `src`) → Meta `Lead`.
- Conseguenza: chi rifiuta i cookie non viene più contato dal Pixel. Il dato affidabile di click e vendite resta quello di Metapic.

## Contatore anonimo (senza consenso)

Nel primo test ads (18–27/10/2026: 313 visite alla pagina secondo Meta) il Pixel ha ricevuto circa 9 PageView in tutto: quasi nessuno preme "Accetta", quindi `ClickOffer`/`CopyCode`/`Lead` restavano a zero e non si sapeva cosa fa sulla pagina chi arriva dalle ads. Per questo c'è un contatore nostro che parte **sempre**:

- `offerte.js` → `countEvent()` manda con `navigator.sendBeacon` a `POST /api/track` gli eventi `page_view` (al caricamento), `click_offer`, `copy_code`, `join_telegram`, con `src`, `utm_campaign`, `utm_content` e `brand`
- `netlify/functions/track.mjs` salva ogni evento come chiave vuota nello store Netlify Blobs `offer-events`: `giorno/evento/src/utm_campaign/utm_content/brand/id`. Logica pura e test in `netlify/lib/events.mjs` (`npm test`)
- **Niente cookie, IP, user agent o identificativi**: solo conteggi aggregati, per questo non serve il consenso (scritto anche in `privacy.html`, sezione "Statistiche anonime"). Eventi sconosciuti e body oltre 1 KB vengono scartati; i testi sono ridotti a 60 caratteri senza `/`
- Il Pixel resta dietro consenso com'era

Lettura dei dati:

```
https://profile.mirkopapadopoli.com/api/stats?key=<STATS_KEY>&from=2026-10-30&to=2026-11-08
```

Risponde con `by_ad` (per fonte + campagna + ad: `page_view`, `click_offer`, `copy_code`, `join_telegram`) e `click_offer_by_brand`. Giorni in UTC, al massimo 92 per richiesta. `STATS_KEY` va impostata in Netlify → Site configuration → Environment variables; senza chiave (o con chiave sbagliata) l'endpoint risponde 404.

Prova in locale: `STATS_KEY=prova npx netlify-cli dev --offline`, poi aprire `offerte.html?src=ads&utm_content=test` e leggere `/api/stats?key=prova`.
