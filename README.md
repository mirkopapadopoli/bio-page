# 🚀 Bio Page - Mirko Papadopoli

Bio page personale con tema Matrix/Hacker, completamente personalizzabile tramite file di configurazione.

## 📁 Struttura del Progetto

```
bio-page/
├── index.html          # Template HTML (non modificare)
├── style.css           # Stili Matrix theme
├── script.js           # Logic principale (non modificare)
├── config.js           # ⚙️ FILE DI CONFIGURAZIONE (modifica questo!)
├── profile.jpg         # Tua foto profilo
├── DEPLOY.md          # Istruzioni per il deploy
└── README.md          # Questo file
```

## ✨ Come Personalizzare la Pagina

### 🔧 Modifica il File `config.js`

**Tutto il contenuto della pagina è in `config.js`**. Apri il file e personalizza:

#### 1️⃣ Profilo

```javascript
profile: {
    name: "Il Tuo Nome",
    bio: "La tua bio<br>Su più righe se vuoi",
    image: "profile.jpg"  // Percorso alla tua foto
}
```

**Per cambiare la foto profilo:**
- Sostituisci `profile.jpg` con la tua foto
- Oppure usa un URL esterno
- Oppure usa un avatar generato: `https://api.dicebear.com/9.x/avataaars/svg?seed=TuoNome`

---

#### 2️⃣ Social Media

```javascript
socials: [
    {
        name: "Instagram",
        icon: "fab fa-instagram",  // Icona FontAwesome
        url: "https://instagram.com/tuousername",
        cssClass: "instagram"
    },
    // Aggiungi altri social...
]
```

**Icone disponibili:** [Font Awesome Icons](https://fontawesome.com/icons)

**Per aggiungere un nuovo social:**
```javascript
{
    name: "LinkedIn",
    icon: "fab fa-linkedin",
    url: "https://linkedin.com/in/tuoprofilo",
    cssClass: "linkedin"
}
```

---

#### 3️⃣ Sezioni di Link

Le sezioni sono completamente modulari:

```javascript
sections: [
    {
        id: "featured",           // ID unico
        title: "Link in Evidenza", // Titolo visibile
        links: [...]               // Array di link
    },
    {
        id: "projects",
        title: "I Miei Progetti",
        links: [...]
    }
    // Aggiungi tutte le sezioni che vuoi!
]
```

---

#### 4️⃣ Aggiungere un Link

Ogni link ha questa struttura:

```javascript
{
    title: "Titolo del Link",
    description: "Breve descrizione",
    icon: "fas fa-link",           // Icona FontAwesome
    url: "https://example.com",
    style: "default",              // "default", "featured", o "support"
    badge: "-15%"                  // Opzionale, badge sconto
}
```

**Stili disponibili:**
- `default` - Stile normale verde
- `featured` - Evidenziato con bordo brillante
- `support` - Stile supporto (rosso/arancio)

---

### 📋 Esempi Pratici

#### Aggiungere una Nuova Sezione

```javascript
sections: [
    // ... sezioni esistenti ...
    ,{
        id: "projects",
        title: "I Miei Progetti",
        links: [
            {
                title: "GitHub Portfolio",
                description: "I miei progetti open source",
                icon: "fab fa-github",
                url: "https://github.com/tuousername",
                style: "default"
            },
            {
                title: "Blog Personale",
                description: "Articoli su AI e Tech",
                icon: "fas fa-blog",
                url: "https://tuoblog.com",
                style: "default"
            }
        ]
    }
]
```

#### Aggiungere un Link con Badge

```javascript
{
    title: "Corso Scontato",
    description: "Impara React da zero",
    icon: "fas fa-graduation-cap",
    url: "https://corso.com",
    style: "featured",
    badge: "-30%"  // Badge visibile
}
```

---

## 🎨 Personalizzare i Colori

Per cambiare il tema Matrix, modifica `style.css`:

```css
:root {
    --bg-color: #0a0e27;              /* Sfondo */
    --text-primary: #00ff41;          /* Testo principale (verde Matrix) */
    --text-secondary: #00cc33;        /* Testo secondario */
    --accent-color: #00ff41;          /* Colore accento */
    --accent-glow: rgba(0, 255, 65, 0.5);  /* Glow verde */
}
```

**Esempio tema Blu:**
```css
:root {
    --bg-color: #0a0e27;
    --text-primary: #00d4ff;          /* Blu chiaro */
    --text-secondary: #0099cc;
    --accent-color: #00d4ff;
    --accent-glow: rgba(0, 212, 255, 0.5);
}
```

---

## 🧪 Testare in Locale

### Opzione 1: Apri Direttamente
```bash
open index.html
```

### Opzione 2: Server Locale (Consigliato)
```bash
# Python 3
python3 -m http.server 8000

# Oppure npx
npx http-server -p 8000
```

Poi apri: `http://localhost:8000`

---

## 🚀 Deploy con Dominio Personalizzato

### Opzione A: Netlify (Consigliata) ⭐

#### Step 1: Deploy con Netlify CLI

```bash
# Installa Netlify CLI (solo prima volta)
npm install -g netlify-cli

# Login
netlify login

# Inizializza e deploy
netlify init
```

Rispondi alle domande:
- **Create & configure a new site** → Sì
- **Team** → Il tuo account personale
- **Site name** → `mirko-bio` (o lascia generare automaticamente)

Poi fai il deploy:
```bash
netlify deploy --prod
```

#### Step 2: Connetti il Dominio `mirkopapadopoli.com`

1. Vai su [app.netlify.com](https://app.netlify.com)
2. Seleziona il tuo sito
3. Vai in **Domain settings**
4. Clicca **Add custom domain**
5. Inserisci: `mirkopapadopoli.com`
6. Clicca **Verify**

#### Step 3: Configura il DNS

Netlify ti mostrerà i record DNS. Accedi al pannello del tuo domain provider e configura:

**Opzione A - Netlify DNS (Più Facile):**
1. In Netlify, clicca **Set up Netlify DNS**
2. Netlify ti darà 4 nameservers
3. Nel tuo domain provider, sostituisci i nameservers con quelli di Netlify

**Opzione B - External DNS:**
```
Tipo: A
Nome: @
Valore: 75.2.60.5

Tipo: CNAME
Nome: www
Valore: [tuo-sito].netlify.app
```

#### Step 4: Deploy Automatico

Una volta configurato, ogni deploy successivo è semplicissimo:
```bash
netlify deploy --prod
```

**✅ Vantaggi di Netlify:**
- SSL automatico gratuito
- Deploy più veloce
- Interface web intuitiva
- Form handling built-in
- Functions serverless incluse

---

### Opzione B: Vercel

#### Step 1: Deploy Iniziale

```bash
# Installa Vercel CLI (solo prima volta)
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Rispondi alle domande:
- **Set up and deploy?** → Y
- **Which scope?** → Il tuo account
- **Link to existing project?** → N
- **Project name?** → `mirko-bio` (o altro)
- **Directory?** → `.` (premi invio)

#### Step 2: Connetti il Dominio

1. Vai su [vercel.com](https://vercel.com)
2. Seleziona il progetto
3. Vai in **Settings → Domains**
4. Aggiungi: `mirkopapadopoli.com`

#### Step 3: Configura DNS

```
Tipo: A
Nome: @
Valore: 76.76.21.21

Tipo: CNAME
Nome: www
Valore: cname.vercel-dns.com
```

#### Step 4: Deploy

```bash
vercel --prod
```

---

## 🔄 Aggiornamenti Futuri

Ogni volta che modifichi qualcosa:

1. **Modifica `config.js`** con i nuovi contenuti
2. **Testa in locale:**
   ```bash
   python3 -m http.server 8000
   ```
3. **Deploy:**
   ```bash
   vercel --prod
   ```
4. ✅ Modifiche online in ~30 secondi!

---

## 📸 Gestione Immagini

### Foto Profilo

**Opzione 1 - File Locale:**
```javascript
image: "profile.jpg"
```
Salva la tua foto come `profile.jpg` nella cartella del progetto.

**Opzione 2 - URL Esterno:**
```javascript
image: "https://i.imgur.com/abc123.jpg"
```

**Opzione 3 - Avatar Generato:**
```javascript
image: "https://api.dicebear.com/9.x/avataaars/svg?seed=MirkoP"
```

---

## 🎯 Checklist Pre-Deploy

- [ ] Foto profilo aggiunta/aggiornata
- [ ] Nome e bio personalizzati in `config.js`
- [ ] Link social aggiornati
- [ ] Tutte le sezioni configurate
- [ ] Tutti i link testati in locale
- [ ] Meta description aggiornata
- [ ] Testato su mobile (F12 → device toolbar)

---

## 🔗 Comandi Utili

### Netlify
```bash
# Deploy produzione
netlify deploy --prod

# Deploy preview (test)
netlify deploy

# Aprire il sito nel browser
netlify open

# Vedere i deploy
netlify sites:list

# Vedere i log
netlify logs

# Informazioni sul sito
netlify status
```

### Vercel
```bash
# Deploy produzione
vercel --prod

# Deploy preview (test)
vercel

# Vedere tutti i deploy
vercel ls

# Vedere i log
vercel logs

# Rimuovere un deploy
vercel rm [deployment-url]
```

---

## ❓ Troubleshooting

### La pagina è bianca
- Controlla la console del browser (F12)
- Verifica che `config.js` sia caricato correttamente
- Controlla che non ci siano errori di sintassi in `config.js`

### Le icone non si vedono
- Font Awesome è caricato? Controlla la connessione internet
- L'icona esiste? Verifica su [fontawesome.com/icons](https://fontawesome.com/icons)

### L'immagine profilo non si carica
- Percorso corretto? Deve essere relativo alla cartella del progetto
- Formato supportato? Usa JPG, PNG, o GIF
- Nome file corretto? Maiuscole/minuscole contano

### Il dominio personalizzato non funziona
- DNS propagato? Controlla su [whatsmydns.net](https://whatsmydns.net)
- Record configurati correttamente? Ricontrolla su Vercel
- Cache del browser? Prova in modalità incognito

---

## 📚 Risorse

- [Font Awesome Icons](https://fontawesome.com/icons) - Icone disponibili
- [Vercel Docs](https://vercel.com/docs) - Documentazione Vercel
- [DiceBear Avatars](https://www.dicebear.com/) - Avatar generati

---

## 🎨 Temi Alternativi

### Tema Cyberpunk (Rosa/Viola)
```css
:root {
    --bg-color: #1a0a2e;
    --text-primary: #ff006e;
    --text-secondary: #fb5607;
    --accent-color: #ff006e;
    --accent-glow: rgba(255, 0, 110, 0.5);
}
```

### Tema Neon Blu
```css
:root {
    --bg-color: #0a0e27;
    --text-primary: #00d4ff;
    --text-secondary: #0099cc;
    --accent-color: #00d4ff;
    --accent-glow: rgba(0, 212, 255, 0.5);
}
```

---

**Buon deploy! 🚀**

Se hai domande, controlla `DEPLOY.md` per istruzioni dettagliate sul deploy.