# PKK Digital – PWA starter

Repository frontend PWA dan deployment Vercel untuk PKK Digital Desa Kediren.

## Struktur
- `index.html`: halaman placeholder terjaga; belum mengaktifkan alur administrasi sampai bridge backend diuji.
- `api/gas.js`: proxy server-side ke Google Apps Script.
- `manifest.webmanifest`, `sw.js`, `icons/`: instalasi PWA dan cache shell.
- `PokjaIV_PWA_Bridge.gs.txt`: contoh bridge untuk project Apps Script.

## Sebelum operasional
1. Tinjau `PokjaIV_PWA_Bridge.gs.txt` terhadap fungsi yang benar-benar ada di project GAS. Nama `getCurrentUser`, modul dashboard, dan fungsi backup harus diverifikasi; jangan menambahkan bridge jika nama/kontrak fungsinya tidak cocok.
2. Deploy ulang Web App Apps Script sesudah bridge tervalidasi.
3. Set Environment Variable Vercel `GAS_WEB_APP_URL` ke URL Web App /exec.
4. Jalankan smoke test API login, getCurrentUser, getPokjaIVModules, getPokjaIVRecords, save/delete dan logout.
5. Baru kemudian ganti halaman placeholder ini dengan frontend operasional lengkap yang telah diverifikasi.

## Keamanan
- Jangan commit file .env atau token pengguna.
- Semua metode API harus allowlist.
- Otorisasi, validasi token, dan role tetap dilakukan oleh Apps Script.
- Data PKK tidak dicache oleh service worker.
- Informasi kesehatan dan data keluarga termasuk data pribadi; batasi akses sesuai peran.

Developer: Supriyanto Abadi Jaya · Desa Kediren.
