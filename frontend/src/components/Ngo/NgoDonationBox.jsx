import React from 'react';
import { Package, User, MapPin } from 'lucide-react';

export function NgoDonationBox({
  ngoDonations,
  isApproved,
  ngoStatus,
  handleAcceptDonation
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">📦 DONATION BOX</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Review donation offers submitted by Pick&Give members and accept them for your organization.</p>
        </div>
        <span className="bg-[#78A642]/10 text-[#78A642] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#78A642]/20 select-none">
          {ngoDonations.length} Pending Offers
        </span>
      </div>

      {ngoDonations.length === 0 ? (
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 bg-[#F8FAF5] rounded-full flex items-center justify-center mx-auto text-[#78A642]">
            <Package className="w-8 h-8" />
          </div>
          <h4 className="font-extrabold text-[#0F340F] text-base font-serif">Donation Box Empty</h4>
          <p className="text-xs text-[#556B5D] max-w-sm mx-auto leading-relaxed">No new donation offers have been posted. Check back later when members submit new donations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngoDonations.map((offer) => (
            <div key={offer._id || offer.id} className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#F8FAF5] text-[#0F340F] border border-[#0F340F]/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {offer.category}
                  </span>
                  <span className="text-[10px] font-bold text-[#556B5D]">
                    {offer.date}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-[#0F340F] leading-tight font-serif">{offer.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#556B5D] mt-1.5">
                    <User className="w-3.5 h-3.5" /> Offered by {offer.donor}
                  </div>
                  <div className="flex items-start gap-1 text-[11px] font-bold text-[#556B5D] mt-1">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {offer.location}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0F340F]/5 flex gap-2">
                {isApproved ? (
                  <button
                    onClick={() => handleAcceptDonation(offer._id || offer.id)}
                    className="flex-grow inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold text-white bg-[#0F340F] hover:bg-[#1C4A1C] rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    ✔️ Accept Offer
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-grow inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg shadow-none cursor-not-allowed select-none"
                    title={ngoStatus === 'Rejected' ? "Account verification rejected. Only approved NGOs can accept donation offers." : "Account verification pending. Only approved NGOs can accept donation offers."}
                  >
                    {ngoStatus === 'Rejected' ? "🔒 Account Locked" : "🔒 Awaiting Approval"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
