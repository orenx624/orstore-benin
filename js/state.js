/* ══════════════════════════════
   STATE GLOBAL
   Toutes les données partagées de l'app
══════════════════════════════ */
export const S = {
  user:     null,
  role:     'buyer',
  products: [],
  cart:     JSON.parse(localStorage.getItem('orstore_cart') || '[]'),
};
