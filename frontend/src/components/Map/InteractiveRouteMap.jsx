// frontend/src/components/Map/InteractiveRouteMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { getBaseCoords } from '../../utils/geo';

// ============================================================================
// PREMIUM INTERACTIVE ROUTE MAP COMPONENT
// Renders a high-fidelity vector city map with stylized streets, a crawling dashed
// route line, pulsing pickup/dropoff anchors, and a moving volunteer courier truck.
// ============================================================================
export function InteractiveRouteMap({ pickupAddress, dropoffAddress, dropoffNgo, status, courierName }) {
  // Check the progress based on status and courierName:
  // - If 'Delivered': 100% complete.
  // - If 'In Transit': truck crawling along route (50% midpoint).
  // - If Claimed but Awaiting Pickup: truck sits near the pickup coordinate (20% progress).
  // - Otherwise: pending courier selection.

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [hasLeaflet, setHasLeaflet] = useState(!!window.L);

  useEffect(() => {
    // Check periodically for Leaflet loading if it wasn't ready immediately
    if (!hasLeaflet) {
      const interval = setInterval(() => {
        if (window.L) {
          setHasLeaflet(true);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [hasLeaflet]);

  useEffect(() => {
    if (!hasLeaflet || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      // Helper to hash string to stable demo coordinate
      const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
      };

      // Parse coordinates from pickupAddress if they exist
      let pickupCoords = null;
      if (pickupAddress && typeof pickupAddress === 'string') {
        const match = pickupAddress.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (match) {
          pickupCoords = [parseFloat(match[1]), parseFloat(match[2])];
        }
      }
      if (!pickupCoords) {
        const base = getBaseCoords(pickupAddress);
        const pHash = hashCode(pickupAddress || '');
        pickupCoords = [
          base[0] + ((pHash % 100) / 1000) * 0.1,
          base[1] + (((pHash >> 8) % 100) / 1000) * 0.1
        ];
      }

      // Parse coordinates from dropoffAddress if they exist
      let dropoffCoords = null;
      if (dropoffAddress && typeof dropoffAddress === 'string') {
        const match = dropoffAddress.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (match) {
          dropoffCoords = [parseFloat(match[1]), parseFloat(match[2])];
        }
      }
      if (!dropoffCoords) {
        const base = getBaseCoords(dropoffAddress || dropoffNgo);
        const dHash = hashCode(dropoffAddress || dropoffNgo || '');
        dropoffCoords = [
          base[0] + ((dHash % 100) / 1000) * 0.1,
          base[1] + (((dHash >> 8) % 100) / 1000) * 0.1
        ];
      }

      console.log("InteractiveRouteMap resolution:", {
        pickupAddress,
        pickupCoords,
        dropoffAddress,
        dropoffNgo,
        dropoffCoords
      });

      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(pickupCoords, 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Custom div icons using premium white-circle pin layout with pointers
      const homeIcon = window.L.divIcon({
        html: `
          <div class="flex flex-col items-center justify-center" style="display: flex !important; flex-direction: column !important; align-items: center !important;">
            <div class="w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110" style="width: 40px !important; height: 40px !important; border-radius: 50% !important; background: white !important; border: 2px solid #EF4444 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 6px rgba(0,0,0,0.15) !important;">
              <span style="font-size: 20px;">🏠</span>
            </div>
            <div class="w-2.5 h-2.5 bg-red-500 transform rotate-45 -mt-1.5 shadow-sm" style="width: 10px !important; height: 10px !important; background: #EF4444 !important; transform: rotate(45deg) !important; margin-top: -6px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;"></div>
          </div>
        `,
        className: 'custom-map-icon',
        iconSize: [40, 48],
        iconAnchor: [20, 48]
      });

      const ngoIcon = window.L.divIcon({
        html: `
          <div class="flex flex-col items-center justify-center" style="display: flex !important; flex-direction: column !important; align-items: center !important;">
            <div class="w-10 h-10 bg-white border-2 border-[#78A642] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110" style="width: 40px !important; height: 40px !important; border-radius: 50% !important; background: white !important; border: 2px solid #78A642 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 6px rgba(0,0,0,0.15) !important;">
              <span style="font-size: 20px;">🏫</span>
            </div>
            <div class="w-2.5 h-2.5 bg-[#78A642] transform rotate-45 -mt-1.5 shadow-sm" style="width: 10px !important; height: 10px !important; background: #78A642 !important; transform: rotate(45deg) !important; margin-top: -6px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;"></div>
          </div>
        `,
        className: 'custom-map-icon',
        iconSize: [40, 48],
        iconAnchor: [20, 48]
      });

      const truckIcon = window.L.divIcon({
        html: `
          <div class="flex flex-col items-center justify-center" style="display: flex !important; flex-direction: column !important; align-items: center !important; animation: bounce 1.2s infinite alternate !important;">
            <div class="w-11 h-11 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110" style="width: 44px !important; height: 44px !important; border-radius: 50% !important; background: white !important; border: 2px solid #3B82F6 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 6px rgba(0,0,0,0.15) !important;">
              <span style="font-size: 22px;">🚚</span>
            </div>
            <div class="w-2.5 h-2.5 bg-blue-500 transform rotate-45 -mt-1.5 shadow-sm" style="width: 10px !important; height: 10px !important; background: #3B82F6 !important; transform: rotate(45deg) !important; margin-top: -6px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;"></div>
          </div>
        `,
        className: 'custom-map-icon',
        iconSize: [44, 52],
        iconAnchor: [22, 52]
      });

      // Markers
      const pickupMarker = window.L.marker(pickupCoords, { icon: homeIcon }).addTo(map)
        .bindPopup(`<b>📍 Pickup Location</b><br/>${pickupAddress}`);

      const dropoffMarker = window.L.marker(dropoffCoords, { icon: ngoIcon }).addTo(map)
        .bindPopup(`<b>🏫 NGO Destination: ${dropoffNgo}</b><br/>${dropoffAddress || ''}`);

      // Track Line
      window.L.polyline([pickupCoords, dropoffCoords], {
        color: '#78A642',
        weight: 4,
        opacity: 0.8,
        dashArray: status === 'In Transit' ? '8, 8' : '5, 5'
      }).addTo(map);

      // Courier Pin if claimed
      if (courierName && !courierName.startsWith('None')) {
        let truckCoords;
        if (status === 'Delivered') {
          truckCoords = dropoffCoords;
        } else if (status === 'In Transit') {
          truckCoords = [
            (pickupCoords[0] + dropoffCoords[0]) / 2,
            (pickupCoords[1] + dropoffCoords[1]) / 2
          ];
        } else {
          // near pickup
          truckCoords = [
            pickupCoords[0] + (dropoffCoords[0] - pickupCoords[0]) * 0.2,
            pickupCoords[1] + (dropoffCoords[1] - pickupCoords[1]) * 0.2
          ];
        }
        window.L.marker(truckCoords, { icon: truckIcon }).addTo(map)
          .bindPopup(`<b>🚚 Active Courier: ${courierName}</b><br/>Status: ${status}`);
      }

      const group = new window.L.featureGroup([pickupMarker, dropoffMarker]);
      map.fitBounds(group.getBounds().pad(0.2));

      mapRef.current = map;
    } catch (e) {
      console.error('Leaflet initialization failed, falling back to SVG vector:', e);
      setHasLeaflet(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [hasLeaflet, pickupAddress, dropoffAddress, dropoffNgo, status, courierName]);

  if (hasLeaflet) {
    return (
      <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-4 shadow-sm space-y-4 text-left animate-fade-in relative z-10">
        <div className="flex items-center justify-between border-b border-[#0F340F]/5 pb-3">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0F340F] flex items-center gap-1.5 select-none">
              <span>🗺️</span> Platform Route Navigator
            </h4>
            <p className="text-[10px] text-[#556B5D] font-bold mt-0.5 select-none">Live interactive OpenStreetMap mapping</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border select-none ${
            status === 'Delivered'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : status === 'In Transit'
                ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                : courierName && courierName.includes('Claimed')
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            {status === 'Delivered' ? 'Delivered' : status === 'In Transit' ? 'In Transit (Live)' : courierName && courierName.includes('Claimed') ? 'Awaiting Pickup' : 'Offer Posted'}
          </span>
        </div>

        {/* Live Leaflet Map Div */}
        <div ref={mapContainerRef} className="bg-[#162E20] border border-[#0F340F]/20 rounded-xl overflow-hidden aspect-[1.8] shadow-inner h-60 z-10" />

        {/* Dynamic Status Dashboard overlay */}
        <div className="bg-[#F8FAF5] p-3 rounded-xl border border-[#0F340F]/5 flex items-center justify-between text-[10px] select-none font-bold text-[#556B5D] leading-tight">
          <span>📍 Routing: {pickupAddress && pickupAddress.length > 28 ? pickupAddress.substring(0, 28) + '...' : pickupAddress} ➔ {dropoffNgo}</span>
          <span className="text-[#78A642] font-black uppercase">GPS Lock ACTIVE</span>
        </div>
      </div>
    );
  }

  // Fallback to beautiful default SVG Map if offline or leaflet not loaded
  return (
    <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-4 shadow-sm space-y-4 text-left animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#0F340F]/5 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-[#0F340F] flex items-center gap-1.5 select-none">
            <span>🗺️</span> Platform Route Navigator
          </h4>
          <p className="text-[10px] text-[#556B5D] font-bold mt-0.5 select-none">Verified dynamic delivery route mapping</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border select-none ${
          status === 'Delivered'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : status === 'In Transit'
              ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
              : courierName && courierName.includes('Claimed')
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
        }`}>
          {status === 'Delivered' ? 'Delivered' : status === 'In Transit' ? 'In Transit (Live)' : courierName && courierName.includes('Claimed') ? 'Awaiting Pickup' : 'Offer Posted'}
        </span>
      </div>

      <div className="relative bg-[#162E20] border border-[#0F340F]/20 rounded-xl overflow-hidden aspect-[1.8] shadow-inner select-none flex items-center justify-center">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'radial-gradient(circle, #78A642 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="0" y1="30" x2="300" y2="230" stroke="#78A642" strokeWidth="6" />
          <line x1="80" y1="0" x2="80" y2="250" stroke="#78A642" strokeWidth="4" />
          <line x1="220" y1="0" x2="220" y2="250" stroke="#78A642" strokeWidth="4" />
          <line x1="0" y1="120" x2="300" y2="120" stroke="#78A642" strokeWidth="5" />
        </svg>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 150">
          <path d="M 50 110 Q 150 40 250 80" stroke="#78A642" strokeWidth="4" strokeLinecap="round" fill="none" className="opacity-20" />
          <path d="M 50 110 Q 150 40 250 80" 
            stroke={status === 'In Transit' ? '#78A642' : status === 'Delivered' ? '#10B981' : '#E2E8F0'} 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            fill="none" 
            strokeDasharray="6, 6"
            style={{
              animation: status === 'In Transit' ? 'dash-crawl 4s linear infinite' : 'none'
            }}
          />

          <circle cx="50" cy="110" r="10" fill="none" stroke="#E32121" strokeWidth="2.5" className="animate-ping opacity-45" style={{ animationDuration: '2s' }} />
          <circle cx="50" cy="110" r="5" fill="#E32121" />

          <circle cx="250" cy="80" r="12" fill="none" stroke="#78A642" strokeWidth="2.5" className="animate-ping opacity-45" style={{ animationDuration: '3s' }} />
          <circle cx="250" cy="80" r="6" fill="#78A642" />

          {courierName && !courierName.startsWith('None') && (
            <g style={{
              transform: status === 'Delivered' 
                ? 'translate(250px, 80px)' 
                : status === 'In Transit'
                  ? 'translate(150px, 50px)'
                  : 'translate(75px, 95px)',
              transition: 'transform 2s ease-in-out'
            }}>
              <circle cx="0" cy="0" r="10" fill="#E32121" className="shadow-md" />
              <text x="-4.5" y="3.5" fill="#FFFFFF" fontSize="10px" className="font-bold">🚚</text>
            </g>
          )}

          <text x="35" y="132" fill="#FFFFFF" fontSize="8px" className="font-extrabold uppercase tracking-wide opacity-80 font-sans">🏠 Pickup</text>
          <text x="220" y="65" fill="#FFFFFF" fontSize="8px" className="font-extrabold uppercase tracking-wide opacity-80 font-sans">🏫 Dropoff</text>
        </svg>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#162E20]/90 backdrop-blur-md border border-white/10 rounded-lg p-2 flex justify-between items-center text-[9px] font-bold text-white shadow-lg leading-tight select-none">
          <div className="text-left">
            <span className="block text-[8px] opacity-65">ACTIVE PIPELINE</span>
            <span className="font-serif text-[10px] tracking-wide mt-0.5 block">{pickupAddress} ➔ {dropoffNgo}</span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] opacity-65">Live ETA</span>
            <span className="font-sans text-[10px] mt-0.5 block">{status === 'Delivered' ? 'Completed' : status === 'In Transit' ? '14 mins' : 'Awaiting start'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
