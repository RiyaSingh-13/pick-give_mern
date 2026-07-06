import React from 'react';

export function AdminAuditLogs({
  adminLogs,
  setAdminLogs
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">📋 FULL SYSTEM AUDIT LOGS</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Chronological history of registered logins, administrative choices, and community actions.</p>
        </div>
        <button
          onClick={() => setAdminLogs([])}
          className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          Clear Audit Log
        </button>
      </div>

      <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm max-h-[600px] overflow-y-auto space-y-3">
        {adminLogs.length === 0 ? (
          <div className="py-12 text-center text-xs font-semibold text-[#556B5D]">
            🍃 Audit feed empty. All actions cleared.
          </div>
        ) : (
          adminLogs.map(log => (
            <div key={log.id || log._id} className="p-4 bg-[#F8FAF5] rounded-xl border border-[#0F340F]/5 text-xs font-semibold text-[#556B5D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
              <div className="flex items-start sm:items-center gap-3">
                <span className="bg-[#0F340F] text-white px-2.5 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider flex-shrink-0">
                  {log.category}
                </span>
                <p className="text-[#0F340F] leading-normal">{log.event}</p>
              </div>
              <span className="text-[10px] text-[#556B5D]/60 font-bold whitespace-nowrap self-end sm:self-center">
                ⏱️ {log.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
