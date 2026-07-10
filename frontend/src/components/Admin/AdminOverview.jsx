// frontend/src/components/Admin/AdminOverview.jsx
import React from 'react';
import { Users, Building, Package, Truck } from 'lucide-react';
import { StatCard } from '../UI/StatCard';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

export function AdminOverview({
  adminUsers,
  adminNgos,
  adminLogs,
  setSelectedDossier,
  handleApproveNgo,
  handleRejectNgo
}) {
  const stats = [
    { value: adminUsers.length, label: "Total Members", icon: Users },
    { value: adminNgos.length, label: "Registered NGOs", icon: Building },
    { value: 12580, label: "Donations Transacted", icon: Package },
    { value: 324, label: "Active Couriers", icon: Truck }
  ];

  const pendingNgos = adminNgos.filter(n => n.status === 'Pending');

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            value={stat.value}
            label={stat.label}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Pending NGO Document Approvals */}
        <Card className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3 flex items-center justify-between">
            <span>⏳ Pending NGO Approvals</span>
            <span className="bg-[#78A642]/10 text-[#78A642] border border-[#78A642]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              {pendingNgos.length} Action Required
            </span>
          </h3>

          {pendingNgos.length === 0 ? (
            <div className="py-8 text-center text-[#556B5D] text-xs font-semibold">
              🎉 All submitted NGO registrations are reviewed and verified!
            </div>
          ) : (
            <div className="divide-y divide-[#0F340F]/5">
              {pendingNgos.map(ngo => (
                <div key={ngo._id || ngo.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <h4 
                      className="font-bold text-[#0F340F] text-sm cursor-pointer hover:underline hover:text-[#78A642] transition-colors"
                      onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                    >
                      🏢 {ngo.ngoName}
                    </h4>
                    <div className="text-[11px] text-[#556B5D] space-y-0.5 font-medium">
                      <p>📧 {ngo.officialEmail} | 📞 {ngo.phone}</p>
                      <p>📄 Reg No: <span className="font-bold text-[#0F340F]">{ngo.registrationNumber}</span></p>
                      <p 
                        className="underline text-[#78A642] cursor-pointer font-bold hover:text-[#0F340F] transition-colors"
                        onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                      >
                        📎 View Certificate & Full Dossier: {ngo.certificate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveNgo(ngo._id || ngo.id)}
                    >
                      ✔️ Approve
                    </Button>
                    <Button
                      variant="dangerOutline"
                      size="sm"
                      onClick={() => handleRejectNgo(ngo._id || ngo.id)}
                    >
                      ❌ Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Side: Recent Activity Stream */}
        <Card className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3">⚙️ System Audit Feed</h3>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {adminLogs.map(log => (
              <div key={log.id || log._id} className="p-3 bg-[#F8FAF5] rounded-xl border border-[#0F340F]/5 text-[11px] font-semibold text-[#556B5D] space-y-1 text-left">
                <div className="flex justify-between items-center">
                  <span className="bg-[#0F340F]/5 text-[#0F340F] px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                    {log.category}
                  </span>
                  <span className="text-[9px] text-[#556B5D]/60 font-bold">{log.timestamp}</span>
                </div>
                <p className="text-[#0F340F] leading-relaxed mt-0.5">{log.event}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
