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

// 📞 Informations de contact
export const CONTACT_INFO = {
  telegram: 't.me/OrStore624',
  facebook: 'www.facebook.com/OrStore.2x',
  whatsapp: 'https://wa.me/message/YNDTTIVCUMUDD1',
  phone: '+229 01 43 36 97 01',
  email: 'orstore624@gmail.com'
};

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

// ✅ Validation de l'email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ Validation du mot de passe
function isValidPassword(pw) {
  if (pw.length < 6) return { valid: false, message: 'Mot de passe trop court (min. 6 caractères).' };
  if (!/[a-z]/.test(pw)) return { valid: false, message: 'Le mot de passe doit contenir au moins une lettre.' };
  return { valid: true };
}

// ✅ Validation du nom
function isValidName(name) {
  const trimmed = name?.trim();
  if (!trimmed || trimmed.length < 3) {
    return { valid: false, message: 'Veuillez entrer un nom valide (min. 3 caractères).' };
  }
  return { valid: true };
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
  const name  = g('reg-name')?.trim();
  const email = g('reg-email')?.trim();
  const pw    = g('reg-pw');
  const pw2   = g('reg-pw2');
  
  hideErr('reg-err');
  
  // ✅ Vérification complète des champs
  if (!name || !email || !pw || !pw2) {
    return err('reg-err', '⚠️ Tous les champs (marqués *) sont obligatoires.');
  }

  // ✅ Validation du nom
  const nameValidation = isValidName(name);
  if (!nameValidation.valid) {
    return err('reg-err', nameValidation.message);
  }

  // ✅ Validation de l'email
  if (!isValidEmail(email)) {
    return err('reg-err', '⚠️ Veuillez entrer une adresse email valide.');
  }

  // ✅ Validation des mots de passe
  if (pw !== pw2) {
    return err('reg-err', '⚠️ Les mots de passe ne correspondent pas.');
  }
  
  const pwValidation = isValidPassword(pw);
  if (!pwValidation.valid) {
    return err('reg-err', pwValidation.message);
  }

  const wantsAdmin = normalizeName(name) === ADMIN_USERNAME;
  if (wantsAdmin) {
    const existingAdmin = await getAdminRecord();
    if (existingAdmin) {
      return err('reg-err', '⚠️ Le nom d\'utilisateur admin est déjà réservé.');
    }
  }

  btnLoad('btn-reg', true);
  try {
    const c = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(c.user, { displayName: name });
    if (wantsAdmin) {
      await storeAdminRecord(c.user);
      toast('✅ Bienvenue administrateur ! 🎉');
      window.navigateScreen('seller');
    } else {
      toast(`✅ Bienvenue ${name} ! 🎉`);
      window.navigateScreen('home');
    }
  } catch (e) {
    const errorMessage = fbErr(e.code);
    const detailedError = `${errorMessage}\n\n💬 Besoin d'aide ? Contactez-nous :\n📧 ${CONTACT_INFO.email}\n📱 ${CONTACT_INFO.phone}`;
    err('reg-err', detailedError);
    console.error('Registration error:', e.code, e.message);
  } finally {
    btnLoad('btn-reg', false);
  }
}

/* ── Connexion ── */
export async function firebaseLogin() {
  const rawLogin = g('log-email')?.trim();
  const pw       = g('log-pw');
  
  hideErr('log-err');
  
  if (!rawLogin || !pw) {
    return err('log-err', '⚠️ Veuillez remplir tous les champs.');
  }

  // ✅ Validation basique de l'email/identifiant
  if (!isValidEmail(rawLogin) && !isAdminLogin(rawLogin)) {
    return err('log-err', '⚠️ Veuillez entrer un email ou identifiant valide.');
  }

  let email = rawLogin;
  if (isAdminLogin(rawLogin)) {
    const admin = await getAdminRecord();
    if (!admin) {
      return err('log-err', '⚠️ Aucun administrateur configuré. Veuillez vous connecter avec votre email.');
    }
    email = admin.email;
  }

  btnLoad('btn-log', true);
  try {
    const credential = await signInWithEmailAndPassword(auth, email, pw);
    const user = credential.user;
    toast('✅ Connexion réussie ! 👋');
    window.navigateScreen(await isAdminUser(user) ? 'seller' : 'home');
  } catch (e) {
    let errorMessage = fbErr(e.code);
    
    // ✅ Amélioration des messages d'erreur Firebase
    if (e.code === 'auth/user-not-found') {
      errorMessage = '⚠️ Aucun compte trouvé avec cet email.';
    } else if (e.code === 'auth/wrong-password') {
      errorMessage = '⚠️ Mot de passe incorrect.';
    } else if (e.code === 'auth/invalid-email') {
      errorMessage = '⚠️ Format d\'email invalide.';
    } else if (e.code === 'auth/user-disabled') {
      errorMessage = '⚠️ Ce compte a été désactivé.';
    } else if (e.code === 'auth/too-many-requests') {
      errorMessage = '⚠️ Trop de tentatives. Veuillez réessayer plus tard.';
    }
    
    const detailedError = `${errorMessage}\n\n💬 Problèmes ? Contactez le support :\n📧 ${CONTACT_INFO.email}\n📱 ${CONTACT_INFO.phone}\n💬 WhatsApp: ${CONTACT_INFO.whatsapp}`;
    err('log-err', detailedError);
    console.error('Login error:', e.code, e.message);
  } finally {
    btnLoad('btn-log', false);
  }
}

/* ── Déconnexion ── */
export async function firebaseLogout() {
  try {
    await signOut(auth);
    S.user = null;
    S.role = 'buyer';
    toast('✅ Déconnecté.');
    window.navigateScreen('home');
  } catch (e) {
    console.error('Logout error:', e);
    toast('⚠️ Erreur lors de la déconnexion.');
  }
}
