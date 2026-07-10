import React from 'react';
import { Card } from './Card';

export function StatCard({ 
  value, 
  label, 
  sublabel, 
  icon: Icon, 
  iconColor = 'text-leaf', 
  iconBg = 'bg-[#F8FAF5]', 
  className = '', 
  ...props 
}) {
  return (
    <Card hover className={`flex items-center gap-4 ${className}`} {...props}>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl border border-[#0F340F]/10 flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="text-left">
        <span className="text-2xl font-black text-[#0F340F] block leading-none">{value}</span>
        <span className="text-xs font-bold text-[#556B5D]">{label}</span>
        {sublabel && (
          <span className="text-[10px] text-[#556B5D]/60 block font-semibold mt-0.5">{sublabel}</span>
        )}
      </div>
    </Card>
  );
}
