import React from 'react';

export function SectionHeader({ title, subtitle, icon, children, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#0F340F]/10 pb-4 gap-4 ${className}`}>
      <div className="text-left">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#0F340F] font-serif flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs font-semibold text-[#556B5D] mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
