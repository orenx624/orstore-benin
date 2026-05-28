/* ══════════════════════════════════════════
  🔥  FIREBASE CONFIG
  ➜  Remplace les 6 valeurs dans firebaseConfig
  ➜  Voir les instructions dans le README
══════════════════════════════════════════ */
import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }          from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }     from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDrfBVBEWo-nb5_Kbws7lsRvdVuc9kuJZI",
  authDomain:        "orstore-benin.firebaseapp.com",
  projectId:         "orstore-benin",
  storageBucket:     "orstore-benin.firebasestorage.app",
  messagingSenderId: "632019078897",
  appId:             "1:632019078897:web:d442534bbc54890d9b6350"
};

export const app     = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
