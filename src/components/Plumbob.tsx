import React from 'react';

interface PlumbobProps {
  color?: string; // default emerald green
  size?: number;  // size in px
}

export const Plumbob: React.FC<PlumbobProps> = ({ color = '#22c55e', size = 28 }) => {
  return (
    <div className="relative flex flex-col items-center pointer-events-none select-none">
      <div 
        className="animate-plumbob relative flex items-center justify-center"
        style={{ width: size, height: size * 1.5 }}
      >
        <svg 
          viewBox="0 0 100 160" 
          width={size} 
          height={size * 1.5}
          className="filter drop-shadow-[0_0_10px_rgba(34,197,94,0.85)]"
        >
          <defs>
            <linearGradient id="plumbob-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="plumbob-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="plumbob-specular" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#4ade80" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Top Pyramids */}
          {/* Top Left Facet */}
          <polygon points="50,5 20,80 50,75" fill="url(#plumbob-left)" />
          {/* Top Right Facet */}
          <polygon points="50,5 50,75 80,80" fill="url(#plumbob-right)" />
          {/* Specular Glint */}
          <polygon points="50,5 35,50 50,45" fill="url(#plumbob-specular)" />

          {/* Bottom Pyramids */}
          {/* Bottom Left Facet */}
          <polygon points="50,75 20,80 50,155" fill="url(#plumbob-left)" />
          {/* Bottom Right Facet */}
          <polygon points="50,75 80,80 50,155" fill="url(#plumbob-right)" />
        </svg>
      </div>

      {/* Subtle floor shadow dot */}
      <div className="w-2.5 h-1 bg-emerald-500/30 rounded-full blur-[1px] mt-0.5 animate-pulse" />
    </div>
  );
};
