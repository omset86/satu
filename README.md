# Panduan Build APK Expo di GitHub Codespaces (Tanpa Antrian EAS)

Catatan lengkap langkah demi langkah untuk membuat proyek React Native (Expo) dari nol hingga mencetak file `.apk` secara lokal di server **GitHub Codespaces**—tanpa membebani laptop dan tanpa antrian server EAS.

---

## 1. Persiapan Repositori & Codespaces

1. **Buat Repositori Baru di GitHub.**
   - Buat repositori baru (Public/Private) dan centang **Add a README file**.
2. **Aktifkan Mesin 4-Core (16GB RAM).**
   - *Catatan: Mesin bawaan 2-core (8GB RAM) sering kehabisan memori (OOM) saat kompilasi C++/CMake React Native.*
   - Buka [://github.com](https://://github.com) -> klik ikon titik tiga (`...`) pada Codespace -> **Change machine type** -> pilih **4-core (16GB RAM)**.
   - Jika sedang terbuka, matikan dulu lewat tombol hijau `Codespaces` di pojok kiri bawah -> **Stop Current Codespace**, lalu buka ulang (**Open in Browser**).
   - Pastikan RAM sudah 16GB dengan perintah:
     ```bash
     free -h
     ```

---

## 2. Inisialisasi Proyek Expo Ringan

1. **Kosongkan folder awal (jika ada `README.md`) dan buat proyek Expo:**
   ```bash
   rm -f README.md
   npx create-expo-app@latest . --template blank
   ```
2. **Pasang pustaka navigasi dasar:**
   ```bash
   npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
   ```
3. **Sesuaikan `app.json` (Expo SDK 58+):**
   - Pastikan ikon mengarah ke file yang ada (`./assets/icon.png`) dan atur `android.package` secara unik:
   ```json
   {
     "expo": {
       "name": "Aplikasi Saya",
       "slug": "aplikasi-saya",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "userInterfaceStyle": "light",
       "android": {
         "package": "com.namaanda.aplikasisaya",
         "adaptiveIcon": {
           "foregroundImage": "./assets/icon.png",
           "backgroundColor": "#ffffff"
         }
       }
     }
   }
   ```

---

## 3. Setup EAS CLI & Login Menggunakan Access Token

1. **Instal EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```
2. **Login Expo via Token (Menghindari Error `localhost` di Cloud):**
   - Buka [expo.dev/settings/access-tokens](https://expo.dev) -> **Create Token** -> salin tokennya.
   - Jalankan di terminal Codespaces:
     ```bash
     export EXPO_TOKEN="TEMPEL_TOKEN_DISINI"
     eas whoami
     ```
3. **Konfigurasi file `eas.json` agar output berupa `.apk`:**
   - Jalankan `eas build:configure` (pilih **Android**).
   - Ubah isi file `eas.json` menjadi:
     ```json
     {
       "cli": {
         "version": ">= 12.0.0"
       },
       "build": {
         "preview": {
           "android": {
             "buildType": "apk"
           }
         },
         "production": {}
       }
     }
     ```
4. **Commit & Push perubahan ke GitHub:**
   - Gunakan tab **Source Control** di panel kiri VS Code -> tulis pesan commit -> klik **Commit** -> klik **Sync Changes**.

---

## 4. Instal Java (JDK 17) & Android SDK (Jika Setup Manual)

1. **Instal Java 17 & alat pendukung:**
   ```bash
   sudo apt-get update && sudo apt-get install -y openjdk-17-jdk unzip wget curl
   ```
2. **Unduh & ekstrak Android Command Line Tools:**
   *(URL dipecah menjadi variabel agar tidak terpotong otomatis oleh browser saat copy-paste)*
   ```bash
   DOMAIN="://google.com" && FILE="commandlinetools-linux-11076708_latest.zip" && \
   curl -L "https://DOMAIN/android/repository/FILE" -o cmdline-tools.zip && \
   mkdir -p \$HOME/Android/Sdk/cmdline-tools && \
   unzip -q cmdline-tools.zip -d \$HOME/Android/Sdk/cmdline-tools && \
   mv HOME/Android/Sdk/cmdline-tools/cmdline-tools HOME/Android/Sdk/cmdline-tools/latest && \
   rm cmdline-tools.zip
   ```
3. **Setujui lisensi & instal komponen Android SDK 35:**
   ```bash
   export ANDROID_HOME=\$HOME/Android/Sdk && \
   export PATH=\$PATH:\(ANDROID_HOME/cmdline-tools/latest/bin:\)ANDROID_HOME/platform-tools && \
   yes | sdkmanager --licenses && \
   sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
   ```

---

## 5. Build APK Tanpa Antrian & Mengunduh Hasilnya

1. **Jalankan perintah build lokal:**
   ```bash
   ANDROID_HOME=\$HOME/Android/Sdk eas build -p android --profile preview --local
   ```
   *(Pilih **Yes** saat diminta membuat Android Keystore baru).*
2. **Cara Mengunduh File `.apk` ke Perangkat:**
   - Setelah muncul `Build successful`, klik kanan file `build-xxxxxxxxx.apk` di panel Explorer kiri -> pilih **Download**.
   - **Penting:** Buat folder baru (misalnya `Downloads/APK`) saat memilih lokasi simpan agar browser tidak menolak dengan pesan *"can't open this folder because it contains system files"*.
3. **Bersihkan & Matikan Codespace (Wajib Agar Kuota Hemat):**
   - Hapus file `.apk` di dalam Codespaces (`Delete`) agar tidak memenuhi penyimpanan atau ikut ter-commit ke GitHub.
   - Klik tombol hijau **`Codespaces`** di pojok kiri bawah -> pilih **`Stop Current Codespace`**.

---

## 6. Alur Kerja untuk Build Berikutnya (Sesi Selanjutnya)

- **Edit kode ringan:** Gunakan [vscode.dev](https://vscode.dev) agar tidak memakan jatah jam gratis Codespaces.
- **Saat ingin build APK lagi:**
  1. Nyalakan kembali Codespace yang sama (Java & Android SDK sudah tersimpan di dalamnya, tidak perlu instal ulang).
  2. Jalankan perintah ini di terminal:
     ```bash
     export EXPO_TOKEN="TEMPEL_TOKEN_DISINI"
     ANDROID_HOME=\$HOME/Android/Sdk eas build -p android --profile preview --local
     ```
  3. Unduh `.apk`, hapus file `.apk` di workspace, lalu **Stop Current Codespace**.

---

## 7. Otomatisasi Setup via Dev Container (Untuk Codespace Baru)

Agar setiap kali membuka **Codespace baru** sistem langsung memakai mesin **16GB RAM** dan otomatis menginstal **Java 17, Android SDK 35, serta EAS CLI**, buat file bernama **`.devcontainer/devcontainer.json`** di dalam repositori dengan isi berikut:

```json
{
  "name": "Expo Android Build Environment",
  "image": "://microsoft.com",
  "hostRequirements": {
    "cpus": 4,
    "memory": "16gb",
    "storage": "32gb"
  },
  "containerEnv": {
    "ANDROID_HOME": "/home/node/Android/Sdk",
    "PATH": "\${containerEnv:PATH}:/home/node/Android/Sdk/cmdline-tools/latest/bin:/home/node/Android/Sdk/platform-tools"
  },
  "postCreateCommand": "sudo apt-get update && sudo apt-get install -y openjdk-17-jdk unzip wget curl && npm install -g eas-cli && mkdir -p \$ANDROID_HOME/cmdline-tools && DOMAIN='://google.com' && FILE='commandlinetools-linux-11076708_latest.zip' && curl -L \"https://DOMAIN/android/repository/FILE\" -o cmdline-tools.zip && unzip -q cmdline-tools.zip -d \$ANDROID_HOME/cmdline-tools && mv \(ANDROID_HOME/cmdline-tools/cmdline-tools\)ANDROID_HOME/cmdline-tools/latest && rm cmdline-tools.zip && yes | sdkmanager --licenses && sdkmanager 'platform-tools' 'platforms;android-35' 'build-tools;35.0.0'"
}
```

### Cara Kerja Saat Membuka Codespace Baru:
1. **Buat Codespace baru** seperti biasa (`<> Code` -> `Codespaces` -> `Create codespace on main`).
2. **Tunggu proses instalasi otomatis di latar belakang** selama sekitar 3–4 menit hingga terminal siap.
3. **Langsung build APK** tanpa perlu mengetik `ANDROID_HOME` lagi:
   ```bash
   export EXPO_TOKEN="TEMPEL_TOKEN_DISINI"
   eas build -p android --profile preview --local
   ```
