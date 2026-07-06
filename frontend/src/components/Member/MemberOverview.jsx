import React from 'react';
import { Gift, Truck, ArrowRight, Heart, Users } from 'lucide-react';
import dashboardIllustrationImg from '../../assets/dashboard_illustration.png';

export function MemberOverview({ currentMember, setDashboardTab }) {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* 1. Welcome Back Banner */}
      <div className="bg-[#F4F7F2] border border-[#0F340F]/8 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm overflow-hidden relative">
        <div className="space-y-2 md:max-w-xl text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#0F340F] leading-tight">
            Welcome back, {currentMember.fullName.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-[#556B5D] font-bold mt-1">
            Together we can make a difference. Choose an action below to get started.
          </p>
        </div>
        <div className="w-full md:w-auto h-28 md:h-32 flex items-center justify-center">
          <img 
            src={dashboardIllustrationImg} 
            alt="Pick&Give clean member dashboard workflow illustration" 
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* 2. Action Cards Curved Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card A: Create Donation */}
        <div className="bg-white border border-[#0F340F]/8 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative">
          <div className="h-28 bg-[#0F340F] w-full rounded-b-[2.5rem]"></div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-md select-none">
            <div className="w-14 h-14 bg-white border-2 border-[#78A642] rounded-full flex items-center justify-center text-[#0F340F]">
              <Gift className="w-7 h-7 text-[#78A642]" />
            </div>
          </div>

          <div className="pt-10 pb-8 px-6 flex flex-col items-center text-center space-y-4">
            <h3 className="text-xl font-extrabold text-[#0F340F] font-serif">Create Donation</h3>
            <p className="text-xs text-[#556B5D] font-bold max-w-xs leading-relaxed">
              Donate items you no longer need and help someone in need.
            </p>
            <button 
              onClick={() => setDashboardTab('donate')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F340F] hover:bg-[#15271D] text-white font-bold text-xs rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Create Donation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card B: Claim Delivery */}
        <div className="bg-white border border-[#0F340F]/8 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative">
          <div className="h-28 bg-[#0F340F] w-full rounded-b-[2.5rem]"></div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-md select-none">
            <div className="w-14 h-14 bg-white border-2 border-[#78A642] rounded-full flex items-center justify-center text-[#0F340F]">
              <Truck className="w-7 h-7 text-[#78A642]" />
            </div>
          </div>

          <div className="pt-10 pb-8 px-6 flex flex-col items-center text-center space-y-4">
            <h3 className="text-xl font-extrabold text-[#0F340F] font-serif">Claim Delivery</h3>
            <p className="text-xs text-[#556B5D] font-bold max-w-xs leading-relaxed">
              Help deliver donations and be the bridge that connects.
            </p>
            <button 
              onClick={() => setDashboardTab('tasks')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F340F] hover:bg-[#15271D] text-white font-bold text-xs rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Claim Delivery <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Your Impact So Far Summary Bar */}
      <div className="bg-white border border-[#0F340F]/8 rounded-2xl shadow-sm p-6 text-left">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="pb-2 border-b-2 border-[#0F340F] self-start select-none">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#0F340F]">Your Impact So Far</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-12 w-full lg:w-auto items-center lg:justify-end text-xs font-semibold text-[#556B5D]">
            {/* Donations */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-red-600" />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#0F340F] block leading-none">12</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 block">Donations</span>
              </div>
            </div>

            {/* Deliveries */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#0F340F] block leading-none">5</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 block">Deliveries</span>
              </div>
            </div>

            {/* NGOs Helped */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#0F340F] block leading-none">8</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 block">NGOs Helped</span>
              </div>
            </div>

            {/* Lives Impacted */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#78A642]/10 text-[#78A642] flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-[#0F340F] block leading-none">35</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 block">Lives Impacted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Howard Zinn Quote Banner */}
      <div className="bg-[#F0F4EC] border border-[#0F340F]/5 rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden text-left">
        <div className="flex items-start gap-4 relative z-10 max-w-xl">
          <span className="text-4xl md:text-5xl text-[#78A642] font-serif leading-none select-none">“</span>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-[#0F340F] font-bold leading-relaxed">
              Small acts, when multiplied by millions of people, can transform the world.
            </p>
            <p className="text-[10px] md:text-xs text-[#556B5D] font-bold">
              — Howard Zinn
            </p>
          </div>
        </div>
        
        <div className="absolute right-6 bottom-0 top-0 w-24 opacity-20 pointer-events-none select-none flex items-end justify-end">
          <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100" className="text-[#78A642]">
            <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
