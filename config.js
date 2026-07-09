// =============================================================================
// 🔧 FILE DI CONFIGURAZIONE
// Modifica questo file per personalizzare la tua bio page!
// =============================================================================

const CONFIG = {
    profile: {
        name: "Mirko Papadopoli",
        bio: "Appassionato di Informatica e AI 🤖<br>Condivido tutorial e consigli per semplificare la tua esperienza digitale 📲",
        image: "img/profile.PNG"
    },

    socials: [
            {
                    "name": "Instagram",
                    "icon": "fab fa-instagram",
                    "url": "https://bit.ly/mirkopapadopoli-instagram",
                    "cssClass": "instagram"
            },
            {
                    "name": "YouTube",
                    "icon": "fab fa-youtube",
                    "url": "https://bit.ly/mirkopapadopoli-youtube",
                    "cssClass": "youtube"
            },
            {
                    "name": "TikTok",
                    "icon": "fab fa-tiktok",
                    "url": "https://bit.ly/mirkopapadopoli-tiktok",
                    "cssClass": "tiktok"
            },
            {
                    "name": "Email",
                    "icon": "fas fa-envelope",
                    "url": "mailto:papadopoli.business@gmail.com",
                    "cssClass": "email"
            }
    ],

    tabbedSections: ["featured","deals"],

    sections: [
        {
            id: "featured",
            title: "Link in Evidenza",
            links: [
                {
                    title: "🔥 Tutte le Offerte",
                    description: "Le migliori offerte selezionate in un'unica pagina",
                    icon: "fas fa-tags",
                    url: "offerte.html",
                    style: "featured"
                },
                {
                    title: "Vetrina Amazon",
                    description: "Scopri i miei prodotti consigliati",
                    icon: "fab fa-amazon",
                    url: "https://bit.ly/mirkopapadopoli-amazon",
                    style: "featured"
                },
                {
                    title: "PLAUD NotePin",
                    description: "AI wearable per registrare e trascrivere",
                    icon: "fas fa-microphone",
                    url: "https://bit.ly/plaudnotepin-mirkopapadopoli",
                    style: "default"
                },
                {
                    title: "INSTA360 X5",
                    description: "Action Cam 360",
                    icon: "img/insta360x5.jpg",
                    url: "https://bit.ly/insta360-x5-mirkopapadopoli",
                    style: "default",
                    badge: "-5%"
                },
                {
                    title: "INSTA360 Ace Pro 2",
                    description: "Action Cam",
                    icon: "img/insta360_acepro2.jpg",
                    url: "https://bit.ly/insta360-acepro2-mirkopapadopoli",
                    style: "default",
                    badge: "-5%"
                },
                {
                    title: "TPLINK Tapo RV50 Omni PRO",
                    description: "Robot Aspirapolvere",
                    icon: "img/tplinkrv50omni.jpg",
                    url: "https://pboost.me/G2a8ytOv",
                    style: "default"
                }
            ]
        },
        {
            id: "deals",
            title: "🔥 Migliori Offerte Selezionate",
            links: [
                {
                    title: "Privé by Zalando: outlet online per la moda e la casa",
                    description: "Privé by Zalando: outlet online per la moda e la casa",
                    icon: "fas fa-link",
                    url: "https://prive-by-zalando-it.mtpc.se/6318976",
                    style: "default"
                },
                {
                    title: "Moda donna, uomo e bambini, articoli per casa e tanto altro | SHEIN ITALIA",
                    description: "Moda donna, uomo e bambini, articoli per casa e tanto altro | SHEIN ITALIA",
                    icon: "fas fa-link",
                    url: "https://shein-it.mtpc.se/6317251",
                    style: "default",
                    badge: "CODICE SCONTO: ITAFNEW26"
                },
                {
                    title: "Etrusca Gioielli: Gold Plated Made in Italy Creations",
                    description: "Etrusca Gioielli: Gold Plated Made in Italy Creations",
                    icon: "fas fa-link",
                    url: "https://etrusca-gioielli.mtpc.se/6317249",
                    style: "default",
                    badge: "CODICE SCONTO: PIC15"
                },
                {
                    title: "PcComponentes.it | Negozio online di computer e tecnologia",
                    description: "PcComponentes.it | Negozio online di computer e tecnologia",
                    icon: "fas fa-link",
                    url: "https://pc-componentes-it.mtpc.se/6317246",
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
    ],

    settings: {
        typingSpeed: 80,
        footerText: "Made with ❤️ by Mirko Papadopoli",
        meta: {
            title: "Mirko Papadopoli | Links",
            description: "Mirko Papadopoli - Appassionato di Informatica e AI. Tutorial e consigli per semplificare la tua esperienza digitale.",
            author: "Mirko Papadopoli"
        }
    },

    tracking: {
        metaPixelId: "",
        googleAdsId: ""
    }
};

// Rendi CONFIG disponibile globalmente
window.CONFIG = CONFIG;
