export const CATEGORIES = [
  { id: 'all', name: 'Semua Alat', icon: 'LayoutGrid' },
  { id: 'conversion', name: 'Konversi', icon: 'Repeat' },
  { id: 'manipulation', name: 'Manipulasi', icon: 'Layers' },
  { id: 'security', name: 'Keamanan & Form', icon: 'ShieldCheck' },
  { id: 'advanced', name: 'Lanjutan', icon: 'Sparkles' },
  { id: 'ai', name: 'Fitur AI', icon: 'Bot' },
];

export const TOOLS = [
  // --- KONVERSI ---
  {
    id: 'word-to-pdf',
    title: 'Word ke PDF',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Konversi dokumen Word (.docx) menjadi file PDF berkualitas tinggi dengan format rapi.',
    icon: 'FileText',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Populer',
    accept: '.docx,.doc',
    acceptDescription: 'File Word (.docx)',
    multiple: false,
    endpoint: '/api/conversion/word-to-pdf',
    buttonText: 'Konversi ke PDF',
    options: []
  },
  {
    id: 'ppt-to-pdf',
    title: 'PPT ke PDF',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Ubah file presentasi PowerPoint (.pptx) menjadi slide dokumen PDF interaktif.',
    icon: 'Presentation',
    color: 'from-orange-500 to-amber-600',
    badge: 'Populer',
    accept: '.pptx,.ppt',
    acceptDescription: 'File PowerPoint (.pptx)',
    multiple: false,
    endpoint: '/api/conversion/ppt-to-pdf',
    buttonText: 'Konversi PPT ke PDF',
    options: []
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel ke PDF',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Jadikan spreadsheet Excel (.xlsx, .xls, .csv) ke dokumen tabel PDF yang siap dicetak.',
    icon: 'FileSpreadsheet',
    color: 'from-emerald-500 to-teal-600',
    badge: '',
    accept: '.xlsx,.xls,.csv',
    acceptDescription: 'File Excel (.xlsx, .csv)',
    multiple: false,
    endpoint: '/api/conversion/excel-to-pdf',
    buttonText: 'Konversi Excel ke PDF',
    options: []
  },
  {
    id: 'jpg-to-pdf',
    title: 'Gambar ke PDF',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Gabungkan gambar JPG, PNG, atau WEBP menjadi satu dokumen PDF dengan tata letak kustom.',
    icon: 'Image',
    color: 'from-rose-500 to-pink-600',
    badge: 'Populer',
    accept: 'image/jpeg,image/png,image/webp,image/bmp',
    acceptDescription: 'File Gambar (JPG, PNG, WEBP)',
    multiple: true,
    endpoint: '/api/conversion/jpg-to-pdf',
    buttonText: 'Gabung Gambar ke PDF',
    options: [
      {
        id: 'orientation',
        name: 'Orientasi Halaman',
        type: 'select',
        default: 'portrait',
        options: [
          { label: 'Potret (Vertikal)', value: 'portrait' },
          { label: 'Lansekap (Horizontal)', value: 'landscape' }
        ]
      },
      {
        id: 'margin',
        name: 'Margin Halaman (px)',
        type: 'range',
        min: 0,
        max: 60,
        step: 5,
        default: 20
      }
    ]
  },
  {
    id: 'html-to-pdf',
    title: 'HTML ke PDF',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Konversi kode atau file HTML/CSS menjadi dokumen PDF terformat sempurna.',
    icon: 'Code2',
    color: 'from-cyan-500 to-blue-600',
    badge: '',
    accept: '.html,.htm,text/html',
    acceptDescription: 'File HTML atau ketik teks HTML',
    multiple: false,
    endpoint: '/api/conversion/html-to-pdf',
    buttonText: 'Konversi HTML ke PDF',
    options: [
      {
        id: 'html_content',
        name: 'Atau Masukkan Kode HTML Langsung',
        type: 'textarea',
        placeholder: '<h1>Contoh Dokumen</h1><p>Teks dokumen Anda...</p>',
        default: ''
      }
    ]
  },
  {
    id: 'scan-to-pdf',
    title: 'Pindai ke PDF',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Tingkatkan kualitas scan dokumen (auto-kontras, ketajaman, grayscale) dan jadikan PDF rapi.',
    icon: 'Scan',
    color: 'from-indigo-500 to-purple-600',
    badge: 'Baru',
    accept: 'image/*',
    acceptDescription: 'Gambar Hasil Scan / Foto Dokumen',
    multiple: true,
    endpoint: '/api/conversion/scan-to-pdf',
    buttonText: 'Proses Hasil Pindai ke PDF',
    options: [
      {
        id: 'enhance',
        name: 'Otomatis Tingkatkan Kontras & Ketajaman',
        type: 'checkbox',
        default: true
      },
      {
        id: 'grayscale',
        name: 'Ubah Menjadi Dokumen Hitam Putih (Grayscale)',
        type: 'checkbox',
        default: false
      }
    ]
  },
  {
    id: 'pdf-to-word',
    title: 'PDF ke Word',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Ubah file PDF menjadi dokumen Word (.docx) yang bisa diedit kembali tanpa merusak teks.',
    icon: 'FileText',
    color: 'from-blue-500 to-cyan-600',
    badge: 'Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/conversion/pdf-to-word',
    buttonText: 'Konversi ke Word DOCX',
    options: []
  },
  {
    id: 'pdf-to-ppt',
    title: 'PDF ke PPT',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Ubah setiap halaman dokumen PDF menjadi slide presentasi PowerPoint (.pptx).',
    icon: 'Presentation',
    color: 'from-amber-500 to-orange-600',
    badge: '',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/conversion/pdf-to-ppt',
    buttonText: 'Konversi ke PowerPoint',
    options: []
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF ke Excel',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Ekstrak tabel dan data terstruktur dari PDF langsung ke lembar kerja Excel (.xlsx).',
    icon: 'FileSpreadsheet',
    color: 'from-emerald-600 to-green-700',
    badge: 'Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/conversion/pdf-to-excel',
    buttonText: 'Ekstrak ke Excel',
    options: []
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF ke JPG',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Ekstrak semua halaman PDF menjadi gambar JPG beresolusi tinggi dalam format ZIP.',
    icon: 'ImageDown',
    color: 'from-fuchsia-500 to-rose-600',
    badge: '',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/conversion/pdf-to-jpg',
    buttonText: 'Konversi PDF ke Gambar JPG',
    options: [
      {
        id: 'dpi',
        name: 'Kualitas Gambar (DPI)',
        type: 'select',
        default: '150',
        options: [
          { label: 'Standar (150 DPI)', value: '150' },
          { label: 'Tinggi (200 DPI)', value: '200' },
          { label: 'Ultra HD (300 DPI)', value: '300' }
        ]
      }
    ]
  },
  {
    id: 'pdf-to-pdfa',
    title: 'PDF ke PDF/A',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Standarisasi dokumen PDF ke format arsip ISO PDF/A untuk kepatuhan hukum dan penyimpanan jangka panjang.',
    icon: 'Archive',
    color: 'from-slate-600 to-slate-800',
    badge: 'Standar ISO',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/conversion/pdf-to-pdfa',
    buttonText: 'Konversi ke PDF/A',
    options: []
  },
  {
    id: 'pdf-to-markdown',
    title: 'PDF ke Markdown',
    category: 'conversion',
    categoryName: 'Konversi',
    description: 'Ekstrak teks, judul, dan susunan paragraf dokumen PDF ke format Markdown (.md).',
    icon: 'FileCode',
    color: 'from-purple-600 to-indigo-700',
    badge: 'Developer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/conversion/pdf-to-markdown',
    buttonText: 'Ekstrak ke Markdown',
    options: []
  },

  // --- MANIPULASI ---
  {
    id: 'merge-pdf',
    title: 'Gabungkan PDF',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Gabungkan 2 atau lebih file PDF menjadi satu berkas PDF dengan urutan yang fleksibel.',
    icon: 'Files',
    color: 'from-red-500 to-rose-600',
    badge: 'Paling Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'File PDF (Pilih minimal 2 file)',
    multiple: true,
    endpoint: '/api/manipulation/merge',
    buttonText: 'Gabungkan Dokumen PDF',
    options: []
  },
  {
    id: 'split-pdf',
    title: 'Pisahkan PDF',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Pisahkan file PDF berdasarkan rentang halaman (misal: 1-3, 5) atau pecah setiap halaman jadi file terpisah.',
    icon: 'Scissors',
    color: 'from-amber-500 to-yellow-600',
    badge: 'Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/manipulation/split',
    buttonText: 'Pisahkan PDF',
    options: [
      {
        id: 'split_every_page',
        name: 'Pecah Setiap Halaman Menjadi File Terpisah',
        type: 'checkbox',
        default: false
      },
      {
        id: 'page_ranges',
        name: 'Atau Tentukan Rentang Halaman (contoh: 1-3, 5, 8-10)',
        type: 'text',
        placeholder: '1-3, 5, 8-10',
        default: ''
      }
    ]
  },
  {
    id: 'compress-pdf',
    title: 'Kompres PDF',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Perkecil ukuran dokumen PDF tanpa mengurangi kualitas teks dan gambar secara signifikan.',
    icon: 'Minimize2',
    color: 'from-emerald-500 to-green-600',
    badge: 'Paling Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/manipulation/compress',
    buttonText: 'Kompres Ukuran PDF',
    options: [
      {
        id: 'level',
        name: 'Tingkat Kompresi',
        type: 'radio',
        default: 'medium',
        options: [
          { label: 'Rendah (Kualitas Maksimal, Ukuran Sedikit Berkurang)', value: 'low' },
          { label: 'Sedang (Rekomendasi Terbaik: Kualitas Bagus & Ringan)', value: 'medium' },
          { label: 'Tinggi (Kompresi Ekstrem, Ukuran Sangat Kecil)', value: 'high' }
        ]
      }
    ]
  },
  {
    id: 'rotate-pdf',
    title: 'Putar PDF',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Putar orientasi halaman PDF 90°, 180°, atau 270° searah jarum jam untuk seluruh atau halaman tertentu.',
    icon: 'RotateCw',
    color: 'from-blue-600 to-indigo-600',
    badge: '',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/manipulation/rotate',
    buttonText: 'Putar Halaman PDF',
    options: [
      {
        id: 'angle',
        name: 'Sudut Putar',
        type: 'select',
        default: '90',
        options: [
          { label: '90 Derajat Searah Jarum Jam', value: '90' },
          { label: '180 Derajat (Terbalik)', value: '180' },
          { label: '270 Derajat Berlawanan Jarum Jam', value: '270' }
        ]
      },
      {
        id: 'pages',
        name: 'Halaman yang Diputar',
        type: 'text',
        placeholder: 'all atau 1, 3, 5',
        default: 'all'
      }
    ]
  },
  {
    id: 'organize-pdf',
    title: 'Atur PDF',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Atur ulang susunan urutan halaman, hapus halaman tertentu, atau rapikan struktur dokumen.',
    icon: 'Move',
    color: 'from-violet-500 to-purple-600',
    badge: '',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/manipulation/organize',
    buttonText: 'Terapkan Susunan PDF',
    options: [
      {
        id: 'page_order',
        name: 'Urutan Halaman Baru (contoh: 3, 1, 2, 4)',
        type: 'text',
        placeholder: '3, 1, 2, 4',
        default: ''
      },
      {
        id: 'pages_to_delete',
        name: 'Hapus Halaman Tertentu (contoh: 2, 5)',
        type: 'text',
        placeholder: '2, 5',
        default: ''
      }
    ]
  },
  {
    id: 'crop-pdf',
    title: 'Potong PDF',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Pangkas margin atau tepi halaman PDF untuk menghapus bagian kosong atau header/footer yang tidak perlu.',
    icon: 'Crop',
    color: 'from-pink-500 to-rose-600',
    badge: '',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/manipulation/crop',
    buttonText: 'Potong Margin PDF',
    options: [
      { id: 'left_margin', name: 'Margin Kiri (px)', type: 'number', default: 20, min: 0 },
      { id: 'top_margin', name: 'Margin Atas (px)', type: 'number', default: 20, min: 0 },
      { id: 'right_margin', name: 'Margin Kanan (px)', type: 'number', default: 20, min: 0 },
      { id: 'bottom_margin', name: 'Margin Bawah (px)', type: 'number', default: 20, min: 0 }
    ]
  },
  {
    id: 'add-page-numbers',
    title: 'Tambah Nomor Halaman',
    category: 'manipulation',
    categoryName: 'Manipulasi',
    description: 'Sematkan penomoran halaman otomatis dengan kustomisasi posisi, format teks, dan ukuran font.',
    icon: 'Binary',
    color: 'from-teal-500 to-emerald-600',
    badge: 'Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/manipulation/add-page-numbers',
    buttonText: 'Tambahkan Nomor Halaman',
    options: [
      {
        id: 'position',
        name: 'Posisi Penomoran',
        type: 'select',
        default: 'bottom_center',
        options: [
          { label: 'Bawah Tengah', value: 'bottom_center' },
          { label: 'Bawah Kanan', value: 'bottom_right' },
          { label: 'Bawah Kiri', value: 'bottom_left' },
          { label: 'Atas Tengah', value: 'top_center' },
          { label: 'Atas Kanan', value: 'top_right' }
        ]
      },
      {
        id: 'format_type',
        name: 'Format Teks',
        type: 'select',
        default: 'Halaman {n} dari {total}',
        options: [
          { label: 'Halaman {n} dari {total}', value: 'Halaman {n} dari {total}' },
          { label: '{n} / {total}', value: '{n} / {total}' },
          { label: '{n}', value: '{n}' }
        ]
      },
      {
        id: 'start_number',
        name: 'Mulai dari Nomor',
        type: 'number',
        default: 1,
        min: 1
      },
      {
        id: 'font_size',
        name: 'Ukuran Font (pt)',
        type: 'number',
        default: 10,
        min: 6,
        max: 24
      }
    ]
  },

  // --- KEAMANAN & FORM ---
  {
    id: 'unlock-pdf',
    title: 'Buka PDF Terkunci',
    category: 'security',
    categoryName: 'Keamanan & Form',
    description: 'Hapus enkripsi kata sandi dari PDF sehingga dokumen dapat dibuka, disalin, atau dicetak bebas.',
    icon: 'Unlock',
    color: 'from-amber-500 to-yellow-600',
    badge: 'Aman',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF Terkunci',
    multiple: false,
    endpoint: '/api/security/unlock',
    buttonText: 'Buka Kunci Dokumen',
    options: [
      {
        id: 'password',
        name: 'Kata Sandi Dokumen Saat Ini',
        type: 'password',
        placeholder: 'Masukkan password PDF...',
        default: ''
      }
    ]
  },
  {
    id: 'protect-pdf',
    title: 'Proteksi PDF',
    category: 'security',
    categoryName: 'Keamanan & Form',
    description: 'Enkripsi dokumen PDF dengan standar AES 256-bit dan atur izin cetak serta penyalinan konten.',
    icon: 'Lock',
    color: 'from-red-600 to-rose-700',
    badge: 'AES 256-bit',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/security/protect',
    buttonText: 'Kunci & Proteksi PDF',
    options: [
      {
        id: 'password',
        name: 'Buat Kata Sandi Pengguna (Wajib)',
        type: 'password',
        placeholder: 'Minimal 4 karakter...',
        default: ''
      },
      {
        id: 'allow_print',
        name: 'Izinkan Dokumen Dicetak',
        type: 'checkbox',
        default: true
      },
      {
        id: 'allow_copy',
        name: 'Izinkan Teks Disalin (Copy/Paste)',
        type: 'checkbox',
        default: true
      }
    ]
  },
  {
    id: 'sign-pdf',
    title: 'Tanda Tangani PDF',
    category: 'security',
    categoryName: 'Keamanan & Form',
    description: 'Beri tanda tangan digital dengan menggambar langsung di layar, stempel teks resmi, atau unggah gambar tanda tangan.',
    icon: 'PenTool',
    color: 'from-blue-600 to-indigo-700',
    badge: 'E-Sign',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/security/sign',
    buttonText: 'Terapkan Tanda Tangan',
    options: [
      {
        id: 'signature_text',
        name: 'Nama Penandatangan / Teks Stempel',
        type: 'text',
        placeholder: 'Contoh: Dr. Budi Santoso, S.Kom',
        default: ''
      },
      {
        id: 'page_number',
        name: 'Nomor Halaman',
        type: 'number',
        default: 1,
        min: 1
      },
      {
        id: 'signature_image',
        name: 'Atau Unggah Gambar Tanda Tangan (PNG Transparan)',
        type: 'file',
        accept: 'image/png,image/jpeg',
        default: null
      }
    ]
  },
  {
    id: 'watermark-pdf',
    title: 'Tanda Air (Watermark)',
    category: 'security',
    categoryName: 'Keamanan & Form',
    description: 'Sematkan teks watermark seperti "RAHASIA", "DRAFT", atau nama instansi secara diagonal di seluruh halaman.',
    icon: 'Stamp',
    color: 'from-purple-500 to-pink-600',
    badge: 'Populer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/security/watermark',
    buttonText: 'Sematkan Watermark',
    options: [
      {
        id: 'watermark_text',
        name: 'Teks Watermark',
        type: 'text',
        placeholder: 'RAHASIA / DRAFT / CHANGEFILEPDF',
        default: 'RAHASIA DOKUMEN'
      },
      {
        id: 'opacity',
        name: 'Tingkat Transparansi (Opacity)',
        type: 'range',
        min: 0.05,
        max: 0.9,
        step: 0.05,
        default: 0.25
      },
      {
        id: 'angle',
        name: 'Sudut Kemiringan (Derajat)',
        type: 'select',
        default: '45',
        options: [
          { label: 'Diagonal 45°', value: '45' },
          { label: 'Horizontal 0°', value: '0' },
          { label: 'Vertikal 90°', value: '90' }
        ]
      },
      {
        id: 'color_hex',
        name: 'Warna Teks',
        type: 'color',
        default: '#64748B'
      }
    ]
  },
  {
    id: 'redact-pdf',
    title: 'Samarkan PDF (Redact)',
    category: 'security',
    categoryName: 'Keamanan & Form',
    description: 'Hapus dan sensor informasi sensitif (NIK, nomor kartu, email, kata kunci rahasia) secara permanen.',
    icon: 'EyeOff',
    color: 'from-slate-700 to-slate-900',
    badge: 'Sensor Permanen',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/security/redact',
    buttonText: 'Sensor Kata Kunci Sensitif',
    options: [
      {
        id: 'search_terms',
        name: 'Kata Kunci / Frasa yang Disensor (Pisahkan dengan koma)',
        type: 'textarea',
        placeholder: 'Contoh: 320102..., rahasia@email.com, Password123',
        default: ''
      }
    ]
  },
  {
    id: 'forms-pdf',
    title: 'Formulir PDF',
    category: 'security',
    categoryName: 'Keamanan & Form',
    description: 'Isi field data formulir PDF AcroForm dan kunci isian formulir secara otomatis.',
    icon: 'CheckSquare',
    color: 'from-cyan-600 to-teal-700',
    badge: '',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF Berformulir (.pdf)',
    multiple: false,
    endpoint: '/api/security/forms/fill',
    buttonText: 'Isi Formulir PDF',
    options: [
      {
        id: 'field_data',
        name: 'Data Isian JSON (Field: Nilai)',
        type: 'textarea',
        placeholder: '{\n  "Nama": "Ahmad Dani",\n  "Email": "ahmad@contoh.id",\n  "NomorHP": "08123456789"\n}',
        default: '{\n  "Nama": "Budi Santoso",\n  "Alamat": "Jakarta, Indonesia"\n}'
      },
      {
        id: 'flatten',
        name: 'Ratakan (Flatten) Formulir agar Tidak Dapat Diedit Lagi',
        type: 'checkbox',
        default: true
      }
    ]
  },

  // --- LANJUTAN ---
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    category: 'advanced',
    categoryName: 'Lanjutan',
    description: 'Tambahkan teks baru, catatan penting, kotak penanda, atau gambar langsung di atas halaman PDF.',
    icon: 'Edit3',
    color: 'from-indigo-600 to-blue-700',
    badge: 'Interaktif',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/advanced/edit',
    buttonText: 'Terapkan Editan ke PDF',
    options: [
      {
        id: 'edits_json',
        name: 'Konfigurasi Elemen Tambahan (JSON)',
        type: 'textarea',
        default: '[\n  {\n    "page": 1,\n    "type": "text",\n    "text": "Disetujui oleh Tim ChangeFilePDF",\n    "x": 60,\n    "y": 60,\n    "width": 300,\n    "height": 40,\n    "color": "#1e40af",\n    "fontSize": 12\n  }\n]'
      }
    ]
  },
  {
    id: 'ocr-pdf',
    title: 'OCR PDF (Kenali Teks)',
    category: 'advanced',
    categoryName: 'Lanjutan',
    description: 'Ubah PDF hasil scan atau foto dokumen menjadi PDF yang teksnya dapat dicari dan disalin (Searchable PDF).',
    icon: 'ScanText',
    color: 'from-blue-500 to-emerald-600',
    badge: 'Tesseract OCR',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF Hasil Scan',
    multiple: false,
    endpoint: '/api/advanced/ocr',
    buttonText: 'Jalankan OCR PDF',
    options: [
      {
        id: 'lang',
        name: 'Bahasa Dokumen',
        type: 'select',
        default: 'ind+eng',
        options: [
          { label: 'Indonesia + Inggris (Rekomendasi)', value: 'ind+eng' },
          { label: 'Bahasa Indonesia Saja', value: 'ind' },
          { label: 'English Only', value: 'eng' }
        ]
      },
      {
        id: 'make_searchable',
        name: 'Hasilkan File PDF yang Teksnya Bisa Dicari (Searchable PDF)',
        type: 'checkbox',
        default: true
      }
    ]
  },
  {
    id: 'repair-pdf',
    title: 'Perbaiki PDF Rusak',
    category: 'advanced',
    categoryName: 'Lanjutan',
    description: 'Pulihkan file PDF yang rusak, tidak bisa dibuka, atau memiliki tabel referensi silang (XREF) yang korup.',
    icon: 'Wrench',
    color: 'from-amber-600 to-red-600',
    badge: 'Pemulihan',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF yang Rusak / Error',
    multiple: false,
    endpoint: '/api/advanced/repair',
    buttonText: 'Perbaiki & Pulihkan PDF',
    options: []
  },
  {
    id: 'compare-pdf',
    title: 'Bandingkan PDF',
    category: 'advanced',
    categoryName: 'Lanjutan',
    description: 'Bandingkan 2 dokumen PDF dan dapatkan laporan persentase kemiripan serta rincian perbedaan teks.',
    icon: 'GitCompare',
    color: 'from-purple-600 to-pink-600',
    badge: 'Diff Analyzer',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Pilih 2 File PDF untuk dibandingkan',
    multiple: true,
    maxFiles: 2,
    endpoint: '/api/advanced/compare',
    buttonText: 'Bandingkan Kedua Dokumen',
    isJsonResponse: true,
    options: []
  },

  // --- FITUR AI ---
  {
    id: 'ai-summarize',
    title: 'Perangkum AI PDF',
    category: 'ai',
    categoryName: 'Fitur AI',
    description: 'Rangkum isi PDF secara instan dengan kecerdasan AI. Dapatkan ringkasan eksekutif dan poin-poin penting.',
    icon: 'Sparkles',
    color: 'from-violet-600 to-fuchsia-600',
    badge: 'Gemini / OpenAI',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/ai/summarize',
    buttonText: 'Rangkum dengan AI',
    isJsonResponse: true,
    options: [
      {
        id: 'summary_type',
        name: 'Gaya Rangkuman',
        type: 'select',
        default: 'concise',
        options: [
          { label: 'Ringkas & Poin Utama (Concise)', value: 'concise' },
          { label: 'Mendalam & Eksekutif (Detailed)', value: 'detailed' }
        ]
      },
      {
        id: 'api_key',
        name: 'API Key Gemini / OpenAI (Opsional)',
        type: 'password',
        placeholder: 'Masukkan API Key Anda (atau kosongkan untuk mode offline bawaan)',
        default: ''
      }
    ]
  },
  {
    id: 'ai-translate',
    title: 'Terjemahkan PDF AI',
    category: 'ai',
    categoryName: 'Fitur AI',
    description: 'Terjemahkan seluruh isi dokumen PDF ke berbagai bahasa dunia dengan tetap menjaga konteks dan makna.',
    icon: 'Languages',
    color: 'from-blue-600 to-violet-600',
    badge: 'AI Translator',
    accept: '.pdf,application/pdf',
    acceptDescription: 'Dokumen PDF (.pdf)',
    multiple: false,
    endpoint: '/api/ai/translate',
    buttonText: 'Terjemahkan Dokumen',
    options: [
      {
        id: 'target_language',
        name: 'Bahasa Tujuan',
        type: 'select',
        default: 'Indonesian',
        options: [
          { label: 'Bahasa Indonesia', value: 'Indonesian' },
          { label: 'English (Inggris)', value: 'English' },
          { label: 'Japanese (Jepang)', value: 'Japanese' },
          { label: 'Arabic (Arab)', value: 'Arabic' },
          { label: 'Chinese (Mandarin)', value: 'Chinese' },
          { label: 'German (Jerman)', value: 'German' },
          { label: 'Spanish (Spanyol)', value: 'Spanish' }
        ]
      },
      {
        id: 'as_pdf',
        name: 'Hasilkan Hasil Terjemahan Sebagai Dokumen PDF Baru',
        type: 'checkbox',
        default: true
      },
      {
        id: 'api_key',
        name: 'API Key Gemini (Opsional)',
        type: 'password',
        placeholder: 'Masukkan API Key AI...',
        default: ''
      }
    ]
  }
];
