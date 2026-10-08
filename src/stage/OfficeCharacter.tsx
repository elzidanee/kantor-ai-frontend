import React from 'react';
import { DynamicAgentState } from './useAgentMovement';
import { SpeechBubble } from '../components/SpeechBubble';

interface OfficeCharacterProps {
  agent: DynamicAgentState;
  isSelected?: boolean;
  isHovered?: boolean;
  showAllBubbles?: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ROLE_CODES: Record<string, string> = {
  Ito: 'PM',
  Avis: 'FE',
  Zidane: 'BE',
  Sinta: 'QA',
  Muji: 'MK',
  Laras: 'KT',
  'Kimi Hime': 'CS',
  Dewi: 'PM',
  Raka: 'FE',
  Bima: 'BE',
  Naya: 'MK',
  Dimas: 'CS',
  Ari: 'BE',
};

// Pengaturan visual detail tiap karakter agar unik dan hidup
interface CharacterVisualProfile {
  hairColor: string;
  hairStyle: 'long' | 'short_messy' | 'short_neat' | 'ponytail' | 'bob' | 'wavy' | 'headset';
  outfitColor: string;
  skinColor: string;
  hasGlasses?: boolean;
  hasHeadset?: boolean;
}

const CHARACTER_PROFILES: Record<string, CharacterVisualProfile> = {
  Dewi: {
    hairColor: '#261c14',
    hairStyle: 'long',
    outfitColor: '#7F77DD',
    skinColor: '#fed7aa',
  },
  Bima: {
    hairColor: '#1c1917',
    hairStyle: 'short_messy',
    outfitColor: '#378ADD',
    skinColor: '#fde68a',
  },
  Ari: {
    hairColor: '#1e1b18',
    hairStyle: 'short_neat',
    outfitColor: '#1D9E75',
    skinColor: '#fef08a',
    hasGlasses: true,
  },
  Sinta: {
    hairColor: '#451a03',
    hairStyle: 'ponytail',
    outfitColor: '#D85A30',
    skinColor: '#fed7aa',
    hasGlasses: true,
  },
  Laras: {
    hairColor: '#581c87',
    hairStyle: 'bob',
    outfitColor: '#D4537E',
    skinColor: '#fde68a',
  },
  Dimas: {
    hairColor: '#292524',
    hairStyle: 'wavy',
    outfitColor: '#A9690F',
    skinColor: '#fed7aa',
  },
  Naya: {
    hairColor: '#1e293b',
    hairStyle: 'headset',
    outfitColor: '#0ea5e9',
    skinColor: '#fde68a',
    hasHeadset: true,
  },
};

export const OfficeCharacter: React.FC<OfficeCharacterProps> = ({
  agent,
  isSelected,
  isHovered,
  showAllBubbles,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const roleCode = ROLE_CODES[agent.name] || agent.role.slice(0, 2).toUpperCase();
  const profile = CHARACTER_PROFILES[agent.name] || {
    hairColor: '#1c1917',
    hairStyle: 'short_neat',
    outfitColor: agent.color || '#3b82f6',
    skinColor: '#fed7aa',
  };

  const isWalking = agent.isWalking;
  const isAtDesk = agent.currentLocation === 'DESK' && !isWalking;
  const isWorking = isAtDesk && agent.status === 'WORKING';
  const isPraying = agent.currentLocation === 'MUSHOLA' && !isWalking;
  const isResting = agent.currentLocation === 'LAPANGAN' && !isWalking;
  const isSleeping = isAtDesk && agent.status === 'OFFLINE';

  const shouldShowBubble = (isSelected || isHovered || showAllBubbles) && !!agent.bubbleText;

  // Sedikit ayunan langkah kaki saat berjalan (1 s/d 4)
  const legCycle = agent.walkFrame;
  const leftLegAngle = isWalking ? (legCycle === 1 ? -22 : legCycle === 3 ? 22 : 0) : 0;
  const rightLegAngle = isWalking ? (legCycle === 1 ? 22 : legCycle === 3 ? -22 : 0) : 0;
  const bodyBob = isWalking && (legCycle === 2 || legCycle === 4) ? -3 : 0;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute cursor-pointer flex flex-col items-center select-none transition-all duration-75 group"
      style={{
        left: agent.x,
        top: agent.y,
        zIndex: Math.round(agent.y) + (isSelected || isHovered ? 400 : 0),
        transform: `translate(-50%, -92%) translateY(${bodyBob}px)`,
      }}
    >
      {/* 1. BALON KATA (FLOATING SPEECH BUBBLE) */}
      {shouldShowBubble && (
        <div 
          className="absolute bottom-[108%] pointer-events-auto z-50 mb-1 transition-all"
          style={{ minWidth: 160, maxWidth: 220 }}
        >
          <SpeechBubble
            text={agent.bubbleText || ''}
            type={agent.bubbleType || (isWorking ? 'WORKING' : (isPraying ? 'PRAYING' : (isResting ? 'RESTING' : 'IDLE')))}
          />
        </div>
      )}

      {/* 2. Selection Glow Ring */}
      {isSelected && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full pointer-events-none animate-pulse z-0"
          style={{
            background: `radial-gradient(ellipse at center, ${profile.outfitColor}70 0%, transparent 70%)`,
            border: `1.5px solid ${profile.outfitColor}`,
            boxShadow: `0 0 12px ${profile.outfitColor}90`,
          }}
        />
      )}

      {/* 3. KARAKTER SVG HIGH-PRECISION VECTOR (TIDAK AI SLOP, CRISP, 60 FPS) */}
      <div 
        className="relative flex flex-col items-center"
        style={{
          transform: `scaleX(${agent.facing === 'left' ? -1 : 1})`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <svg
          viewBox="0 0 64 80"
          width="48"
          height="60"
          className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Bayangan halus tubuh */}
            <linearGradient id={`grad-body-${agent.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={profile.outfitColor} />
              <stop offset="100%" stopColor={profile.outfitColor} stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id={`grad-skin-${agent.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={profile.skinColor} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* ======================================================== */}
          {/* KAKI KARAKTER (LEGS)                                     */}
          {/* ======================================================== */}
          {!isAtDesk ? (
            <g id="legs">
              {/* Kaki Kiri */}
              <g transform={`rotate(${leftLegAngle} 26 58)`}>
                <rect x="23" y="56" width="6" height="15" rx="3" fill="#1e293b" />
                {/* Sepatu */}
                <ellipse cx="26" cy="72" rx="4.5" ry="3" fill="#0f172a" />
              </g>

              {/* Kaki Kanan */}
              <g transform={`rotate(${rightLegAngle} 38 58)`}>
                <rect x="35" y="56" width="6" height="15" rx="3" fill="#1e293b" />
                {/* Sepatu */}
                <ellipse cx="38" cy="72" rx="4.5" ry="3" fill="#0f172a" />
              </g>
            </g>
          ) : (
            // Pose Duduk: Kaki terlipat di bawah meja
            <g id="sitting-legs">
              <rect x="22" y="58" width="20" height="8" rx="4" fill="#1e293b" />
            </g>
          )}

          {/* ======================================================== */}
          {/* BADAN & BAJU KARAKTER (TORSO & OUTFIT)                    */}
          {/* ======================================================== */}
          <rect
            x="19"
            y="36"
            width="26"
            height="23"
            rx="7"
            fill={`url(#grad-body-${agent.id})`}
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* Kerah Baju Putih / Aksen */}
          <polygon points="32,41 27,36 37,36" fill="#ffffff" opacity="0.9" />

          {/* Lencana Kode Peran di Dada (PM, FE, BE, QA, dll) */}
          <rect
            x="24"
            y="43"
            width="16"
            height="9"
            rx="3"
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth="0.75"
          />
          <text
            x="32"
            y="50"
            fill="#ffffff"
            fontSize="6.5"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {roleCode}
          </text>

          {/* ======================================================== */}
          {/* TANGAN & LENGAN (ARMS & POSE PROPS)                      */}
          {/* ======================================================== */}
          {isWorking ? (
            // Pose Mengetik di Meja (Laptop glowing + tangan bergerak)
            <g id="typing-arms">
              {/* Laptop mini di pangkuan */}
              <rect x="18" y="50" width="28" height="3" rx="1.5" fill="#334155" stroke="#0f172a" strokeWidth="0.75" />
              <polygon points="20,50 22,41 42,41 44,50" fill="#0284c7" stroke="#0f172a" strokeWidth="0.75" />
              {/* Layar glowing code */}
              <rect x="24" y="43" width="16" height="5" fill="#38bdf8" opacity="0.8" />
              {/* Tangan kiri & kanan */}
              <circle cx="21" cy="51" r="3" fill={profile.skinColor} stroke="#0f172a" strokeWidth="0.75" />
              <circle cx="43" cy="51" r="3" fill={profile.skinColor} stroke="#0f172a" strokeWidth="0.75" />
            </g>
          ) : isPraying ? (
            // Pose Sholat Qiyam (Kedua tangan bersedekap rapi di dada)
            <g id="praying-arms">
              <path d="M 19,42 Q 32,47 45,42" fill="none" stroke={profile.outfitColor} strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="32" cy="45" rx="5" ry="3" fill={profile.skinColor} stroke="#0f172a" strokeWidth="0.75" />
            </g>
          ) : isResting ? (
            // Pose Santai Ngopi (Pegang cangkir kopi dengan uap)
            <g id="coffee-arms">
              {/* Lengan pegang cangkir */}
              <circle cx="43" cy="48" r="3" fill={profile.skinColor} stroke="#0f172a" strokeWidth="0.75" />
              {/* Cangkir Kopi */}
              <rect x="42" y="44" width="7" height="8" rx="2" fill="#ffffff" stroke="#78350f" strokeWidth="0.75" />
              <path d="M 49,46 C 51,46 51,49 49,49" fill="none" stroke="#78350f" strokeWidth="0.75" />
              {/* Uap Kopi Hangat */}
              <path d="M 44,42 Q 46,39 44,36" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.7" />
            </g>
          ) : (
            // Pose Default / Berdiri / Jalan
            <g id="default-arms">
              <rect x="14" y="38" width="5.5" height="15" rx="2.5" fill={profile.outfitColor} stroke="#0f172a" strokeWidth="1" />
              <circle cx="16.5" cy="54" r="2.8" fill={profile.skinColor} />

              <rect x="44.5" y="38" width="5.5" height="15" rx="2.5" fill={profile.outfitColor} stroke="#0f172a" strokeWidth="1" />
              <circle cx="47.5" cy="54" r="2.8" fill={profile.skinColor} />
            </g>
          )}

          {/* ======================================================== */}
          {/* KEPALA & WAJAH (HEAD & EXPRESSION)                       */}
          {/* ======================================================== */}
          {/* Rambut Belakang (untuk style panjang) */}
          {profile.hairStyle === 'long' && (
            <path d="M 16,22 C 12,32 14,48 18,52 L 46,52 C 50,48 52,32 48,22 Z" fill={profile.hairColor} />
          )}

          {/* Bentuk Wajah Bulat Menggemaskan */}
          <ellipse
            cx="32"
            cy="24"
            rx="15"
            ry="14"
            fill={profile.skinColor}
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* Pipi Merona Halus (Blush) */}
          <circle cx="21" cy="27" r="2.5" fill="#f43f5e" opacity="0.25" />
          <circle cx="43" cy="27" r="2.5" fill="#f43f5e" opacity="0.25" />

          {/* Mata Karakter */}
          {isSleeping ? (
            // Mata Terpejam Tidur (◠ ◠)
            <g id="sleeping-eyes">
              <path d="M 23,24 Q 26,21 29,24" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 35,24 Q 38,21 41,24" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ) : (
            // Mata Terbuka Cerah dengan Highlight Kilau
            <g id="open-eyes">
              <ellipse cx="26" cy="23" rx="2.8" ry="3.5" fill="#0f172a" />
              <circle cx="27" cy="22" r="1.2" fill="#ffffff" />

              <ellipse cx="38" cy="23" rx="2.8" ry="3.5" fill="#0f172a" />
              <circle cx="39" cy="22" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Kacamata jika ada profilnya (Ari, Sinta) */}
          {profile.hasGlasses && (
            <g id="glasses" stroke="#0f172a" strokeWidth="1.2" fill="none">
              <rect x="22" y="19" width="8" height="7" rx="2" fill="#38bdf8" fillOpacity="0.2" />
              <rect x="34" y="19" width="8" height="7" rx="2" fill="#38bdf8" fillOpacity="0.2" />
              <line x1="30" y1="23" x2="34" y2="23" />
            </g>
          )}

          {/* Headset Customer Support jika ada (Naya) */}
          {profile.hasHeadset && (
            <g id="headset">
              {/* Bando Headset */}
              <path d="M 16,24 C 16,10 48,10 48,24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
              {/* Earcup */}
              <ellipse cx="16" cy="24" rx="2.5" ry="4.5" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />
              <ellipse cx="48" cy="24" rx="2.5" ry="4.5" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />
              {/* Mikrofon ke mulut */}
              <path d="M 16,25 Q 22,32 30,30" fill="none" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="30" cy="30" r="1.5" fill="#38bdf8" />
            </g>
          )}

          {/* Senyum Manis */}
          <path d="M 29,28 Q 32,31 35,28" fill="none" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />

          {/* ======================================================== */}
          {/* RAMBUT DEPAN & GAYA RAMBUT (HAIR CUTS)                   */}
          {/* ======================================================== */}
          <path
            d="M 17,20 C 18,12 24,9 32,9 C 40,9 46,12 47,20 C 42,16 35,16 31,18 C 27,16 21,17 17,20 Z"
            fill={profile.hairColor}
            stroke="#0f172a"
            strokeWidth="1"
          />

          {profile.hairStyle === 'ponytail' && (
            // Kuncir kuda Sinta
            <ellipse cx="48" cy="14" rx="5" ry="4" fill={profile.hairColor} stroke="#0f172a" strokeWidth="1" />
          )}

          {profile.hairStyle === 'bob' && (
            // Rambut Bob Laras
            <path d="M 17,18 C 15,28 17,32 19,34 C 17,28 18,22 20,20 Z" fill={profile.hairColor} />
          )}
        </svg>

        {/* Efek Sparkle ketik layar jika aktif bekerja di meja */}
        {isWorking && (
          <div className="absolute top-4 right-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping pointer-events-none" />
        )}

        {/* Efek floating "zzz" jika tidur */}
        {isSleeping && (
          <span className="absolute -top-3 right-0 text-[10px] font-bold text-slate-300 animate-pulse pointer-events-none">
            zzz...
          </span>
        )}
      </div>

      {/* 4. KONTAK BAYANGAN KAKI DI LANTAI (GROUND SHADOW) */}
      <div
        className="bg-black/55 rounded-full blur-[1.5px] -mt-1 pointer-events-none transition-all"
        style={{
          width: isAtDesk ? '38px' : '22px',
          height: '6px',
        }}
      />

      {/* 5. PELAT NAMA & STATUS MODERN (SLEEK NAME BADGE) */}
      <div
        className={`mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border shadow-xl backdrop-blur-md transition-all ${
          isSelected || isHovered
            ? 'bg-slate-900 border-cyan-400 scale-105 opacity-100 shadow-cyan-500/25 ring-2 ring-cyan-500/30'
            : 'bg-slate-950/90 border-slate-700/80 opacity-95'
        }`}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: profile.outfitColor }}
        />
        <span className="text-[10px] font-bold text-white tracking-tight font-sans">
          {agent.name}
        </span>
        <span className="text-[8.5px] font-mono px-1 rounded bg-slate-800 text-slate-300 font-semibold">
          {roleCode}
        </span>
        {isWalking && (
          <span className="text-[9px] text-cyan-300 font-mono animate-pulse">
            • jalan
          </span>
        )}
      </div>
    </div>
  );
};
