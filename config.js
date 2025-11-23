// =============================================================================
// 🔧 FILE DI CONFIGURAZIONE
// Modifica questo file per personalizzare la tua bio page!
// =============================================================================

const CONFIG = {
    // =========================================================================
    // 👤 INFORMAZIONI PROFILO
    // =========================================================================
    profile: {
        name: "Mirko Papadopoli",
        bio: "Appassionato di Informatica e AI 🤖<br>Condivido tutorial e consigli per semplificare la tua esperienza digitale 📲",
        // Percorso relativo all'immagine del profilo
        // Puoi usare un file locale (es: "profile.jpg") o un URL esterno
        image: "img/profile.PNG",
        // ALTERNATIVA: Usa un avatar generato automaticamente
        // image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mirko"
    },

    // =========================================================================
    // 🌐 SOCIAL MEDIA
    // =========================================================================
    // Icone disponibili: https://fontawesome.com/icons
    socials: [
        {
            name: "Instagram",
            icon: "fab fa-instagram",
            url: "https://bit.ly/mirkopapadopoli-instagram",
            cssClass: "instagram" // Per colori personalizzati al hover
        },
        {
            name: "YouTube",
            icon: "fab fa-youtube",
            url: "https://bit.ly/mirkopapadopoli-youtube",
            cssClass: "youtube"
        },
        {
            name: "TikTok",
            icon: "fab fa-tiktok",
            url: "https://tiktok.com/@mirkopapadopoli",
            cssClass: "tiktok"
        },
        {
            name: "Email",
            icon: "fas fa-envelope",
            url: "mailto:papadopoli.business@gmail.com",
            cssClass: "email"
        }
    ],

    // =========================================================================
    // 📋 SEZIONI DI LINK
    // =========================================================================
    // Puoi aggiungere o rimuovere sezioni facilmente
    sections: [
        {
            id: "featured",
            title: "Link in Evidenza",
            links: [
                {
                    title: "Vetrina Amazon",
                    description: "Scopri i miei prodotti consigliati",
                    icon: "fab fa-amazon",
                    url: "https://bit.ly/mirkopapadopoli-amazon",
                    style: "featured", // Opzioni: "featured", "support", "default"
                    badge: "BLACK FRIDAY",
                },
                {
                    title: "SetApp - Sconto 15%",
                    description: "Oltre 240 app Mac con un abbonamento",
                    icon: "fas fa-laptop-code",
                    url: "https://bit.ly/mirkopapadopoli-setapp",
                    style: "default",
                    badge: "-15%" // Badge opzionale
                },
                {
                    title: "IPTV Italia",
                    description: "Playlist canali gratuiti",
                    icon: "fas fa-tv",
                    url: "https://github.com/iptv-org/iptv",
                    style: "default"
                },
                {
                    title: "PLAUD NotePin",
                    description: "AI wearable per registrare e trascrivere",
                    icon: "fas fa-microphone",
                    url: "https://www.amazon.it/dp/B0D25P17KH",
                    style: "default"
                },

                /* {
                    title: "Coursera",
                    description: "Corsi online certificati",
                    icon: "fas fa-graduation-cap",
                    url: "https://coursera.pxf.io/k0Pedk",
                    style: "default"
                },
                {
                    title: "Unieuro",
                    description: "Offerte elettronica e tecnologia",
                    icon: "fas fa-bolt",
                    url: "https://track.adform.net/adfserve/?bn=85063815",
                    style: "default"
                } */
                {
                    title: "Sedia Ergonomica",
                    description: "Sedia ergonomica PaperLooos per lavoro, studio e gioco",
                    //icon: "fas fa-bolt",
                    icon: "img/sedia.jpg",
                    url: "https://paperloops.com?sca_ref=9860932.coptS7MXDKJTh",
                    style: "default"
                }
            ]
        },
        {
            id: "support",
            title: "Supporta il mio lavoro",
            links: [
            
                {
                    title: "Media Kit",
                    description: "Per collaborazioni",
                    icon: "fas fa-briefcase",
                    url: "https://beacons.ai/mirkopapadopoli/mediakit",
                    style: "default"
                },
                {
                    title: "Offrimi un caffè ☕",
                    description: "Se i miei contenuti ti sono utili",
                    icon: "fab fa-paypal",
                    url: "https://paypal.com/paypalme/rkomii",
                    style: "support"
                }
            ]
        }

        // =====================================================================
        // 💡 AGGIUNGI NUOVE SEZIONI QUI
        // =====================================================================
        // Esempio di nuova sezione:
        /*
        ,{
            id: "projects",
            title: "I Miei Progetti",
            links: [
                {
                    title: "Progetto 1",
                    description: "Descrizione del progetto",
                    icon: "fas fa-code",
                    url: "https://example.com",
                    style: "default"
                }
            ]
        }
        */
    ],

    // =========================================================================
    // ⚙️ IMPOSTAZIONI
    // =========================================================================
    settings: {
        // Velocità dell'effetto typing (millisecondi per carattere)
        typingSpeed: 80,

        // Footer text
        footerText: "Made with ❤️ by Mirko Papadopoli",

        // Meta tags per SEO
        meta: {
            title: "Mirko Papadopoli | Links",
            description: "Mirko Papadopoli - Appassionato di Informatica e AI. Tutorial e consigli per semplificare la tua esperienza digitale.",
            author: "Mirko Papadopoli"
        }
    }
};

// Rendi CONFIG disponibile globalmente
window.CONFIG = CONFIG;