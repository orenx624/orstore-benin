/* ══════════════════════════════
   DONNÉES PRODUITS DÉMO
   Utilisées si Firestore est vide
══════════════════════════════ */
export const DEMO_PRODUCTS = [
  // Électronique
  { name:"Samsung Galaxy A34 5G",     desc:"128Go, écran 6.6\", 5000mAh, Triple caméra 48MP",                    price:195000, orig:220000, cat:"Électronique", emoji:"📱", loc:"Cotonou",    featured:true,  isNew:false, sellerId:"demo", sellerName:"OrStore" },
  { name:"iPhone 14 Pro Max",         desc:"256Go, Puce A16 Bionic, Dynamic Island, Caméra 48MP",                price:520000, orig:580000, cat:"Électronique", emoji:"📱", loc:"Cotonou",    featured:true,  isNew:false, sellerId:"demo", sellerName:"OrStore" },
  { name:"Laptop HP 15 Core i5",      desc:"8Go RAM, SSD 256Go, écran 15.6\", Windows 11 Pro",                   price:280000, orig:320000, cat:"Électronique", emoji:"💻", loc:"Cotonou",    featured:true,  isNew:true,  sellerId:"demo", sellerName:"OrStore" },
  { name:"Tablette Samsung Tab A8",   desc:"Écran 10.5\", 3Go RAM, 32Go, Android 12, WiFi",                      price:125000, orig:null,   cat:"Électronique", emoji:"📲", loc:"Cotonou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"OrStore" },
  { name:"Casque Sony WH-1000XM5",    desc:"Bluetooth, réduction bruit active, 30h autonomie",                   price:89000,  orig:110000, cat:"Électronique", emoji:"🎧", loc:"Cotonou",    featured:true,  isNew:false, sellerId:"demo", sellerName:"OrStore" },
  { name:"Montre Xiaomi Band 8",      desc:"Suivi santé, notifications, 14 jours autonomie, waterproof IP68",    price:35000,  orig:null,   cat:"Électronique", emoji:"⌚", loc:"Cotonou",    featured:true,  isNew:true,  sellerId:"demo", sellerName:"OrStore" },
  { name:"Écouteurs TWS Pro",         desc:"Bluetooth 5.3, réduction bruit, 36h total, étui charge",             price:28000,  orig:35000,  cat:"Électronique", emoji:"🎵", loc:"Cotonou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"OrStore" },
  // Vêtements
  { name:"Robe Ankara Élégante",      desc:"Tissu Ankara 100%, modèle longue, tailles 38-46 disponibles",        price:12500,  orig:null,   cat:"Vêtements",    emoji:"👗", loc:"Porto-Novo", featured:true,  isNew:false, sellerId:"demo", sellerName:"Mode Bénin" },
  { name:"Boubou Traditionnel Brodé", desc:"Grand boubou bazin riche, broderies main, taille S à XXL",           price:18000,  orig:22000,  cat:"Vêtements",    emoji:"👘", loc:"Abomey",     featured:false, isNew:false, sellerId:"demo", sellerName:"Artisan Bénin" },
  { name:"Sneakers Nike Air Max 270", desc:"Chaussures sport unisexe, semelle Air, tailles 36-46",               price:38000,  orig:null,   cat:"Vêtements",    emoji:"👟", loc:"Calavi",     featured:true,  isNew:true,  sellerId:"demo", sellerName:"SportShop BJ" },
  { name:"Costume 3 Pièces Homme",    desc:"Slim fit polyester premium, coloris noir ou bleu marine",            price:45000,  orig:55000,  cat:"Vêtements",    emoji:"🤵", loc:"Cotonou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"OrStore" },
  { name:"Tenue Wax Homme",           desc:"Chemise + pantalon tissu wax, coupe moderne, tailles S-XL",         price:9500,   orig:null,   cat:"Vêtements",    emoji:"👔", loc:"Porto-Novo", featured:false, isNew:false, sellerId:"demo", sellerName:"Mode Bénin" },
  // Accessoires
  { name:"Sac à Main Cuir Femme",     desc:"Cuir véritable, compartiments multiples, anses réglables",           price:22000,  orig:28000,  cat:"Accessoires",  emoji:"👜", loc:"Cotonou",    featured:true,  isNew:false, sellerId:"demo", sellerName:"OrStore" },
  { name:"Lunettes Soleil Aviator",   desc:"Verres polarisants UV400, monture dorée, étui inclus",               price:28000,  orig:35000,  cat:"Accessoires",  emoji:"🕶️", loc:"Porto-Novo", featured:false, isNew:false, sellerId:"demo", sellerName:"Style Bénin" },
  { name:"Ceinture Cuir Premium",     desc:"Cuir véritable, boucle métal dorée, taille universelle ajustable",  price:8500,   orig:null,   cat:"Accessoires",  emoji:"🪢", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"OrStore" },
  { name:"Portefeuille Cuir Homme",   desc:"Cuir véritable, 8 emplacements cartes, compartiment billets",       price:12000,  orig:15000,  cat:"Accessoires",  emoji:"👛", loc:"Cotonou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"OrStore" },
  // Beauté
  { name:"Parfum Dior Sauvage 100ml", desc:"Eau de parfum authentique, flacon 100ml, longue tenue",              price:48000,  orig:55000,  cat:"Beauté",       emoji:"🧴", loc:"Porto-Novo", featured:true,  isNew:false, sellerId:"demo", sellerName:"Parfums BJ" },
  { name:"Kit Maquillage Pro 24 coul",desc:"Palette ombres, fond de teint, mascara, rouge à lèvres",            price:15000,  orig:18000,  cat:"Beauté",       emoji:"💄", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"Beauty Bénin" },
  { name:"Fer à Lisser Professionnel",desc:"Céramique 230°C, chauffe 30s, affichage LCD, tous cheveux",          price:18500,  orig:22000,  cat:"Beauté",       emoji:"💇", loc:"Calavi",     featured:false, isNew:true,  sellerId:"demo", sellerName:"Beauty Bénin" },
  { name:"Crème Karité Naturelle 500",desc:"Karité pur + huile de coco, hydratation intense, peau sèche",       price:5500,   orig:null,   cat:"Beauté",       emoji:"🧖", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"Nature BJ" },
  // Maison
  { name:"Télévision LED 55\" 4K Smart",desc:"Android TV, HDR10, Dolby Audio, WiFi, 3 HDMI, Netflix",          price:195000, orig:240000, cat:"Maison",       emoji:"📺", loc:"Cotonou",    featured:true,  isNew:false, sellerId:"demo", sellerName:"Electrodom BJ" },
  { name:"Climatiseur Split 12000 BTU",desc:"Réversible chaud/froid, classe A++, télécommande, R32",            price:185000, orig:null,   cat:"Maison",       emoji:"❄️", loc:"Parakou",    featured:false, isNew:false, sellerId:"demo", sellerName:"Electrodom BJ" },
  { name:"Réfrigérateur 200L Double", desc:"Compartiment congélateur, dégivrage automatique, classe A+",        price:135000, orig:155000, cat:"Maison",       emoji:"🧊", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"Electrodom BJ" },
  { name:"Canapé 3 Places Velours",   desc:"Tissu velours gris anthracite, assise comfort, pieds métal",        price:95000,  orig:null,   cat:"Maison",       emoji:"🛋️", loc:"Cotonou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"Déco BJ" },
  { name:"Ventilateur sur Pied 18\"", desc:"3 vitesses, télécommande, minuterie 8h, oscillation 120°",          price:22000,  orig:26000,  cat:"Maison",       emoji:"🌀", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"Electrodom BJ" },
  // Alimentation
  { name:"Riz Local Béninois 25kg",   desc:"Riz étuvé grain long, production locale, qualité supérieure",       price:18000,  orig:null,   cat:"Alimentation", emoji:"🍚", loc:"Bohicon",    featured:false, isNew:false, sellerId:"demo", sellerName:"Agri Bénin" },
  { name:"Huile de Palme Rouge 5L",   desc:"100% naturelle, non raffinée, production artisanale",               price:6500,   orig:null,   cat:"Alimentation", emoji:"🫙", loc:"Porto-Novo", featured:false, isNew:false, sellerId:"demo", sellerName:"Agri Bénin" },
  { name:"Pack Eau Minérale 1.5L x12",desc:"Eau minérale naturelle du Bénin, pack 12 bouteilles",               price:3600,   orig:null,   cat:"Alimentation", emoji:"💧", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"Aqua BJ" },
  { name:"Café Robusta du Bénin 500g",desc:"Café moulu arabusta, torréfaction artisanale, arôme intense",       price:4500,   orig:null,   cat:"Alimentation", emoji:"☕", loc:"Parakou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"Agri Bénin" },
  // Sport
  { name:"Vélo VTT Shimano 21V",      desc:"26\", cadre aluminium, 21V, freins à disque, fourche suspendue",    price:85000,  orig:98000,  cat:"Sport",        emoji:"🚲", loc:"Cotonou",    featured:true,  isNew:false, sellerId:"demo", sellerName:"SportShop BJ" },
  { name:"Tapis de Yoga 6mm",         desc:"TPE écologique, 183x61cm, sac de transport + sangle inclus",        price:8500,   orig:null,   cat:"Sport",        emoji:"🧘", loc:"Cotonou",    featured:false, isNew:true,  sellerId:"demo", sellerName:"SportShop BJ" },
  { name:"Haltères Réglables 2x10kg", desc:"Fonte peinte rouge, embouts de serrage, idéal home gym",            price:35000,  orig:42000,  cat:"Sport",        emoji:"🏋️", loc:"Cotonou",    featured:false, isNew:false, sellerId:"demo", sellerName:"SportShop BJ" },
];
