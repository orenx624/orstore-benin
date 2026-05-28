/* ══════════════════════════════
   RENDU PRODUITS
══════════════════════════════ */
import { S } from './state.js';

/* ── Génère le HTML d'une carte produit ── */
export function card(p) {
  const origPrice = p.originalPrice || p.orig;
  const category  = p.category || p.cat;
  const location  = p.location || p.loc;
  const disc      = origPrice && origPrice > p.price ? Math.round((1 - p.price / origPrice) * 100) : 0;

  // Image ou emoji
  const visual = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${p.name}">`
    : p.emoji || '📦';

  return `
    <div class="product-card" onclick="openProduct('${p.id}')">
      ${disc > 0 ? `<div class="badge-discount">−${disc}%</div>` : ''}
      ${p.isNew  ? `<div class="badge-new">Nouveau</div>` : ''}
      <div class="pcard-img">${visual}</div>
      <div class="pcard-body">
        <div class="pcard-name">${p.name}</div>
        <div class="pcard-pricing">
          <span class="pcard-price">${p.price.toLocaleString('fr-FR')} FCFA</span>
          ${origPrice ? `<span class="pcard-old">${origPrice.toLocaleString('fr-FR')}</span>` : ''}
        </div>
        <div class="pcard-loc">📍 ${location || 'Bénin'}</div>
        <button class="btn-add-cart" onclick="event.stopPropagation();addToCart('${p.id}')">+ Panier</button>
      </div>
    </div>`;
}

export function grid(arr) { return `<div class="products-grid">${arr.map(card).join('')}</div>`; }
export function row(arr)  { return `<div class="products-scroll">${arr.map(card).join('')}</div>`; }

/* ── Render section accueil ── */
export function renderHome() {
  const featured = S.products.filter(p => p.featured);
  const newest   = [...S.products]
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, 10);
  const el_f = document.getElementById('row-featured');
  const el_n = document.getElementById('row-new');
  if (el_f) el_f.innerHTML = row(featured);
  if (el_n) el_n.innerHTML = row(newest);
  updateCatCounts();
}

/* ── Met à jour les compteurs de catégories ── */
export function updateCatCounts() {
  const CATS = {
    'cc-elec': 'Électronique', 'cc-vete': 'Vêtements',
    'cc-acce': 'Accessoires',  'cc-beau': 'Beauté',
    'cc-mais': 'Maison',       'cc-alim': 'Alimentation',
    'cc-spor': 'Sport',
  };
  Object.entries(CATS).forEach(([id, cat]) => {
    const el = document.getElementById(id);
    if (el) {
      const n = S.products.filter(p => (p.category || p.cat) === cat).length;
      el.textContent = n + ' produit' + (n > 1 ? 's' : '');
    }
  });
}

/* ── Render liste produits du vendeur connecté ── */
export function renderSellerProducts() {
  const el = document.getElementById('my-products-list');
  if (!el) return;
  const mine = S.user
    ? S.products.filter(p => p.sellerId === S.user.uid || p.sellerId === 'demo')
    : [];
  const sProd = document.getElementById('s-prod-count');
  if (sProd) sProd.textContent = mine.length;

  if (mine.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div style="font-size:3rem">📦</div>
        <p>Vous n'avez pas encore de produits.<br>Cliquez sur "+ Ajouter un produit".</p>
      </div>`;
    return;
  }
  el.innerHTML = mine.map(p => {
    const thumb = p.imageUrl
      ? `<img src="${p.imageUrl}" alt="${p.name}">`
      : p.emoji || '📦';
    return `
      <div class="seller-product">
        <div class="sp-thumb">${thumb}</div>
        <div class="sp-info">
          <div class="sp-name">${p.name}</div>
          <div class="sp-price">${p.price.toLocaleString('fr-FR')} FCFA</div>
          <div class="sp-cat">${p.category || p.cat}</div>
        </div>
        <span class="prod-status ${p.isNew ? 'status-new' : 'status-active'}">
          ${p.isNew ? 'Nouveau' : 'Actif'}
        </span>
      </div>`;
  }).join('');
}
