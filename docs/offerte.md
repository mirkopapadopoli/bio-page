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

Usare `offerte.html?src=ads` negli annunci Meta, `?src=ig` in bio, `?src=tg` nei post del canale. `src` viene passato in ogni evento di tracking. `?cat=<categoria>` preseleziona un filtro.

## Tracking e consenso

- Meta Pixel e Google Ads si caricano **solo dopo "Accetta"** sul banner cookie (GDPR). Prima il Pixel partiva nell'`<head>` senza consenso.
- Eventi: `click_offer` (`brand`, `category`, `placement` = `promo` | `list`, `src`) → Meta `ClickOffer`; `join_telegram` (`placement`, `src`) → Meta `Lead`.
- Conseguenza: chi rifiuta i cookie non viene più contato dal Pixel. Il dato affidabile di click e vendite resta quello di Metapic.
