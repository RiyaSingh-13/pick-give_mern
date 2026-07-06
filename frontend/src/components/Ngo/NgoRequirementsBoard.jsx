import React from 'react';
import { CheckCircle } from 'lucide-react';

export function NgoRequirementsBoard({
  myRequests,
  requestForm,
  setRequestForm,
  requestPostedSuccess,
  validationError,
  isApproved,
  ngoStatus,
  handlePostRequest,
  handleStopRequest
}) {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">📋 MY REQUESTS</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Post material needs for your shelter or program and track responses from members.</p>
        </div>
        <span className="bg-[#78A642]/10 text-[#78A642] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#78A642]/20 select-none">
          {myRequests.length} Active Requests
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Post a New Request Form */}
        <div className="lg:col-span-5 bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
          <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3">Post a New Request</h3>
          
          {requestPostedSuccess && (
            <div className="bg-[#F8FAF5] border border-[#78A642]/30 text-[#0F340F] p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-[#78A642] flex-shrink-0" />
              Request posted successfully! Members will be notified.
            </div>
          )}

          <form onSubmit={isApproved ? handlePostRequest : (e) => e.preventDefault()} className="space-y-4 text-xs font-semibold text-[#0F340F]">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#556B5D]">Item Category</label>
              <select
                required
                disabled={!isApproved}
                value={requestForm.category}
                onChange={(e) => setRequestForm({...requestForm, category: e.target.value})}
                className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#78A642] transition-colors ${
                  isApproved ? 'bg-[#F8FAF5] border-[#0F340F]/10 text-[#0F340F]' : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <option value="">Select Category</option>
                <option value="Food">Food / Rations</option>
                <option value="Clothes">Winter Clothes / Woolens</option>
                <option value="Books">Educational Materials</option>
                <option value="Medical">Hygiene / Medical kits</option>
                <option value="Toys">Recreational / Toys</option>
                <option value="Electronics">Household Electronics</option>
                <option value="Furniture">Furniture / Housewares</option>
                <option value="Others">Others / Custom Items</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#556B5D]">Item Name / Title</label>
              <input
                type="text"
                required
                disabled={!isApproved}
                placeholder={isApproved ? "e.g. 50 Packets of Basmati Rice" : "Locked: Awaiting Verification"}
                value={requestForm.title}
                onChange={(e) => setRequestForm({...requestForm, title: e.target.value})}
                className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#78A642] transition-colors ${
                  isApproved ? 'bg-[#F8FAF5] border-[#0F340F]/10 text-[#0F340F] placeholder-[#556B5D]/40' : 'bg-slate-50 border-slate-200 text-slate-400 placeholder-slate-300 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#556B5D]">Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  required
                  disabled={!isApproved}
                  placeholder={isApproved ? "e.g. 50" : "Locked"}
                  value={requestForm.quantity}
                  onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                  className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#78A642] transition-colors ${
                    isApproved ? 'bg-[#F8FAF5] border-[#0F340F]/10 text-[#0F340F] placeholder-[#556B5D]/40' : 'bg-slate-50 border-slate-200 text-slate-400 placeholder-slate-300 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#556B5D]">Urgency Level</label>
                <select
                  required
                  disabled={!isApproved}
                  value={requestForm.urgency}
                  onChange={(e) => setRequestForm({...requestForm, urgency: e.target.value})}
                  className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#78A642] transition-colors ${
                    isApproved ? 'bg-[#F8FAF5] border-[#0F340F]/10 text-[#0F340F]' : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">🔥 High</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#556B5D]">Brief Description / Instructions</label>
              <textarea
                rows="3"
                disabled={!isApproved}
                placeholder={isApproved ? "Detail why this is needed, size/type requirements, drop-off location guidelines etc." : "Locked: Awaiting Verification"}
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                className={`w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#78A642] transition-colors resize-none ${
                  isApproved ? 'bg-[#F8FAF5] border-[#0F340F]/10 text-[#0F340F] placeholder-[#556B5D]/40' : 'bg-slate-50 border-slate-200 text-slate-400 placeholder-slate-300 cursor-not-allowed'
                }`}
              ></textarea>
            </div>

            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in text-left">
                ⚠️ {validationError}
              </div>
            )}

            {isApproved ? (
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-white bg-[#0F340F] hover:bg-[#1C4A1C] rounded-xl shadow-md transition-all cursor-pointer animate-fade-in"
              >
                🚀 Post Request to Feed
              </button>
            ) : (
              <div className="space-y-2 pt-1 animate-fade-in">
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-xl shadow-none cursor-not-allowed select-none"
                >
                  🔒 Awaiting Account Verification
                </button>
                <p className="text-[10px] text-amber-600 font-bold text-center leading-normal">
                  ⚠️ Only verified NGOs can post requirements on the public community feed.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Posted Requests List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3">Active NGO Requirements</h3>
          
          {myRequests.length === 0 ? (
            <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-12 text-center space-y-2 shadow-sm">
              <p className="text-xs text-[#556B5D] font-bold">No active requests posted by your organization.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => {
                const [fulfilledVal, totalVal] = req.fulfilled.split('/').map(Number);
                const isFulfilled = fulfilledVal >= totalVal;
                const isStopped = req.status === 'Stopped';
                return (
                  <div key={req._id || req.id} className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 ${isStopped ? 'border-slate-200 bg-slate-50/40 opacity-75' : 'border-[#0F340F]/8'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#F8FAF5] text-[#0F340F] border border-[#0F340F]/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {req.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          req.urgency === 'High' ? 'bg-red-100 text-red-800' : req.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {req.urgency} Urgency
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border select-none ${
                          isStopped 
                            ? 'bg-slate-100 text-slate-600 border-slate-200' 
                            : isFulfilled 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                              : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {isStopped ? '🛑 Stopped' : isFulfilled ? '🎉 Fulfilled' : '🟢 Active'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#556B5D] font-bold">
                        Posted: {req.date}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#0F340F] font-serif">{req.title}</h4>
                      <p className="text-xs text-[#556B5D] mt-1.5 leading-relaxed font-semibold">
                        {req.description || "Looking for generous contributions from members. Dropoff coordinates locked at standard Hope Shelter center."}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#0F340F]/5 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#556B5D]">Contribution progress:</span>
                        <span className="bg-[#78A642]/10 text-[#78A642] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#78A642]/20">
                          {req.fulfilled} Items
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-[#F8FAF5] rounded-full h-2 overflow-hidden border border-[#0F340F]/5">
                          <div 
                            className="bg-[#78A642] h-full transition-all duration-500" 
                            style={{ width: `${Math.min(100, Math.round((fulfilledVal / totalVal) * 100))}%` }}
                          ></div>
                        </div>

                        {!isStopped && (
                          <button
                            onClick={() => handleStopRequest(req._id || req.id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer font-sans uppercase"
                          >
                            🛑 Stop Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
