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
                    title: "AliExpress IT",
                    description: "Offerte selezionate su AliExpress",
                    icon: "https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128",
                    url: "https://aliexpress-it.mtpc.se/6203629",
                    style: "default",
                    category: "marketplace"
                },
                {
                    title: "Marionnaud",
                    description: "Profumi, Make up, Trattamenti Viso e Corpo",
                    icon: "https://www.google.com/s2/favicons?domain=marionnaud.it&sz=128",
                    url: "https://marionnaud.mtpc.se/6171483",
                    style: "default",
                    category: "beauty"
                },
                {
                    title: "PcComponentes.it",
                    description: "Negozio online di computer e tecnologia",
                    icon: "https://www.google.com/s2/favicons?domain=pccomponentes.it&sz=128",
                    url: "https://pc-componentes-it.mtpc.se/6141649",
                    style: "default",
                    category: "tech"
                },
                {
                    title: "QVC Italia",
                    description: "Bellezza, Moda, Casa ed Elettronica",
                    icon: "https://www.google.com/s2/favicons?domain=qvc.it&sz=128",
                    url: "https://qvc.mtpc.se/6123714",
                    style: "default",
                    category: "marketplace"
                },
                {
                    title: "Samsung IT – Galaxy S26 Ultra",
                    description: "Acquista Galaxy S26 Ultra – Prezzi e offerte",
                    icon: "https://www.google.com/s2/favicons?domain=samsung.com&sz=128",
                    url: "https://samsung-it.mtpc.se/6165130",
                    style: "default",
                    category: "tech"
                },
                {
                    title: "JD Sports Italia",
                    description: "Shop online di scarpe e abbigliamento sportivo",
                    icon: "https://www.google.com/s2/favicons?domain=jdsports.it&sz=128",
                    url: "https://jd-sports-it.mtpc.se/6162304",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Mango Italia",
                    description: "Moda donna e uomo – stile contemporaneo",
                    icon: "https://www.google.com/s2/favicons?domain=mango.com&sz=128",
                    url: "https://mango-it.mtpc.se/6161172",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Foot Locker Italy",
                    description: "Sneaker iconiche e abbigliamento sportivo",
                    icon: "https://www.google.com/s2/favicons?domain=footlocker.it&sz=128",
                    url: "https://footlocker.mtpc.se/6161153",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Acqua di Marzamemi",
                    description: "Fragranze di nicchia ispirate alla Sicilia",
                    icon: "https://www.google.com/s2/favicons?domain=acquadimarzamemi.com&sz=128",
                    url: "https://acqua-di-marzamemi.mtpc.se/6147237",
                    style: "default",
                    category: "beauty"
                },
                {
                    title: "LeLang Advanced Skin Care",
                    description: "Skincare avanzata per una pelle luminosa e giovane",
                    icon: "https://www.google.com/s2/favicons?domain=lelangcare.com&sz=128",
                    url: "https://lelang-skincare.mtpc.se/6147235",
                    style: "default",
                    category: "beauty"
                },
                {
                    title: "Adidas Italia",
                    description: "Sport, streetwear e stile – il meglio di Adidas",
                    icon: "https://www.google.com/s2/favicons?domain=adidas.it&sz=128",
                    url: "https://adidas-it-new.mtpc.se/6141152",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Michael Kors Italia",
                    description: "Borse, accessori e moda di lusso accessibile",
                    icon: "https://www.google.com/s2/favicons?domain=michaelkors.com&sz=128",
                    url: "https://michael-kors-it.mtpc.se/6141124",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "KIKO Milano",
                    description: "Make up occhi, viso e labbra e cura della pelle",
                    icon: "https://www.google.com/s2/favicons?domain=kikocosmetics.com&sz=128",
                    url: "https://kiko-milano-it.mtpc.se/6125968",
                    style: "default",
                    category: "beauty"
                },
                {
                    title: "THE B'S – Moda Lusso",
                    description: "Abbigliamento e accessori di lusso 2026",
                    icon: "https://www.google.com/s2/favicons?domain=thebs.com&sz=128",
                    url: "https://thebs.mtpc.se/6124875",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Levi's Italia",
                    description: "Il denim più iconico al mondo con sconti esclusivi",
                    icon: "https://www.google.com/s2/favicons?domain=levi.com&sz=128",
                    url: "https://levis-it.mtpc.se/6123691",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "New Balance Italia",
                    description: "Scarpe e abbigliamento tecnico per sport e lifestyle",
                    icon: "https://www.google.com/s2/favicons?domain=newbalance.it&sz=128",
                    url: "https://new-balance-it.mtpc.se/6123685",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Notino Italia",
                    description: "Profumi, skincare e beauty dai migliori brand",
                    icon: "https://www.google.com/s2/favicons?domain=notino.it&sz=128",
                    url: "https://notino-it.mtpc.se/6125311",
                    style: "default",
                    category: "beauty"
                },
                {
                    title: "Westwing Outlet",
                    description: "Mobili, decorazioni e tessili per la casa a prezzi scontati",
                    icon: "https://www.google.com/s2/favicons?domain=westwing.it&sz=128",
                    url: "https://westwing-it.mtpc.se/6121136",
                    style: "default",
                    category: "casa"
                },
                {
                    title: "Westwing – Nuove Offerte",
                    description: "Altre promozioni su arredi, decorazioni e tessili",
                    icon: "https://www.google.com/s2/favicons?domain=westwing.it&sz=128",
                    url: "https://westwing-it.mtpc.se/6188613",
                    style: "default",
                    category: "casa"
                },
                {
                    title: "Charlotte Tilbury IT",
                    description: "Usa il codice DARLING15 per il -15% extra e spedizione gratuita!",
                    icon: "https://www.google.com/s2/favicons?domain=charlottetilbury.com&sz=128",
                    url: "https://charlotte-tilbury-it.mtpc.se/6207589",
                    style: "default",
                    badge: "CODICE SCONTO: DARLING15",
                    category: "beauty"
                },
                {
                    title: "Dorelan IT",
                    description: "Materassi, cuscini e sistemi letto Dorelan",
                    icon: "https://www.google.com/s2/favicons?domain=dorelan.com&sz=128",
                    url: "https://dorelan.mtpc.se/6208895",
                    style: "default",
                    category: "casa"
                },
                {
                    title: "Prenatal IT",
                    description: "Abbigliamento, accessori e prodotti per neonati e bambini",
                    icon: "https://www.google.com/s2/favicons?domain=prenatal.it&sz=128",
                    url: "https://prenatal-it.mtpc.se/6271619",
                    style: "default",
                    badge: "CODICE SAVETEN",
                    category: "famiglia"
                },
                {
                    title: "Privé by Zalando IT",
                    description: "Moda e accessori di brand premium a prezzi scontati",
                    icon: "https://www.google.com/s2/favicons?domain=prive.zalando.it&sz=128",
                    url: "https://prive-by-zalando-it.mtpc.se/6273752",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Etrusca Gioielli",
                    description: "Gioielli artigianali italiani in oro e argento",
                    icon: "https://www.google.com/s2/favicons?domain=etruscagioielli.it&sz=128",
                    url: "https://etrusca-gioielli.mtpc.se/6282922",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Lenovo Italia – Laptop e Notebook",
                    description: "IdeaPad, ThinkPad, Yoga, Legion e tutta la gamma notebook",
                    icon: "https://www.google.com/s2/favicons?domain=lenovo.com&sz=128",
                    url: "https://bednari.com/c/6iia5dppfe36ba321f24cc01b591a8/",
                    style: "default",
                    category: "tech"
                },
                {
                    title: "ChicMe – Moda Donna",
                    description: "Abbigliamento femminile trendy a prezzi accessibili",
                    icon: "https://www.google.com/s2/favicons?domain=chicme.com&sz=128",
                    url: "https://rzekl.com/c/gf807z8tar36ba321f24312b8f391a/",
                    style: "default",
                    category: "moda"
                },
                {
                    title: "Boardmix – Whiteboard AI",
                    description: "Lifetime deal: mappe mentali, flowchart e 100+ agenti AI",
                    icon: "https://www.google.com/s2/favicons?domain=boardmix.com&sz=128",
                    url: "https://axavl.com/c/3tevoaw5qq36ba321f24d12233f6f4/",
                    style: "default",
                    badge: "LIFETIME DEAL",
                    category: "tech"
                },
                {
                    title: "Alibaba.com – Sourcing Globale B2B",
                    description: "Milioni di prodotti, EU Local Stock, Trade Assurance",
                    icon: "https://www.google.com/s2/favicons?domain=alibaba.com&sz=128",
                    url: "https://rzekl.com/c/pm1aev55cl36ba321f24219aa26f6f/",
                    style: "default",
                    category: "marketplace"
                },
                {
                    title: "Turbo VPN – Protezione Online",
                    description: "72% di sconto sul piano Gold 27 mesi – solo €3,33/mese",
                    icon: "https://www.google.com/s2/favicons?domain=turbovpn.com&sz=128",
                    url: "https://grfpr.com/c/exe221unkp36ba321f24ddf84d4c0b/",
                    style: "default",
                    badge: "-72%",
                    category: "tech"
                },
                {
                    title: "AliExpress Best Deals",
                    description: "Le migliori offerte selezionate su AliExpress",
                    icon: "https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128",
                    url: "https://fas.st/0vFRv",
                    style: "default",
                    category: "marketplace"
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
        metaPixelId: "1363279862594624",
        googleAdsId: ""
    }
};

// Rendi CONFIG disponibile globalmente
window.CONFIG = CONFIG;
