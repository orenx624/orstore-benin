/* ══════════════════════════════
   NAVIGATION — Écrans & Sections
══════════════════════════════ */
import { S }                    from './state.js';
import { grid }                 from './render.js';
import { renderSellerProducts } from './render.js';

let _hist = [];

/* ── Navigue vers un écran principal ── */
export function navigateToScreen(name) {
  const cur = document.querySelector('.screen.active');
  if (cur) _hist.push(cur.id);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-' + name).classList.add('active');
  document.querySelectorAll('.error-msg').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
  window.scrollTo(0, 0);
  if (name === 'seller') renderSellerProducts();
}

/* ── Retour à l'écran précédent ── */
export function goBack() {
  if (_hist.length) {
    const prev = _hist.pop();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(prev).classList.add('active');
  }
}

/* ── Choix du rôle (acheteur / vendeur) ── */
export function chooseRole(role) {
  S.role = role;
  if (role === 'seller') {
    S.user ? navigateToScreen('seller') : navigateToScreen('login');
  } else {
    navigateToScreen('home');
  }
}

/* ── Affiche une section dans l'écran home ── */
export function showSec(id) {
  document.querySelectorAll('.home-section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  document.querySelector('.home-content').scrollTo(0, 0);
}

/* ── Sections ── */
export function showCatList() {
  showSec('sec-catlist');
  document.querySelectorAll('.subnav a').forEach((a, i) => a.classList.toggle('active', i === 1));
}

export function showCat(cat) {
  const CATS_META = {
    'Électronique':'📱','Vêtements':'👗','Accessoires':'👜',
    'Beauté':'💄','Maison':'🏠','Alimentation':'🥗','Sport':'⚽',
  };
  const prods = S.products.filter(p => (p.category || p.cat) === cat);
  document.getElementById('cat-title').innerHTML = `${CATS_META[cat] || '🛍️'} ${cat}`;
  document.getElementById('cat-count').textContent  = `${prods.length} produit${prods.length > 1 ? 's' : ''} disponible${prods.length > 1 ? 's' : ''}`;
  document.getElementById('cat-grid').innerHTML = prods.length
    ? grid(prods)
    : '<div class="empty-state"><div style="font-size:3rem">📦</div><p>Aucun produit dans cette catégorie pour l\'instant.</p></div>';
  showSec('sec-category');
}

export function showPromos() {
  const prods = S.products.filter(p => (p.originalPrice || p.orig) && (p.originalPrice || p.orig) > p.price);
  document.getElementById('promo-count').textContent = `${prods.length} offre${prods.length > 1 ? 's' : ''} en promotion`;
  document.getElementById('promo-grid').innerHTML = prods.length
    ? grid(prods)
    : '<div class="empty-state"><div style="font-size:3rem">🏷️</div><p>Aucune promotion en ce moment.</p></div>';
  showSec('sec-promos');
  document.querySelectorAll('.subnav a').forEach((a, i) => a.classList.toggle('active', i === 2));
}

export function showNouveautes() {
  const prods = S.products.filter(p => p.isNew);
  document.getElementById('news-count').textContent = `${prods.length} nouveau${prods.length > 1 ? 'x' : ''} produit${prods.length > 1 ? 's' : ''}`;
  document.getElementById('news-grid').innerHTML = prods.length
    ? grid(prods)
    : '<div class="empty-state"><div style="font-size:3rem">✨</div><p>Pas encore de nouveautés.</p></div>';
  showSec('sec-nouveautes');
  document.querySelectorAll('.subnav a').forEach((a, i) => a.classList.toggle('active', i === 3));
}

export function showContact() {
  showSec('sec-contact');
  document.querySelectorAll('.subnav a').forEach((a, i) => a.classList.toggle('active', i === 4));
}

export function goHome() {
  showSec('sec-accueil');
  document.querySelectorAll('.subnav a').forEach((a, i) => a.classList.toggle('active', i === 0));
}
