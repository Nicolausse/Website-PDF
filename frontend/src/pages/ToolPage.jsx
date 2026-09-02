import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  Lock, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import DynamicIcon from '../components/DynamicIcon';
import FileUploader from '../components/FileUploader';
import OptionPanel from '../components/OptionPanel';
import ProcessingState from '../components/ProcessingState';
import ResultCard from '../components/ResultCard';
import ToolCard from '../components/ToolCard';
import { processPdfTool } from '../services/api';

export const ToolPage = ({ toolId, onGoHome, onSelectTool }) => {
  const tool = TOOLS.find((t) => t.id === toolId);

  const [files, setFiles] = useState([]);
  const [optionValues, setOptionValues] = useState({});
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize default options for this tool
  useEffect(() => {
    if (tool && tool.options) {
      const initial = {};
      tool.options.forEach((opt) => {
        initial[opt.id] = opt.default !== undefined ? opt.default : '';
      });
      setOptionValues(initial);
    }
    setFiles([]);
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
    setProgress(0);
  }, [toolId]);

  if (!tool) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Alat tidak ditemukan</h2>
        <button
          onClick={onGoHome}
          className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleProcess = async () => {
    // Validation: check if file or HTML content exists
    if (files.length === 0 && (!optionValues.html_content || !optionValues.html_content.trim())) {
      setErrorMessage('Harap pilih atau unggah file terlebih dahulu.');
      return;
    }

    if (tool.id === 'merge-pdf' && files.length < 2) {
      setErrorMessage('Minimal pilih 2 file PDF untuk digabungkan.');
      return;
    }

    setStatus('processing');
    setProgress(15);
    setErrorMessage('');

    const formData = new FormData();

    // Append file(s)
    if (tool.multiple) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    } else if (files.length > 0) {
      if (tool.id === 'compare-pdf') {
        formData.append('file1', files[0]);
        if (files[1]) {
          formData.append('file2', files[1]);
        }
      } else {
        formData.append('file', files[0]);
      }
    }

    // Append options
    if (tool.options) {
      tool.options.forEach((opt) => {
        const val = optionValues[opt.id] !== undefined ? optionValues[opt.id] : opt.default;
        if (val !== undefined && val !== null) {
          formData.append(opt.id, val);
        }
      });
    }

    try {
      // Simulate smooth progress increments
      const progressTimer = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 8 : prev));
      }, 400);

      const responseData = await processPdfTool(tool.endpoint, formData, (uploadPct) => {
        setProgress(Math.min(70, uploadPct));
      });

      clearInterval(progressTimer);
      setProgress(100);

      setTimeout(() => {
        setResult(responseData);
        setStatus('success');
      }, 500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Gagal memproses file.');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
    setProgress(0);
  };

  // Find 4 related tools in the same category
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 animate-fade-in">
      
      {/* --- BREADCRUMB & BACK BUTTON --- */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <span className="cursor-pointer hover:underline" onClick={onGoHome}>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize">{tool.categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">{tool.title}</span>
        </div>
      </div>

      {/* --- TOOL HEADER --- */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-lg shadow-slate-900/10 mb-2`}>
            <DynamicIcon name={tool.icon} className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {tool.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* --- ERROR BANNER --- */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-3 text-rose-800 dark:text-rose-200 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
          <div className="flex-1">
            <span className="font-semibold">Terjadi Kesalahan: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* --- WORKSPACE CONTAINER --- */}
      <div className="space-y-6">
        
        {/* State 1: Idle Workspace */}
        {status === 'idle' && (
          <div className="space-y-6">
            
            {/* File Uploader Dropzone */}
            <FileUploader
              files={files}
              setFiles={setFiles}
              accept={tool.accept}
              acceptDescription={tool.acceptDescription}
              multiple={tool.multiple}
              maxFiles={tool.maxFiles || 10}
            />

            {/* Option Configuration Panel */}
            <OptionPanel
              options={tool.options}
              optionValues={optionValues}
              setOptionValues={setOptionValues}
            />

            {/* Action Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleProcess}
                disabled={files.length === 0 && (!optionValues.html_content || !optionValues.html_content.trim())}
                className={`w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-xl transition-all duration-300 ${
                  files.length > 0 || (optionValues.html_content && optionValues.html_content.trim())
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white shadow-primary-600/25 hover:scale-[1.02] cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{tool.buttonText || `Proses ${tool.title}`}</span>
              </button>
            </div>

          </div>
        )}

        {/* State 2: Processing Progress */}
        {status === 'processing' && (
          <ProcessingState
            progress={progress}
            toolName={tool.title}
          />
        )}

        {/* State 3: Success Result Display */}
        {status === 'success' && result && (
          <ResultCard
            result={result}
            tool={tool}
            onReset={handleReset}
          />
        )}

        {/* State 4: Error Retry Action */}
        {status === 'error' && (
          <div className="text-center pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              Coba Ulangi
            </button>
          </div>
        )}

      </div>

      {/* --- RELATED TOOLS SECTION --- */}
      {relatedTools.length > 0 && (
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Alat Terkait Kategori {tool.categoryName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                onSelect={onSelectTool}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ToolPage;
