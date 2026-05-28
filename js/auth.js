/* ══════════════════════════════
   AUTHENTIFICATION
══════════════════════════════ */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth }                        from './config.js';
import { S }                           from './state.js';
import { g, err, hideErr, btnLoad, fbErr, toast } from './utils.js';

/* ── Met à jour les avatars et la bannière selon l'état de connexion ── */
export function refreshAvatars() {
  const u = S.user;
  document.querySelectorAll('.user-avatar').forEach(av => {
    av.textContent = u
      ? (u.displayName || u.email).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      : '👤';
  });
  if (u && document.getElementById('seller-username'))
    document.getElementById('seller-username').textContent = u.displayName || 'Vendeur';

  // ✅ Bannière "Créer un compte" — visible uniquement si NON connecté
  const banner = document.getElementById('auth-banner');
  if (banner) banner.style.display = u ? 'none' : 'block';
}

/* ── Écoute les changements d'état d'authentification ── */
export function initAuth(onUserChange) {
  onAuthStateChanged(auth, user => {
    S.user = user;
    refreshAvatars();
    if (onUserChange) onUserChange(user);
  });
}

/* ── Inscription ── */
export async function firebaseRegister() {
  const name  = g('reg-name');
  const email = g('reg-email');
  const pw    = g('reg-pw');
  const pw2   = g('reg-pw2');
  hideErr('reg-err');
  if (!name || !email || !pw || !pw2) return err('reg-err', 'Tous les champs sont obligatoires.');
  if (pw !== pw2)   return err('reg-err', 'Les mots de passe ne correspondent pas.');
  if (pw.length < 6) return err('reg-err', 'Mot de passe trop court (min. 6 caractères).');
  btnLoad('btn-reg', true);
  try {
    const c = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(c.user, { displayName: name });
    toast(`Bienvenue ${name} ! 🎉`);
    window.screen(S.role === 'seller' ? 'seller' : 'home');
  } catch (e) { err('reg-err', fbErr(e.code)); }
  btnLoad('btn-reg', false);
}

/* ── Connexion ── */
export async function firebaseLogin() {
  const email = g('log-email');
  const pw    = g('log-pw');
  hideErr('log-err');
  if (!email || !pw) return err('log-err', 'Veuillez remplir tous les champs.');
  btnLoad('btn-log', true);
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    toast('Connexion réussie ! 👋');
    window.screen(S.role === 'seller' ? 'seller' : 'home');
  } catch (e) { err('log-err', fbErr(e.code)); }
  btnLoad('btn-log', false);
}

/* ── Déconnexion ── */
export async function firebaseLogout() {
  await signOut(auth);
  S.user = null;
  toast('Déconnecté.');
  window.screen('role');
}
