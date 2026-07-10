import React from 'react';
import { X } from 'lucide-react';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  maxWidth = 'max-w-lg', // max-w-lg, max-w-xl, max-w-2xl
  showLeaves = true,
  className = ''
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E392A]/50 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full ${maxWidth} paper-sheet border border-forest/15 p-6 md:p-8 relative bg-white rounded-3xl shadow-xl animate-float ${className}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-mutegreen hover:text-forest transition-colors p-1.5 rounded-full hover:bg-cream cursor-pointer z-50"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Floating leaf decorative elements */}
        {showLeaves && (
          <>
            <div className="absolute top-2 left-2 text-[#7EB138]/20 pointer-events-none select-none">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 text-[#7EB138]/20 pointer-events-none select-none transform rotate-180">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
              </svg>
            </div>
          </>
        )}

        {/* Modal Header */}
        {(title || subtitle) && (
          <div className="text-center mb-6 relative z-10">
            {title && (
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A3828] font-serif uppercase tracking-tight leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[#556B5D] font-bold mt-1.5">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
