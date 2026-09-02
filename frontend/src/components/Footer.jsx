import React from 'react';
import { FileText, Shield, Zap, Heart, CheckCircle2, Lock } from 'lucide-react';

export const Footer = ({ onSelectTool }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-indigo flex items-center justify-center text-white font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ChangeFile<span className="text-primary-600 dark:text-primary-400">PDF</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform lengkap pengelolaan & konversi file PDF modern. Cepat, aman, dan 100% diproses langsung tanpa batasan.
            </p>
            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>Privasi Terjaga (Auto-Delete)</span>
            </div>
          </div>

          {/* Konversi */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Konversi Populer
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onSelectTool('word-to-pdf')} className="hover:text-primary-600 transition-colors">Word ke PDF</button></li>
              <li><button onClick={() => onSelectTool('pdf-to-word')} className="hover:text-primary-600 transition-colors">PDF ke Word</button></li>
              <li><button onClick={() => onSelectTool('excel-to-pdf')} className="hover:text-primary-600 transition-colors">Excel ke PDF</button></li>
              <li><button onClick={() => onSelectTool('jpg-to-pdf')} className="hover:text-primary-600 transition-colors">Gambar ke PDF</button></li>
              <li><button onClick={() => onSelectTool('pdf-to-jpg')} className="hover:text-primary-600 transition-colors">PDF ke JPG</button></li>
            </ul>
          </div>

          {/* Manipulasi & Keamanan */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Manipulasi & Keamanan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onSelectTool('merge-pdf')} className="hover:text-primary-600 transition-colors">Gabungkan PDF</button></li>
              <li><button onClick={() => onSelectTool('compress-pdf')} className="hover:text-primary-600 transition-colors">Kompres PDF</button></li>
              <li><button onClick={() => onSelectTool('split-pdf')} className="hover:text-primary-600 transition-colors">Pisahkan PDF</button></li>
              <li><button onClick={() => onSelectTool('protect-pdf')} className="hover:text-primary-600 transition-colors">Proteksi & Kunci PDF</button></li>
              <li><button onClick={() => onSelectTool('sign-pdf')} className="hover:text-primary-600 transition-colors">Tanda Tangani PDF</button></li>
            </ul>
          </div>

          {/* AI & Fitur Cerdas */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Fitur AI & Lanjutan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onSelectTool('ai-summarize')} className="hover:text-primary-600 transition-colors flex items-center space-x-1.5"><Zap className="w-3 h-3 text-amber-500" /><span>Perangkum AI PDF</span></button></li>
              <li><button onClick={() => onSelectTool('ai-translate')} className="hover:text-primary-600 transition-colors">Terjemahkan PDF AI</button></li>
              <li><button onClick={() => onSelectTool('ocr-pdf')} className="hover:text-primary-600 transition-colors">OCR Kenali Teks</button></li>
              <li><button onClick={() => onSelectTool('repair-pdf')} className="hover:text-primary-600 transition-colors">Perbaiki PDF Rusak</button></li>
              <li><button onClick={() => onSelectTool('compare-pdf')} className="hover:text-primary-600 transition-colors">Bandingkan Dokumen</button></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 ChangeFilePDF. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-primary-500" />
              <span>Pemrosesan Aman & Enkripsi Standar</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
