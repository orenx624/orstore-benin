/* ══════════════════════════════
   MODALS
══════════════════════════════ */
import { S }          from './state.js';
import { renderCart } from './cart.js';
import { toast }      from './utils.js';

/* ── Ouvre une modal ── */
export function openModal(id) {
  document.getElementById(id).classList.add('open');
}

/* ── Ferme une modal ── */
export function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* ── Ouvre la modal panier ── */
export function openCart() {
  renderCart();
  openModal('modal-cart');
}

/* ── Ouvre la fiche détail d'un produit ── */
export function openProduct(id) {
  const p = S.products.find(x => x.id === id);
  if (!p) return;
  const origPrice = p.originalPrice || p.orig;
  const disc      = origPrice && origPrice > p.price ? Math.round((1 - p.price / origPrice) * 100) : 0;

  const visual = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${p.name}">`
    : p.emoji || '📦';

  document.getElementById('pdl-content').innerHTML = `
    <div class="pdl-img">${visual}</div>
    <div class="pdl-body">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        ${p.isNew  ? '<span class="badge-new"  style="position:static;font-size:.8rem;padding:4px 12px">Nouveau</span>'  : ''}
        ${disc > 0 ? `<span class="badge-discount" style="position:static;font-size:.8rem;padding:4px 12px">−${disc}%</span>` : ''}
      </div>
      <h2 class="pdl-name">${p.name}</h2>
      <div class="pdl-pricing">
        <span class="pdl-price">${p.price.toLocaleString('fr-FR')} FCFA</span>
        ${origPrice ? `<span class="pcard-old" style="font-size:1rem">${origPrice.toLocaleString('fr-FR')} FCFA</span>` : ''}
      </div>
      <p class="pdl-desc">${p.description || p.desc || 'Aucune description disponible.'}</p>
      <div class="pdl-meta">
        <div>🏷️ <strong>${p.category || p.cat}</strong></div>
        <div>📍 <strong>${p.location || p.loc || 'Bénin'}</strong></div>
        <div>👤 <strong>${p.sellerName || 'OrStore'}</strong></div>
      </div>
      <button class="btn-primary" style="margin-top:20px"
        onclick="addToCart('${p.id}');closeModal('modal-pdl')">
        🛒 Ajouter au panier
      </button>
      <button class="btn-outline" style="margin-top:10px"
        onclick="toast('Contacter le vendeur — bientôt disponible 💬')">
        💬 Contacter le vendeur
      </button>
    </div>`;
  openModal('modal-pdl');
}

/* ── Ouvre le menu utilisateur (profil) ── */
export function openUserMenu() {
  const u = S.user;
  document.getElementById('um-out').style.display  = u ? 'none'  : 'block';
  document.getElementById('um-in').style.display   = u ? 'block' : 'none';
  document.getElementById('um-av').textContent     = u
    ? (u.displayName || u.email).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '👤';
  document.getElementById('um-name').textContent   = u ? (u.displayName || 'Utilisateur') : 'Non connecté';
  document.getElementById('um-email').textContent  = u ? u.email : 'Connectez-vous pour plus de fonctionnalités';
  openModal('modal-user');
}

/* ── Formulaire de contact ── */
export function submitContact(e) {
  e.preventDefault();
  toast('Message envoyé ! Nous vous répondrons sous 24h. ✅');
  e.target.reset();
}
