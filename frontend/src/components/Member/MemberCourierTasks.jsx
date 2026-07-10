// frontend/src/components/Member/MemberCourierTasks.jsx
import React from 'react';
import { MapPin, Building, Package } from 'lucide-react';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

export function MemberCourierTasks({
  radiusFilter,
  setRadiusFilter,
  volunteerTasks,
  claimedTasks,
  handleClaimTask
}) {
  return (
    <div className="space-y-8 animate-fade-in text-left font-sans">
      <SectionHeader
        title="LOGISTICS ACTIVE WORKBOARD"
        subtitle="Claim hyper-local delivery runs near you to support local NGOs."
        icon="🚚"
      >
        <div className="flex items-center gap-2 bg-white border border-[#0F340F]/8 px-3 py-1.5 rounded-xl">
          <span className="text-xs font-bold text-[#576F5E]">Radius Range:</span>
          <select 
            value={radiusFilter} 
            onChange={(e) => setRadiusFilter(e.target.value)}
            className="text-xs font-bold text-[#0F340F] focus:outline-none cursor-pointer bg-transparent"
          >
            <option value="2">Within 2 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
        </div>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {volunteerTasks.filter(t => t.distance <= parseFloat(radiusFilter)).map((task) => {
          const isClaimed = claimedTasks.includes(task.id);
          return (
            <Card 
              key={task.id} 
              className={`!p-0 overflow-hidden ${
                isClaimed ? 'border-[#78A642] ring-1 ring-[#78A642]/20' : 'border-[#0F340F]/8'
              }`}
            >
              <div className="p-5 border-b border-[#0F340F]/5 flex justify-between items-start bg-[#F8FAF5]/30 text-left">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#78A642] px-2.5 py-0.5 bg-[#78A642]/10 rounded-full font-mono">
                    Task #{task.id ? task.id.toString().slice(-6).toUpperCase() : ''}
                  </span>
                  <h4 className="text-base font-extrabold text-[#0F340F] mt-1.5 leading-tight font-serif">{task.title}</h4>
                </div>
                <span className="text-[10px] font-bold text-[#576F5E] bg-[#F8FAF5] border border-[#0F340F]/8 px-2 py-1 rounded-md">
                  {task.distance} km away
                </span>
              </div>

              <div className="p-5 space-y-4 text-left">
                <div className="space-y-2 text-xs text-[#576F5E] font-semibold">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-[#78A642] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#0F340F] block">Pickup Point:</span>
                      <span className="text-[11px] mt-0.5 block">{task.pickup}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Building className="w-4 h-4 text-[#0F340F] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#0F340F] block">NGO Destination:</span>
                      <span className="text-[11px] mt-0.5 block">{task.ngo}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#0F340F]/5">
                    <Package className="w-4 h-4 text-[#78A642] flex-shrink-0" />
                    <span>Weight: {task.weight}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center gap-4">
                  <button 
                    type="button"
                    className="text-xs font-bold text-[#78A642] hover:text-[#638B34] flex items-center gap-1 cursor-pointer font-sans"
                  >
                    👁️ View Donor Photo
                  </button>
                  <Button 
                    onClick={() => handleClaimTask(task.id)}
                    variant={isClaimed ? "dangerOutline" : "primary"}
                    size="sm"
                    className={isClaimed ? "!text-[#C2410C] !border-[#C2410C] hover:!bg-[#C2410C]/5 rounded-full" : "rounded-full"}
                  >
                    {isClaimed ? 'Cancel Delivery Run' : '🚚 ACCEPT DELIVERY RUN'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
