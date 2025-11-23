# 🚀 Guida Deploy Rapido

## Setup Iniziale (una volta sola)

### 1. Installa Vercel CLI
```bash
npm install -g vercel
```

### 2. Aggiungi la tua foto profilo
- Rinomina la tua foto in `profile.jpg`
- Mettila nella cartella `bio-page/`

### 3. Personalizza i contenuti
Apri `index.html` e modifica:
- Nome e bio (righe 35-44)
- Link social (righe 47-62)
- Link ai tuoi contenuti (righe 67-167)

## Deploy su Vercel

### Prima volta:
```bash
cd bio-page
vercel login
vercel
```

Rispondi alle domande:
- Set up and deploy? → **Y**
- Which scope? → Il tuo account
- Link to existing project? → **N**
- Project name? → `mirko-bio` (o come preferisci)
- Directory? → `.` (premi invio)

### Deploy successivi:
```bash
vercel --prod
```

✅ Fatto! La tua pagina è online.

## Connettere il Dominio

1. Vai su [vercel.com](https://vercel.com)
2. Seleziona il progetto
3. Settings → Domains
4. Aggiungi il tuo dominio
5. Configura DNS come indicato

### Esempio configurazione DNS:
Se il tuo dominio è `tuodominio.com`:

**Opzione A (Consigliata):**
```
Tipo: CNAME
Nome: @
Valore: cname.vercel-dns.com
```

**Opzione B:**
```
Tipo: A
Nome: @
Valore: 76.76.21.21

Tipo: CNAME
Nome: www
Valore: cname.vercel-dns.com
```

## Verifica

1. Apri il tuo dominio nel browser
2. Controlla su mobile
3. Testa tutti i link

## Comandi Utili

```bash
# Deploy in produzione
vercel --prod

# Deploy preview
vercel

# Vedere i deploy
vercel ls

# Rimuovere un deployment
vercel rm [deployment-url]

# Vedere i log
vercel logs
```

## Aggiornamenti Futuri

Ogni volta che modifichi qualcosa:

1. Modifica i file localmente
2. Testa aprendo `index.html` nel browser
3. Deploy: `vercel --prod`
4. ✅ Le modifiche sono online!

## Alternative a Vercel

### Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### GitHub Pages:
1. Crea repo su GitHub
2. Push del codice
3. Settings → Pages → Source: main branch

## Troubleshooting

**"Command not found: vercel"**
- Reinstalla: `npm install -g vercel`
- O usa: `npx vercel`

**"Login failed"**
- Verifica la connessione internet
- Riprova: `vercel login`

**"404 su deployment"**
- Verifica che `index.html` sia nella root
- Controlla `vercel.json`

**Modifiche non visibili**
- Svuota cache: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
- Verifica di aver fatto `vercel --prod` e non solo `vercel`

## 🎯 Checklist Pre-Deploy

- [ ] Foto profilo aggiunta (`profile.jpg`)
- [ ] Nome e bio personalizzati
- [ ] Link social aggiornati
- [ ] Tutti i link testati in locale
- [ ] Meta description aggiornata
- [ ] Testato su mobile (F12 → device toolbar)
- [ ] Google Analytics configurato (opzionale)

## 📊 Analytics

Dopo il deploy, monitora:
- Visite totali
- Click sui link
- Dispositivi usati (mobile/desktop)

Usa Google Analytics o Vercel Analytics (a pagamento).

## Support

Problemi? Verifica:
1. Tutti i file sono nella stessa cartella
2. Nomi file corretti (case-sensitive)
3. Nessun errore in console (F12)
4. Vercel CLI aggiornato: `npm update -g vercel`

---

**Buon deploy! 🚀**
