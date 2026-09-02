import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

export const ResultCard = ({ result, tool, onReset }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl glass-card border border-emerald-500/30 shadow-2xl shadow-emerald-500/5 space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Top Success Badge */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Dokumen Berhasil Diproses!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Fitur <span className="font-semibold text-primary-600 dark:text-primary-400">{tool.title}</span> telah selesai dijalankan.
        </p>
      </div>

      {/* Case 1: Downloadable File or ZIP Response */}
      {result.type === 'file' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {result.filename}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ukuran: {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.downloadUrl}
              download={result.filename}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-600/25 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File</span>
            </a>
          </div>
        </div>
      )}

      {/* Case 2: AI / JSON Structured Result (Summarizer, Translate, OCR Text, Compare PDF) */}
      {result.type === 'json' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
          
          {/* AI Summarize Result Display */}
          {result.data.summary && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-violet-600 dark:text-violet-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Hasil Rangkuman ({result.data.engine || 'AI'})</span>
                </div>
                <button
                  onClick={() => handleCopyText(result.data.summary)}
                  className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
              </div>

              {/* Key Points */}
              {result.data.key_points && result.data.key_points.length > 0 && (
                <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 space-y-2">
                  <h4 className="text-xs font-bold text-violet-900 dark:text-violet-200 uppercase tracking-wider">
                    Poin-Poin Kunci:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {result.data.key_points.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-violet-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {result.data.summary}
              </div>
            </div>
          )}

          {/* AI Translate Result Display */}
          {result.data.translated_text && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  Terjemahan Bahasa: {result.data.target_language} ({result.data.engine})
                </div>
                <button
                  onClick={() => handleCopyText(result.data.translated_text)}
                  className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {result.data.translated_text}
              </div>
            </div>
          )}

          {/* Compare PDF Result Display */}
          {result.data.similarity_percentage !== undefined && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
                    {result.data.similarity_percentage}%
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Tingkat Kemiripan</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
                    {result.data.is_identical ? 'Identik' : 'Ada Perbedaan'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Status Perbandingan</div>
                </div>
              </div>

              {result.data.diff_summary && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rincian Perbedaan Teks (Diff):</span>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed max-h-56 overflow-y-auto overflow-x-auto">
                    {result.data.diff_summary}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* OCR Result Display */}
          {result.data.full_text && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Total Kata Terdeteksi: {result.data.total_words} kata ({result.data.total_pages} halaman)
                </span>
                <button
                  onClick={() => handleCopyText(result.data.full_text)}
                  className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-mono">
                {result.data.full_text}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Proses File Lain</span>
        </button>
      </div>

    </div>
  );
};

export default ResultCard;
