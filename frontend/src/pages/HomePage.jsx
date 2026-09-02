import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Search, 
  Layers, 
  Lock, 
  CheckCircle2, 
  ChevronDown, 
  ArrowRight,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import ToolCard from '../components/ToolCard';
import DynamicIcon from '../components/DynamicIcon';

export const HomePage = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSelectTool
}) => {
  const [openFaq, setOpenFaq] = useState(null);

  // Filter tools by category and search query
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = currentCategory === 'all' || tool.category === currentCategory;
    const matchesSearch =
      !searchQuery ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const faqs = [
    {
      q: 'Apakah file dokumen saya aman dan terjaga privasinya?',
      a: 'Sangat aman! Seluruh dokumen yang Anda unggah langsung diproses di server lokal secara terenkripsi dan otomatis dihapus secara permanen dari sistem setelah pemrosesan selesai.'
    },
    {
      q: 'Apakah ada batasan jumlah atau ukuran file?',
      a: 'ChangeFilePDF dirancang tanpa batasan penggunaan harian. Anda dapat mengonversi, menggabungkan, memotong, atau menandatangani dokumen PDF sebanyak yang Anda butuhkan.'
    },
    {
      q: 'Bagaimana fitur Perangkum AI bekerja?',
      a: 'Perangkum AI menganalisis isi dokumen PDF Anda menggunakan teknologi NLP cerdas untuk menghasilkan ringkasan eksekutif, poin-poin utama, dan kesimpulan secara otomatis.'
    },
    {
      q: 'Apakah ChangeFilePDF mendukung multi-file (seperti Gabungkan PDF & Gambar ke PDF)?',
      a: 'Ya, Anda dapat memilih dan mengunggah banyak file sekaligus untuk fitur-fitur seperti Gabung PDF, Konversi Gambar ke PDF, dan Pindai ke PDF.'
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-8 pb-4 text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 px-4">
          
          {/* Top Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200/80 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
            <span>Solusi Terlengkap Manajemen & Konversi Dokumen PDF</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Ubah, Kelola, & Amankan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-indigo bg-clip-text text-transparent">
              Dokumen PDF Anda Seketika
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            30+ alat canggih: Konversi Word, Excel, PPT, Gambar, Manipulasi Halaman, Enkripsi, OCR Tesseract, dan Analisis Ringkasan AI. 100% Fungsional & Cepat.
          </p>

          {/* Hero Quick Search Bar (Mobile and Desktop) */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-indigo rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-lg border border-slate-200/80 dark:border-slate-800">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
                <input
                  type="text"
                  placeholder="Ketik alat yang Anda butuhkan (misal: Gabung PDF, AI, Word, Kompres)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-2 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>30+ Fitur Aktif</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
              <span>Auto-Hapus & Privasi Terjaga</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Pemrosesan Instan</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- CATEGORY FILTER TABS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <DynamicIcon name={cat.icon} className="w-4 h-4" />
                <span>{cat.name}</span>
                {cat.id === 'all' && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-primary-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {TOOLS.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Tidak ada alat yang cocok dengan pencarian "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coba kata kunci lain atau pilih kategori "Semua Alat".
            </p>
            <button
              onClick={() => { setSearchQuery(''); onSelectCategory('all'); }}
              className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Tampilkan Seluruh Alat
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Daftar Alat</span>
                <span className="text-xs font-semibold text-slate-400 font-normal">
                  ({filteredTools.length} alat tersedia)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onSelect={onSelectTool}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- WHY CHOOSE CHANGEFILEPDF (VALUE PROPOSITIONS) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/30 border border-slate-200/80 dark:border-slate-800 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Kenapa Memilih ChangeFilePDF?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Platform all-in-one yang dirancang untuk kecepatan, akurasi konversi dokumen, dan keamanan tanpa kompromi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konversi & Eksekusi Cepat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ditenagai oleh library PyMuPDF & ReportLab berkecepatan tinggi untuk menghasilkan output PDF berkualitas tanpa watermark pihak ketiga.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                100% Aman & Privasi Terjamin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                File Anda diproses secara mandiri dalam direktori sementara yang terisolasi dan dihapus otomatis setelah unduhan selesai.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kecerdasan Buatan (AI) & OCR
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Rangkum dokumen panjang, terjemahkan multi-bahasa, serta kenali teks dari gambar pindaian dengan Tesseract OCR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Segala informasi yang perlu Anda ketahui seputar ChangeFilePDF.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between space-x-4 focus:outline-none"
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180 text-primary-500' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
