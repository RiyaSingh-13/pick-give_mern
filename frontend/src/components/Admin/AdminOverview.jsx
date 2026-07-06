import React from 'react';
import { Users, Building, Package, Truck } from 'lucide-react';

export function AdminOverview({
  adminUsers,
  adminNgos,
  adminLogs,
  setSelectedDossier,
  handleApproveNgo,
  handleRejectNgo
}) {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#0F340F] block">{adminUsers.length}</span>
            <span className="text-xs font-bold text-[#556B5D]">Total Members</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#0F340F] block">{adminNgos.length}</span>
            <span className="text-xs font-bold text-[#556B5D]">Registered NGOs</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#0F340F] block">12,580</span>
            <span className="text-xs font-bold text-[#556B5D]">Donations Transacted</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#0F340F] block">324</span>
            <span className="text-xs font-bold text-[#556B5D]">Active Couriers</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Pending NGO Document Approvals */}
        <div className="lg:col-span-7 bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3 flex items-center justify-between">
            <span>⏳ Pending NGO Approvals</span>
            <span className="bg-[#78A642]/10 text-[#78A642] border border-[#78A642]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              {adminNgos.filter(n => n.status === 'Pending').length} Action Required
            </span>
          </h3>

          {adminNgos.filter(n => n.status === 'Pending').length === 0 ? (
            <div className="py-8 text-center text-[#556B5D] text-xs font-semibold">
              🎉 All submitted NGO registrations are reviewed and verified!
            </div>
          ) : (
            <div className="divide-y divide-[#0F340F]/5">
              {adminNgos.filter(n => n.status === 'Pending').map(ngo => (
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
                    <button
                      onClick={() => handleApproveNgo(ngo._id || ngo.id)}
                      className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      ✔️ Approve
                    </button>
                    <button
                      onClick={() => handleRejectNgo(ngo._id || ngo.id)}
                      className="border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Recent Activity Stream */}
        <div className="lg:col-span-5 bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm space-y-4">
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
        </div>
      </div>
    </div>
  );
}
