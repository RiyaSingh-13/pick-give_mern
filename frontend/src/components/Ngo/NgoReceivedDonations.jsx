import React from 'react';
import { CheckCircle } from 'lucide-react';

export function NgoReceivedDonations({
  ngoReceived
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">🤝 DONATIONS RECEIVED</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Track the status of the donations that your organization has accepted.</p>
        </div>
        <span className="bg-[#0F340F]/5 text-[#0F340F] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#0F340F]/10 select-none">
          {ngoReceived.length} Total Accepted
        </span>
      </div>

      {ngoReceived.length === 0 ? (
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 bg-[#F8FAF5] rounded-full flex items-center justify-center mx-auto text-[#78A642]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="font-extrabold text-[#0F340F] text-base font-serif">No Received Donations Yet</h4>
          <p className="text-xs text-[#556B5D] max-w-sm mx-auto leading-relaxed">You haven't accepted any donation offers. Go to the "Donation Box" tab to review and accept offers!</p>
        </div>
      ) : (
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-[#556B5D] divide-y divide-[#0F340F]/5">
              <thead className="bg-[#F8FAF5] text-[#0F340F] text-[10px] font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Donor Details</th>
                  <th className="px-6 py-4">Courier Partner</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Accepted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F340F]/5">
                {ngoReceived.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#F8FAF5] text-[#0F340F] border border-[#0F340F]/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {item.donor}
                    </td>
                    <td className="px-6 py-4">
                      {item.deliveryMode === 'Self' ? (
                        <span className="text-[#78A642] font-bold flex items-center gap-1">
                          🙋‍♂️ Self Delivery (Donor)
                        </span>
                      ) : item.courier === 'None (Awaiting Courier)' ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          ⏳ Awaiting Courier
                        </span>
                      ) : (
                        <span className="text-[#78A642] font-bold flex items-center gap-1">
                          🚚 {item.courier}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        item.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-[#78A642]/10 text-[#0F340F] border border-[#0F340F]/10'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
