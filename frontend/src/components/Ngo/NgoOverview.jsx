// frontend/src/components/Ngo/NgoOverview.jsx
import React from 'react';
import { ShieldAlert, Package, ArrowRight, Heart, Clipboard, CheckCircle, Truck, Users } from 'lucide-react';
import ngoWelcomeIllustrationImg from '../../assets/ngo_welcome_illustration.png';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

export function NgoOverview({
  currentNgo,
  isApproved,
  ngoStatus,
  activeNgoRecord,
  ngoDonations,
  ngoReceived,
  ngoInDeliveries,
  ngoCompletedDeliveries,
  ngoActiveVolunteers,
  setNgoTab
}) {
  const stats = [
    { value: ngoDonations.length, label: "Pending Donations", sublabel: "Waiting your acceptance", icon: Package },
    { value: ngoReceived.length, label: "Donations Accepted", sublabel: "Accepted by NGO", icon: CheckCircle },
    { value: ngoInDeliveries, label: "In Transit", sublabel: "Currently on the way", icon: Truck },
    { value: ngoCompletedDeliveries, label: "Completed Deliveries", sublabel: "Successfully delivered", icon: CheckCircle },
    { value: ngoActiveVolunteers, label: "Active Volunteers", sublabel: "Helping in deliveries", icon: Users }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left font-sans">
      {/* 1. Welcome Back Banner */}
      <div className="bg-[#F4F7F2] border border-[#0F340F]/8 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm overflow-hidden relative min-h-[160px]">
        <div className="space-y-3 text-left md:max-w-md z-10">
          <h1 className="text-3xl md:text-[38px] font-extrabold font-serif text-[#0F340F] leading-tight">
            Welcome back, {currentNgo.ngoName}! 👋
          </h1>
          <p className="text-xs text-[#556B5D] font-bold mt-1">
            Together, we can create a bigger impact in the community.
          </p>
        </div>
        
        {/* Premium illustration of NGO building blending into the right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] h-full hidden md:block select-none overflow-hidden rounded-r-3xl">
          <img 
            src={ngoWelcomeIllustrationImg} 
            alt="NGO building and landscape illustration" 
            className="h-full w-full object-cover object-center select-none"
          />
        </div>
        
        {/* Mobile-only illustration */}
        <div className="w-full h-32 md:hidden select-none overflow-hidden rounded-2xl">
          <img 
            src={ngoWelcomeIllustrationImg} 
            alt="NGO building and landscape illustration" 
            className="h-full w-full object-cover select-none"
          />
        </div>
      </div>

      {/* Account Status Banner for Pending/Rejected NGOs */}
      {!isApproved && (
        ngoStatus === 'Rejected' ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 text-left animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-500"></div>
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-850 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div className="space-y-1.5 text-left flex-grow">
              <h4 className="font-extrabold text-red-900 text-sm font-serif flex items-center gap-1.5">
                ❌ Account Registration Rejected
              </h4>
              <p className="text-xs text-red-850 font-semibold leading-relaxed">
                Your NGO registration request (Reg No: <span className="font-mono font-bold text-red-900">{activeNgoRecord?.registrationNumber || currentNgo.registrationNumber}</span>) was reviewed and rejected by the administration team.
              </p>
              <p className="text-[11px] text-red-750 font-medium">
                Your actions (posting requirements and accepting offers) remain strictly locked. Please contact our system administrators at <a href="mailto:admin@gmail.com" className="underline font-bold text-red-900">admin@gmail.com</a> to re-verify your documents or appeal this decision.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 text-left animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1.5 text-left flex-grow">
              <h4 className="font-extrabold text-amber-900 text-sm font-serif flex items-center gap-1.5">
                ⚠️ Account Under Review / Awaiting Verification
              </h4>
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                Your NGO credentials and official registration certificate (<span className="font-mono font-bold text-[#0F340F]">{activeNgoRecord?.registrationNumber || currentNgo.registrationNumber}</span>) are currently being reviewed by our administration team. 
              </p>
              <p className="text-[11px] text-amber-700 font-medium">
                To maintain community safety and trust, you will be allowed to **post material requirements** and **accept member donation offers** once your profile status is updated to <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wide">Approved</span> by the platform administrators.
              </p>
            </div>
          </div>
        )
      )}

      {/* 2. Action Cards Grid - Horizontal Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card A: Donation Box */}
        <Card className="flex items-start gap-5 relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 text-[#78A642]/5 pointer-events-none group-hover:scale-110 transition-transform">
            <Heart className="w-full h-full fill-current" />
          </div>
          
          <div className="w-16 h-16 rounded-full bg-[#F4F7F2] flex items-center justify-center text-[#0F340F] border border-[#0F340F]/5 flex-shrink-0">
            <Package className="w-8 h-8" />
          </div>
          
          <div className="space-y-4 flex-grow">
            <div>
              <h3 className="text-lg font-bold text-[#0F340F] font-serif">Donation Box</h3>
              <p className="text-xs font-semibold text-[#556B5D] leading-relaxed mt-1">
                View all donation offers from members and accept what your organization needs.
              </p>
            </div>
            <Button 
              onClick={() => setNgoTab('box')}
              variant="primary"
              size="sm"
            >
              Go to Donation Box <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Card B: Post Request */}
        <Card className="flex items-start gap-5 relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 text-[#78A642]/5 pointer-events-none group-hover:scale-110 transition-transform">
            <Heart className="w-full h-full fill-current" />
          </div>
          
          <div className="w-16 h-16 rounded-full bg-[#F4F7F2] flex items-center justify-center text-[#0F340F] border border-[#0F340F]/5 flex-shrink-0">
            <Clipboard className="w-8 h-8" />
          </div>
          
          <div className="space-y-4 flex-grow">
            <div>
              <h3 className="text-lg font-bold text-[#0F340F] font-serif">Post Request</h3>
              <p className="text-xs font-semibold text-[#556B5D] leading-relaxed mt-1">
                Post your requirements and let members know how they can help your organization.
              </p>
            </div>
            <Button 
              onClick={() => setNgoTab('request')}
              variant="primary"
              size="sm"
            >
              Post a Request <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Horizontal 5-Column Impact Stats Bar */}
      <Card className="!p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#0F340F]/5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-4 px-2 py-3 md:py-0 md:justify-center group hover:scale-[1.02] transition-all first:pt-0">
                <div className="w-12 h-12 rounded-full border-2 border-[#78A642]/30 flex items-center justify-center text-[#78A642] bg-[#F8FAF5] flex-shrink-0 group-hover:bg-[#78A642]/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-2xl font-black text-[#0F340F] font-sans block">{stat.value}</span>
                  <span className="text-[10px] font-bold text-[#0F340F] block">{stat.label}</span>
                  <span className="text-[9px] text-[#556B5D] font-semibold block mt-0.5">{stat.sublabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Beautiful Centered Social Impact Quote */}
      <div className="py-8 text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[#78A642] text-xl font-bold font-serif">“</span>
        <p className="text-xs font-serif italic font-bold text-[#556B5D] leading-relaxed">
          To be hopeful in bad times is not just foolishly romantic. It is based on the fact that human history is a history not only of cruelty, but also of compassion, sacrifice, courage, kindness. What we choose to emphasize in this complex history will determine our lives.
        </p>
        <h5 className="text-[10px] font-extrabold tracking-wider uppercase text-[#0F340F] mt-2">
          — Howard Zinn, Social Historian
        </h5>
      </div>
    </div>
  );
}
