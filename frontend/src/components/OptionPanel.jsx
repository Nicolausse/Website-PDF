import React, { useState } from 'react';
import { Eye, EyeOff, Sliders, Settings2 } from 'lucide-react';

export const OptionPanel = ({ options, optionValues, setOptionValues }) => {
  const [showPassword, setShowPassword] = useState({});

  if (!options || options.length === 0) return null;

  const handleChange = (id, value) => {
    setOptionValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const toggleShowPassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm">
        <Settings2 className="w-4 h-4 text-primary-500" />
        <span>Pengaturan & Opsi Tambahan</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {options.map((opt) => {
          const val = optionValues[opt.id] !== undefined ? optionValues[opt.id] : opt.default;

          if (opt.type === 'password') {
            const isVisible = showPassword[opt.id];
            return (
              <div key={opt.id} className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {opt.name}
                </label>
                <div className="relative">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    placeholder={opt.placeholder || ''}
                    value={val || ''}
                    onChange={(e) => handleChange(opt.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword(opt.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          }

          if (opt.type === 'select') {
            return (
              <div key={opt.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {opt.name}
                </label>
                <select
                  value={val}
                  onChange={(e) => handleChange(opt.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {opt.options.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (opt.type === 'radio') {
            return (
              <div key={opt.id} className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {opt.name}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {opt.options.map((item) => {
                    const isSelected = val === item.value;
                    return (
                      <div
                        key={item.value}
                        onClick={() => handleChange(opt.id, item.value)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-900 dark:text-primary-100 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={opt.id}
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-0.5 text-primary-600 focus:ring-primary-500"
                        />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (opt.type === 'checkbox') {
            return (
              <div key={opt.id} className="flex items-center space-x-3 md:col-span-2 py-1">
                <input
                  type="checkbox"
                  id={opt.id}
                  checked={!!val}
                  onChange={(e) => handleChange(opt.id, e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700"
                />
                <label htmlFor={opt.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  {opt.name}
                </label>
              </div>
            );
          }

          if (opt.type === 'range') {
            return (
              <div key={opt.id} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {opt.name}
                  </label>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {val}
                  </span>
                </div>
                <input
                  type="range"
                  min={opt.min}
                  max={opt.max}
                  step={opt.step || 1}
                  value={val}
                  onChange={(e) => handleChange(opt.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>
            );
          }

          if (opt.type === 'color') {
            return (
              <div key={opt.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {opt.name}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) => handleChange(opt.id, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{val}</span>
                </div>
              </div>
            );
          }

          if (opt.type === 'textarea') {
            return (
              <div key={opt.id} className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {opt.name}
                </label>
                <textarea
                  rows={4}
                  placeholder={opt.placeholder || ''}
                  value={val || ''}
                  onChange={(e) => handleChange(opt.id, e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            );
          }

          // Default Text / Number
          return (
            <div key={opt.id} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {opt.name}
              </label>
              <input
                type={opt.type || 'text'}
                min={opt.min}
                max={opt.max}
                placeholder={opt.placeholder || ''}
                value={val || ''}
                onChange={(e) => handleChange(opt.id, opt.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionPanel;
