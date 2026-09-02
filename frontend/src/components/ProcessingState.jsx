import React from 'react';
import { Loader2, Sparkles, FileCheck, CheckCircle2 } from 'lucide-react';

export const ProcessingState = ({ progress, toolName }) => {
  const getStageMessage = (pct) => {
    if (pct < 40) return 'Mengunggah file ke server...';
    if (pct < 80) return `Memproses logika ${toolName}...`;
    return 'Menyusun berkas hasil unduhan...';
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 rounded-3xl glass-card text-center space-y-6 animate-fade-in border border-primary-500/30">
      {/* Animated Spinner & Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-950/60 border-t-primary-600 dark:border-t-primary-400 animate-spin" />
        <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Status Text */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Memproses Dokumen Anda
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {getStageMessage(progress)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className="bg-gradient-to-r from-primary-600 to-accent-indigo h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(15, progress)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>Memproses</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Security Reassurance */}
      <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>File Anda dienkripsi dan akan otomatis dihapus setelah selesai</span>
      </div>
    </div>
  );
};

export default ProcessingState;
