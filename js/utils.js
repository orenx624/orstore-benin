/* ══════════════════════════════
   UTILITAIRES
══════════════════════════════ */

/** Récupère la valeur d'un input par id */
export const g = id => document.getElementById(id)?.value?.trim() || '';

/** Affiche un message d'erreur */
export function err(id, m) {
  const e = document.getElementById(id);
  if (e) { e.textContent = m; e.style.display = 'block'; }
}

/** Cache un message d'erreur */
export function hideErr(id) {
  const e = document.getElementById(id);
  if (e) { e.style.display = 'none'; e.textContent = ''; }
}

/** Active/désactive le loader d'un bouton */
export function btnLoad(id, loading) {
  const b = document.getElementById(id);
  if (b) { b.disabled = loading; b.textContent = loading ? 'Chargement...' : b.dataset.label; }
}

/** Traduit les codes d'erreur Firebase en messages lisibles */
export const fbErr = code => ({
  'auth/email-already-in-use':      'Cet email est déjà utilisé.',
  'auth/invalid-email':             'Email invalide.',
  'auth/weak-password':             'Mot de passe trop court (min. 6 car.).',
  'auth/user-not-found':            'Aucun compte avec cet email.',
  'auth/wrong-password':            'Mot de passe incorrect.',
  'auth/invalid-credential':        'Email ou mot de passe incorrect.',
  'auth/too-many-requests':         'Trop de tentatives. Réessayez.',
  'auth/network-request-failed':    'Erreur réseau.',
  'auth/configuration-not-found':   '⚠️ Firebase non configuré — suivez les instructions.',
})[code] || 'Erreur : ' + code;

/** Affiche un toast de notification */
export function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
