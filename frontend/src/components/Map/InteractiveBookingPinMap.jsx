// frontend/src/components/Map/InteractiveBookingPinMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { getBaseCoords } from '../../utils/geo';

export function InteractiveBookingPinMap({ value, memberLocation, onChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [hasLeaflet, setHasLeaflet] = useState(!!window.L);

  // Keep references to latest value and onChange to avoid resetting map
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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
