// frontend/src/components/Admin/AdminNgosList.jsx
import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { SectionHeader } from '../UI/SectionHeader';
import { Table } from '../UI/Table';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';

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

  const tableHeaders = [
    { label: 'NGO Name' },
    { label: 'Contact Info' },
    { label: 'Verification ID' },
    { label: 'Status' },
    { label: 'Joined Date' },
    { label: 'Actions', className: 'text-center' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="REGISTERED NGOs"
        subtitle="Review official registrations, verification metrics, and system profiles."
        icon="🏢"
      >
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
      </SectionHeader>

      <Table headers={tableHeaders}>
        {filteredNgos.map(ngo => (
          <tr key={ngo._id || ngo.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
            <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
              {ngo.ngoName}
            </td>
            <td className="px-6 py-4 font-medium leading-relaxed text-xs text-[#556B5D]">
              <p>📧 {ngo.officialEmail}</p>
              <p>📞 {ngo.phone}</p>
              <p className="text-[10px] text-[#556B5D]/60 mt-0.5">📍 {ngo.address}</p>
            </td>
            <td className="px-6 py-4 font-mono font-bold text-[#0F340F] text-xs">
              {ngo.registrationNumber}
            </td>
            <td className="px-6 py-4">
              <Badge status={ngo.status || 'Pending'} />
            </td>
            <td className="px-6 py-4 font-medium text-xs text-[#556B5D]">
              {ngo.joinedDate}
            </td>
            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                  className="border border-[#0F340F]/10 text-[10px] px-2.5 py-1.5 rounded-xl font-bold"
                >
                  🔍 View Dossier
                </Button>
                {ngo.status !== 'Approved' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleApproveNgo(ngo._id || ngo.id)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-150 text-[10px] px-2.5 py-1.5 rounded-xl font-bold"
                    title="Approve NGO"
                  >
                    ✔️ Approve
                  </Button>
                )}
                {ngo.status !== 'Rejected' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRejectNgo(ngo._id || ngo.id)}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-150 text-[10px] px-2.5 py-1.5 rounded-xl font-bold"
                    title="Reject NGO"
                  >
                    ❌ Reject
                  </Button>
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
      </Table>
    </div>
  );
}
