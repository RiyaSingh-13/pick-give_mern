// frontend/src/components/Member/MemberSettingsProfile.jsx
import React from 'react';
import { Gift, Truck, Award, Building, Users } from 'lucide-react';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';

export function MemberSettingsProfile({
  dashboardTab,
  currentMember
}) {
  const achievements = [
    {
      title: "Generosity Pioneer",
      description: "Completed over 10 verified donations of premium quality items.",
      icon: Gift,
      unlocked: true
    },
    {
      title: "Miles of Smile",
      description: "Traveled over 50 km for local courier volunteer runs.",
      icon: Truck,
      unlocked: true
    },
    {
      title: "First Responder",
      description: "Accepted and delivered an urgent pickup request in under 3 hours.",
      icon: Award,
      unlocked: true
    },
    {
      title: "Direct Impact",
      description: "Support 5 distinct local partner NGOs. (Progress: 4/5)",
      icon: Building,
      unlocked: false
    },
    {
      title: "Community Hub",
      description: "Connect 3 new active neighbors to Pick&Give platform.",
      icon: Users,
      unlocked: false
    }
  ];

  if (dashboardTab === 'achievements') {
    return (
      <div className="space-y-6 animate-fade-in text-left font-sans">
        <SectionHeader title="PLATFORM ACHIEVEMENTS" icon="⭐" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            if (ach.unlocked) {
              return (
                <Card 
                  key={idx} 
                  className="bg-[#78A642]/5 border-[#78A642]/20 p-6 flex flex-col items-center text-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#78A642] text-white font-bold flex items-center justify-center text-xs rounded-bl-xl shadow-sm">
                    ✔
                  </div>
                  <div className="w-14 h-14 bg-[#78A642]/10 rounded-full flex items-center justify-center text-[#78A642] mb-2 border border-[#78A642]/20">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#0F340F]">{ach.title}</h4>
                  <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">{ach.description}</p>
                </Card>
              );
            }
            return (
              <Card 
                key={idx} 
                className="p-6 flex flex-col items-center text-center gap-3 opacity-60"
              >
                <div className="w-14 h-14 bg-[#0F340F]/5 rounded-full flex items-center justify-center text-[#576F5E] mb-2">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F340F]">{ach.title}</h4>
                <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">{ach.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (dashboardTab === 'profile') {
    return (
      <div className="space-y-6 animate-fade-in text-left font-sans">
        <SectionHeader title="MEMBER PROFILE" icon="👤" />
        
        <Card className="p-6 max-w-xl">
          <div className="flex items-center gap-4 pb-6 border-b border-[#0F340F]/5">
            <div className="w-16 h-16 rounded-full bg-[#0F340F] text-white flex items-center justify-center text-xl font-bold font-serif">
              {currentMember.initials}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0F340F]">{currentMember.fullName}</h3>
              <p className="text-xs text-[#576F5E] font-semibold">Active Member since May 2026</p>
              <p className="text-[10px] text-[#78A642] font-extrabold mt-1">Verified Donor & Courier Driver</p>
            </div>
          </div>

          <div className="py-6 space-y-4 text-xs font-semibold text-[#576F5E]">
            <div className="flex justify-between">
              <span>Full Name:</span>
              <span className="text-[#0F340F] font-bold">{currentMember.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span>Registered Email:</span>
              <span className="text-[#0F340F] font-bold">{currentMember.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number:</span>
              <span className="text-[#0F340F] font-bold">{currentMember.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Pickup City:</span>
              <span className="text-[#0F340F] font-bold">{currentMember.location}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (dashboardTab === 'settings') {
    return (
      <div className="space-y-6 animate-fade-in text-left font-sans">
        <SectionHeader title="ACCOUNT SETTINGS" icon="⚙️" />
        
        <Card className="p-6 max-w-xl text-xs font-semibold text-[#576F5E] space-y-5">
          <div className="flex items-center justify-between border-b border-[#0F340F]/5 pb-4">
            <div>
              <h4 className="font-bold text-[#0F340F] text-sm">Notifications Status</h4>
              <p className="text-[10px] mt-0.5">Toggle alert logs and mobile coordinations.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-[#78A642]" />
          </div>

          <div className="flex items-center justify-between border-b border-[#0F340F]/5 pb-4">
            <div>
              <h4 className="font-bold text-[#0F340F] text-sm">Auto-Accept Local Courier Runs</h4>
              <p className="text-[10px] mt-0.5">Allow automatic radius locks for tasks under 1 km.</p>
            </div>
            <input type="checkbox" className="w-4 h-4 cursor-pointer accent-[#78A642]" />
          </div>

          <div className="flex items-center justify-between pb-2">
            <div>
              <h4 className="font-bold text-[#0F340F] text-sm">Visual Accessibility</h4>
              <p className="text-[10px] mt-0.5">Increase general text weight and contrast standards.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-[#78A642]" />
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
