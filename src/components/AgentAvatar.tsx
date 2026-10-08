import React from 'react';

export type AgentName =
  | 'Ito'
  | 'Avis'
  | 'Zidane'
  | 'Sinta'
  | 'Muji'
  | 'Laras'
  | 'Kimi Hime'
  | 'Dewi'
  | 'Raka'
  | 'Bima'
  | 'Naya'
  | 'Dimas'
  | 'Ari'
  | string;

interface AgentAvatarProps {
  name: AgentName;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  showStatus?: boolean;
  status?: 'WORKING' | 'IDLE' | 'PRAYING' | 'RESTING' | 'TOILET' | 'OFFLINE' | string;
  borderColor?: string;
  variant?: 'photo';
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 88,
};

// Metadata Resmi 7 Staf AI (Ito PM, Avis FE, Zidane BE, Sinta QA, Muji MK, Laras KT, Kimi Hime CS)
export const AGENT_AVATAR_META: Record<
  string,
  {
    name: string;
    role: string;
    roleShort: string;
    jobdesk: string;
    color: string;
    gender: 'CEWEK' | 'COWOK';
    photoUrl: string;
    transparentSprite: string;
  }
> = {
  Ito: {
    name: 'Ito',
    role: 'Project Manager',
    roleShort: 'PM',
    jobdesk: 'Memecah target menjadi tugas terstruktur, membagi tugas ke tim, memantau progres, dan mengintegrasikan hasil.',
    color: '#8B5CF6',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Avis: {
    name: 'Avis',
    role: 'Frontend Developer',
    roleShort: 'FE',
    jobdesk: 'Membuat halaman web, komponen UI responsif, struktur HTML/CSS/JS, dan mengintegrasikan kontrak API.',
    color: '#3B82F6',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Zidane: {
    name: 'Zidane',
    role: 'Backend Developer',
    roleShort: 'BE',
    jobdesk: 'Merancang kontrak API, skema database, arsitektur endpoint, dan logika bisnis backend.',
    color: '#10B981',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Sinta: {
    name: 'Sinta',
    role: 'QA Tester',
    roleShort: 'QA',
    jobdesk: 'Menulis test case, menguji kode dan keluaran tim terhadap kriteria penerimaan, serta melaporkan temuan bug.',
    color: '#EC4899',
    gender: 'CEWEK',
    photoUrl: '/sprites/dewi_avatar.png',
    transparentSprite: '/sprites/dewi_transparent.png',
  },
  Muji: {
    name: 'Muji',
    role: 'Digital Marketing',
    roleShort: 'MK',
    jobdesk: 'Merencanakan strategi kampanye, riset kata kunci, target audiens, dan menyusun brief konten promosi.',
    color: '#F59E0B',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Laras: {
    name: 'Laras',
    role: 'Content writer',
    roleShort: 'KT',
    jobdesk: 'Menulis artikel, caption, dan copy promosi berbahasa Indonesia sesuai brief.',
    color: '#A855F7',
    gender: 'CEWEK',
    photoUrl: '/sprites/dewi_avatar.png',
    transparentSprite: '/sprites/dewi_transparent.png',
  },
  'Kimi Hime': {
    name: 'Kimi Hime',
    role: 'Customer Support',
    roleShort: 'CS',
    jobdesk: 'Menjawab pertanyaan pelanggan berdasarkan panduan, mengklasifikasikan tiket masalah, dan meneruskan bug ke tim pengembang.',
    color: '#06B6D4',
    gender: 'CEWEK',
    photoUrl: '/sprites/dewi_avatar.png',
    transparentSprite: '/sprites/dewi_transparent.png',
  },
  // Backward-compatible Aliases
  Dewi: {
    name: 'Ito',
    role: 'Project Manager',
    roleShort: 'PM',
    jobdesk: 'Memecah target menjadi tugas terstruktur, membagi tugas ke tim, memantau progres, dan mengintegrasikan hasil.',
    color: '#8B5CF6',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Raka: {
    name: 'Avis',
    role: 'Frontend Developer',
    roleShort: 'FE',
    jobdesk: 'Membuat halaman web, komponen UI responsif, struktur HTML/CSS/JS, dan mengintegrasikan kontrak API.',
    color: '#3B82F6',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Bima: {
    name: 'Zidane',
    role: 'Backend Developer',
    roleShort: 'BE',
    jobdesk: 'Merancang kontrak API, skema database, arsitektur endpoint, dan logika bisnis backend.',
    color: '#10B981',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Naya: {
    name: 'Muji',
    role: 'Digital Marketing',
    roleShort: 'MK',
    jobdesk: 'Merencanakan strategi kampanye, riset kata kunci, target audiens, dan menyusun brief konten promosi.',
    color: '#F59E0B',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
  Dimas: {
    name: 'Kimi Hime',
    role: 'Customer Support',
    roleShort: 'CS',
    jobdesk: 'Menjawab pertanyaan pelanggan berdasarkan panduan, mengklasifikasikan tiket masalah, dan meneruskan bug ke tim pengembang.',
    color: '#06B6D4',
    gender: 'CEWEK',
    photoUrl: '/sprites/dewi_avatar.png',
    transparentSprite: '/sprites/dewi_transparent.png',
  },
  Ari: {
    name: 'Zidane',
    role: 'Backend Developer',
    roleShort: 'BE',
    jobdesk: 'Merancang kontrak API, skema database, dan logika bisnis backend.',
    color: '#10B981',
    gender: 'COWOK',
    photoUrl: '/sprites/bima_avatar.png',
    transparentSprite: '/sprites/bima_transparent.png',
  },
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  showBadge = false,
  showStatus = false,
  status = 'WORKING',
  borderColor,
  onClick,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 40;
  const meta = AGENT_AVATAR_META[name] || AGENT_AVATAR_META['Ito'];
  const finalBorder = borderColor || meta.color;

  // Status Indicator Color
  const statusColor =
    status === 'WORKING'
      ? '#22c55e'
      : status === 'IDLE'
      ? '#eab308'
      : status === 'PRAYING'
      ? '#14b8a6'
      : status === 'RESTING'
      ? '#f97316'
      : status === 'TOILET'
      ? '#06b6d4'
      : '#64748b';

  // Selalu memakai foto avatar Dewi (cewek) dan Bima (cowok)
  const photoUrl = meta.gender === 'CEWEK' ? '/sprites/dewi_avatar.png' : '/sprites/bima_avatar.png';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      title={`${meta.name} • ${meta.role} (${meta.jobdesk})`}
    >
      {/* Container Frame with Neon Glow */}
      <div
        className="w-full h-full rounded-2xl overflow-hidden border-2 flex items-center justify-center bg-slate-950 shadow-md relative group transition-all"
        style={{
          borderColor: finalBorder,
          boxShadow: `0 0 10px ${finalBorder}40`,
        }}
      >
        <img
          src={photoUrl}
          alt={`${meta.name} - ${meta.role}`}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = meta.gender === 'CEWEK' ? '/sprites/dewi_full.jpg' : '/sprites/bima_full.jpg';
          }}
        />

        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Status Dot Ring */}
      {showStatus && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-slate-950 shadow-sm"
          style={{
            width: Math.max(8, Math.round(pixelSize * 0.26)),
            height: Math.max(8, Math.round(pixelSize * 0.26)),
            backgroundColor: statusColor,
          }}
          title={`Status: ${status}`}
        />
      )}

      {/* Role Badge Pill */}
      {showBadge && (
        <span
          className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-md text-[8px] font-mono font-black border uppercase shadow-sm pointer-events-none"
          style={{
            backgroundColor: `${meta.color}ee`,
            color: '#ffffff',
            borderColor: meta.color,
          }}
        >
          {meta.roleShort}
        </span>
      )}
    </div>
  );
};

export default AgentAvatar;
