# ChangeFilePDF 🚀

ChangeFilePDF adalah aplikasi web full-stack modern untuk pengelolaan, konversi, manipulasi, pengamanan, OCR, dan analisis AI dokumen PDF secara lengkap dan fungsional.

---

## ⚙️ Persyaratan Sistem: LibreOffice Headless (Untuk Konversi Office Berakurasi Tinggi)

Untuk memastikan konversi file Microsoft Office (Word `.doc/.docx`, PowerPoint `.ppt/.pptx`, Excel `.xls/.xlsx`) mempertahankan 100% tata letak asli, cover page, gambar beresolusi tinggi, tabel bergaris, dan pemisahan halaman (*page breaks*), ChangeFilePDF menggunakan mesin konversi **LibreOffice Headless** (`soffice --headless --convert-to pdf`).

### 📦 Panduan Instalasi LibreOffice di Sistem:
- **Linux / Docker / Container**:
  ```bash
  apt-get update && apt-get install -y libreoffice
  ```
- **Windows**:
  ```powershell
  winget install TheDocumentFoundation.LibreOffice
  # atau unduh installer resmi dari https://www.libreoffice.org/download/download-libreoffice/
  ```
- **macOS**:
  ```bash
  brew install --cask libreoffice
  ```

---

## 🌟 Fitur-Fitur Utama (31 Alat Nyata)

### 1. 🔄 Konversi (Conversions)
- **Word ke PDF** (`.docx` / `.doc` -> PDF via LibreOffice Headless dengan presisi layout 100%)
- **PPT ke PDF** (`.pptx` / `.ppt` -> Slide PDF via LibreOffice Headless)
- **Excel ke PDF** (`.xlsx`, `.xls`, `.csv` -> PDF via LibreOffice Headless)
- **Gambar ke PDF** (JPG, PNG, WEBP -> Multi-halaman PDF dengan pengaturan orientasi & margin)
- **HTML ke PDF** (File HTML atau string kode HTML langsung)
- **Pindai ke PDF** (Auto enhance, kontras tajam, grayscale)
- **PDF ke Word** (PDF -> `.docx` yang dapat diedit)
- **PDF ke PPT** (PDF -> Slide PowerPoint `.pptx`)
- **PDF ke Excel** (Ekstraksi tabel otomatis -> `.xlsx`)
- **PDF ke JPG** (Render halaman resolusi tinggi -> file ZIP)
- **PDF ke PDF/A** (Kepatuhan arsip standar ISO)
- **PDF ke Markdown** (Ekstraksi teks terstruktur `.md`)

### 2. ✂️ Manipulasi (Manipulations)
- **Gabungkan PDF** (Merge multi-file PDF dengan urutan dinamis)
- **Pisahkan PDF** (Pecah per rentang halaman atau setiap halaman ke file ZIP)
- **Kompres PDF** (Optimasi ukuran dengan tingkat Rendah, Sedang, Ekstrem)
- **Putar PDF** (Rotasi 90°, 180°, 270° untuk seluruh atau sebagian halaman)
- **Atur PDF** (Ubah susunan urutan halaman & hapus halaman tertentu)
- **Potong PDF** (Pangkas margin/cropbox dokumen)
- **Tambah Nomor Halaman** (Kustomisasi posisi, format teks, dan ukuran font)

### 3. 🔒 Keamanan & Formulir (Security & Forms)
- **Buka PDF Terkunci** (Hapus enkripsi password dokumen)
- **Proteksi PDF** (Enkripsi standar AES 256-bit dengan password pengguna & izin cetak/salin)
- **Tanda Tangani PDF** (Stempel tanda tangan digital, teks resmi, atau unggah PNG tanda tangan)
- **Tanda Air (Watermark)** (Teks watermark kustom dengan transparansi & sudut kemiringan)
- **Samarkan PDF (Redact)** (Blackout permanen kata kunci sensitif seperti NIK, email, atau password)
- **Formulir PDF** (Isi form AcroForm otomatis via JSON & flatten dokumen)

### 4. ⚡ Fitur Lanjutan (Advanced Tools)
- **Edit PDF** (Sematkan teks, gambar, kotak penanda, atau highlight langsung)
- **OCR PDF** (Tesseract Optical Character Recognition untuk membuat Searchable PDF)
- **Perbaiki PDF Rusak** (Regenerasi tabel XREF & perbaikan stream korup)
- **Bandingkan PDF** (Analisis komparasi 2 PDF, persentase kemiripan, dan diff teks)

### 5. 🤖 Fitur AI Cerdas (AI Powered)
- **Perangkum AI PDF** (Rangkuman eksekutif & poin-poin utama dengan Gemini/OpenAI API + fallback NLP lokal otomatis)
- **Terjemahkan PDF AI** (Terjemahkan teks PDF ke Bahasa Indonesia, Inggris, Jepang, Arab, Mandarin, dll. menjadi teks atau PDF terjemahan baru)

---

## 🛠️ Struktur Proyek

```
Website PDF/
├── backend/
│   ├── .venv/                      # Python Virtual Environment
│   ├── main.py                     # Entry point FastAPI & CORS
│   ├── requirements.txt            # Dependensi Python
│   ├── test_backend.py             # Automated test suite
│   ├── routers/
│   │   ├── conversion.py
│   │   ├── manipulation.py
│   │   ├── security.py
│   │   ├── advanced.py
│   │   ├── ai.py
│   │   └── system.py
│   ├── services/
│   │   ├── conversion_service.py
│   │   ├── manipulation_service.py
│   │   ├── security_service.py
│   │   ├── advanced_service.py
│   │   └── ai_service.py
│   └── utils/
│       └── helpers.py              # File cleanup & zip helper
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── data/
│       │   └── toolsData.js        # Katalog 31 tools
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ToolCard.jsx
│       │   ├── FileUploader.jsx
│       │   ├── OptionPanel.jsx
│       │   ├── ProcessingState.jsx
│       │   ├── ResultCard.jsx
│       │   └── DynamicIcon.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   └── ToolPage.jsx
│       └── services/
│           └── api.js              # Client Axios
└── README.md
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Menjalankan Backend (FastAPI)
```powershell
cd "d:\Antigravity\Website PDF"
& "backend\.venv\Scripts\uvicorn.exe" backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Akses Swagger API Documentation di: `http://127.0.0.1:8000/docs`

### 2. Menjalankan Frontend (Vite + React)
```powershell
cd "d:\Antigravity\Website PDF\frontend"
npm run dev
```
Akses Aplikasi Web di: `http://127.0.0.1:5173/`

### 3. Menjalankan Pengujian Otomatis
```powershell
cd "d:\Antigravity\Website PDF"
& "backend\.venv\Scripts\python.exe" backend\test_backend.py
```
Semua 15 test suite akan dieksekusi untuk memverifikasi fungsionalitas seluruh fitur.
