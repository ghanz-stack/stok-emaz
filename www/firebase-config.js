/**
 * Firebase Configuration for Stok Emas Gudang Ibu NID
 * 
 * PROJECT BARU: gudang-ibu-nid-stok-emas
 * 
 * SETUP YANG DIBUTUH:
 * 1. Buat Firebase project baru di console.firebase.google.com
 * 2. Enable: Firestore, Authentication (Email/Password)
 * 3. Copy config dari project baru ke bawah
 * 4. Replace config di bawah ini
 */

// TODO: Ganti dengan config dari Firebase project baru
window.FIREBASE_CONFIG = {
  apiKey: "TODO-Ganti-dengan-API-Key",
  authDomain: "TODO-Ganti-dengan-authDomain.firebaseapp.com",
  projectId: "TODO-Ganti-dengan-projectId",
  storageBucket: "TODO-Ganti-dengan-projectId.firebasestorage.app",
  messagingSenderId: "TODO-Ganti-dengan-messagingSenderId",
  appId: "TODO-Ganti-dengan-appId",
  measurementId: "TODO-Ganti-dengan-measurementId"
};

/**
 * Inisialisasi Firebase - Panggil setelah config di-set
 * 
 * Catatan: Firebase akan diaktifkan saat user login pertama kali.
 * Authentication menggunakan Email/Password (full access semua user).
 */
function initFirebase() {
  if (!window.FIREBASE_CONFIG || window.FIREPLACE_CONFIG === "TODO") {
    console.error("Firebase config belum di-set. Silakan ganti di firebase-config.js");
    return false;
  }

  try {
    const app = firebase.initializeApp(window.FIREBASE_CONFIG);
    
    // Enable Firestore persistence untuk multi-device sync
    firebase.firestore().settings({
      persistenceEnabled: true,
      cacheSizeBytes: firebase.firestore().settings().cacheSizeBytes === firebase.firestore().settings.Unlimited ? firebase.firestore().settings.Unlimited : 10 * 1024 * 1024
    });

    // Enable Auth email/password
    firebase.auth().setPersistence(firebase.auth.AuthPersistence.NONE);

    console.log("Firebase berhasil diinisialisasi - Project:", app.options.projectId);
    return true;
  } catch (e) {
    console.error("Gagal inisialisasi Firebase:", e);
    return false;
  }
}

// Auto-init saat load (akan gagal jika config placeholder)
document.addEventListener("DOMContentLoaded", function() {
  // delay sedikit biar file terbaca sebelum init
  setTimeout(initFirebase, 100);
});