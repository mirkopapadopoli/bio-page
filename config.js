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
                }
            ]
        },
        {
            id: "deals",
            title: "🔥 Migliori Offerte Selezionate",
            links: [
                {
                    title: "AliExpress IT",
                    description: "Offerte selezionate su AliExpress",
                    icon: "fas fa-shopping-cart",
                    url: "https://aliexpress-it.mtpc.se/6203629",
                    style: "default"
                },
                {
                    title: "Profumi, Make up, Trattamenti Viso e Corpo | Marionnaud",
                    description: "Profumi, Make up, Trattamenti Viso e Corpo | Marionnaud",
                    icon: "fas fa-tag",
                    url: "https://marionnaud.mtpc.se/6171483",
                    style: "default"
                },
                {
                    title: "PcComponentes.it | Negozio online di computer e tecnologia",
                    description: "PcComponentes.it | Negozio online di computer e tecnologia",
                    icon: "fas fa-gift",
                    url: "https://pc-componentes-it.mtpc.se/6141649",
                    style: "default"
                },
                {
                    title: "QVC Italia – Acquista online prodotti di Bellezza, Moda, Casa ed Elettronica",
                    description: "QVC Italia – Acquista online prodotti di Bellezza, Moda, Casa ed Elettronica",
                    icon: "fas fa-link",
                    url: "https://qvc.mtpc.se/6123714",
                    style: "default"
                },
                {
                    title: "Acquista Galaxy S26 Ultra | Prezzi e offerte | Samsung IT",
                    description: "Acquista Galaxy S26 Ultra | Prezzi e offerte | Samsung IT",
                    icon: "fas fa-link",
                    url: "https://samsung-it.mtpc.se/6165130",
                    style: "default"
                },
                {
                    title: "JD Sports Italia - Shop online di scarpe e abbigliamento",
                    description: "JD Sports Italia - Shop online di scarpe e abbigliamento",
                    icon: "fas fa-link",
                    url: "https://jd-sports-it.mtpc.se/6162304",
                    style: "default"
                },
                {
                    title: "Mango Italia | Moda online",
                    description: "Mango Italia | Moda online",
                    icon: "fas fa-link",
                    url: "https://mango-it.mtpc.se/6161172",
                    style: "default"
                },
                {
                    title: "Solo da Foot Locker | Collezione | Foot Locker Italy",
                    description: "Solo da Foot Locker | Collezione | Foot Locker Italy",
                    icon: "fas fa-link",
                    url: "https://footlocker.mtpc.se/6161153",
                    style: "default"
                },
                {
                    title: "ACQUA di MARZAMEMI® - fragranze di nicchia ispirate alla Sicilia - Acquadimarzamemi",
                    description: "ACQUA di MARZAMEMI® - fragranze di nicchia ispirate alla Sicilia - Acquadimarzamemi",
                    icon: "fas fa-link",
                    url: "https://acqua-di-marzamemi.mtpc.se/6147237",
                    style: "default"
                },
                {
                    title: "LeLang® | Advanced Skin Care - LeLang Skin Care",
                    description: "LeLang® | Advanced Skin Care - LeLang Skin Care",
                    icon: "fas fa-link",
                    url: "https://lelang-skincare.mtpc.se/6147235",
                    style: "default"
                },
                {
                    title: "adidas IT NEW",
                    description: "adidas IT NEW",
                    icon: "fas fa-link",
                    url: "https://adidas-it-new.mtpc.se/6141152",
                    style: "default"
                },
                {
                    title: "Promozione | Michael Kors [IT]",
                    description: "Promozione | Michael Kors [IT]",
                    icon: "fas fa-link",
                    url: "https://michael-kors-it.mtpc.se/6141124",
                    style: "default"
                },
                {
                    title: "Make up occhi, viso e labbra e cura della pelle | KIKO",
                    description: "Make up occhi, viso e labbra e cura della pelle | KIKO",
                    icon: "fas fa-link",
                    url: "https://kiko-milano-it.mtpc.se/6125968",
                    style: "default"
                },
                {
                    title: "Moda donna - Abbigliamento e accessori di lusso 2026 | thebs.com",
                    description: "Moda donna - Abbigliamento e accessori di lusso 2026 | thebs.com",
                    icon: "fas fa-link",
                    url: "https://thebs.mtpc.se/6124875",
                    style: "default"
                },
                {
                    title: "Levis IT",
                    description: "Levis IT",
                    icon: "fas fa-link",
                    url: "https://levis-it.mtpc.se/6123691",
                    style: "default"
                },
                {
                    title: "Scarpe e Abbigliamento | Sito ufficiale - New Balance",
                    description: "Scarpe e Abbigliamento | Sito ufficiale - New Balance",
                    icon: "fas fa-link",
                    url: "https://new-balance-it.mtpc.se/6123685",
                    style: "default"
                },
                {
                    title: "Brands Sale | notino.it",
                    description: "Brands Sale | notino.it",
                    icon: "fas fa-link",
                    url: "https://notino-it.mtpc.se/6125311",
                    style: "default"
                },
                {
                    title: "Sconti e offerte su mobili, decorazioni e tessili | Outlet Westwing",
                    description: "Sconti e offerte su mobili, decorazioni e tessili | Outlet Westwing",
                    icon: "fas fa-link",
                    url: "https://westwing-it.mtpc.se/6121136",
                    style: "default"
                },
                {
                    title: "Sconti e offerte su mobili, decorazioni e tessili | Outlet Westwing",
                    description: "Sconti e offerte su mobili, decorazioni e tessili | Outlet Westwing",
                    icon: "fas fa-link",
                    url: "https://westwing-it.mtpc.se/6188613",
                    style: "default"
                },
                {
                    title: "Charlotte Tilbury IT",
                    description: "Charlotte Tilbury IT",
                    icon: "fas fa-link",
                    url: "https://charlotte-tilbury-it.mtpc.se/6207589",
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
    }
};

// Rendi CONFIG disponibile globalmente
window.CONFIG = CONFIG;
