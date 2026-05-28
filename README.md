# OrStore Bénin — Structure du projet

## 📁 Arborescence

```
orstore-benin/
│
├── index.html              ← Page principale fragmentée avec placeholders pour partials
│
├── partials/              ← Fragments HTML chargés dynamiquement
│   ├── role.html           ← Écran de choix du rôle
│   ├── auth.html           ← Écrans connexion / inscription
│   ├── home.html           ← Page d'accueil et sections publiques
│   ├── seller.html         ← Tableau de bord vendeur
│   └── modals.html         ← Toutes les modals (panier, user, produit, ajout)
│
├── styles/
│   ├── main.css            ← Variables CSS, reset, écrans role & auth
│   ├── home.css            ← Navbar, hero, produits, catégories, contact, bottom nav
│   ├── seller.css          ← Tableau de bord vendeur
│   ├── modals.css          ← Toutes les modals (panier, user, produit, ajout)
│   └── utils.css           ← Toast, empty state, animations
│
└── js/
    ├── app.js              ← Point d'entrée — importe tout, expose les globals, init
    ├── config.js           ← Configuration Firebase (à modifier ici)
    ├── state.js            ← État global partagé (S)
    ├── data.js             ← Produits démo (fallback si Firestore vide)
    ├── utils.js            ← Helpers : g(), err(), toast(), btnLoad(), fbErr()
    ├── auth.js             ← Inscription, connexion, déconnexion, refreshAvatars
    ├── products.js         ← Chargement Firestore, seed DB, publication produit + image
    ├── cart.js             ← Panier : add, remove, qty, render, badge
    ├── render.js           ← Cartes produits, grilles, renderHome, renderSellerProducts
    ├── navigation.js       ← Changements d'écran, sections (showCat, showPromos…)
    ├── search.js           ← Recherche en temps réel
    ├── modals.js           ← open/close modal, détail produit, menu user
    └── html-loader.js      ← Chargement dynamique des fragments HTML
```

---

## 🔧 Modifications courantes

| Besoin | Fichier |
|--------|---------|
| Changer les couleurs / fonts | `styles/main.css` → `:root { --gold: ... }` |
| Modifier le style des cartes produits | `styles/home.css` → `.product-card` |
| Modifier le dashboard vendeur | `styles/seller.css` |
| Ajouter une modal | `styles/modals.css` + `js/modals.js` |
| Modifier le HTML fragmenté | `partials/*.html` + `js/html-loader.js` |
| Changer la config Firebase | `js/config.js` |
| Ajouter des produits démo | `js/data.js` |
| Modifier la logique du panier | `js/cart.js` |
| Modifier la navigation | `js/navigation.js` |

---

## 🔥 Configuration Firebase

### ÉTAPE 1 — Créer le projet
→ https://console.firebase.google.com  
→ "Créer un projet" → Nom : `orstore-benin`  
→ Désactiver Analytics → "Créer"

### ÉTAPE 2 — Activer l'authentification
→ Menu gauche : Authentication → Commencer  
→ Onglet "Sign-in method"  
→ Activer "E-mail/mot de passe" → Enregistrer

### ÉTAPE 3 — Créer la base Firestore
→ Menu gauche : Firestore Database → Créer  
→ Mode TEST (pour commencer)  
→ Région : europe-west

### ÉTAPE 4 — ⚠️ Activer Firebase Storage (nouveau — pour les images)
→ Menu gauche : **Storage** → Commencer  
→ Mode TEST → Région : europe-west  
→ Règles Storage à mettre en place (voir ci-dessous)

**Règles Storage recommandées :**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### ÉTAPE 5 — Récupérer les clés
→ Accueil du projet → icône `</>` (Web app)  
→ Nom : `orstore-web` → Enregistrer  
→ Copier le bloc `firebaseConfig`  
→ Coller les valeurs dans **`js/config.js`**

### ÉTAPE 6 — Héberger sur GitHub Pages
→ github.com → New repository → `orstore-benin`  
→ Upload **tout le dossier** (index.html + styles/ + js/)  
→ Settings → Pages → Branch: main → Save  
→ URL : `https://TON-USERNAME.github.io/orstore-benin/`

---

## ✅ Firebase gratuit jusqu'à
- 10 000 connexions/mois
- 1 Go de base de données Firestore
- 50 000 lectures Firestore/jour
- **5 Go de stockage** (Firebase Storage — pour les images)
