import React from 'react';
import { AGENT_AVATAR_META, AgentName } from './AgentAvatar';

interface AgentFullPortraitProps {
  name: AgentName;
  className?: string;
}

export const AgentFullPortrait: React.FC<AgentFullPortraitProps> = ({ name, className = '' }) => {
  const meta = AGENT_AVATAR_META[name] || AGENT_AVATAR_META['Dewi'];
  const isCewek = meta.gender === 'CEWEK';

  // Karakter foto transparan kualitas tinggi (Dewi untuk cewek, Bima untuk cowok)
  const spriteSrc = isCewek ? '/sprites/dewi_transparent.png' : '/sprites/bima_transparent.png';
  const roleColor = meta.color;

  return (
    <div className={`relative w-44 h-72 flex flex-col items-center justify-center ${className}`}>
      {/* Ambient Glow Lingkaran di Belakang Karakter Sesuai Warna Peran */}
      <div
        className="absolute w-36 h-36 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ backgroundColor: roleColor }}
      />

      <img
        src={spriteSrc}
        alt={`${meta.name} - ${meta.role}`}
        className="w-40 h-auto max-h-72 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] animate-sim-idle relative z-10 transition-transform duration-300"
        onError={(e) => {
          e.currentTarget.src = isCewek ? '/sprites/dewi_full.jpg' : '/sprites/bima_full.jpg';
        }}
      />

      {/* Role Pill Badge di Bawah Kaki Karakter */}
      <div
        className="absolute bottom-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider shadow-lg z-20 border"
        style={{
          backgroundColor: '#090d19ee',
          color: roleColor,
          borderColor: `${roleColor}66`,
          boxShadow: `0 0 10px ${roleColor}33`,
        }}
      >
        {meta.roleShort} • {meta.role}
      </div>
    </div>
  );
};

export default AgentFullPortrait;
