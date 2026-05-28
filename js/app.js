/* ══════════════════════════════
   APP.JS — Point d'entrée principal
   Importe tous les modules et expose les
   fonctions nécessaires au HTML (window.xxx)
══════════════════════════════ */

// ── Modules
import { S }                               from './state.js';
import { toast }                           from './utils.js';
import { initAuth, firebaseRegister, firebaseLogin, firebaseLogout } from './auth.js';
import { loadProducts, submitProduct }     from './products.js';
import { saveCart, updateBadge, addToCart, removeCart, qtyCart, renderCart, checkoutWhatsApp, openWhatsAppChat } from './cart.js';
import { navigateToScreen, goBack, chooseRole, showCatList, showCat, showPromos, showNouveautes, showContact, goHome, getSavedRole, getSavedScreen, getSavedSection } from './navigation.js';
import { doSearch }                        from './search.js';
import { openModal, closeModal, openCart, openProduct, openUserMenu, submitContact } from './modals.js';

/* ══════════════════════════════
   EXPOSITION GLOBALE (window.xxx)
   Nécessaire pour les onclick HTML
══════════════════════════════ */
window.S              = S;
window.toast          = toast;

// Auth
window.navigateScreen = navigateToScreen;   // utilisé dans tout le HTML
window.goBack         = goBack;
window.firebaseRegister = firebaseRegister;
window.firebaseLogin  = firebaseLogin;
window.firebaseLogout = firebaseLogout;

// Navigation
window.chooseRole     = chooseRole;
window.showCatList    = showCatList;
window.showCat        = showCat;
window.showPromos     = showPromos;
window.showNouveautes = showNouveautes;
window.showContact    = showContact;
window.goHome         = goHome;

// Produits & panier
window.submitProduct  = submitProduct;
window.addToCart      = addToCart;
window.removeCart     = removeCart;
window.qtyCart        = qtyCart;
window.saveCart       = saveCart;
window.updateBadge    = updateBadge;
window.renderCart     = renderCart;
window.checkoutWhatsApp = checkoutWhatsApp;
window.openWhatsAppChat = openWhatsAppChat;

// Modals
window.openModal      = openModal;
window.closeModal     = closeModal;
window.openCart       = openCart;
window.openProduct    = openProduct;
window.openUserMenu   = openUserMenu;
window.submitContact  = submitContact;

// Recherche
window.doSearch       = doSearch;

/* ══════════════════════════════
   EMOJI PICKER (formulaire vendeur)
══════════════════════════════ */
window.setEmoji = (btn, emoji) => {
  document.querySelectorAll('.em-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('ap-emoji').value = emoji;
};

/* ══════════════════════════════
   INIT AU CHARGEMENT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Restaurer l'état précédent après actualisation
  const savedRole = getSavedRole();
  if (savedRole) S.role = savedRole;
  const savedScreen = getSavedScreen();
  const savedSection = getSavedSection();
  if (savedScreen && savedScreen !== 'role') {
    if (savedScreen === 'seller') {
      chooseRole('seller');
    } else {
      navigateToScreen(savedScreen);
    }
  }

  // Panier
  updateBadge();

  // Charge les produits
  loadProducts();

  // Restaurer la section dans home après chargement des produits
  setTimeout(() => {
    if (savedScreen === 'home' && savedSection) {
      const sectionMap = {
        'sec-accueil': goHome,
        'sec-catlist': showCatList,
        'sec-promos': showPromos,
        'sec-nouveautes': showNouveautes,
        'sec-contact': showContact,
      };
      if (sectionMap[savedSection]) {
        sectionMap[savedSection]();
      } else {
        // Pour les sections dynamiques comme sec-category et sec-search, restaurer directement
        document.querySelectorAll('.home-section').forEach(s => s.style.display = 'none');
        const sec = document.getElementById(savedSection);
        if (sec) sec.style.display = 'block';
      }
    }
  }, 100);

  // Recherche
  document.getElementById('search-form')?.addEventListener('submit', doSearch);
  document.getElementById('search-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch(e);
  });

  // Bottom nav — active state
  document.querySelectorAll('.bnav-item').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Prévisualisation image produit
  document.getElementById('ap-image')?.addEventListener('change', function () {
    const file    = this.files[0];
    const preview = document.getElementById('ap-image-preview');
    if (!file || !preview) return;
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu">`;
      preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });

  // Auth — écoute connexion/déconnexion
  initAuth(user => {
    // Si un vendeur vient de se connecter et qu'on est sur l'écran login/register,
    // rediriger vers le dashboard vendeur
    const active = document.querySelector('.screen.active')?.id;
    if (user && S.role === 'seller' && (active === 'sc-login' || active === 'sc-register')) {
      navigateToScreen('seller');
    }
  });

});
