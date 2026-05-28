/* ══════════════════════════════
   RECHERCHE
══════════════════════════════ */
import { S }      from './state.js';
import { grid }   from './render.js';

export function doSearch(e) {
  if (e) e.preventDefault();
  const q = document.getElementById('search-input').value.trim().toLowerCase();
  if (!q) return;

  const res = S.products.filter(p =>
    p.name.toLowerCase().includes(q)                      ||
    (p.category || p.cat || '').toLowerCase().includes(q) ||
    (p.description || p.desc || '').toLowerCase().includes(q) ||
    (p.location || p.loc || '').toLowerCase().includes(q) ||
    (p.sellerName || '').toLowerCase().includes(q)
  );

  const label = document.getElementById('search-input').value.trim();
  document.getElementById('search-title').textContent =
    `Résultats pour "${label}" — ${res.length} produit${res.length > 1 ? 's' : ''}`;
  document.getElementById('search-grid').innerHTML = res.length
    ? grid(res)
    : '<div class="empty-state"><div style="font-size:3rem">🔍</div><p>Aucun produit trouvé. Essayez un autre mot-clé.</p></div>';

  // Affiche la section recherche
  document.querySelectorAll('.home-section').forEach(s => s.style.display = 'none');
  document.getElementById('sec-search').style.display = 'block';
  document.querySelector('.home-content')?.scrollTo(0, 0);
  document.querySelectorAll('.subnav a').forEach(a => a.classList.remove('active'));
}
