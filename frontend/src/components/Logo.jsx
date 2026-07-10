// frontend/src/components/Logo.jsx
import React from 'react';

export const Logo = ({ className = '', showText = true, horizontal = true, light = false }) => {
  const principalColor = light ? '#FFFFFF' : '#1A3828';
  const textColorClass = light ? 'text-white' : 'text-[#1A3828]';
  const containerClass = className || (showText ? 'h-12 md:h-14 flex-shrink-0' : 'w-12 h-12 flex-shrink-0');
  return (
    <div className={`flex items-center gap-3 select-none ${containerClass}`}>
      {/* High-Fidelity SVG Icon exactly matching the provided green heart-box logo */}
      <svg
        viewBox="0 0 400 320"
        className="w-auto h-12 md:h-14 drop-shadow-sm transition-transform hover:scale-105 duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left silhouette head */}
        <circle cx="140" cy="70" r="18" fill={principalColor} />
        
        {/* Right silhouette head */}
        <circle cx="260" cy="85" r="18" fill={principalColor} />

        {/* Heart-forming silhouette bodies in dark green */}
        {/* Left shoulder/body curving down and inward */}
        <path
          d="M 122 88 C 115 105, 95 145, 115 178 C 120 185, 135 205, 155 200 C 145 190, 135 175, 138 150 C 140 130, 150 115, 158 95 C 162 88, 140 82, 122 88 Z"
          fill={principalColor}
        />
        
        {/* Right shoulder/body curving down and inward */}
        <path
          d="M 278 103 C 285 115, 305 150, 285 185 C 280 192, 260 210, 240 200 C 250 192, 260 178, 258 155 C 255 135, 242 120, 235 105 C 230 95, 260 92, 278 103 Z"
          fill={principalColor}
        />

        {/* Left arm forming upper-left heart curve */}
        <path
          d="M 140 88 C 155 110, 185 118, 200 118 C 175 118, 150 105, 140 88 Z"
          fill={principalColor}
        />

        {/* Right arm forming upper-right heart curve */}
        <path
          d="M 260 103 C 245 120, 215 118, 200 118 C 225 118, 245 112, 260 103 Z"
          fill={principalColor}
        />

        {/* Leaf stems curving around silhouettes on the right */}
        <path
          d="M 270 120 C 285 105, 290 90, 285 75 C 275 80, 275 105, 270 120 Z"
          fill="#7EB138"
        />
        <path
          d="M 278 135 C 295 135, 302 125, 298 112 C 288 115, 282 125, 278 135 Z"
          fill="#7EB138"
        />

        {/* Supportive Hand at the Bottom cradling the entire heart in light green */}
        <path
          d="M 125 185 C 135 220, 175 235, 210 235 C 250 235, 275 215, 285 195 C 270 215, 240 225, 210 225 C 160 225, 135 195, 125 185 Z"
          fill="#7EB138"
        />
        <path
          d="M 130 190 C 145 225, 185 228, 215 228 C 245 228, 255 220, 265 210 C 250 218, 235 218, 215 218 C 175 218, 145 198, 130 190 Z"
          fill="#94C84C"
        />

        {/* Cardboard Box centered inside the heart */}
        <path
          d="M 160 160 L 240 160 L 235 205 L 165 205 Z"
          fill="#0F2519"
        />
        
        {/* Left Flap */}
        <path
          d="M 160 160 L 148 175 L 175 175 Z"
          fill={principalColor}
        />
        {/* Right Flap */}
        <path
          d="M 240 160 L 252 175 L 225 175 Z"
          fill={principalColor}
        />
        {/* Front Flap */}
        <path
          d="M 175 160 L 200 178 L 225 160 Z"
          fill={principalColor}
        />

        {/* Clothes (Shirt) in the box */}
        <path
          d="M 165 158 C 162 135, 192 130, 192 158 Z"
          fill={principalColor}
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <path
          d="M 174 142 C 178 146, 182 146, 186 142"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Books in the box */}
        <rect
          x="195"
          y="130"
          width="20"
          height="32"
          rx="2"
          fill="#7EB138"
          stroke="#FFFFFF"
          strokeWidth="2"
          transform="rotate(6, 195, 130)"
        />
        <line
          x1="200"
          y1="138"
          x2="210"
          y2="138"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Jar with heart in the box */}
        <rect
          x="218"
          y="142"
          width="16"
          height="22"
          rx="2"
          fill="#0F2519"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <rect
          x="221"
          y="138"
          width="10"
          height="4"
          fill="#7EB138"
        />
        {/* Heart on jar */}
        <path
          d="M 226 153 C 224 151, 223 153, 226 155 C 229 153, 228 151, 226 153 Z"
          fill="#FFFFFF"
        />
      </svg>

      {showText && (
        <div className={horizontal ? "flex flex-col justify-center" : "flex flex-col items-center mt-3"}>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${textColorClass} leading-none flex items-center font-sans`}>
            Pick<span className="text-[#7EB138] font-bold">&</span>Give
          </h1>
          <div className="flex items-center gap-1.5 mt-1 select-none">
            <span className="h-[1px] w-6 bg-[#7EB138]/40"></span>
            <p className={`text-[9px] md:text-[10px] font-bold tracking-wider ${textColorClass} uppercase whitespace-nowrap`}>
              From Your Hands to Those in Need
            </p>
            <span className="h-[1px] w-6 bg-[#7EB138]/40"></span>
          </div>
        </div>
      )}
    </div>
  );
};
