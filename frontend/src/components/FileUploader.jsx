import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, Plus, AlertCircle, CheckCircle } from 'lucide-react';

export const FileUploader = ({
  files,
  setFiles,
  accept = '.pdf',
  acceptDescription = 'Dokumen PDF (.pdf)',
  multiple = false,
  maxFiles = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (incomingFiles) => {
    const validFiles = Array.from(incomingFiles);
    if (!multiple) {
      setFiles([validFiles[0]]);
    } else {
      const combined = [...files, ...validFiles];
      if (maxFiles && combined.length > maxFiles) {
        setFiles(combined.slice(0, maxFiles));
      } else {
        setFiles(combined);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index, e) => {
    e.stopPropagation();
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-primary-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        {/* Upload Icon with Pulse Glow */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-indigo text-white flex items-center justify-center shadow-lg shadow-primary-500/25 mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          {multiple ? 'Tarik & Letakkan File Anda di Sini' : 'Tarik & Letakkan File di Sini'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md">
          atau <span className="text-primary-600 dark:text-primary-400 font-semibold underline underline-offset-2">pilih file dari komputer</span>
        </p>

        {/* File Types Hint */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          <span>Format: {acceptDescription}</span>
          {multiple && <span className="text-primary-600 dark:text-primary-400">• Multi-File Didukung</span>}
        </div>
      </div>

      {/* Selected Files Preview List */}
      {files.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              File Terpilih ({files.length} {multiple && maxFiles ? `/ maks ${maxFiles}` : ''})
            </span>
            {files.length > 1 && (
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium"
              >
                Hapus Semua
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map((f, idx) => (
              <div
                key={`${f.name}-${idx}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {f.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {formatFileSize(f.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRemoveFile(idx, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Hapus file ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
