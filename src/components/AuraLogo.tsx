import React from 'react';

interface AuraLogoProps {
  className?: string;
  size?: number;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-[28%] overflow-hidden shadow-[0_6px_20px_-2px_rgba(109,40,217,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #581c87 100%)',
      }}
      aria-label="Aura Care Logo"
    >
      {/* Soft inner radial gradient highlight */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, transparent 60%)',
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full"
      >
        {/* Outer subtle dashed circle */}
        <circle
          cx="50"
          cy="50"
          r="28"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="3.5"
          strokeDasharray="4 4"
          fill="none"
        />

        {/* Center circular translucent glow layer */}
        <circle
          cx="50"
          cy="50"
          r="19"
          fill="rgba(255, 255, 255, 0.22)"
        />

        {/* Rounded medical plus cross */}
        {/* Horizontal bar */}
        <rect
          x="28"
          y="44.5"
          width="44"
          height="11"
          rx="5.5"
          fill="#ffffff"
        />
        {/* Vertical bar */}
        <rect
          x="44.5"
          y="28"
          width="11"
          height="44"
          rx="5.5"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};
