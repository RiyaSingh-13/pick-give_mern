import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div 
      className={`bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm transition-all ${
        hover ? 'hover:scale-[1.01] hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
