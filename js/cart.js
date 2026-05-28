/* ══════════════════════════════
   PANIER
══════════════════════════════ */
import { S }     from './state.js';
import { toast } from './utils.js';

const WHATSAPP_PHONE = '22997000000';
const WHATSAPP_LABEL = '+229 97 00 00 00';

function buildWhatsAppMessage() {
  const total = S.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = [
    'Bonjour OrStore, je souhaite passer une commande via WhatsApp :',
    '',
    '🛒 Détails du panier :'
  ];

  S.cart.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} x${item.qty} — ${(item.price * item.qty).toLocaleString('fr-FR')} FCFA`);
  });

  lines.push('', `Total : ${total.toLocaleString('fr-FR')} FCFA`, '', 'Adresse de livraison :', '(Merci de préciser votre adresse ici)', '', 'Merci !');
  return lines.join('\n');
}

export function checkoutWhatsApp() {
  if (S.cart.length === 0) {
    return toast('Votre panier est vide. Ajoutez un produit avant de commander.');
  }
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function openWhatsAppChat() {
  const message = 'Bonjour OrStore, j’ai une question sur une commande.';
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/* ── Sauvegarde le panier dans localStorage ── */
export function saveCart() {
  localStorage.setItem('orstore_cart', JSON.stringify(S.cart));
}

/* ── Met à jour le badge compteur du panier ── */
export function updateBadge() {
  const n = S.cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent    = n;
    b.style.display  = n > 0 ? 'flex' : 'none';
  });
}

/* ── Ajoute un produit au panier ── */
export function addToCart(id) {
  const p = S.products.find(x => x.id === id);
  if (!p) return;
  const ex = S.cart.find(x => x.id === id);
  if (ex) {
    ex.qty++;
  } else {
    S.cart.push({ id, name: p.name, price: p.price, emoji: p.emoji || '📦', imageUrl: p.imageUrl || null, qty: 1 });
  }
  saveCart();
  updateBadge();
  toast(`${p.name} ajouté au panier 🛒`);
  if (document.getElementById('modal-cart')?.classList.contains('open')) renderCart();
}

/* ── Retire un produit du panier ── */
export function removeCart(id) {
  S.cart = S.cart.filter(x => x.id !== id);
  saveCart(); updateBadge(); renderCart();
}

/* ── Change la quantité d'un article ── */
export function qtyCart(id, delta) {
  const item = S.cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); renderCart();
}

/* ── Affiche le contenu du panier dans la modal ── */
export function renderCart() {
  const el = document.getElementById('cart-items');
  const ft = document.getElementById('cart-footer');
  if (!el) return;

  if (S.cart.length === 0) {
    el.innerHTML = '<div class="empty-state"><div style="font-size:3rem">🛒</div><p>Votre panier est vide.</p></div>';
    if (ft) ft.innerHTML = '';
    return;
  }

  const total = S.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = S.cart.reduce((s, i) => s + i.qty, 0);

  el.innerHTML = S.cart.map(i => {
    const visual = i.imageUrl
      ? `<img src="${i.imageUrl}" alt="${i.name}">`
      : i.emoji;
    return `
      <div class="cart-item">
        <div class="ci-emoji">${visual}</div>
        <div class="ci-info">
          <div class="ci-name">${i.name}</div>
          <div class="ci-price">${(i.price * i.qty).toLocaleString('fr-FR')} FCFA</div>
          <div class="ci-unit">${i.price.toLocaleString('fr-FR')} FCFA / unité</div>
        </div>
        <div class="ci-qty">
          <button onclick="qtyCart('${i.id}',-1)">−</button>
          <span>${i.qty}</span>
          <button onclick="qtyCart('${i.id}',1)">+</button>
        </div>
        <button class="ci-del" onclick="removeCart('${i.id}')">🗑️</button>
      </div>`;
  }).join('');

  if (ft) ft.innerHTML = `
    <div class="cart-total-row">
      <span>Sous-total (${totalQty} article${totalQty > 1 ? 's' : ''})</span>
      <strong>${total.toLocaleString('fr-FR')} FCFA</strong>
    </div>
    <div class="cart-total-row" style="color:var(--muted);font-size:.85rem">
      <span>Livraison</span><span>À calculer</span>
    </div>
    <div class="divider" style="margin:12px 0"></div>
    <div class="cart-total-row total-big">
      <span>Total</span><strong>${total.toLocaleString('fr-FR')} FCFA</strong>
    </div>
    <button class="btn-primary" style="margin-top:16px"
      onclick="checkoutWhatsApp()">
      💳 Commander maintenant via WhatsApp
    </button>
    <button class="btn-outline" style="margin-top:10px"
      onclick="S.cart=[];saveCart();updateBadge();renderCart()">
      Vider le panier
    </button>`;
}
