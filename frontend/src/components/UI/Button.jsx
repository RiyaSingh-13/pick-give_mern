import React from 'react';

export function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'dangerOutline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  onClick,
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-semibold transition-all cursor-pointer select-none rounded-full active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

  const variants = {
    primary: 'text-white bg-forest hover:bg-forest-hover shadow-sm hover:scale-[1.02]',
    secondary: 'text-forest bg-[#F4F7F2] hover:bg-[#EAF0E6]',
    outline: 'text-forest bg-transparent border-2 border-forest hover:bg-forest/5 hover:scale-[1.02]',
    danger: 'text-white bg-[#E32121] hover:bg-[#C61818] shadow-sm hover:scale-[1.02]',
    dangerOutline: 'border border-red-200 bg-transparent text-red-600 hover:bg-red-50',
    ghost: 'text-mutegreen hover:text-[#0F340F] hover:bg-[#F4F7F2]/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px] font-bold rounded-lg',
    md: 'px-4 py-2 text-xs xl:text-sm font-semibold rounded-full',
    lg: 'px-6 py-3.5 text-base font-semibold rounded-full'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
