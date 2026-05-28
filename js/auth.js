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
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { auth, db }                    from './config.js';
import { S }                           from './state.js';
import { g, err, hideErr, btnLoad, fbErr, toast } from './utils.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_DOC_PATH = ['metadata', 'admin'];

function normalizeName(value) {
  return value?.trim().toLowerCase();
}

function isAdminLogin(value) {
  return normalizeName(value) === ADMIN_USERNAME;
}

async function getAdminRecord() {
  const adminDoc = doc(db, ...ADMIN_DOC_PATH);
  const snapshot = await getDoc(adminDoc);
  return snapshot.exists() ? snapshot.data() : null;
}

async function storeAdminRecord(user) {
  const adminDoc = doc(db, ...ADMIN_DOC_PATH);
  await setDoc(adminDoc, {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    createdAt: serverTimestamp(),
  });
}

async function getLoginEmail(value) {
  if (!isAdminLogin(value)) return value;
  const admin = await getAdminRecord();
  return admin?.email || value;
}

async function isAdminUser(user) {
  if (!user) return false;
  const admin = await getAdminRecord();
  return admin?.uid === user.uid;
}

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
  onAuthStateChanged(auth, async user => {
    S.user = user;
    if (user) {
      S.role = await isAdminUser(user) ? 'seller' : 'buyer';
    } else {
      S.role = 'buyer';
    }
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

  const wantsAdmin = normalizeName(name) === ADMIN_USERNAME;
  if (wantsAdmin) {
    const existingAdmin = await getAdminRecord();
    if (existingAdmin) return err('reg-err', 'Le nom d’utilisateur admin est déjà réservé.');
  }

  btnLoad('btn-reg', true);
  try {
    const c = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(c.user, { displayName: name });
    if (wantsAdmin) {
      await storeAdminRecord(c.user);
      toast('Bienvenue administrateur ! 🎉');
      window.navigateScreen('seller');
    } else {
      toast(`Bienvenue ${name} ! 🎉`);
      window.navigateScreen('home');
    }
  } catch (e) {
    err('reg-err', fbErr(e.code));
  } finally {
    btnLoad('btn-reg', false);
  }
}

/* ── Connexion ── */
export async function firebaseLogin() {
  const rawLogin = g('log-email');
  const pw       = g('log-pw');
  hideErr('log-err');
  if (!rawLogin || !pw) return err('log-err', 'Veuillez remplir tous les champs.');

  let email = rawLogin;
  if (isAdminLogin(rawLogin)) {
    const admin = await getAdminRecord();
    if (!admin) return err('log-err', 'Aucun administrateur configuré. Connectez-vous avec votre email.');
    email = admin.email;
  }

  btnLoad('btn-log', true);
  try {
    const credential = await signInWithEmailAndPassword(auth, email, pw);
    const user = credential.user;
    toast('Connexion réussie ! 👋');
    window.navigateScreen(await isAdminUser(user) ? 'seller' : 'home');
  } catch (e) {
    err('log-err', fbErr(e.code));
  } finally {
    btnLoad('btn-log', false);
  }
}

/* ── Déconnexion ── */
export async function firebaseLogout() {
  await signOut(auth);
  S.user = null;
  S.role = 'buyer';
  toast('Déconnecté.');
  window.navigateScreen('home');
}
