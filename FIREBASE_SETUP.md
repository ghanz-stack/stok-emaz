# Firebase Setup — Gudang Ibu NID (project BARU)

Repo ini private. GitHub Pages hanya jalan di repo Public/Pro → untuk repo private pakai **Firebase Hosting** (gratis).

## 1. Buat project baru
1. Buka console.firebase.google.com → Add project (cth: `gudang-ibu-nid`)
2. Add Web App → copy `firebaseConfig` → paste ke `www/firebase-config.js`
3. Authentication → Sign-in method → aktifkan **Email/Password** → buat 1 user (cth: admin@gudangibunid.id)
4. Firestore Database → Create database (production, lokasi asia-southeast1) → Start in production mode
5. Rules → paste isi `firestore.rules` → Publish
6. (Wajib login di app? tidak — app pakai nama+P IN lokal. Auth dipakai untuk `request.auth != null` di rules. Kalau belum pasang Auth di app, longgarkan rules sementara ke `allow read, write: if true;` saat testing, lalu ketatkan lagi.)

## 2. Deploy Hosting (gantikan GitHub Pages)
```
npm i -g firebase-tools
firebase login
firebase use --add   (pilih project baru)
firebase deploy --only firestore:rules,hosting
```
URL live: `https://<project-id>.web.app` → buka di semua HP → Install (PWA).

## 3. APK via GitHub Actions
Push ke master → tab Actions → `Build APK` → download `stok-emas-gid-debug-apk` → install di HP.

## 4. Cek realtime
Buka URL live di 2 HP → login nama beda → input di HP-1 → muncul di HP-2 (indikator Live ☁️ hijau).
