import React from 'react';
import { Bell } from 'lucide-react';

export function MemberUrgentNeeds({
  ngoRequests,
  currentMember,
  setNewBooking,
  setDashboardTab
}) {
  const activeRequests = ngoRequests.filter(r => r.status !== 'Stopped');

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif flex items-center gap-2">
            <span>🚨</span> URGENT NGO REQUIREMENTS
          </h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">
            Local verified organizations have immediate material shortages. Fulfill a request to double your impact today.
          </p>
        </div>
        <span className="bg-red-50 text-red-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-red-200 select-none animate-pulse">
          {activeRequests.length} Emergency Shortages
        </span>
      </div>

      {activeRequests.length === 0 ? (
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <p className="text-xs text-[#556B5D] font-bold py-4 text-center">No active NGO requirements posted at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeRequests.map((req) => {
            const [fulfilledVal, totalVal] = req.fulfilled.split('/').map(Number);
            const percent = Math.min(100, Math.round((fulfilledVal / totalVal) * 100)) || 0;
            return (
              <div key={req._id || req.id} className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#F8FAF5] text-[#0F340F] border border-[#0F340F]/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {req.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        req.urgency === 'High' ? 'bg-red-100 text-red-800 border border-red-200' : req.urgency === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {req.urgency} Urgency
                      </span>
                    </div>
                    <span className="text-[10px] text-[#556B5D] font-bold">
                      {req.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#78A642] uppercase tracking-wider block mb-0.5">
                      🏫 {req.ngo}
                    </span>
                    <h4 className="text-base font-extrabold text-[#0F340F] font-serif leading-tight">
                      {req.title}
                    </h4>
                    <p className="text-xs text-[#556B5D] mt-2 leading-relaxed font-semibold">
                      {req.description || "Looking for generous contributions from members. Dropoff coordinates locked at NGO shelter center."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#0F340F]/5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#556B5D]">Progress:</span>
                      <span className="bg-[#78A642]/10 text-[#78A642] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#78A642]/20">
                        {req.fulfilled} Items
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#556B5D]">
                      {percent}% fulfilled
                    </span>
                  </div>

                  <div className="w-full bg-[#0F340F]/5 rounded-full h-2 overflow-hidden border border-[#0F340F]/5">
                    <div 
                      className="bg-[#78A642] h-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setNewBooking({
                          step: 2,
                          category: req.category,
                          title: `Fulfillment: ${req.title}`,
                          description: `Fulfilling urgent request for ${req.quantity} units of ${req.title} posted by ${req.ngo}.`,
                          photo: null,
                          photoName: '',
                          address: currentMember.location,
                          instructions: '',
                          ngoName: req.ngo
                        });
                        setDashboardTab('donate');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-xs rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      🎁 Fulfill Request
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
