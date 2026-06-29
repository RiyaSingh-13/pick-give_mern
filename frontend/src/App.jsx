import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import donationDeliveryImg from './assets/donation_delivery.png';
import dashboardIllustrationImg from './assets/dashboard_illustration.png';
import ngoWelcomeIllustrationImg from './assets/ngo_welcome_illustration.png';
import {
  Heart,
  Shield,
  Building,
  Gift,
  Truck,
  TrendingUp,
  UserPlus,
  Users,
  CheckCircle,
  ArrowRight,
  MapPin,
  Shirt,
  Apple,
  BookOpen,
  Gamepad2,
  HeartPulse,
  Laptop,
  Armchair,
  Grid,
  ChevronRight,
  Info,
  Package,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPinned,
  X,
  Upload,
  Home,
  Bell,
  User,
  Settings,
  LogOut,
  Star,
  Check,
  Search,
  ChevronDown,
  Award,
  Clipboard,
  Trash2,
  Lock,
  ShieldAlert
} from 'lucide-react';


// ============================================================================
// RICH INDIAN CITIES GEODB & BASE COORD RESOLVER
// ============================================================================
const CITY_COORDS = {
  lucknow: [26.8467, 80.9462],
  delhi: [28.6139, 77.2090],
  noida: [28.5355, 77.3910],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  mumbai: [19.0760, 72.8777],
  bombay: [19.0760, 72.8777],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  kolkata: [22.5726, 88.3639],
  calcutta: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  madras: [13.0827, 80.2707],
  hyderabad: [17.3850, 78.4867],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  kanpur: [26.4499, 80.3319],
  patna: [25.5941, 85.1376],
  bhopal: [23.2599, 77.4126],
  indore: [22.7196, 75.8577],
  nagpur: [21.1458, 79.0882],
  visakhapatnam: [17.6868, 83.2185],
  vadodara: [22.3072, 73.1812],
  ghaziabad: [28.6692, 77.4538],
  ludhiana: [30.9010, 75.8573],
  agra: [27.1767, 78.0081],
  nashik: [19.9975, 73.7898],
  faridabad: [28.4089, 77.3178],
  meerut: [28.9845, 77.7064],
  rajkot: [22.3039, 70.8022],
  varanasi: [25.3176, 82.9739],
  srinagar: [34.0837, 74.7973],
  amritsar: [31.6340, 74.8723],
  allahabad: [25.4358, 81.8463],
  prayagraj: [25.4358, 81.8463],
  coimbatore: [11.0168, 76.9558],
  jabalpur: [22.1760, 79.9300],
  gwalior: [26.2183, 78.1828],
  vijayawada: [16.5062, 80.6480],
  madurai: [9.9252, 78.1198],
  guwahati: [26.1445, 91.7362],
  chandigarh: [30.7333, 76.7794]
};

const getBaseCoords = (address) => {
  if (!address || typeof address !== 'string') return [28.6139, 77.2090]; // Default New Delhi
  const lower = address.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (lower.includes(city)) {
      return coords;
    }
  }
  return [28.6139, 77.2090]; // Default New Delhi
};


// ============================================================================
// PREMIUM INTERACTIVE ROUTE MAP COMPONENT
// Renders a high-fidelity vector city map with stylized streets, a crawling dashed
// route line, pulsing pickup/dropoff anchors, and a moving volunteer courier truck.
// ============================================================================
function InteractiveRouteMap({ pickupAddress, dropoffAddress, dropoffNgo, status, courierName }) {
  // Check the progress based on status and courierName:
  // - If 'Delivered': 100% complete.
  // - If 'In Transit': truck crawling along route (50% midpoint).
  // - If Claimed but Awaiting Pickup: truck sits near the pickup coordinate (20% progress).
  // - Otherwise: pending courier selection.

  const mapContainerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [hasLeaflet, setHasLeaflet] = React.useState(!!window.L);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

function InteractiveBookingPinMap({ value, memberLocation, onChange }) {
  const mapContainerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markerRef = React.useRef(null);
  const [hasLeaflet, setHasLeaflet] = React.useState(!!window.L);

  // Keep references to latest value and onChange to avoid resetting map
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
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

  // Map Initialization: Runs ONLY ONCE when hasLeaflet becomes true
  React.useEffect(() => {
    if (!hasLeaflet || !mapContainerRef.current) return;
    if (mapRef.current) return; // Already initialized

    try {
      const parseCoords = (val) => {
        if (!val || typeof val !== 'string') return null;
        const match = val.match(/Coordinates:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/) || val.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (match) {
          return [parseFloat(match[1]), parseFloat(match[2])];
        }
        return null;
      };

      const initialCoords = parseCoords(value) || getBaseCoords(memberLocation);
      
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(initialCoords, 12);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      const pinIcon = window.L.divIcon({
        html: `
          <div class="flex flex-col items-center justify-center" style="display: flex !important; flex-direction: column !important; align-items: center !important;">
            <div class="w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110" style="width: 40px !important; height: 40px !important; border-radius: 50% !important; background: white !important; border: 2px solid #EF4444 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 6px rgba(0,0,0,0.15) !important;">
              <span style="font-size: 20px;">📍</span>
            </div>
            <div class="w-2.5 h-2.5 bg-red-500 transform rotate-45 -mt-1.5 shadow-sm" style="width: 10px !important; height: 10px !important; background: #EF4444 !important; transform: rotate(45deg) !important; margin-top: -6px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;"></div>
          </div>
        `,
        className: 'custom-map-pin',
        iconSize: [40, 48],
        iconAnchor: [20, 48]
      });

      // Place initial marker if coords were parsed from value
      const parsed = parseCoords(value);
      if (parsed) {
        markerRef.current = window.L.marker(parsed, { icon: pinIcon }).addTo(map);
      }

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = window.L.marker(e.latlng, { icon: pinIcon }).addTo(map);
        }
        if (onChangeRef.current) {
          onChangeRef.current(`Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      });

      mapRef.current = map;
    } catch (err) {
      console.error('InteractiveBookingPinMap error:', err);
      setHasLeaflet(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [hasLeaflet]); // Only run on hasLeaflet!

  // Synchronize value prop (e.g. if user types coordinates or sets it elsewhere)
  React.useEffect(() => {
    if (!hasLeaflet || !mapRef.current) return;
    
    const parseCoords = (val) => {
      if (!val || typeof val !== 'string') return null;
      const match = val.match(/Coordinates:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/) || val.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (match) {
        return [parseFloat(match[1]), parseFloat(match[2])];
      }
      return null;
    };

    const coords = parseCoords(value);
    if (coords) {
      const pinIcon = window.L.divIcon({
        html: `
          <div class="flex flex-col items-center justify-center" style="display: flex !important; flex-direction: column !important; align-items: center !important;">
            <div class="w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110" style="width: 40px !important; height: 40px !important; border-radius: 50% !important; background: white !important; border: 2px solid #EF4444 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 6px rgba(0,0,0,0.15) !important;">
              <span style="font-size: 20px;">📍</span>
            </div>
            <div class="w-2.5 h-2.5 bg-red-500 transform rotate-45 -mt-1.5 shadow-sm" style="width: 10px !important; height: 10px !important; background: #EF4444 !important; transform: rotate(45deg) !important; margin-top: -6px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;"></div>
          </div>
        `,
        className: 'custom-map-pin',
        iconSize: [40, 48],
        iconAnchor: [20, 48]
      });

      if (markerRef.current) {
        const currentLatLng = markerRef.current.getLatLng();
        // Only update if marker position is actually different (to prevent redundant sets)
        if (Math.abs(currentLatLng.lat - coords[0]) > 0.00001 || Math.abs(currentLatLng.lng - coords[1]) > 0.00001) {
          markerRef.current.setLatLng(coords);
        }
      } else {
        markerRef.current = window.L.marker(coords, { icon: pinIcon }).addTo(mapRef.current);
      }
    } else {
      // If address is typed as non-coordinate text, remove the marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [value, hasLeaflet]);

  if (!hasLeaflet) return null;

  return (
    <div className="space-y-1.5 text-left z-10 relative">
      <span className="text-[11px] text-[#556B5D] font-bold block select-none">Or click on the map to pin your exact pickup coordinates:</span>
      <div ref={mapContainerRef} className="h-40 rounded-xl overflow-hidden border border-[#0F340F]/12 shadow-sm z-10" />
    </div>
  );
}


function App() {
  // Simple Path Router
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Unified dynamic session states (connected mock DB)
  const [currentMember, setCurrentMember] = useState(() => {
    const saved = localStorage.getItem('currentMember');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentNgo, setCurrentNgo] = useState(() => {
    const saved = localStorage.getItem('currentNgo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('currentMember', JSON.stringify(currentMember));
  }, [currentMember]);

  useEffect(() => {
    localStorage.setItem('currentNgo', JSON.stringify(currentNgo));
  }, [currentNgo]);

  const [donations, setDonations] = useState([]);
  const [adminTab, setAdminTab] = useState('overview'); // 'overview', 'ngos', 'users', 'logs'
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminNgos, setAdminNgos] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [requestForm, setRequestForm] = useState({ category: '', title: '', quantity: '', urgency: 'Low', description: '' });
  const [requestPostedSuccess, setRequestPostedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('isAdminLoggedIn') === 'true');

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const activeNgoRecord = currentNgo ? adminNgos.find(n => n.ngoName === currentNgo.ngoName) : null;
  const ngoStatus = activeNgoRecord ? activeNgoRecord.status : (currentNgo?.status || 'Pending');
  const isApproved = ngoStatus === 'Approved';

  // Load data from live Express backend APIs
  const fetchAllData = async () => {
    try {
      // 1. Fetch Donations
      const resDonations = await fetch('http://localhost:5001/api/donations');
      if (resDonations.ok) {
        const data = await resDonations.json();
        setDonations(data);
      }

      // 2. Fetch NGOs
      const resNgos = await fetch('http://localhost:5001/api/users/ngos');
      if (resNgos.ok) {
        const data = await resNgos.json();
        setAdminNgos(data);
        if (data.length > 0) {
          const found = data.find(n => n.ngoName === currentNgo?.ngoName);
          if (!found) {
            const hope = data.find(n => n.ngoName === 'Hope Foundation');
            if (hope) {
              setCurrentNgo(hope);
            } else {
              setCurrentNgo(data[0]);
            }
          } else {
            // Keep the active session up-to-date with status changes from admin actions
            setCurrentNgo(found);
          }
        }
      }

      // 3. Fetch Members
      const resMembers = await fetch('http://localhost:5001/api/users/members');
      if (resMembers.ok) {
        const data = await resMembers.json();
        setAdminUsers(data);
      }

      // 4. Fetch Logs
      const resLogs = await fetch('http://localhost:5001/api/audits');
      if (resLogs.ok) {
        const data = await resLogs.json();
        setAdminLogs(data);
      }

      // 5. Fetch NGO Requests
      const resRequests = await fetch('http://localhost:5001/api/requests');
      if (resRequests.ok) {
        const data = await resRequests.json();
        setNgoRequests(data);
      }
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Poll backend every 5 seconds for real-time coordination
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Listen to popstate changes (back/forward browser buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Custom Navigation function
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [activeCategory, setActiveCategory] = useState(null);
  
  // Modal states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showNgoModal, setShowNgoModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInSuccess, setSignInSuccess] = useState(false);
  
  // Form submission success states
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [ngoSuccess, setNgoSuccess] = useState(false);

  // Form states
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const [ngoForm, setNgoForm] = useState({
    ngoName: '',
    officialEmail: '',
    phone: '',
    address: '',
    description: '',
    registrationNumber: '',
    certificate: null,
    password: ''
  });

  const [uploadedFileName, setUploadedFileName] = useState('');

  // Statistics Array (Landing Page)
  const STATS_ITEMS = [
    { value: "12,580+", label: "Donations Delivered", sublabel: "Verified delivery pipelines", icon: Package },
    { value: "3,240+", label: "Active Volunteers", sublabel: "Drivers & on-foot couriers", icon: Users },
    { value: "450+", label: "Partner NGOs", sublabel: "Local community organizations", icon: Building },
    { value: "50,000+", label: "Lives Impacted", sublabel: "Direct material support", icon: Heart },
    { value: "Growing Daily", label: "Be Part of the Change", sublabel: "Join thousands of kind hearts", icon: TrendingUp }
  ];

  // Donation Categories Array
  const DONATION_CATEGORIES = [
    { title: "Clothes", icon: Shirt },
    { title: "Food", icon: Apple },
    { title: "Books", icon: BookOpen },
    { title: "Toys", icon: Gamepad2 },
    { title: "Medical", icon: HeartPulse },
    { title: "Electronics", icon: Laptop },
    { title: "Furniture", icon: Armchair },
    { title: "Others", icon: Grid }
  ];

  // How it works steps
  const FLOW_STEPS = [
    { step: "1", title: "Upload", description: "Upload items you want to donate.", colorClass: "bg-[#78A642]" },
    { step: "2", title: "NGO Accepts", description: "NGO reviews and accepts the request.", colorClass: "bg-[#0F340F]" },
    { step: "3", title: "Volunteer Delivers", description: "Volunteer picks up and delivers it.", colorClass: "bg-[#78A642]" },
    { step: "4", title: "Impact Created", description: "Donation reaches those who need it.", colorClass: "bg-[#0F340F]" }
  ];

  // Why Choose Us list
  const BENEFITS = [
    {
      title: "Verified & Trusted NGOs",
      description: "All NGOs are verified to ensure your donation reaches the right place.",
      icon: Shield
    },
    {
      title: "Live Tracking",
      description: "Track your donation in real-time from pickup to delivery.",
      icon: MapPin
    },
    {
      title: "Community Powered",
      description: "A strong network of volunteers and donors working together for impact.",
      icon: Users
    },
    {
      title: "Easy & Transparent",
      description: "Simple process, transparent updates, and real impact you can see.",
      icon: CheckCircle
    }
  ];

  // Handlers
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.password) {
      alert('Password is required.');
      return;
    }
    setMemberSuccess(true);
    try {
      const res = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'Member',
          fullName: memberForm.fullName,
          email: memberForm.email,
          phone: memberForm.phone,
          location: memberForm.location,
          password: memberForm.password
        })
      });

      if (res.ok) {
        const user = await res.json();
        const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'RS';
        setCurrentMember({
          fullName: user.fullName,
          initials: initials,
          email: user.email,
          location: user.location,
          phone: user.phone
        });

        setTimeout(() => {
          setMemberSuccess(false);
          setShowMemberModal(false);
          fetchAllData();
          navigateTo('/member');
          setMemberForm({ fullName: '', email: '', phone: '', location: '', password: '' });
        }, 1200);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to register.');
        setMemberSuccess(false);
      }
    } catch (err) {
      console.error('Member submit error:', err);
      setMemberSuccess(false);
    }
  };

  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    if (!ngoForm.password) {
      alert('Password is required.');
      return;
    }
    setNgoSuccess(true);
    try {
      const registeredNgoName = ngoForm.ngoName;
      const res = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'NGO',
          ngoName: registeredNgoName,
          officialEmail: ngoForm.officialEmail,
          phone: ngoForm.phone,
          address: ngoForm.address,
          description: ngoForm.description,
          registrationNumber: ngoForm.registrationNumber,
          password: ngoForm.password
        })
      });

      if (res.ok) {
        const ngo = await res.json();
        setCurrentNgo(ngo);

        setTimeout(() => {
          setNgoSuccess(false);
          setShowNgoModal(false);
          fetchAllData();
          navigateTo('/ngo');
          setNgoForm({ ngoName: '', officialEmail: '', phone: '', address: '', description: '', registrationNumber: '', certificate: null, password: '' });
          setUploadedFileName('');
        }, 1200);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to register NGO.');
        setNgoSuccess(false);
      }
    } catch (err) {
      console.error('NGO submit error:', err);
      setNgoSuccess(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInSuccess(false);

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword })
      });

      if (res.ok) {
        const user = await res.json();
        setSignInSuccess(true);
        setTimeout(() => {
          setShowSignInModal(false);
          setSignInSuccess(false);
          setSignInEmail('');
          setSignInPassword('');
          
          if (user.role === 'Member') {
            const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'M';
            setCurrentMember({
              fullName: user.fullName,
              initials: initials,
              email: user.email,
              location: user.location,
              phone: user.phone
            });
            navigateTo('/member');
          } else if (user.role === 'NGO') {
            setCurrentNgo(user);
            navigateTo('/ngo');
          } else if (user.role === 'Admin') {
            setIsAdminLoggedIn(true);
            navigateTo('/admin');
          }
        }, 1200);
      } else {
        const data = await res.json();
        setSignInError(data.error || 'Failed to sign in. Please verify your email.');
      }
    } catch (err) {
      console.error('Sign In Error:', err);
      setSignInError('Server connection error. Please try again later.');
    }
  };

  const handleQuickSignIn = async (email, password) => {
    setSignInEmail(email);
    setSignInPassword(password);
    setSignInError('');
    setSignInSuccess(false);

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });

      if (res.ok) {
        const user = await res.json();
        setSignInSuccess(true);
        setTimeout(() => {
          setShowSignInModal(false);
          setSignInSuccess(false);
          setSignInEmail('');
          setSignInPassword('');
          
          if (user.role === 'Member') {
            const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'M';
            setCurrentMember({
              fullName: user.fullName,
              initials: initials,
              email: user.email,
              location: user.location,
              phone: user.phone
            });
            navigateTo('/member');
          } else if (user.role === 'NGO') {
            setCurrentNgo(user);
            navigateTo('/ngo');
          } else if (user.role === 'Admin') {
            setIsAdminLoggedIn(true);
            navigateTo('/admin');
          }
        }, 1200);
      } else {
        const data = await res.json();
        setSignInError(data.error || 'Failed to sign in. Please verify your email.');
      }
    } catch (err) {
      console.error('Quick Sign In Error:', err);
      setSignInError('Server connection error. Please try again later.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNgoForm({ ...ngoForm, certificate: file });
      setUploadedFileName(file.name);
    }
  };

  // ==========================================
  // NGO DASHBOARD COMPONENT STATES & DATA
  // ==========================================
  const [ngoTab, setNgoTab] = useState('dashboard');
  
  // Derived NGO lists directly connected to globalDonations!
  const ngoDonations = donations.filter(d => 
    (d.ngo === 'Common Pool' || (currentNgo && d.ngo === currentNgo.ngoName)) && 
    d.status === 'Offer Posted'
  );
  const ngoReceived = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status !== 'Offer Posted');
  const ngoDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && (d.status === 'In Transit' || d.status === 'Delivered')).map(d => ({
    id: d._id || d.id,
    courier: d.courier || 'None (Awaiting Courier)',
    route: `${d.donor} ➔ ${d.ngo} Shelter`,
    item: d.title,
    status: d.status === 'In Transit' ? 'On the way' : 'Successfully delivered'
  }));

  const ngoInDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status === 'In Transit').length;
  const ngoCompletedDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status === 'Delivered').length;
  const ngoActiveVolunteers = [...new Set(donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.courier && d.courier !== 'None (Awaiting Courier)').map(d => d.courier.replace(' (Active)', '').replace(' (Completed)', '')))].length;
  const myRequests = ngoRequests.filter(r => currentNgo && r.ngo === currentNgo.ngoName);

  const handleAcceptDonation = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/donations/${id}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngo: currentNgo.ngoName })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error accepting donation:', err);
    }
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!requestForm.category) {
      setValidationError('Please select an item category.');
      return;
    }
    if (!requestForm.title || !requestForm.title.trim()) {
      setValidationError('Please enter an item name / title.');
      return;
    }
    if (!requestForm.quantity || isNaN(Number(requestForm.quantity)) || Number(requestForm.quantity) <= 0) {
      setValidationError('Please enter a valid quantity needed (positive number).');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: requestForm.title,
          category: requestForm.category,
          urgency: requestForm.urgency,
          quantity: Number(requestForm.quantity),
          description: requestForm.description,
          ngo: currentNgo.ngoName
        })
      });
      if (res.ok) {
        setRequestPostedSuccess(true);
        setRequestForm({ category: '', title: '', quantity: '', urgency: 'Low', description: '' });
        setValidationError('');
        fetchAllData();
        setTimeout(() => setRequestPostedSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setValidationError(errData.error || 'Server rejected request. Please check input values.');
      }
    } catch (err) {
      console.error('Error posting request:', err);
      setValidationError('Failed to post request. Please check your backend connection.');
    }
  };

  const handleStopRequest = async (id) => {
    if (!window.confirm("Are you sure you want to stop/close this requirement request? Members will no longer see it on the community feed.")) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5001/api/requests/${id}/stop`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        fetchAllData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to stop the request.');
      }
    } catch (err) {
      console.error('handleStopRequest Error:', err);
      alert('Connection error. Please check your backend server is running.');
    }
  };

  const handleApproveNgo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/ngos/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error approving NGO:', err);
    }
  };

  const handleRejectNgo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/ngos/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error rejecting NGO:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Old Admin States Block removed cleanly (moved to top of App for TDZ compliance)

  // ==========================================
  // MEMBER DASHBOARD COMPONENT STATES & DATA
  // ==========================================
  const [dashboardTab, setDashboardTab] = useState('dashboard'); // 'dashboard', 'donate', 'tasks', 'donations', 'deliveries', 'achievements', 'profile', 'settings'
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [radiusFilter, setRadiusFilter] = useState('5');
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [otpInputValues, setOtpInputValues] = useState({}); // { [donationId]: string }
  const [otpErrors, setOtpErrors] = useState({}); // { [donationId]: string }

  // Derived Member list directly connected to globalDonations!
  const activeDonations = donations.filter(d => currentMember && d.donorEmail === currentMember.email);

  // Form states for new booking (with Recipient NGO bound)
  const [newBooking, setNewBooking] = useState({
    step: 1,
    category: null,
    title: '',
    description: '',
    photo: null,
    photoName: '',
    address: currentMember?.location || '14 Baker Street, Apt 3B, New Delhi',
    instructions: '',
    ngoName: 'Common Pool', // default Recipient is the common pool
    deliveryMode: 'Volunteer'
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Derived claimed delivery routes
  const memberDeliveries = [
    ...(claimedTasks.includes('1105') ? [{ id: '1105', title: 'Warm Clothes & Blankets', location: '14 Baker Street (Your coordinates)', ngo: 'Hope Shelter', status: 'In Transit' }] : []),
    ...donations.filter(d => d.courier && currentMember && d.courier.startsWith(currentMember.fullName)).map(d => ({
      id: (d._id || d.id || '').toString(),
      title: d.title,
      location: d.location,
      ngo: d.ngo,
      status: d.status
    }))
  ];

  // Available volunteer tasks derived from dynamic accepted donations + static preset
  const volunteerTasks = [
    {
      id: '1105',
      title: 'Warm Clothes & Blankets',
      ngo: 'Hope Shelter',
      pickup: '14 Baker Street (Your coordinates)',
      dropoff: '22 Compassion Ave (2.1 km total)',
      weight: 'Light (1 box, clothes)',
      distance: 0.1
    },
    ...donations.filter(d => d.status === 'Accepted' && (!d.courier || d.courier === 'None (Awaiting Courier)')).map(d => ({
      id: (d._id || d.id || '').toString(),
      title: d.title,
      ngo: d.ngo,
      pickup: d.location,
      dropoff: 'Hope Center Shelter (2.5 km total)',
      weight: 'Medium (1 Package)',
      distance: 1.2
    }))
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    try {
      const res = await fetch('http://localhost:5001/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBooking.title || 'Other Donation',
          category: newBooking.category || 'Clothes',
          donor: currentMember.fullName,
          donorEmail: currentMember.email,
          ngo: newBooking.ngoName || 'Common Pool',
          location: newBooking.address || currentMember.location,
          description: newBooking.description,
          instructions: newBooking.instructions,
          photo: newBooking.photoName,
          deliveryMode: newBooking.deliveryMode || 'Volunteer'
        })
      });
      if (res.ok) {
        setTimeout(() => {
          setBookingSuccess(false);
          setNewBooking({
            step: 1,
            category: null,
            title: '',
            description: '',
            photo: null,
            photoName: '',
            address: currentMember?.location || '',
            instructions: '',
            ngoName: 'Common Pool',
            deliveryMode: 'Volunteer'
          });
          fetchAllData();
          setDashboardTab('donations');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to book donation. Please verify your fields.');
        setBookingSuccess(false);
      }
    } catch (err) {
      console.error('Error booking donation:', err);
      alert('Connection error: could not connect to server. Please try again.');
      setBookingSuccess(false);
    }
  };

  const handleClaimTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/donations/${taskId}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerName: currentMember.fullName })
      });
      if (res.ok) {
        fetchAllData();
        // Toggle in claimedTasks local state for instant local styling coordination
        if (claimedTasks.includes(taskId)) {
          setClaimedTasks(claimedTasks.filter(id => id !== taskId));
        } else {
          setClaimedTasks([...claimedTasks, taskId]);
        }
      }
    } catch (err) {
      console.error('Error claiming task:', err);
    }
  };

  const handleCompleteDelivery = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/donations/${id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerName: currentMember.fullName })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error completing delivery:', err);
    }
  };

  const handleStartSelfTransit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/donations/${id}/self-transit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error starting self transit:', err);
    }
  };

  const handleCompleteSelfDelivery = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/donations/${id}/self-complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error completing self delivery:', err);
    }
  };

  // Render Dashboard
  const renderDashboardContent = () => {
    switch (dashboardTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* 1. Welcome Back Banner */}
            <div className="bg-[#F4F7F2] border border-[#0F340F]/8 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm overflow-hidden relative">
              <div className="space-y-2 md:max-w-xl">
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
                {/* Curved Dark Green Top Header Bar */}
                <div className="h-28 bg-[#0F340F] w-full rounded-b-[2.5rem]"></div>
                
                {/* Floating circular icon badge */}
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
                {/* Curved Dark Green Top Header Bar */}
                <div className="h-28 bg-[#0F340F] w-full rounded-b-[2.5rem]"></div>
                
                {/* Floating circular icon badge */}
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
                
                {/* Green accent line under header */}
                <div className="pb-2 border-b-2 border-[#0F340F] self-start select-none">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#0F340F]">Your Impact So Far</h3>
                </div>

                {/* Grid items */}
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
              
              {/* Dotted leaf shoot illustration on the right */}
              <div className="absolute right-6 bottom-0 top-0 w-24 opacity-20 pointer-events-none select-none flex items-end justify-end">
                <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100" className="text-[#78A642]">
                  <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
                </svg>
              </div>
            </div>

          </div>
        );
      
      case 'donate':
        return (
          <div className="bg-white border border-[#0F340F]/8 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-sm text-left animate-fade-in">
            <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif mb-2">📦 BOOK NEW DONATION</h2>
            <p className="text-xs text-[#576F5E] font-semibold mb-8">Follow our interactive form wizard to book a verified community pickup.</p>
            
            {newBooking.ngoName && newBooking.ngoName !== 'Common Pool' && (
              <div className="bg-[#F4F7F2] border border-[#78A642]/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#78A642]/10 flex items-center justify-center text-lg flex-shrink-0 select-none">
                    🎁
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0F340F] text-xs uppercase tracking-wider">Fulfilling NGO Requirement</h4>
                    <p className="text-xs text-[#576F5E] font-semibold leading-relaxed mt-0.5">
                      This donation will be locked & delivered exclusively to <span className="font-bold text-[#0F340F] underline">{newBooking.ngoName}</span>.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNewBooking({
                    ...newBooking,
                    step: 1,
                    category: null,
                    title: '',
                    description: '',
                    ngoName: 'Common Pool'
                  })}
                  className="bg-white border border-[#0F340F]/10 hover:border-red-200 text-[#0F340F] hover:text-red-600 font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer self-start sm:self-center"
                >
                  Cancel / Standard Donation
                </button>
              </div>
            )}

            {bookingSuccess ? (
              <div className="text-center py-16 flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-[#78A642]/10 flex items-center justify-center text-[#78A642]">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0F340F] font-serif">Donation Submitted!</h3>
                <p className="text-sm text-[#576F5E] font-semibold">Your donation is logged and waiting for a volunteer driver to coordinate handoff.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                
                {/* Step indicator */}
                <div className="flex items-center justify-between border-b border-[#0F340F]/5 pb-4">
                  <span className="text-xs font-extrabold text-[#78A642] uppercase tracking-widest">Step {newBooking.step} of 4</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(s => (
                      <span key={s} className={`w-6 h-1.5 rounded-full ${newBooking.step >= s ? 'bg-[#78A642]' : 'bg-[#0F340F]/5'}`} />
                    ))}
                  </div>
                </div>

                {newBooking.step === 1 && (
                  <div className="space-y-4">
                    <label className="text-sm font-extrabold text-[#0F340F]">1. Choose Item Category:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {DONATION_CATEGORIES.map((cat, idx) => {
                        const Icon = cat.icon;
                        const isSelected = newBooking.category === cat.title;
                        return (
                          <div
                            key={idx}
                            onClick={() => setNewBooking({ ...newBooking, category: cat.title, step: 2 })}
                            className={`flex flex-col items-center justify-center border aspect-square p-4 rounded-2xl cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0F340F] border-[#0F340F] text-white shadow-md' 
                                : 'bg-[#F8FAF5]/40 border-[#0F340F]/8 text-[#0F340F] hover:bg-white hover:border-[#78A642] hover:shadow-sm'
                            }`}
                          >
                            <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'text-[#0F340F]'}`} />
                            <span className="text-xs font-bold text-center leading-tight">{cat.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {newBooking.step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">2. Item Title:</label>
                      <input 
                        type="text" 
                        required
                        value={newBooking.title}
                        onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm"
                        placeholder="e.g. Warm wool blankets or Box of toys"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">3. Brief Details / Quantity:</label>
                      <textarea 
                        rows="3"
                        required
                        value={newBooking.description}
                        onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm resize-none"
                        placeholder="Describe the items, condition, and count..."
                      />
                    </div>
                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        onClick={() => setNewBooking({ ...newBooking, step: 1 })}
                        className="px-6 py-2.5 rounded-full border border-[#0F340F]/15 text-[#0F340F] font-bold text-xs cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { if (newBooking.title && newBooking.description) setNewBooking({ ...newBooking, step: 3 }) }}
                        className="px-6 py-2.5 rounded-full bg-[#0F340F] hover:bg-[#0A230A] text-white font-bold text-xs cursor-pointer"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {newBooking.step === 3 && (
                  <div className="space-y-5">
                    <label className="text-sm font-extrabold text-[#0F340F] block">3. Upload Handoff Verification Photo:</label>
                    <span className="text-[11px] text-[#576F5E] font-semibold -mt-3 block">
                      (A quick photo of the packed items aids volunteer loading and helps the NGO verify size and volume)
                    </span>
                    <div className="relative border border-dashed border-[#78A642]/40 rounded-2xl py-8 px-4 flex flex-col items-center justify-center bg-[#78A642]/5 group hover:bg-[#78A642]/10 transition-colors cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewBooking({ ...newBooking, photo: e.target.files[0], photoName: e.target.files[0].name, step: 4 });
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-[#78A642] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#0F340F]">
                        {newBooking.photoName ? newBooking.photoName : "Click to select or drop verification photo"}
                      </span>
                      <span className="text-[10px] text-[#576F5E] font-semibold mt-1">supports jpg, png (Max size: 5MB)</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        onClick={() => setNewBooking({ ...newBooking, step: 2 })}
                        className="px-6 py-2.5 rounded-full border border-[#0F340F]/15 text-[#0F340F] font-bold text-xs cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setNewBooking({ ...newBooking, step: 4 })}
                        className="px-6 py-2.5 rounded-full bg-[#0F340F] hover:bg-[#0A230A] text-white font-bold text-xs cursor-pointer"
                      >
                        Skip Photo
                      </button>
                    </div>
                  </div>
                )}

                {newBooking.step === 4 && (
                  <div className="space-y-5">
                    {/* Delivery Mode Choice Cards */}
                    <div>
                      <label className="text-sm font-extrabold text-[#0F340F] block mb-2">4. Select Delivery Mode:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          onClick={() => setNewBooking({ ...newBooking, deliveryMode: 'Volunteer' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            newBooking.deliveryMode !== 'Self'
                              ? 'border-[#78A642] bg-[#F8FAF5]'
                              : 'border-[#0F340F]/15 hover:border-[#0F340F]/30 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#78A642]" />
                            <span className="font-extrabold text-sm text-[#0F340F]">Volunteer Delivery</span>
                          </div>
                          <p className="text-[11px] text-[#556B5D] font-semibold mt-1">
                            A registered volunteer courier will pick up the package from your door.
                          </p>
                        </div>

                        <div 
                          onClick={() => setNewBooking({ ...newBooking, deliveryMode: 'Self' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            newBooking.deliveryMode === 'Self'
                              ? 'border-[#78A642] bg-[#F8FAF5]'
                              : 'border-[#0F340F]/15 hover:border-[#0F340F]/30 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-[#78A642]" />
                            <span className="font-extrabold text-sm text-[#0F340F]">Self Deliver</span>
                          </div>
                          <p className="text-[11px] text-[#556B5D] font-semibold mt-1">
                            You will drop off the items at the NGO's coordinates yourself.
                          </p>
                        </div>
                      </div>
                    </div>

                    {newBooking.deliveryMode !== 'Self' ? (
                      <>
                        <div>
                          <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">5. Pickup Coordinates / Address:</label>
                          <input 
                            type="text" 
                            required
                            value={newBooking.address}
                            onChange={(e) => setNewBooking({ ...newBooking, address: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm"
                            placeholder="Primary home address"
                          />
                        </div>
                        <InteractiveBookingPinMap value={newBooking.address} memberLocation={currentMember?.location} onChange={(val) => setNewBooking({ ...newBooking, address: val })} />
                        <div>
                          <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">6. Driver Pickup Access Notes (Optional):</label>
                          <input 
                            type="text" 
                            value={newBooking.instructions}
                            onChange={(e) => setNewBooking({ ...newBooking, instructions: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm"
                            placeholder="e.g. Ring buzzer 3B. Leave at gate if not answered."
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-4 bg-[#F8FAF5] border border-[#78A642]/20 rounded-2xl text-[#0F340F] text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                        <span className="text-base">🙋‍♂️</span>
                        <div>
                          <p className="font-bold text-[#0F340F]">Drop-off coordinates locked to the NGO facility.</p>
                          <p className="text-[#556B5D] mt-0.5">Since you chose Self Deliver, you will transport the package yourself. No volunteer courier will arrive at your home.</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        onClick={() => setNewBooking({ ...newBooking, step: 3 })}
                        className="px-6 py-2.5 rounded-full border border-[#0F340F]/15 text-[#0F340F] font-bold text-xs cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="px-8 py-3 rounded-full bg-[#78A642] hover:bg-[#638B34] text-white font-bold text-sm cursor-pointer shadow-md transition-all"
                      >
                        ❤️ SUBMIT REQUEST
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#0F340F]/5 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">🚚 LOGISTICS ACTIVE WORKBOARD</h2>
                <p className="text-xs text-[#576F5E] font-semibold mt-0.5">Claim hyper-local delivery runs near you to support local NGOs.</p>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {volunteerTasks.filter(t => t.distance <= parseFloat(radiusFilter)).map((task) => {
                const isClaimed = claimedTasks.includes(task.id);
                return (
                  <div 
                    key={task.id} 
                    className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                      isClaimed ? 'border-[#78A642] ring-1 ring-[#78A642]/20' : 'border-[#0F340F]/8'
                    }`}
                  >
                    <div className="p-5 border-b border-[#0F340F]/5 flex justify-between items-start bg-[#F8FAF5]/30">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#78A642] px-2 py-0.5 bg-[#78A642]/10 rounded-full font-mono">
                          Task #{task.id ? task.id.toString().slice(-6).toUpperCase() : ''}
                        </span>
                        <h4 className="text-base font-extrabold text-[#0F340F] mt-1.5 leading-tight">{task.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-[#576F5E] bg-[#F8FAF5] border border-[#0F340F]/8 px-2 py-1 rounded-md">
                        {task.distance} km away
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
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
                        <div className="flex gap-2 pt-2 border-t border-[#0F340F]/5 pt-2">
                          <Package className="w-4 h-4 text-[#78A642] flex-shrink-0" />
                          <span>Weight: {task.weight}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center gap-4">
                        <button 
                          type="button"
                          className="text-xs font-bold text-[#78A642] hover:text-[#638B34] flex items-center gap-1 cursor-pointer"
                        >
                          👁️ View Donor Photo
                        </button>
                        <button 
                          onClick={() => handleClaimTask(task.id)}
                          className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-sm ${
                            isClaimed 
                              ? 'bg-transparent border border-[#C2410C] text-[#C2410C] hover:bg-[#C2410C]/5' 
                              : 'bg-[#0F340F] hover:bg-[#0A230A] text-white'
                          }`}
                        >
                          {isClaimed ? 'Cancel Delivery Run' : '🚚 ACCEPT DELIVERY RUN'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'donations':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-4">🎁 MY DONATIONS LOG</h2>
            <div className="bg-white border border-[#0F340F]/8 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAF5] border-b border-[#0F340F]/5 text-[10px] font-extrabold text-[#576F5E] uppercase tracking-wider">
                    <th className="p-4">Donation ID</th>
                    <th className="p-4">Item Title</th>
                    <th className="p-4">Partner NGO</th>
                    <th className="p-4">Delivery Mode</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Log Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F340F]/5 text-xs text-[#0F340F] font-bold">
                  {activeDonations.map((item) => {
                    const itemId = item._id || item.id;
                    const isSelected = selectedDonationId === itemId;
                    return (
                      <React.Fragment key={itemId}>
                        <tr 
                          onClick={() => setSelectedDonationId(isSelected ? null : itemId)}
                          className={`hover:bg-[#F8FAF5] transition-colors cursor-pointer select-none ${
                            isSelected ? 'bg-[#F8FAF5] border-l-4 border-[#78A642]' : ''
                          }`}
                        >
                          <td className="p-4 font-mono text-[#576F5E]">
                            <span className="flex items-center gap-1.5">
                              {isSelected ? '▼' : '▶'} #{(itemId || '').toString().slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">{item.title}</td>
                          <td className="p-4 text-[#576F5E] font-semibold">{item.ngo}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold ${
                              item.deliveryMode === 'Self' ? 'text-[#78A642]' : 'text-blue-600'
                            }`}>
                              {item.deliveryMode === 'Self' ? '🙋‍♂️ Self' : '🚚 Volunteer'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                              item.status === 'Delivered' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : item.status === 'In Transit'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                                  : item.courier && item.courier.includes('Claimed')
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              {item.status === 'Delivered' ? 'Delivered' : item.status === 'In Transit' ? 'In Transit' : item.courier && item.courier.includes('Claimed') ? 'Awaiting Pickup' : 'Offer Posted'}
                            </span>
                          </td>
                          <td className="p-4 text-[#576F5E] font-semibold">{item.date}</td>
                        </tr>
                        {isSelected && (
                          <tr>
                            <td colSpan="6" className="p-6 bg-[#F8FAF5]/40 border-t border-b border-[#0F340F]/5">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-left font-sans">
                                {/* Left side: Detailed stats + OTP secure card */}
                                <div className="space-y-4">
                                  <div className="bg-white border border-[#0F340F]/8 rounded-xl p-5 shadow-sm space-y-3">
                                    <h4 className="text-sm font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-2 flex items-center gap-1.5">
                                      <span>📋</span> Donation Handoff Metrics
                                    </h4>
                                    <div className="space-y-2 text-xs font-semibold text-[#556B5D] leading-relaxed">
                                      <p><span className="text-[#0F340F] font-bold">Description:</span> {item.description || 'No description provided.'}</p>
                                      {item.deliveryMode !== 'Self' && <p><span className="text-[#0F340F] font-bold">Pickup Point:</span> {item.location}</p>}
                                      {item.deliveryMode !== 'Self' && item.instructions && <p><span className="text-[#0F340F] font-bold">Instructions:</span> {item.instructions}</p>}
                                      <p><span className="text-[#0F340F] font-bold">Delivery Mode:</span> {item.deliveryMode === 'Self' ? 'Self Deliver' : 'Volunteer Delivery'}</p>
                                      <p><span className="text-[#0F340F] font-bold">Current Courier:</span> {item.courier || 'None (Awaiting NGO Acceptance & Courier)'}</p>
                                    </div>
                                  </div>
 
                                  {item.deliveryMode === 'Self' ? (
                                    <div className="bg-[#F8FAF5] border border-[#78A642]/30 rounded-xl p-5 shadow-sm space-y-2.5 relative overflow-hidden">
                                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#78A642]"></div>
                                      <h4 className="text-xs font-extrabold text-[#0F340F] uppercase tracking-widest flex items-center gap-1.5 select-none">
                                        <span>🙋‍♂️</span> Self-Delivery Instructions
                                      </h4>
                                      <p className="text-[11px] text-[#556B5D] leading-normal font-semibold">
                                        Since you chose **Self Deliver**, please drop off this donation at the NGO's address. Once you're ready, click "Start Self Delivery" below. When you successfully hand over the package, click "Complete Self Delivery".
                                      </p>
                                      {item.status === 'Accepted' && (
                                        <button
                                          onClick={() => handleStartSelfTransit(itemId)}
                                          className="w-full mt-2 bg-[#78A642] hover:bg-[#638B34] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer font-sans"
                                        >
                                          🚀 Start Self Delivery (Mark In Transit)
                                        </button>
                                      )}
                                      {item.status === 'In Transit' && (
                                        <button
                                          onClick={() => handleCompleteSelfDelivery(itemId)}
                                          className="w-full mt-2 bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer animate-pulse font-sans"
                                        >
                                          ✔️ Complete Self Delivery (Mark Delivered)
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    /* OTP golden secure card */
                                    <div className="bg-[#FFFDF4] border border-amber-200 rounded-xl p-5 shadow-sm space-y-2.5 relative overflow-hidden">
                                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                                      <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 select-none">
                                        <span>🔑</span> Pickup Verification OTP
                                      </h4>
                                      <div className="inline-flex items-center justify-center bg-white border border-amber-200 px-4 py-2.5 rounded-lg font-mono text-xl font-black text-amber-700 tracking-wider shadow-inner select-all">
                                        {item.otp || '4891'}
                                      </div>
                                      <p className="text-[10px] text-amber-800 leading-normal font-semibold">
                                        Please **provide this 4-digit code** to the volunteer courier when they physically arrive at your doorstep. They must enter this code into their platform interface to verify and start the transit safely.
                                      </p>
                                    </div>
                                  )}
                                </div>
 
                                {/* Right side: Premium Live Navigator Map */}
                                <div>
                                  <InteractiveRouteMap 
                                    pickupAddress={item.deliveryMode === 'Self' ? 'Self Delivery (Donor Drop-off)' : item.location}
                                    dropoffAddress={adminNgos.find(n => n.ngoName === item.ngo)?.address || item.ngo}
                                    dropoffNgo={item.ngo}
                                    status={item.status}
                                    courierName={item.deliveryMode === 'Self' ? 'Self (Donor)' : item.courier}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'deliveries':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-4">📋 VOLUNTEER RUN LOGS</h2>
            {memberDeliveries.length === 0 ? (
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-12 text-center text-[#576F5E]">
                <Truck className="w-12 h-12 text-[#576F5E]/30 mx-auto mb-3" />
                <p className="text-sm font-bold">You have no active or completed volunteer delivery runs.</p>
                <p className="text-xs mt-1">Accept courier tasks on the workboard to start supporting local pipelines.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 bg-[#F8FAF5] border border-[#0F340F]/8 rounded-2xl font-serif font-bold text-[#0F340F] flex items-center justify-between shadow-sm select-none">
                  <span>📋 Active Delivery Navigator HUD</span>
                  <span className="text-xs font-sans font-bold bg-[#0F340F]/5 text-[#0F340F] px-3 py-1 rounded-full border border-[#0F340F]/10">Total claimed runs: {memberDeliveries.length}</span>
                </div>
                <div className="space-y-6">
                  {memberDeliveries.map(task => {
                    const isAwaitingPickup = task.status === 'Accepted';
                    return (
                      <div key={task.id} className="p-5 border border-[#0F340F]/8 rounded-2xl bg-white shadow-sm flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#0F340F]/5 pb-3">
                          <div>
                            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#78A642] px-2.5 py-0.5 bg-[#78A642]/10 rounded-full select-none">
                              Task #{task.id ? task.id.toString().slice(-6).toUpperCase() : ''}
                            </span>
                            <h4 className="text-base font-extrabold text-[#0F340F] mt-1.5 leading-tight">{task.title}</h4>
                            <p className="text-xs font-semibold text-[#556B5D] mt-1.5 flex flex-wrap gap-x-2 gap-y-1">
                              <span>📍 Pickup Address:</span> 
                              <span className="text-[#0F340F] font-bold">{task.location}</span> 
                              <span className="text-[#556B5D]/40">➔</span>
                              <span>NGO Destination:</span> 
                              <span className="text-[#0F340F] font-bold">{task.ngo}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border select-none ${
                              task.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : task.status === 'In Transit'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {task.status === 'Delivered' ? 'Delivered' : task.status === 'In Transit' ? 'In Transit (Live)' : 'Awaiting Pickup'}
                            </span>

                            {task.status === 'In Transit' && (
                              <button
                                onClick={() => handleCompleteDelivery(task.id)}
                                className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                              >
                                ✔️ Complete Delivery
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive live navigator layout split */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                          {/* Left Panel: Verification Dialog or Transit Status details */}
                          <div className="space-y-4">
                            {isAwaitingPickup ? (
                              <div className="bg-[#FFFDF4] border border-amber-200 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden text-left font-sans">
                                <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                                <div>
                                  <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 select-none">
                                    <span>🔑</span> Secure Pickup OTP Verification Required
                                  </h4>
                                  <p className="text-[11px] text-amber-800 font-semibold leading-relaxed mt-1">
                                    To maintain high community safety standards, ask the donor for their **4-digit Pickup Verification OTP** and enter it below to confirm the pickup and begin the transit run.
                                  </p>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      maxLength="4"
                                      placeholder="Enter 4-Digit OTP"
                                      value={otpInputValues[task.id] || ''}
                                      onChange={(e) => setOtpInputValues({ ...otpInputValues, [task.id]: e.target.value.replace(/\D/g, '') })}
                                      className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-bold font-mono tracking-widest text-[#0F340F] focus:outline-none focus:ring-2 focus:ring-amber-400/40 w-full placeholder-amber-900/30 shadow-inner"
                                    />
                                    <button
                                      onClick={async () => {
                                        const otp = otpInputValues[task.id];
                                        if (!otp || otp.length !== 4) {
                                          setOtpErrors({ ...otpErrors, [task.id]: 'Please enter a valid 4-digit OTP code.' });
                                          return;
                                        }
                                        try {
                                          const res = await fetch(`http://localhost:5001/api/donations/${task.id}/verify-pickup`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ otp, volunteerName: currentMember.fullName })
                                          });
                                          const data = await res.json();
                                          if (res.ok) {
                                            setOtpInputValues({ ...otpInputValues, [task.id]: '' });
                                            setOtpErrors({ ...otpErrors, [task.id]: '' });
                                            fetchAllData();
                                          } else {
                                            setOtpErrors({ ...otpErrors, [task.id]: data.error || 'Failed to verify OTP.' });
                                          }
                                        } catch (err) {
                                          setOtpErrors({ ...otpErrors, [task.id]: 'Connection error. Please try again.' });
                                        }
                                      }}
                                      className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors cursor-pointer"
                                    >
                                      Confirm & Start
                                    </button>
                                  </div>

                                  {otpErrors[task.id] && (
                                    <p className="text-[10px] font-bold text-red-600 animate-pulse">
                                      ⚠️ {otpErrors[task.id]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-[#F8FAF5] border border-[#0F340F]/8 rounded-xl p-5 shadow-sm space-y-4 text-left font-sans">
                                <h4 className="text-xs font-extrabold text-[#0F340F] uppercase tracking-widest flex items-center gap-1.5 select-none">
                                  <span>🚚</span> Delivery Progress & Instructions
                                </h4>
                                <div className="space-y-2 text-xs font-semibold text-[#556B5D] leading-relaxed">
                                  <p><span className="text-[#0F340F] font-bold">Logistics Status:</span> {task.status === 'Delivered' ? 'Delivered successfully! Thank you for your support.' : 'Verification code verified. Packaged cargo is currently in transit to NGO shelter center.'}</p>
                                  <p><span className="text-[#0F340F] font-bold">Recipient NGO Hub:</span> {task.ngo}</p>
                                  <p className="text-[11px] text-[#78A642] font-extrabold">🌿 Double platform impact points unlocked for this run!</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Panel: Interactive dynamic Live Route Map */}
                          <div>
                            <InteractiveRouteMap 
                              pickupAddress={task.location}
                              dropoffAddress={adminNgos.find(n => n.ngoName === task.ngo)?.address || task.ngo}
                              dropoffNgo={task.ngo}
                              status={task.status}
                              courierName={task.status === 'Delivered' ? `${currentMember.fullName} (Completed)` : isAwaitingPickup ? `${currentMember.fullName} (Claimed)` : `${currentMember.fullName} (Active)`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-4">⭐ PLATFORM ACHIEVEMENTS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-white border border-[#78A642]/20 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-3 bg-[#78A642]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#78A642] text-white font-bold flex items-center justify-center text-xs rounded-bl-xl shadow-sm">
                  ✔
                </div>
                <div className="w-14 h-14 bg-[#78A642]/10 rounded-full flex items-center justify-center text-[#78A642] mb-2 border border-[#78A642]/20">
                  <Gift className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F340F]">Generosity Pioneer</h4>
                <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">Completed over 10 verified donations of premium quality items.</p>
              </div>

              <div className="bg-white border border-[#78A642]/20 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-3 bg-[#78A642]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#78A642] text-white font-bold flex items-center justify-center text-xs rounded-bl-xl shadow-sm">
                  ✔
                </div>
                <div className="w-14 h-14 bg-[#78A642]/10 rounded-full flex items-center justify-center text-[#78A642] mb-2 border border-[#78A642]/20">
                  <Truck className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F340F]">Miles of Smile</h4>
                <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">Traveled over 50 km for local courier volunteer runs.</p>
              </div>

              <div className="bg-white border border-[#78A642]/20 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-3 bg-[#78A642]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#78A642] text-white font-bold flex items-center justify-center text-xs rounded-bl-xl shadow-sm">
                  ✔
                </div>
                <div className="w-14 h-14 bg-[#78A642]/10 rounded-full flex items-center justify-center text-[#78A642] mb-2 border border-[#78A642]/20">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F340F]">First Responder</h4>
                <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">Accepted and delivered an urgent pickup request in under 3 hours.</p>
              </div>

              <div className="bg-white border border-[#0F340F]/8 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-3 opacity-60">
                <div className="w-14 h-14 bg-[#0F340F]/5 rounded-full flex items-center justify-center text-[#576F5E] mb-2">
                  <Building className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F340F]">Direct Impact</h4>
                <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">Support 5 distinct local partner NGOs. (Progress: 4/5)</p>
              </div>

              <div className="bg-white border border-[#0F340F]/8 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-3 opacity-60">
                <div className="w-14 h-14 bg-[#0F340F]/5 rounded-full flex items-center justify-center text-[#576F5E] mb-2">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F340F]">Community Hub</h4>
                <p className="text-xs text-[#576F5E] font-semibold leading-relaxed">Connect 3 new active neighbors to Pick&Give platform.</p>
              </div>

            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-4">👤 MEMBER PROFILE</h2>
            <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm max-w-xl">
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
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-4">⚙️ ACCOUNT SETTINGS</h2>
            <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm max-w-xl text-xs font-semibold text-[#576F5E] space-y-5">
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
            </div>
          </div>
        );

      case 'urgent':
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
                                step: 2, // Skip category selection (step 1) since category is pre-selected
                                category: req.category,
                                title: `Fulfillment: ${req.title}`,
                                description: `Fulfilling urgent request for ${req.quantity} units of ${req.title} posted by ${req.ngo}.`,
                                photo: null,
                                photoName: '',
                                address: currentMember.location,
                                instructions: '',
                                ngoName: req.ngo // Target the requesting NGO specifically!
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

      default:
        return null;
    }
  };

  const renderNgoContent = () => {
    switch (ngoTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in text-left">
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

            {/* Account Status Banner for Unapproved/Pending NGOs */}
            {/* Account Status Banner for Unapproved/Pending/Rejected NGOs */}
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
                    <p className="text-[11px] text-red-700 font-medium">
                      Your actions (posting requirements and accepting offers) remain strictly locked. Please contact our system administrators at <a href="mailto:admin@gmail.com" className="underline font-bold text-red-900">admin@gmail.com</a> to re-verify your documents or appeal this decision.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 text-left animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0">
                    <ShieldAlert className="w-5 h-5" />
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
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-start gap-5 relative overflow-hidden group">
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
                  <button 
                    onClick={() => setNgoTab('box')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0F340F] hover:bg-[#1C4A1C] rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Go to Donation Box <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card B: Post Request */}
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-start gap-5 relative overflow-hidden group">
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
                  <button 
                    onClick={() => setNgoTab('request')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0F340F] hover:bg-[#1C4A1C] rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Post a Request <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Horizontal 5-Column Impact Stats Bar */}
            <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,52,15,0.01)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#0F340F]/5">
                
                {/* Stat 1: Pending */}
                <div className="flex items-center gap-4 px-2 py-3 md:py-0 md:justify-center group hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-full border-2 border-[#78A642]/30 flex items-center justify-center text-[#78A642] bg-[#F8FAF5] flex-shrink-0 group-hover:bg-[#78A642]/10 transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-2xl font-black text-[#0F340F] font-sans block">{ngoDonations.length}</span>
                    <span className="text-[10px] font-bold text-[#0F340F] block">Pending Donations</span>
                    <span className="text-[9px] text-[#556B5D] font-semibold block mt-0.5">Waiting your acceptance</span>
                  </div>
                </div>

                {/* Stat 2: Received */}
                <div className="flex items-center gap-4 px-2 pt-4 md:pt-0 md:px-4 md:justify-center group hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-full border-2 border-[#78A642]/30 flex items-center justify-center text-[#78A642] bg-[#F8FAF5] flex-shrink-0 group-hover:bg-[#78A642]/10 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-2xl font-black text-[#0F340F] font-sans block">{ngoReceived.length}</span>
                    <span className="text-[10px] font-bold text-[#0F340F] block">Donation Received</span>
                    <span className="text-[9px] text-[#556B5D] font-semibold block mt-0.5">Accepted by NGO</span>
                  </div>
                </div>

                {/* Stat 3: In Deliveries */}
                <div className="flex items-center gap-4 px-2 pt-4 md:pt-0 md:px-4 md:justify-center group hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-full border-2 border-[#78A642]/30 flex items-center justify-center text-[#78A642] bg-[#F8FAF5] flex-shrink-0 group-hover:bg-[#78A642]/10 transition-colors">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-2xl font-black text-[#0F340F] font-sans block">{ngoInDeliveries}</span>
                    <span className="text-[10px] font-bold text-[#0F340F] block">In Deliveries</span>
                    <span className="text-[9px] text-[#556B5D] font-semibold block mt-0.5">Currently on the way</span>
                  </div>
                </div>

                {/* Stat 4: Completed */}
                <div className="flex items-center gap-4 px-2 pt-4 md:pt-0 md:px-4 md:justify-center group hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-full border-2 border-[#78A642]/30 flex items-center justify-center text-[#78A642] bg-[#F8FAF5] flex-shrink-0 group-hover:bg-[#78A642]/10 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-2xl font-black text-[#0F340F] font-sans block">{ngoCompletedDeliveries}</span>
                    <span className="text-[10px] font-bold text-[#0F340F] block">Completed Deliveries</span>
                    <span className="text-[9px] text-[#556B5D] font-semibold block mt-0.5">Successfully delivered</span>
                  </div>
                </div>

                {/* Stat 5: Volunteers */}
                <div className="flex items-center gap-4 px-2 pt-4 md:pt-0 md:px-4 md:justify-center group hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-full border-2 border-[#78A642]/30 flex items-center justify-center text-[#78A642] bg-[#F8FAF5] flex-shrink-0 group-hover:bg-[#78A642]/10 transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-2xl font-black text-[#0F340F] font-sans block">{ngoActiveVolunteers}</span>
                    <span className="text-[10px] font-bold text-[#0F340F] block">Active Volunteers</span>
                    <span className="text-[9px] text-[#556B5D] font-semibold block mt-0.5">Helping in deliveries</span>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Beautiful Centered Social Impact Quote (Howard Zinn) */}
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

      case 'box':
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

      case 'received':
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

      case 'request':
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

      case 'deliveries':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">🚚 ACTIVE COURIER & DELIVERIES</h2>
                <p className="text-xs font-semibold text-[#556B5D] mt-1">Monitor volunteers transporting donation packages from donor doorsteps to your facility.</p>
              </div>
              <span className="bg-[#78A642]/10 text-[#78A642] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#78A642]/20 select-none">
                {ngoDeliveries.length} Active Runs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ngoDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      delivery.status === 'Successfully delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800 animate-pulse'
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

      default:
        return null;
    }
  };

  const renderDossierModal = () => {
    if (!selectedDossier) return null;
    const { type, data } = selectedDossier;

    const onClose = () => setSelectedDossier(null);

    // Calculate dynamic stats
    let totalDonations = 0;
    let totalRequests = 0;
    let totalDeliveries = 0;

    if (type === 'Member') {
      totalDonations = donations.filter(d => d.donorEmail === data.email).length;
      totalDeliveries = donations.filter(d => d.courier && d.courier.startsWith(data.fullName)).length;
    } else {
      totalRequests = ngoRequests.filter(r => r.ngo === data.ngoName).length;
      totalDonations = donations.filter(d => d.ngo === data.ngoName && d.status === 'Delivered').length;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E392A]/60 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-2xl paper-sheet border border-[#0F340F]/15 animate-float p-6 md:p-8 relative text-left bg-white rounded-3xl shadow-2xl">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-[#556B5D] hover:text-[#0F340F] transition-colors p-1.5 rounded-full hover:bg-[#F4F7F2]"
            aria-label="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dossier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0F340F]/10 pb-4 mb-6 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#78A642] bg-[#F8FAF5] border border-[#78A642]/10 px-2.5 py-0.5 rounded-full">
                🔍 {type} Dossier Details
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#0F340F] font-serif mt-2">
                {type === 'Member' ? data.fullName : data.ngoName}
              </h2>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                data.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : data.status === 'Rejected'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                ● {data.status || 'Pending'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left side: Detailed Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5">
                <span>📋</span> Contact & Registry Profiles
              </h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-[#556B5D]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📧 Email Address</span>
                  <span className="text-[#0F340F] text-sm break-all font-mono font-bold">
                    {type === 'Member' ? data.email : data.officialEmail}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📞 Contact Number</span>
                  <span className="text-[#0F340F] text-sm font-mono font-bold">{data.phone}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📍 Address / Location</span>
                  <span className="text-[#0F340F] text-sm leading-relaxed">
                    {type === 'Member' ? data.location : data.address}
                  </span>
                </div>

                {type === 'NGO' && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📄 Govt Registration Number</span>
                    <span className="text-[#0F340F] font-mono font-bold text-sm bg-cream px-1.5 py-0.5 rounded border border-[#0F340F]/5">
                      {data.registrationNumber}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#556B5D]/60 block mb-0.5">📅 Joined System Date</span>
                  <span className="text-[#0F340F] font-serif font-bold">{data.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Right side: Mission or Calculated Metrics */}
            <div className="space-y-6">
              
              {/* Calculated Stats Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5">
                  <span>📊</span> Impact Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {type === 'Member' ? (
                    <>
                      <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                        <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Donations</span>
                        <span className="text-xl font-black text-[#0F340F] block mt-1">{totalDonations} booked</span>
                      </div>
                      <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                        <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Deliveries</span>
                        <span className="text-xl font-black text-[#0F340F] block mt-1">{totalDeliveries} runs</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                        <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Requests Posted</span>
                        <span className="text-xl font-black text-[#0F340F] block mt-1">{totalRequests} posted</span>
                      </div>
                      <div className="bg-[#F8FAF5] border border-[#0F340F]/5 p-3 rounded-xl hover:scale-[1.02] transition-transform">
                        <span className="text-[9px] uppercase font-bold text-[#556B5D] block">Donations Fulfilled</span>
                        <span className="text-xl font-black text-[#0F340F] block mt-1">{totalDonations} received</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mission / Description or Certificate */}
              {type === 'NGO' ? (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5">
                    <span>🏢</span> NGO Profile Mission
                  </h3>
                  <div className="bg-cream/40 border border-[#0F340F]/5 p-3.5 rounded-xl text-xs font-semibold text-[#556B5D] leading-relaxed italic max-h-[140px] overflow-y-auto">
                    "{data.description}"
                  </div>

                  {/* Mock Certificate Card */}
                  <div className="bg-gradient-to-br from-[#0F340F]/5 to-[#78A642]/5 border border-[#0F340F]/10 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#0F340F]/10 flex items-center justify-center text-red-600 font-extrabold flex-shrink-0">
                      PDF
                    </div>
                    <div className="text-left flex-grow">
                      <span className="text-[10px] font-black uppercase text-[#556B5D] block">Verification Certificate</span>
                      <span className="text-xs font-bold text-[#0F340F] block underline truncate cursor-pointer hover:text-[#78A642]">
                        {data.certificate || 'ngo_registration.pdf'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0F340F] border-b border-[#0F340F]/5 pb-1 flex items-center gap-1.5">
                    <span>👑</span> Member Account Role
                  </h3>
                  <div className="bg-cream/40 border border-[#0F340F]/5 p-4 rounded-xl text-xs font-semibold text-[#556B5D] leading-relaxed space-y-1">
                    <p>🧑‍💼 <span className="font-extrabold text-[#0F340F]">System Role:</span> {data.role}</p>
                    <p className="text-[11px] text-[#556B5D]/80 leading-normal mt-1">
                      This member is actively registered as a {data.role === 'Member' ? 'Donor / Courier' : 'System Operator'} and maintains full access to schedule donations, request receipts, and claim logistics runs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification Drawer Actions Footer */}
          <div className="border-t border-[#0F340F]/10 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {type === 'NGO' ? (
              <>
                <div className="flex gap-2">
                  {data.status !== 'Approved' && (
                    <button
                      onClick={() => {
                        handleApproveNgo(data._id || data.id);
                        onClose();
                      }}
                      className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      ✔️ Approve NGO
                    </button>
                  )}
                  {data.status !== 'Rejected' && (
                    <button
                      onClick={() => {
                        handleRejectNgo(data._id || data.id);
                        onClose();
                      }}
                      className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      ❌ Reject NGO
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    if (confirm(`Are you absolutely sure you want to permanently delete NGO "${data.ngoName}" from the registry?`)) {
                      handleDeleteUser(data._id || data.id);
                      onClose();
                    }
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer self-end sm:self-center"
                >
                  🗑️ Delete Account
                </button>
              </>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold text-[#556B5D]/60 block">MEMBER ACCOUNT ACTIONS</span>
                  <span className="text-xs font-semibold text-emerald-600 block mt-0.5">● Profile Active & Verified</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Are you absolutely sure you want to permanently delete Member "${data.fullName}" from the registry?`)) {
                      handleDeleteUser(data._id || data.id);
                      onClose();
                    }
                  }}
                  className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  🗑️ Delete Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAdminContent = () => {
    // Filtered lists for search utility
    const filteredNgos = adminNgos.filter(ngo => 
      ngo.ngoName.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      ngo.officialEmail.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      ngo.registrationNumber.toLowerCase().includes(adminSearchQuery.toLowerCase())
    );

    const filteredUsers = adminUsers.filter(user => 
      user.fullName.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(adminSearchQuery.toLowerCase())
    );

    switch (adminTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat 1 */}
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-[#0F340F] block">{adminUsers.length}</span>
                  <span className="text-xs font-bold text-[#556B5D]">Total Members</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-[#0F340F] block">{adminNgos.length}</span>
                  <span className="text-xs font-bold text-[#556B5D]">Registered NGOs</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-[#0F340F] block">12,580</span>
                  <span className="text-xs font-bold text-[#556B5D]">Donations Transacted</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-5 shadow-sm hover:scale-[1.01] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8FAF5] border border-[#0F340F]/10 flex items-center justify-center text-[#78A642] flex-shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-[#0F340F] block">324</span>
                  <span className="text-xs font-bold text-[#556B5D]">Active Couriers</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Pending NGO Document Approvals */}
              <div className="lg:col-span-7 bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3 flex items-center justify-between">
                  <span>⏳ Pending NGO Approvals</span>
                  <span className="bg-[#78A642]/10 text-[#78A642] border border-[#78A642]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {adminNgos.filter(n => n.status === 'Pending').length} Action Required
                  </span>
                </h3>

                {adminNgos.filter(n => n.status === 'Pending').length === 0 ? (
                  <div className="py-8 text-center text-[#556B5D] text-xs font-semibold">
                    🎉 All submitted NGO registrations are reviewed and verified!
                  </div>
                ) : (
                  <div className="divide-y divide-[#0F340F]/5">
                    {adminNgos.filter(n => n.status === 'Pending').map(ngo => (
                      <div key={ngo._id || ngo.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                        <div className="space-y-1">
                          <h4 
                            className="font-bold text-[#0F340F] text-sm cursor-pointer hover:underline hover:text-[#78A642] transition-colors"
                            onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                          >
                            🏢 {ngo.ngoName}
                          </h4>
                          <div className="text-[11px] text-[#556B5D] space-y-0.5 font-medium">
                            <p>📧 {ngo.officialEmail} | 📞 {ngo.phone}</p>
                            <p>📄 Reg No: <span className="font-bold text-[#0F340F]">{ngo.registrationNumber}</span></p>
                            <p 
                              className="underline text-[#78A642] cursor-pointer font-bold hover:text-[#0F340F] transition-colors"
                              onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                            >
                              📎 View Certificate & Full Dossier: {ngo.certificate}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                          <button
                            onClick={() => handleApproveNgo(ngo._id || ngo.id)}
                            className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            ✔️ Approve
                          </button>
                          <button
                            onClick={() => handleRejectNgo(ngo._id || ngo.id)}
                            className="border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Recent Activity Stream */}
              <div className="lg:col-span-5 bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-3">⚙️ System Audit Feed</h3>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {adminLogs.map(log => (
                    <div key={log.id} className="p-3 bg-[#F8FAF5] rounded-xl border border-[#0F340F]/5 text-[11px] font-semibold text-[#556B5D] space-y-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="bg-[#0F340F]/5 text-[#0F340F] px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                          {log.category}
                        </span>
                        <span className="text-[9px] text-[#556B5D]/60 font-bold">{log.timestamp}</span>
                      </div>
                      <p className="text-[#0F340F] leading-relaxed mt-0.5">{log.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ngos':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#0F340F]/10 pb-4 gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">🏢 REGISTERED NGOs</h2>
                <p className="text-xs font-semibold text-[#556B5D] mt-1">Review official registrations, verification metrics, and system profiles.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search NGO name, email..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="bg-white border border-[#0F340F]/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#78A642] text-[#0F340F] shadow-sm w-64 placeholder-[#556B5D]/40"
                />
                <Search className="w-4 h-4 text-[#556B5D]/40 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="bg-white border border-[#0F340F]/8 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-[#556B5D] divide-y divide-[#0F340F]/5">
                  <thead className="bg-[#F8FAF5] text-[#0F340F] text-[10px] font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">NGO Name</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Verification ID</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F340F]/5">
                    {filteredNgos.map(ngo => (
                      <tr key={ngo._id || ngo.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
                          {ngo.ngoName}
                        </td>
                        <td className="px-6 py-4 font-medium leading-relaxed">
                          <p>📧 {ngo.officialEmail}</p>
                          <p>📞 {ngo.phone}</p>
                          <p className="text-[10px] text-[#556B5D]/60 mt-0.5">📍 {ngo.address}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-[#0F340F]">
                          {ngo.registrationNumber}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            ngo.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : ngo.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {ngo.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {ngo.joinedDate}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedDossier({ type: 'NGO', data: ngo })}
                              className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-sky-150 transition-colors cursor-pointer"
                            >
                              🔍 View Dossier
                            </button>
                            {ngo.status !== 'Approved' && (
                              <button
                                onClick={() => handleApproveNgo(ngo._id || ngo.id)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl border border-emerald-150 transition-colors cursor-pointer"
                                title="Approve NGO"
                              >
                                ✔️ Approve
                              </button>
                            )}
                            {ngo.status !== 'Rejected' && (
                              <button
                                onClick={() => handleRejectNgo(ngo._id || ngo.id)}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl border border-amber-150 transition-colors cursor-pointer"
                                title="Reject NGO"
                              >
                                ❌ Reject
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to permanently delete NGO "${ngo.ngoName}" from the registry?`)) {
                                  handleDeleteUser(ngo._id || ngo.id);
                                }
                              }}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#0F340F]/10 pb-4 gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">👥 REGISTERED MEMBERS</h2>
                <p className="text-xs font-semibold text-[#556B5D] mt-1">Audit active profiles, donation/volunteer logs, and contact vectors.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user name, email..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="bg-white border border-[#0F340F]/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#78A642] text-[#0F340F] shadow-sm w-64 placeholder-[#556B5D]/40"
                />
                <Search className="w-4 h-4 text-[#556B5D]/40 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="bg-white border border-[#0F340F]/8 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-[#556B5D] divide-y divide-[#0F340F]/5">
                  <thead className="bg-[#F8FAF5] text-[#0F340F] text-[10px] font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Full Name</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Active Profile Roles</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F340F]/5">
                    {filteredUsers.map(user => (
                      <tr key={user._id || user.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 font-medium leading-normal">
                          <p>📧 {user.email}</p>
                          <p>📞 {user.phone}</p>
                          <p className="text-[10px] text-[#556B5D]/60 mt-0.5">📍 {user.location}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            user.role.includes('Volunteer')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {user.joinedDate}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedDossier({ type: 'Member', data: user })}
                              className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-sky-150 transition-colors cursor-pointer"
                            >
                              🔍 View Dossier
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to permanently delete Member "${user.fullName}" from the registry?`)) {
                                  handleDeleteUser(user._id || user.id);
                                }
                              }}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-[#0F340F]/10 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">📋 FULL SYSTEM AUDIT LOGS</h2>
                <p className="text-xs font-semibold text-[#556B5D] mt-1">Chronological history of registered logins, administrative choices, and community actions.</p>
              </div>
              <button
                onClick={() => setAdminLogs([])}
                className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                Clear Audit Log
              </button>
            </div>

            <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-6 shadow-sm max-h-[600px] overflow-y-auto space-y-3">
              {adminLogs.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-[#556B5D]">
                  🍃 Audit feed empty. All actions cleared.
                </div>
              ) : (
                adminLogs.map(log => (
                  <div key={log.id} className="p-4 bg-[#F8FAF5] rounded-xl border border-[#0F340F]/5 text-xs font-semibold text-[#556B5D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="bg-[#0F340F] text-white px-2.5 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider flex-shrink-0">
                        {log.category}
                      </span>
                      <p className="text-[#0F340F] leading-normal">{log.event}</p>
                    </div>
                    <span className="text-[10px] text-[#556B5D]/60 font-bold whitespace-nowrap self-end sm:self-center">
                      ⏱️ {log.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If path matches /member, render the beautiful, premium Member Dashboard
  if (currentPath === '/member') {
    if (!currentMember) {
      // If not logged in, immediately redirect to landing page
      navigateTo('/');
      return null;
    }
    return (
      <div className="min-h-screen bg-[#F8FAF5] font-sans antialiased text-[#0F340F]">
        
        {/* 1. TOP NAVBAR HEADER (Deep Forest Green Background) */}
        <header className="bg-[#0F340F] text-white px-6 md:px-8 py-3.5 shadow-md relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo rendered in high-contrast white */}
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
              <Logo light={true} />
            </div>

            {/* Profile trigger & Sign Out (Pure White) */}
            <div className="flex items-center gap-6 text-sm">
              <div 
                onClick={() => setDashboardTab('profile')}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <div className="w-9 h-9 rounded-full bg-white text-[#0F340F] flex items-center justify-center font-bold text-sm border border-white/5 group-hover:scale-105 transition-transform">
                  {currentMember.initials}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-white">Hello, {currentMember.fullName.split(' ')[0]}</span>
                  <span className="text-[10px] text-white/70 font-semibold underline mt-0.5 group-hover:text-white">View My Profile</span>
                </div>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </div>

              <span className="h-6 w-[1px] bg-white/20"></span>

              <button 
                onClick={() => {
                  setCurrentMember(null);
                  localStorage.removeItem('currentMember');
                  navigateTo('/');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 text-white font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* 2. HORIZONTAL TAB NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8">
          <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-1 shadow-[0_2px_12px_rgba(15,52,15,0.02)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2.5 px-4 overflow-x-auto scrollbar-hide">
              
              {/* Left Side: Standard Navigation Tabs */}
              <div className="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
                <button 
                  onClick={() => setDashboardTab('dashboard')}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                    dashboardTab === 'dashboard' || dashboardTab === 'donate' || dashboardTab === 'tasks'
                      ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                      : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                  }`}
                >
                  <Home className="w-4 h-4" /> Dashboard
                </button>

                <button 
                  onClick={() => setDashboardTab('deliveries')}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                    dashboardTab === 'deliveries'
                      ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                      : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                  }`}
                >
                  <Truck className="w-4 h-4" /> My Deliveries
                </button>

                <button 
                  onClick={() => setDashboardTab('donations')}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                    dashboardTab === 'donations'
                      ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                      : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                  }`}
                >
                  <Package className="w-4 h-4" /> My Donations
                </button>

                <button 
                  onClick={() => setDashboardTab('achievements')}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                    dashboardTab === 'achievements'
                      ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                      : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                  }`}
                >
                  <Award className="w-4 h-4" /> Achievements
                </button>
              </div>

              {/* Right Side: Animated Urgent Needs Cherry Red Button */}
              <div className="relative group flex-shrink-0 select-none">
                {/* Pulsing Outer Crimson Glow */}
                <div className="absolute -inset-0.5 bg-[#E32121] rounded-full blur opacity-55 group-hover:opacity-75 transition duration-300 animate-emergency-glow"></div>
                
                <button
                  onClick={() => setDashboardTab('urgent')}
                  className={`relative inline-flex items-center gap-3 px-5 py-3 rounded-full font-extrabold text-[13px] text-white shadow-sm transition-all cursor-pointer select-none whitespace-nowrap overflow-visible ${
                    dashboardTab === 'urgent'
                      ? 'bg-[#C61818] ring-2 ring-red-400/40'
                      : 'bg-[#E32121] hover:bg-[#C61818] hover:scale-[1.03] active:scale-[0.97]'
                  }`}
                >
                  {/* Alarm Ringing Bell icon */}
                  <Bell className="w-4 h-4 text-white animate-emergency-ring" />
                  <span>Urgent NGO Needs</span>
                  
                  {/* White circle with dark red count */}
                  <span className="bg-white text-[#E32121] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black leading-none shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                    {ngoRequests.length}
                  </span>
                </button>

                {/* 3 Green radiating spark lines exactly like the user's uploaded image */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#78A642] absolute -top-4 -right-3.5 pointer-events-none select-none animate-pulse">
                  <path d="M4 14C5.5 11 8 9 11.5 8.5" />
                  <path d="M10 13C12.5 10 16 8.5 20 8.5" />
                  <path d="M15 14C17.5 12 21 11.5 24 13" />
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE CONTAINER */}
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
          {renderDashboardContent()}
        </main>

      </div>
    );
  }

  // If path matches /ngo, render the beautiful, premium NGO Dashboard
  if (currentPath === '/ngo') {
    if (!currentNgo) {
      // If not logged in, immediately redirect to landing page
      navigateTo('/');
      return null;
    }
    return (
      <div className="min-h-screen bg-[#F8FAF5] font-sans antialiased text-[#0F340F]">
        
        {/* 1. TOP NAVBAR HEADER (Deep Forest Green Background) */}
        <header className="bg-[#0F340F] text-white px-6 md:px-8 py-3.5 shadow-md relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo rendered in high-contrast white */}
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
              <Logo light={true} />
            </div>

            {/* Profile trigger & Sign Out (Pure White) */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2.5 select-none">
                <div className="w-9 h-9 rounded-full bg-white text-[#0F340F] flex items-center justify-center font-bold text-sm border border-white/5 flex-shrink-0">
                  🏢
                </div>
                <div className="flex flex-col text-left">
                  <label className="text-[9px] text-white/60 font-extrabold uppercase tracking-wide leading-none mb-0.5">Active NGO</label>
                  <select
                    value={currentNgo.ngoName}
                    onChange={(e) => {
                      const selected = adminNgos.find(n => n.ngoName === e.target.value);
                      if (selected) {
                        setCurrentNgo(selected);
                        setNgoTab('dashboard');
                      }
                    }}
                    className="bg-transparent border-0 text-white font-bold text-xs p-0 focus:ring-0 focus:outline-none cursor-pointer pr-5 font-serif select-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right center',
                      backgroundSize: '1.1em',
                      backgroundRepeat: 'no-repeat',
                      paddingRight: '1.2rem',
                      colorScheme: 'dark'
                    }}
                  >
                    {adminNgos.length === 0 ? (
                      <option value={currentNgo.ngoName} className="bg-[#0F340F] text-white font-bold">{currentNgo.ngoName}</option>
                    ) : (
                      adminNgos.map(ngo => (
                        <option 
                          key={ngo._id || ngo.id} 
                          value={ngo.ngoName} 
                          className="bg-[#0F340F] text-white font-bold font-sans"
                        >
                          {ngo.ngoName} ({ngo.status})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <span className="h-6 w-[1px] bg-white/20"></span>

              <button 
                onClick={() => {
                  setCurrentNgo(null);
                  localStorage.removeItem('currentNgo');
                  navigateTo('/');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 text-white font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* 2. HORIZONTAL TAB NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8">
          <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-1 shadow-[0_2px_12px_rgba(15,52,15,0.02)]">
            <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8 overflow-x-auto py-2.5 px-4 scrollbar-hide">
              <button 
                onClick={() => setNgoTab('dashboard')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  ngoTab === 'dashboard'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Home className="w-4 h-4" /> Dashboard
              </button>

              <button 
                onClick={() => setNgoTab('box')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  ngoTab === 'box'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Package className="w-4 h-4" /> Donation Box
              </button>

              <button 
                onClick={() => setNgoTab('received')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  ngoTab === 'received'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Donation Received
              </button>

              <button 
                onClick={() => setNgoTab('request')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  ngoTab === 'request'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Clipboard className="w-4 h-4" /> My Request
              </button>

              <button 
                onClick={() => setNgoTab('deliveries')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  ngoTab === 'deliveries'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Truck className="w-4 h-4" /> Deliveries
              </button>
            </div>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE CONTAINER */}
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
          {!isApproved && (
            ngoStatus === 'Rejected' ? (
              <div className="mb-6 p-5 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm text-red-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold flex items-center gap-1.5 text-red-800">
                    <span>❌</span> Account Registration Rejected
                  </h4>
                  <p className="text-xs text-red-700 font-semibold leading-relaxed">
                    Your NGO credentials verification request was reviewed and rejected by the administration team. Please contact <a href="mailto:admin@gmail.com" className="underline font-bold text-red-950">admin@gmail.com</a> to appeal.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    // Admin approval shortcut for easy client-side demo testing!
                    if (activeNgoRecord) {
                      try {
                        const res = await fetch(`http://localhost:5001/api/users/ngos/${activeNgoRecord._id || activeNgoRecord.id}/verify`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'Approved' })
                        });
                        if (res.ok) {
                          fetchAllData();
                        }
                      } catch (err) {
                        console.error('Error approving NGO shortcut:', err);
                      }
                    } else {
                      setAdminNgos(adminNgos.map(n => n.ngoName === currentNgo.ngoName ? { ...n, status: 'Approved' } : n));
                    }
                  }}
                  className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
                >
                  ✔️ Re-Approve Instantly (Demo Shortcut)
                </button>
              </div>
            ) : (
              <div className="mb-6 p-5 rounded-2xl border border-amber-200 bg-amber-50/80 backdrop-blur-sm text-amber-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold flex items-center gap-1.5 text-amber-800">
                    <span>⚠️</span> Account Pending Verification Approval
                  </h4>
                  <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                    Your NGO account is currently pending document validation checks by the Pick&Give administrative team. You can still browse, but actions are locked until verification is complete.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    // Admin approval shortcut for easy client-side demo testing!
                    if (activeNgoRecord) {
                      try {
                        const res = await fetch(`http://localhost:5001/api/users/ngos/${activeNgoRecord._id || activeNgoRecord.id}/verify`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'Approved' })
                        });
                        if (res.ok) {
                          fetchAllData();
                        }
                      } catch (err) {
                        console.error('Error approving NGO shortcut:', err);
                      }
                    } else {
                      setAdminNgos(adminNgos.map(n => n.ngoName === currentNgo.ngoName ? { ...n, status: 'Approved' } : n));
                    }
                  }}
                  className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
                >
                  ✔️ Approve Account Instantly
                </button>
              </div>
            )
          )}
          {renderNgoContent()}
        </main>

      </div>
    );
  }

  // If path matches /admin, render the beautiful, premium Admin Dashboard Portal
  if (currentPath === '/admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminSignIn 
          setIsAdminLoggedIn={setIsAdminLoggedIn} 
          navigateTo={navigateTo} 
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAF5] font-sans antialiased text-[#0F340F]">
        
        {/* 1. TOP NAVBAR HEADER (Deep Forest Green Background) */}
        <header className="bg-[#0F340F] text-white px-6 md:px-8 py-3.5 shadow-md relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo rendered in high-contrast white */}
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
              <Logo light={true} />
            </div>

            {/* Profile trigger & Sign Out (Pure White) */}
            <div className="flex items-center gap-6 text-sm">
              <div 
                onClick={() => setAdminTab('overview')}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <div className="w-9 h-9 rounded-full bg-white text-[#0F340F] flex items-center justify-center font-bold text-sm border border-white/5 group-hover:scale-105 transition-transform">
                  👑
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                    Admin Portal <ChevronDown className="w-3 h-3 text-white/60 inline" />
                  </span>
                  <span className="text-[10px] text-white/70 font-semibold underline mt-0.5 group-hover:text-white">System Admin</span>
                </div>
              </div>

              <span className="h-6 w-[1px] bg-white/20"></span>

              <button 
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  navigateTo('/');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 text-white font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* 2. HORIZONTAL TAB NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8">
          <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-1 shadow-[0_2px_12px_rgba(15,52,15,0.02)]">
            <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8 overflow-x-auto py-2.5 px-4 scrollbar-hide">
              <button 
                onClick={() => setAdminTab('overview')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  adminTab === 'overview'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Home className="w-4 h-4" /> Overview
              </button>

              <button 
                onClick={() => setAdminTab('ngos')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  adminTab === 'ngos'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Building className="w-4 h-4" /> Registered NGOs
              </button>

              <button 
                onClick={() => setAdminTab('users')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  adminTab === 'users'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Users className="w-4 h-4" /> Registered Members
              </button>

              <button 
                onClick={() => setAdminTab('logs')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  adminTab === 'logs'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Clipboard className="w-4 h-4" /> System Audit Logs
              </button>
            </div>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE CONTAINER */}
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
          {renderAdminContent()}
        </main>

        {/* 4. DETAILS DOSSIER DRAWER/MODAL */}
        {selectedDossier && renderDossierModal()}

      </div>
    );
  }

  // Otherwise, render the Premium Landing Page (Standard Root Path)
  return (
    <div className="min-h-screen bg-white font-sans text-slateblack antialiased relative">
      
      {/* Decorative background vectors representing leaves */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-leaf/5 rounded-full filter blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-sage/5 rounded-full filter blur-3xl pointer-events-none z-0" />

      {/* SVGs needed for Clip-Paths */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="organic-leaf-mask" clipPathUnits="objectBoundingBox">
            <path d="M 0.12 0 L 1 0 L 1 1 L 0.12 1 C 0.05 0.8, 0 0.5, 0.12 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-forest/5 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with leaves matching upload */}
          <Logo />

          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[13px] xl:text-sm font-semibold text-slateblack">
            <a href="#home" className="hover:text-leaf transition-colors whitespace-nowrap">Home</a>
            <a href="#how-it-works" className="hover:text-leaf transition-colors whitespace-nowrap">How It Works</a>
            <a href="#about-us" className="hover:text-leaf transition-colors whitespace-nowrap">About Us</a>
          </nav>

          {/* Action Buttons bound to modals / active sessions */}
          <div className="flex items-center gap-2 xl:gap-3">
            {currentMember ? (
              <>
                <button 
                  onClick={() => navigateTo('/member')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-semibold text-white bg-forest hover:bg-forest-hover rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <User className="w-4 h-4 flex-shrink-0" /> Hello, {currentMember.fullName.split(' ')[0]} (Go to Dashboard)
                </button>
                <button 
                  onClick={() => {
                    setCurrentMember(null);
                    localStorage.removeItem('currentMember');
                    navigateTo('/');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-bold text-forest hover:bg-[#F4F7F2] rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" /> Sign Out
                </button>
              </>
            ) : currentNgo ? (
              <>
                <button 
                  onClick={() => navigateTo('/ngo')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-semibold text-white bg-forest hover:bg-forest-hover rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Building className="w-4 h-4 flex-shrink-0" /> {currentNgo.ngoName} (Go to Dashboard)
                </button>
                <button 
                  onClick={() => {
                    setCurrentNgo(null);
                    localStorage.removeItem('currentNgo');
                    navigateTo('/');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-bold text-forest hover:bg-[#F4F7F2] rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" /> Sign Out
                </button>
              </>
            ) : isAdminLoggedIn ? (
              <>
                <button 
                  onClick={() => navigateTo('/admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-semibold text-white bg-forest hover:bg-forest-hover rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  👑 Admin Control Panel
                </button>
                <button 
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    navigateTo('/');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-bold text-forest hover:bg-[#F4F7F2] rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowSignInModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-bold text-forest hover:bg-[#F4F7F2] rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  <User className="w-4 h-4 flex-shrink-0" /> Sign In
                </button>
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-semibold text-white bg-forest hover:bg-forest-hover rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4 flex-shrink-0" /> Join as Member
                </button>
                <button 
                  onClick={() => setShowNgoModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-[12px] xl:text-sm font-semibold text-forest hover:bg-forest/5 bg-transparent border-2 border-forest rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Building className="w-4 h-4 flex-shrink-0" /> Register NGO
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-cream/30 via-white to-white px-4 md:px-8">
        
        {/* Floating decorative elements */}
        <div className="absolute top-24 left-10 text-leaf/10 animate-pulse pointer-events-none">
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 100 100">
            <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Info */}
          <div className="lg:col-span-6 flex flex-col items-start text-center lg:text-left">
            
            {/* Small leaf badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-forest text-xs font-semibold uppercase tracking-wider mb-6 mx-auto lg:mx-0 select-none">
              <span className="w-2 h-2 rounded-full bg-leaf animate-pulse"></span>
              Together We Create Change
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-forest leading-[1.12] mb-6 font-serif">
              Give What You Can.<br />
              <span className="bg-gradient-to-r from-forest via-leaf to-forest bg-clip-text text-transparent">
                Deliver What Matters.
              </span>
            </h1>

            <p className="text-base md:text-lg text-mutegreen max-w-xl mb-8 font-medium mx-auto lg:mx-0">
              Connect with nearby NGOs, donate useful items, volunteer for deliveries, and create real impact in your community.
            </p>

            {/* CTA Group bound to modals */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start w-full">
              <button 
                onClick={() => setShowMemberModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-forest hover:bg-forest-hover rounded-full shadow-md shadow-forest/10 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5" /> Join as Member
              </button>
              <button 
                onClick={() => setShowNgoModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-forest bg-transparent border-2 border-forest hover:bg-forest/5 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              >
                <Building className="w-5 h-5" /> Register NGO
              </button>
              <button 
                onClick={() => setShowSignInModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-forest bg-[#F4F7F2] rounded-full hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              >
                <User className="w-5 h-5 animate-pulse text-[#78A642]" /> Sign In to Dashboard
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full border-t border-forest/5 pt-6 text-left">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Verified NGOs</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Community Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Zero Waste Mission</span>
              </div>
            </div>
          </div>

          {/* Hero Right Illustration showing mock clean image */}
          <div className="lg:col-span-6 relative flex flex-col items-center w-full">
            {/* Stunning Leaf Masked Container */}
            <div className="leaf-mask-container shadow-2xl">
              <img
                src={donationDeliveryImg}
                alt="Donation pipeline visual"
                className="leaf-mask-image"
              />
            </div>
            
            {/* Soft decorative elements backing the leaf */}
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-sage/20 rounded-full filter blur-xl animate-pulse pointer-events-none" />
          </div>
        </div>
      </section>

      {/* STATS BAR SECTION */}
      <section id="impact" className="py-6 px-4 md:px-8 bg-white z-10 relative">
        <div className="max-w-7xl mx-auto bg-forest text-cream rounded-2xl p-6 md:p-8 stats-bar-shadow">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center">
            {STATS_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center gap-1.5 group hover:scale-[1.03] transition-transform duration-200">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sage group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white leading-none mt-1">
                    {item.value}
                  </h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-wide uppercase text-sage">
                    {item.label}
                  </p>
                  <p className="text-[9px] text-white/50 px-2 line-clamp-1">
                    {item.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COLUMN CONTENT SECTIONS */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 bg-cream/30 border-t border-b border-forest/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column 1: How Pick&Give Works */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-forest mb-4 font-serif">
                How Pick&Give Works 🌿
              </h2>
              <p className="text-mutegreen text-sm mb-8 leading-relaxed font-medium">
                We make contribution seamless. Follow our direct pipelines to start supporting local organizations in just a few clicks.
              </p>

              {/* Steps vertical flow */}
              <div className="flex flex-col gap-6 mb-8">
                {FLOW_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className={`w-8 h-8 rounded-full ${step.colorClass} flex items-center justify-center font-bold text-white text-xs flex-shrink-0 transition-transform group-hover:scale-110 duration-200 shadow-sm`}>
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-forest mb-0.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-mutegreen leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-6"></div>
          </div>

          {/* Column 2: What Can You Donate? */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-forest mb-4 font-serif">
                What Can You Donate? 📦
              </h2>
              <p className="text-mutegreen text-sm mb-8 leading-relaxed font-medium">
                Select your category and start packing. We accept a wide range of essential resources to meet community needs.
              </p>

              {/* Grid 4x2 categories */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {DONATION_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center aspect-square border rounded-xl cursor-pointer select-none transition-all duration-300 ${isSelected ? 'bg-white border-leaf shadow-md scale-105' : 'bg-cream/40 border-forest/10 hover:bg-white hover:border-leaf/50 hover:shadow-sm hover:-translate-y-1'}`}
                      onClick={() => setActiveCategory(idx)}
                    >
                      <Icon className={`w-6 h-6 mb-1.5 transition-colors ${isSelected ? 'text-leaf' : 'text-forest'}`} />
                      <span className="text-[10px] font-bold text-slateblack text-center">{cat.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => setShowMemberModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-leaf hover:bg-leaf-hover rounded-full self-start shadow-sm cursor-pointer transition-all"
            >
              Donate Now <Heart className="w-4 h-4 fill-white text-white" />
            </button>
          </div>

          {/* Column 3: Why Choose Pick&Give? */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-forest mb-4 font-serif">
                Why Choose Pick&Give? ✨
              </h2>
              <p className="text-mutegreen text-sm mb-8 leading-relaxed font-medium">
                Transparency and safety are built into every contribution. Know exactly where your support lands.
              </p>

              {/* Feature highlights list */}
              <div className="flex flex-col gap-4 mb-8">
                {BENEFITS.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start p-3 rounded-xl border border-forest/5 hover:border-leaf/25 hover:bg-white hover:shadow-sm transition-all duration-300">
                      <div className="w-9 h-9 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-forest mb-0.5">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-mutegreen leading-relaxed font-medium">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-mutegreen">
              <Info className="w-4 h-4 text-leaf flex-shrink-0" />
              Secure verified operations inside your city.
            </div>
          </div>

        </div>
      </section>

      {/* DEDICATED ABOUT US SECTION */}
      <section id="about-us" className="py-20 px-4 md:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-forest mb-4 font-serif">
              About Pick&Give 🌿
            </h2>
            <div className="w-16 h-1 bg-leaf mx-auto mb-6 rounded-full"></div>
            <p className="text-mutegreen text-base font-medium leading-relaxed">
              We are a dedicated community bridge designed to connect kind hearts directly with local social needs. By matching generous donors, reliable volunteer drivers, and verified NGOs, we ensure that every single item makes a meaningful, direct difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1: Our Mission */}
            <div className="bg-cream/25 border border-forest/5 p-8 rounded-2xl hover:border-leaf/30 transition-all duration-300">
              <div className="w-12 h-12 bg-leaf/10 rounded-xl flex items-center justify-center text-leaf mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-forest mb-3 font-serif">Our Mission</h3>
              <p className="text-sm text-mutegreen leading-relaxed font-medium">
                To simplify material philanthropy by creating a transparent, real-time connected logistics system where people can easily donate items they no longer need directly to those who do.
              </p>
            </div>

            {/* Card 2: Transparency First */}
            <div className="bg-cream/25 border border-forest/5 p-8 rounded-2xl hover:border-leaf/30 transition-all duration-300">
              <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center text-forest mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-forest mb-3 font-serif">Transparency First</h3>
              <p className="text-sm text-mutegreen leading-relaxed font-medium">
                Every matched donation is tracked from pickup to handoff. Verified photograph confirmations and direct notifications give our donors absolute confidence and visual impact proof.
              </p>
            </div>

            {/* Card 3: Direct Community Contact */}
            <div className="bg-cream/25 border border-forest/5 p-8 rounded-2xl hover:border-leaf/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-leaf/10 rounded-xl flex items-center justify-center text-[#7EB138] mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-forest mb-3 font-serif">Connect Directly</h3>
                <p className="text-sm text-mutegreen leading-relaxed font-medium mb-4">
                  Need custom delivery coordination or NGO bulk integrations? Speak directly with our dedicated community support desk.
                </p>
              </div>
              <div className="border-t border-forest/5 pt-4 flex flex-col gap-2">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-xs font-bold text-forest hover:text-leaf transition-colors text-left">
                  <Phone className="w-3.5 h-3.5 text-leaf" /> +91 98765 43210 (Toll-Free Support)
                </a>
                <a href="tel:+919999988888" className="flex items-center gap-2 text-xs font-bold text-forest hover:text-leaf transition-colors text-left">
                  <Phone className="w-3.5 h-3.5 text-leaf" /> +91 99999 88888 (NGO Desk Coordinator)
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick contact banners inside About Us */}
          <div className="bg-[#0F340F] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-sage">
                <Info className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-bold font-serif text-white">Have questions about donation packaging?</h4>
                <p className="text-xs text-white/70 font-semibold">Reach our verified team 24/7 via hotlines or email support.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="tel:+919876543210" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-leaf text-white font-bold text-xs hover:bg-leaf-hover transition-all">
                <Phone className="w-3 h-3" /> Call: +91 98765 43210
              </a>
              <a href="mailto:support@pickandgive.org" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all border border-white/10">
                <Mail className="w-3 h-3" /> support@pickandgive.org
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <footer className="bg-forest text-white py-16 px-4 md:px-8 relative overflow-hidden">
        {/* Outer decorative soft glow shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 filter blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 filter blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 font-serif">
              Small Acts. Lasting Impact.
            </h2>
            <p className="text-sage text-sm font-semibold">
              Join thousands of kind hearts making a difference every single day.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => setShowMemberModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-leaf hover:bg-leaf-hover rounded-full shadow-sm cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" /> Join as Member
            </button>
            <button 
              onClick={() => setShowNgoModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-transparent border-2 border-white/30 hover:bg-white/10 rounded-full cursor-pointer transition-all"
            >
              <Building className="w-4 h-4" /> Register NGO
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 relative z-10">
          <p>© {new Date().getFullYear()} Pick&Give. From Your Hands to Those in Need. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-sage font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-sage" />
            Be the reason someone smiles today. ❤️
          </div>
        </div>
      </footer>

      {/* MEMBER REGISTRATION MODAL */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E392A]/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg paper-sheet border border-forest/15 animate-float p-8 relative">
            
            <button 
              onClick={() => setShowMemberModal(false)}
              className="absolute top-4 right-4 text-mutegreen hover:text-forest transition-colors p-1.5 rounded-full hover:bg-cream"
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-2 left-2 text-[#7EB138]/20 pointer-events-none select-none">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 text-[#7EB138]/20 pointer-events-none select-none transform rotate-180">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
              </svg>
            </div>

            <div className="flex justify-center mb-6">
              <Logo showText={false} />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-8 font-serif uppercase tracking-tight leading-tight">
              Member Registration Form:<br />
              <span className="text-leaf">Personal Info</span>
            </h2>

            {memberSuccess ? (
              <div className="text-center py-12 flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-forest font-serif">Welcome Aboard!</h3>
                <p className="text-sm text-mutegreen font-semibold">Your Member Account has been created successfully. Logging you in...</p>
              </div>
            ) : (
              <form onSubmit={handleMemberSubmit} className="space-y-6 relative z-10 text-left">
                <div>
                  <label className="input-label">1. Full Name:</label>
                  <input 
                    type="text" 
                    required 
                    value={memberForm.fullName}
                    onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="input-label">2. Email Address:</label>
                  <input 
                    type="email" 
                    required 
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="input-label">3. Phone Number:</label>
                  <input 
                    type="tel" 
                    required 
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="input-label">4. Location (City/Area or Zip Code):</label>
                  <span className="text-[11px] font-semibold text-mutegreen mb-1.5 block -mt-1">
                    (Crucial for local community matching)
                  </span>
                  <input 
                    type="text" 
                    required 
                    value={memberForm.location}
                    onChange={(e) => setMemberForm({ ...memberForm, location: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="e.g. New Delhi or 110001"
                  />
                </div>

                <div>
                  <label className="input-label">5. Security Password:</label>
                  <input 
                    type="password" 
                    required 
                    value={memberForm.password}
                    onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="Create a secure password"
                  />
                </div>

                <div className="pt-2 flex justify-center">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 bg-forest hover:bg-forest-hover text-white font-bold text-base rounded-full shadow-md transition-all cursor-pointer"
                  >
                    JOIN AS MEMBER
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NGO REGISTRATION MODAL */}
      {showNgoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E392A]/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl paper-sheet border border-forest/15 p-8 relative my-8">
            
            <button 
              onClick={() => setShowNgoModal(false)}
              className="absolute top-4 right-4 text-mutegreen hover:text-forest transition-colors p-1.5 rounded-full hover:bg-cream"
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-6">
              <Logo showText={false} />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-8 font-serif uppercase tracking-tight leading-tight">
              NGO Registration Form:<br />
              <span className="text-leaf">Organization Info</span>
            </h2>

            {ngoSuccess ? (
              <div className="text-center py-12 flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
                  <Building className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-forest font-serif">NGO Registered!</h3>
                <p className="text-sm text-mutegreen font-semibold">Your credentials have been submitted for verification checks.</p>
              </div>
            ) : (
              <form onSubmit={handleNgoSubmit} className="space-y-5 text-left max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="input-label">1. NGO Name:</label>
                  <input 
                    type="text" 
                    required 
                    value={ngoForm.ngoName}
                    onChange={(e) => setNgoForm({ ...ngoForm, ngoName: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="Enter official NGO name"
                  />
                </div>

                <div>
                  <label className="input-label">2. Official Email Address:</label>
                  <input 
                    type="email" 
                    required 
                    value={ngoForm.officialEmail}
                    onChange={(e) => setNgoForm({ ...ngoForm, officialEmail: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="ngo@organization.org"
                  />
                </div>

                <div>
                  <label className="input-label">3. Phone Number:</label>
                  <input 
                    type="tel" 
                    required 
                    value={ngoForm.phone}
                    onChange={(e) => setNgoForm({ ...ngoForm, phone: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="NGO Support contact number"
                  />
                </div>

                <div>
                  <label className="input-label">4. Full Address & Operating City:</label>
                  <textarea 
                    required 
                    rows="3"
                    value={ngoForm.address}
                    onChange={(e) => setNgoForm({ ...ngoForm, address: e.target.value })}
                    className="input-box border border-forest/20 resize-none py-2"
                    placeholder="Enter complete office address and primary service city"
                  />
                </div>

                <div>
                  <label className="input-label">5. Description of NGO:</label>
                  <span className="text-[11px] font-semibold text-mutegreen mb-1 block -mt-1">
                    (Explain your mission, causes, and goals)
                  </span>
                  <textarea 
                    required 
                    rows="3"
                    value={ngoForm.description}
                    onChange={(e) => setNgoForm({ ...ngoForm, description: e.target.value })}
                    className="input-box border border-forest/20 resize-none py-2"
                    placeholder="Briefly tell us about your causes..."
                  />
                </div>

                <div className="border border-dashed border-forest/35 p-4 rounded-xl bg-cream/20">
                  <label className="input-label">6. Registration Number (for verification):</label>
                  <input 
                    type="text" 
                    required 
                    value={ngoForm.registrationNumber}
                    onChange={(e) => setNgoForm({ ...ngoForm, registrationNumber: e.target.value })}
                    className="input-box border border-forest/25 font-mono"
                    placeholder="e.g. REG-12345678"
                  />
                </div>

                <div className="border border-dashed border-leaf/40 p-4 rounded-xl bg-[#7EB138]/5">
                  <label className="input-label">7. Upload Verification Certificate:</label>
                  <span className="text-[11px] font-semibold text-mutegreen mb-2 block -mt-1">
                    (Attach official Government NGO license or certification in PDF, JPG, or PNG format)
                  </span>
                  <div className="relative flex flex-col items-center justify-center border border-dashed border-[#7EB138]/30 py-4 rounded-lg bg-white hover:bg-cream/40 transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      required 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-6 h-6 text-leaf group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-forest">
                      {uploadedFileName ? uploadedFileName : "Click to select certificate file"}
                    </span>
                    <span className="text-[9px] text-[#556B5D] mt-0.5">Max size: 5MB</span>
                  </div>
                </div>

                <div className="border border-[#0F340F]/15 p-4 rounded-xl bg-cream/10">
                  <label className="input-label">8. Security Password:</label>
                  <input 
                    type="password" 
                    required 
                    value={ngoForm.password}
                    onChange={(e) => setNgoForm({ ...ngoForm, password: e.target.value })}
                    className="input-box border border-forest/20"
                    placeholder="Create a secure password"
                  />
                </div>

                <div className="pt-2 flex justify-center">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 bg-forest hover:bg-forest-hover text-white font-bold text-base rounded-full shadow-md transition-all cursor-pointer"
                  >
                    REGISTER NGO
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SIGN IN MODAL */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E392A]/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md paper-sheet border border-forest/15 animate-float p-8 relative">
            
            <button 
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-mutegreen hover:text-forest transition-colors p-1.5 rounded-full hover:bg-cream"
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-2 left-2 text-[#7EB138]/20 pointer-events-none select-none">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 text-[#7EB138]/20 pointer-events-none select-none transform rotate-180">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
              </svg>
            </div>

            <div className="flex justify-center mb-6">
              <Logo showText={false} />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-6 font-serif uppercase tracking-tight leading-tight">
              Welcome Back<br />
              <span className="text-leaf">Sign In</span>
            </h2>

            {signInSuccess ? (
              <div className="text-center py-8 flex flex-col items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-forest font-serif">Signed In Successfully!</h3>
                <p className="text-xs text-mutegreen font-semibold">Redirecting you to your workspace...</p>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-5 relative z-10 text-left">
                {signInError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in">
                    ⚠️ {signInError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="input-label">Email Address:</label>
                    <input 
                      type="email" 
                      required 
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="input-box border border-forest/20"
                      placeholder="Enter your registered email address"
                    />
                  </div>

                  <div>
                    <label className="input-label">Password:</label>
                    <input 
                      type="password" 
                      required 
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="input-box border border-forest/20"
                      placeholder="Enter your security password"
                    />
                  </div>

                  <p className="text-[10px] text-mutegreen font-semibold leading-relaxed mt-1.5">
                    💡 Hint: Create a Member or NGO account using the links in the header, then sign in with your email and password here!
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <button 
                    type="submit"
                    className="w-full px-10 py-3.5 bg-forest hover:bg-forest-hover text-white font-bold text-base rounded-full shadow-md transition-all cursor-pointer"
                  >
                    SIGN IN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DEDICATED ADMIN SIGN-IN PORTAL
// ============================================================================
function AdminSignIn({ setIsAdminLoggedIn, navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend connection status
    fetch('http://localhost:5001/api/users/ngos')
      .then(res => {
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('error');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const user = await res.json();
        if (user.role === 'Admin') {
          setSuccess(true);
          setTimeout(() => {
            setIsAdminLoggedIn(true);
          }, 1000);
        } else {
          setError('Access denied. This portal is restricted to system administrators.');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Admin Sign In Error:', err);
      setError('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
      });

      if (res.ok) {
        const user = await res.json();
        if (user.role === 'Admin') {
          setSuccess(true);
          setTimeout(() => {
            setIsAdminLoggedIn(true);
          }, 1000);
        } else {
          setError('Access denied. Admin role not found.');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Demo Sign In Error:', err);
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#0F340F] via-[#1A3828] to-[#081F08] p-4 font-sans text-[#0F340F] overflow-hidden">
      
      {/* Decorative leaf backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#7EB138]/10 rounded-full filter blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7EB138]/15 rounded-full filter blur-3xl pointer-events-none z-0" />
      
      {/* Back to Home Button */}
      <button 
        onClick={() => navigateTo('/')}
        className="absolute top-6 left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm text-xs font-bold border border-white/10"
      >
        <span className="text-sm">←</span> Back to Home
      </button>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.4)] border border-[#0F340F]/10 p-8 md:p-10 relative overflow-hidden z-10 animate-fade-in">
        
        {/* Subtle decorative leaf vectors inside card */}
        <div className="absolute -top-12 -right-12 text-[#7EB138]/10 pointer-events-none select-none">
          <svg width="120" height="120" fill="currentColor" viewBox="0 0 100 100">
            <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
          </svg>
        </div>

        {/* Central Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-[#0F340F]/5 rounded-2xl flex items-center justify-center text-[#7EB138] mb-3">
            <Logo showText={false} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F340F] text-center font-serif tracking-tight">
            Admin Portal
          </h2>
          <p className="text-xs text-[#556B5D] font-bold text-center mt-1 uppercase tracking-widest">
            Pick&Give System Console
          </p>
          
          {/* Connection Status Pill */}
          <div className="mt-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F340F]/5 border border-[#0F340F]/10">
            <span className={`w-2 h-2 rounded-full ${
              backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
              backendStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500 animate-ping'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#556B5D]">
              API Connection: {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
            </span>
          </div>
        </div>

        {success ? (
          <div className="text-center py-10 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0F340F]">Access Granted</h3>
            <p className="text-xs text-[#556B5D] font-semibold">Authorizing administrator session...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left relative z-10">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0F340F] mb-1.5 block uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#556B5D]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#0F340F]/10 rounded-2xl bg-[#F8FAF5] font-sans text-sm text-[#0F340F] transition-all focus:outline-none focus:border-[#0F340F] focus:bg-white focus:ring-4 focus:ring-[#7EB138]/10"
                    placeholder="name@pickandgive.org"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F340F] mb-1.5 block uppercase tracking-wider">
                  Security Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#556B5D]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#0F340F]/10 rounded-2xl bg-[#F8FAF5] font-sans text-sm text-[#0F340F] transition-all focus:outline-none focus:border-[#0F340F] focus:bg-white focus:ring-4 focus:ring-[#7EB138]/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading || backendStatus === 'offline'}
                className="w-full py-3.5 bg-[#0F340F] hover:bg-[#1C4A1C] disabled:bg-[#0F340F]/40 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>

              <button 
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                ⚡ Quick Demo Login (admin@gmail.com / admin123)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
