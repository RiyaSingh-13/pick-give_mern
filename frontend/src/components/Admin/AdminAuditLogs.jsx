// frontend/src/components/Admin/AdminAuditLogs.jsx
import React from 'react';
import { SectionHeader } from '../UI/SectionHeader';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';

export function AdminAuditLogs({
  adminLogs,
  setAdminLogs
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="FULL SYSTEM AUDIT LOGS"
        subtitle="Chronological history of registered logins, administrative choices, and community actions."
        icon="📋"
      >
        <Button
          variant="dangerOutline"
          size="sm"
          onClick={() => setAdminLogs([])}
          className="px-3 py-1.5 rounded-xl font-bold"
        >
          Clear Audit Log
        </Button>
      </SectionHeader>

      <Card className="max-h-[600px] overflow-y-auto space-y-3 p-6">
        {adminLogs.length === 0 ? (
          <div className="py-12 text-center text-xs font-semibold text-[#556B5D]">
            🍃 Audit feed empty. All actions cleared.
          </div>
        ) : (
          adminLogs.map(log => (
            <div key={log.id || log._id} className="p-4 bg-[#F8FAF5] rounded-xl border border-[#0F340F]/5 text-xs font-semibold text-[#556B5D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left animate-fade-in">
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
      </Card>
    </div>
  );
}
