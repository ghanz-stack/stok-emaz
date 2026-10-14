# RENCANA BACKUP — Gudang Stok G24 Kedaton (via Firebase project BARU khusus)

## Prinsip
3-2-1: 3 salinan data, 2 media (cloud + file), 1 off-site (HP/laptop berbeda).

## 0. Syarat sekali setting (wajib)
1. console.firebase.google.com → project **BARU** → Firestore → Create database (production, asia-southeast1).
2. Rules → paste isi `firestore.rules` dari repo ini → **Publish**.
3. Project Settings → Your apps → Web → copy config → paste ke `www/firebase-config.js` → push.
4. Di app: indikator harus **Live ☁️**. Kalau "Cloud ditolak ⚠️" berarti langkah 2 belum dilakukan.

## L1 — Berjalan sekarang (gratis)
| # | Apa | Kapan | Di mana |
|---|-----|-------|---------|
| 1 | Snapshot `backups` (mutasi+session+log+user+master) | Manual + otomatis tiap Tutup Hari | Firestore `backups` |
| 2 | Backup JSON perangkat | Kapan saja (menu Log) | File di HP |
| 3 | Unduh semua snapshot | Mingguan oleh ADMIN | File `backup-cloud-*.json` |

Restore: menu Log → pilih snapshot → Restore (khusus ADMIN) → tekan Push.

## L2 — Berikutnya (gratis, butuh 1x setting)
1. Retensi 30 hari: buka `firestore.rules` untuk `backups` (allow delete khusus ADMIN) + tombol "Hapus >30 hari".
2. Jadwal mingguan: setiap Senin ADMIN unduh JSON (perangkat + cloud) ke laptop + beri nama tanggal.
3. Uji restore 1x sebulan di HP cadangan (pastikan file backup valid).

## L3 — Nanti (berbayar Blaze, ±Rp0–20rb/bln)
1. Cloud Function terjadwal (cron harian 23:00): export Firestore → Cloud Storage bucket `arsip/`.
2. Sinkron bucket → Google Drive via Apps Script (arsip off-site otomatis).
3. Aktifkan jika transaksi >10rb/bulan atau multi-cabang.

## Tanggung jawab
- ADMIN: eksekutor backup mingguan + simpan file di 2 tempat (laptop + HP).
- Kasir: pastikan Tutup Hari tiap hari (memicu auto-backup).
- Jangan pernah: hapus koleksi manual dari console tanpa snapshot baru.
