import React from 'react';

export function Badge({ status, className = '', ...props }) {
  const getStatusStyles = (statusVal) => {
    const s = (statusVal || '').toLowerCase().trim();
    
    if (s.includes('approved') || s.includes('delivered') || s.includes('success')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('rejected') || s.includes('failed') || s.includes('high')) {
      return 'bg-red-50 text-red-750 border-red-200';
    }
    if (s.includes('pending') || s.includes('awaiting') || s.includes('medium')) {
      return 'bg-amber-50 text-amber-750 border-amber-200';
    }
    if (s.includes('posted') || s.includes('offer') || s.includes('low')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (s.includes('transit') || s.includes('way') || s.includes('claimed') || s.includes('accepted')) {
      return 'bg-indigo-50 text-indigo-750 border-indigo-200';
    }
    // Default
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getStatusStyles(status)} ${className}`}
      {...props}
    >
      {status}
    </span>
  );
}
