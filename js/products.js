/* ══════════════════════════════
   PRODUITS — Firestore + Storage
══════════════════════════════ */
import {
  collection, getDocs, addDoc, serverTimestamp, query, orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import { db, storage }              from './config.js';
import { S }                         from './state.js';
import { DEMO_PRODUCTS }             from './data.js';
import { g, err, hideErr, btnLoad, toast } from './utils.js';
import { renderHome, renderSellerProducts } from './render.js';

/* ── Charge les produits depuis Firestore ── */
export async function loadProducts() {
  try {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    if (snap.empty) { await seedDB(); return loadProducts(); }
    S.products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (_) {
    // Fallback sur les données démo si Firestore inaccessible
    S.products = DEMO_PRODUCTS.map((p, i) => ({
      ...p,
      id: 'local_' + i,
      createdAt: { seconds: Date.now() / 1000 - i * 3600 },
    }));
  }
  renderHome();
  window.updateBadge?.();
}

/* ── Peuple Firestore avec les données démo ── */
async function seedDB() {
  for (const p of DEMO_PRODUCTS)
    await addDoc(collection(db, 'products'), { ...p, createdAt: serverTimestamp() });
}

/* ── Publie un nouveau produit (avec upload image optionnel) ── */
export async function submitProduct() {
  if (!S.user) return toast('Connectez-vous pour ajouter un produit.');

  const name  = g('ap-name');
  const price = g('ap-price');
  const cat   = g('ap-cat');
  const desc  = g('ap-desc');
  const orig  = g('ap-orig');
  const loc   = g('ap-loc') || 'Bénin';
  const emoji = g('ap-emoji') || '📦';

  hideErr('ap-err');
  if (!name || !price || !cat || !desc)
    return err('ap-err', 'Nom, prix, catégorie et description sont obligatoires.');

  btnLoad('btn-ap', true);
  try {
    // ── Upload de l'image si fournie ──
    let imageUrl = null;
    const fileInput = document.getElementById('ap-image');
    if (fileInput && fileInput.files[0]) {
      const file        = fileInput.files[0];
      const storageRef  = ref(storage, `products/${S.user.uid}/${Date.now()}_${file.name}`);
      const snapshot    = await uploadBytes(storageRef, file);
      imageUrl          = await getDownloadURL(snapshot.ref);
    }

    const newP = {
      name,
      price:      +price,
      orig:       orig ? +orig : null,
      cat, desc, loc, emoji,
      imageUrl,
      sellerId:   S.user.uid,
      sellerName: S.user.displayName || 'Vendeur',
      featured:   false,
      isNew:      true,
      createdAt:  serverTimestamp(),
    };

    const ref2 = await addDoc(collection(db, 'products'), newP);
    S.products.unshift({
      ...newP,
      id:            ref2.id,
      originalPrice: orig ? +orig : null,
      description:   desc,
      category:      cat,
      location:      loc,
    });

    window.closeModal('modal-ap');
    toast('Produit publié ! ✅');
    renderSellerProducts();

    // Réinitialise le formulaire
    ['ap-name','ap-price','ap-cat','ap-desc','ap-orig','ap-loc','ap-emoji'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (fileInput) fileInput.value = '';
    const preview = document.getElementById('ap-image-preview');
    if (preview) { preview.innerHTML = ''; preview.classList.remove('has-image'); }

  } catch (e) {
    err('ap-err', 'Erreur Firebase. Vérifiez votre configuration.');
    console.error(e);
  }
  btnLoad('btn-ap', false);
}
