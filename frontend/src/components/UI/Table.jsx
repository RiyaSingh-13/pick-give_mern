import React from 'react';

export function Table({ headers, children, className = '' }) {
  return (
    <div className={`bg-white border border-[#0F340F]/8 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-semibold text-[#556B5D] divide-y divide-[#0F340F]/5">
          <thead className="bg-[#F8FAF5] text-[#0F340F] text-[10px] font-extrabold uppercase tracking-wider">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className={`px-6 py-4 ${header.className || ''}`}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0F340F]/5">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
