import React from 'react';
import { User, MapPinned } from 'lucide-react';

export function NgoLogisticsTracking({
  ngoDeliveries
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">🚚 ACTIVE COURIER & DELIVERIES</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Monitor volunteers transporting donation packages from donor doorstep to your facility.</p>
        </div>
        <span className="bg-[#78A642]/10 text-[#78A642] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#78A642]/20 select-none">
          {ngoDeliveries.length} Active Runs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ngoDeliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border select-none ${
                delivery.status === 'Successfully delivered' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
              }`}>
                {delivery.status}
              </span>
              <span className="text-[10px] font-bold text-[#556B5D]">
                ID: #{delivery.id}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#0F340F] font-serif">{delivery.item}</h4>
              <div className="text-xs font-semibold text-[#556B5D] mt-2 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#78A642]" /> <span className="font-bold text-[#0F340F]">Courier:</span> {delivery.courier}
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPinned className="w-4 h-4 text-[#78A642] mt-0.5" /> <span className="font-bold text-[#0F340F] flex-shrink-0">Pipeline:</span> <span className="leading-normal">{delivery.route}</span>
                </div>
              </div>
            </div>

            {delivery.status === 'On the way' && (
              <div className="bg-[#F8FAF5] p-3 rounded-xl border border-[#0F340F]/5 flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#556B5D] flex items-center gap-1">
                  📍 Live Courier Tracking Locked
                </span>
                <span className="text-[#78A642] font-black uppercase">Active (GPS verified)</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
