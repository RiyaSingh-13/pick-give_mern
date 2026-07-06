import React from 'react';
import { Search, Trash2 } from 'lucide-react';

export function AdminNgosList({
  adminNgos,
  adminSearchQuery,
  setAdminSearchQuery,
  setSelectedDossier,
  handleApproveNgo,
  handleRejectNgo,
  handleDeleteUser
}) {
  const filteredNgos = adminNgos.filter(ngo => 
    ngo.ngoName.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    ngo.officialEmail.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    ngo.registrationNumber.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#0F340F]/10 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">🏢 REGISTERED NGOs</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Review official registrations, verification metrics, and system profiles.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search NGO name, email..."
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            className="bg-white border border-[#0F340F]/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#78A642] text-[#0F340F] shadow-sm w-64 placeholder-[#556B5D]/40"
          />
          <Search className="w-4 h-4 text-[#556B5D]/40 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white border border-[#0F340F]/8 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-[#556B5D] divide-y divide-[#0F340F]/5">
            <thead className="bg-[#F8FAF5] text-[#0F340F] text-[10px] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">NGO Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Verification ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F340F]/5">
              {filteredNgos.map(ngo => (
                <tr key={ngo._id || ngo.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
                    {ngo.ngoName}
                  </td>
                  <td className="px-6 py-4 font-medium leading-relaxed">
                    <p>📧 {ngo.officialEmail}</p>
                    <p>📞 {ngo.phone}</p>
                    <p className="text-[10px] text-[#556B5D]/60 mt-0.5">📍 {ngo.address}</p>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-[#0F340F]">
                    {ngo.registrationNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      ngo.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ngo.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-750 border-amber-200'
                    }`}>
                      {ngo.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {ngo.joinedDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                        className="bg-[#0F340F]/5 hover:bg-[#0F340F]/10 text-[#0F340F] text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-[#0F340F]/10 transition-colors cursor-pointer"
                      >
                        🔍 View Dossier
                      </button>
                      {ngo.status !== 'Approved' && (
                        <button
                          onClick={() => handleApproveNgo(ngo._id || ngo.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl border border-emerald-150 transition-colors cursor-pointer"
                          title="Approve NGO"
                        >
                          ✔️ Approve
                        </button>
                      )}
                      {ngo.status !== 'Rejected' && (
                        <button
                          onClick={() => handleRejectNgo(ngo._id || ngo.id)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl border border-amber-150 transition-colors cursor-pointer"
                          title="Reject NGO"
                        >
                          ❌ Reject
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you absolutely sure you want to permanently delete NGO "${ngo.ngoName}" from the registry?`)) {
                            handleDeleteUser(ngo._id || ngo.id);
                          }
                        }}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
