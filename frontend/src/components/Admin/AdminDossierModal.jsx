// frontend/src/components/Admin/AdminDossierModal.jsx
import React from 'react';
import { Modal } from '../UI/Modal';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';

export function AdminDossierModal({
  selectedDossier,
  setSelectedDossier,
  donations,
  ngoRequests,
  handleApproveNgo,
  handleRejectNgo,
  handleDeleteUser
}) {
  if (!selectedDossier) return null;
  const { type, data } = selectedDossier;
  const onClose = () => setSelectedDossier(null);

  // Calculate dynamic stats
  let totalDonations = 0;
  let totalRequests = 0;
  let totalDeliveries = 0;

  if (type === 'Member') {
    totalDonations = donations.filter(d => d.donorEmail === data.email).length;
    totalDeliveries = donations.filter(d => d.courier && d.courier.startsWith(data.fullName)).length;
  } else {
    totalRequests = ngoRequests.filter(r => r.ngo === data.ngoName).length;
    totalDonations = donations.filter(d => d.ngo === data.ngoName && d.status === 'Delivered').length;
  }

  return (
    <Modal
      isOpen={!!selectedDossier}
      onClose={onClose}
      maxWidth="max-w-2xl"
      showLeaves={false}
    >
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0F340F]/10 pb-4 mb-6 gap-3 text-left">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#78A642] bg-[#F8FAF5] border border-[#78A642]/10 px-2.5 py-0.5 rounded-full">
            🔍 {type} Dossier Details
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#0F340F] font-serif mt-2">
            {type === 'Member' ? data.fullName : data.ngoName}
          </h2>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge status={data.status || 'Pending'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
        
        {/* Left side: Detailed Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5 font-sans">
            <span>📋</span> Contact & Registry Profiles
          </h3>
          
          <div className="space-y-3.5 text-xs font-semibold text-[#556B5D]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📧 Email Address</span>
              <span className="text-[#0F340F] text-sm break-all font-mono font-bold">
                {type === 'Member' ? data.email : data.officialEmail}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📞 Contact Number</span>
              <span className="text-[#0F340F] text-sm font-mono font-bold">{data.phone}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📍 Address / Location</span>
              <span className="text-[#0F340F] text-sm leading-relaxed">
                {type === 'Member' ? data.location : data.address}
              </span>
            </div>

            {type === 'NGO' && (
              <div>
                <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📄 Govt Registration Number</span>
                <span className="text-[#0F340F] font-mono font-bold text-sm bg-cream px-1.5 py-0.5 rounded border border-[#0F340F]/5">
                  {data.registrationNumber}
                </span>
              </div>
            )}

            <div>
              <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📅 Joined System Date</span>
              <span className="text-[#0F340F] font-serif font-bold">{data.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Right side: Mission or Calculated Metrics */}
        <div className="space-y-6">
          
          {/* Calculated Stats Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5 font-sans">
              <span>📊</span> Impact Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              {type === 'Member' ? (
                <>
                  <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                    <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Donations</span>
                    <span className="text-xl font-black text-[#0F340F] block mt-1">{totalDonations} booked</span>
                  </div>
                  <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                    <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Deliveries</span>
                    <span className="text-xl font-black text-[#0F340F] block mt-1">{totalDeliveries} runs</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                    <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Requests Posted</span>
                    <span className="text-xl font-black text-[#0F340F] block mt-1">{totalRequests} posted</span>
                  </div>
                  <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                    <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Donations Fulfilled</span>
                    <span className="text-xl font-black text-[#0F340F] block mt-1">{totalDonations} received</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mission / Description or Certificate */}
          {type === 'NGO' ? (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5 font-sans">
                <span>🏢</span> NGO Profile Mission
              </h3>
              <div className="bg-cream/40 border border-[#0F340F]/5 p-3.5 rounded-xl text-xs font-semibold text-[#556B5D] leading-relaxed italic max-h-[140px] overflow-y-auto">
                "{data.description}"
              </div>

              {/* Mock Certificate Card */}
              <div className="bg-gradient-to-br from-[#0F340F]/5 to-[#78A642]/5 border border-[#0F340F]/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#0F340F]/10 flex items-center justify-center text-red-600 font-extrabold flex-shrink-0">
                  PDF
                </div>
                <div className="text-left flex-grow">
                  <span className="text-[10px] font-black uppercase text-[#556B5D] block">Verification Certificate</span>
                  <span className="text-xs font-bold text-[#0F340F] block underline truncate cursor-pointer hover:text-[#78A642]">
                    {data.certificate || 'ngo_registration.pdf'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5 font-sans">
                <span>👑</span> Member Account Role
              </h3>
              <div className="bg-cream/40 border border-[#0F340F]/5 p-4 rounded-xl text-xs font-semibold text-[#556B5D] leading-relaxed space-y-1">
                <p>🧑‍💼 <span className="font-extrabold text-[#0F340F]">System Role:</span> {data.role}</p>
                <p className="text-[11px] text-[#556B5D]/80 leading-normal mt-1">
                  This member is actively registered as a {data.role === 'Member' ? 'Donor / Courier' : 'System Operator'} and maintains full access to schedule donations, request receipts, and claim logistics runs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Drawer Actions Footer */}
      <div className="border-t border-[#0F340F]/10 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {type === 'NGO' ? (
          <>
            <div className="flex gap-2">
              {data.status !== 'Approved' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApproveNgo(data._id || data.id);
                    onClose();
                  }}
                >
                  ✔️ Approve NGO
                </Button>
              )}
              {data.status !== 'Rejected' && (
                <Button
                  variant="dangerOutline"
                  className="px-4 py-2.5 text-xs font-black rounded-xl"
                  onClick={() => {
                    handleRejectNgo(data._id || data.id);
                    onClose();
                  }}
                >
                  ❌ Reject NGO
                </Button>
              )}
            </div>
            
            <button
              onClick={() => {
                if (window.confirm(`Are you absolutely sure you want to permanently delete NGO "${data.ngoName}" from the registry?`)) {
                  handleDeleteUser(data._id || data.id);
                  onClose();
                }
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer self-end sm:self-center"
            >
              🗑️ Delete Account
            </button>
          </>
        ) : (
          <>
            <div>
              <span className="text-[10px] font-bold text-[#556B5D]/60 block">MEMBER ACCOUNT ACTIONS</span>
              <span className="text-xs font-semibold text-emerald-600 block mt-0.5">● Profile Active & Verified</span>
            </div>
            <Button
              variant="dangerOutline"
              className="px-4 py-2.5 text-xs font-black rounded-xl"
              onClick={() => {
                if (window.confirm(`Are you absolutely sure you want to permanently delete Member "${data.fullName}" from the registry?`)) {
                  handleDeleteUser(data._id || data.id);
                  onClose();
                }
              }}
            >
              🗑️ Delete Account
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
