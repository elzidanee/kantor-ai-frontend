import React from 'react';
import { DynamicAgentState } from './useAgentMovement';
import { SpeechBubble } from '../components/SpeechBubble';

interface OfficeAvatarCharacterProps {
  agent: DynamicAgentState;
  isSelected?: boolean;
  isHovered?: boolean;
  showAllBubbles?: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ROLE_META: Record<
  string,
  {
    roleCode: string;
    roleName: string;
    badgeIcon: string;
    accentColor: string;
    gender: 'COWOK' | 'CEWEK';
  }
> = {
  Ito: {
    roleCode: 'PM',
    roleName: 'Project Manager',
    badgeIcon: '📋',
    accentColor: '#8B5CF6',
    gender: 'COWOK',
  },
  Avis: {
    roleCode: 'FE',
    roleName: 'Frontend Developer',
    badgeIcon: '💻',
    accentColor: '#3B82F6',
    gender: 'COWOK',
  },
  Zidane: {
    roleCode: 'BE',
    roleName: 'Backend Developer',
    badgeIcon: '🗄️',
    accentColor: '#10B981',
    gender: 'COWOK',
  },
  Sinta: {
    roleCode: 'QA',
    roleName: 'QA Tester',
    badgeIcon: '🛡️',
    accentColor: '#EC4899',
    gender: 'CEWEK',
  },
  Muji: {
    roleCode: 'MK',
    roleName: 'Digital Marketing',
    badgeIcon: '📈',
    accentColor: '#F59E0B',
    gender: 'COWOK',
  },
  Laras: {
    roleCode: 'KT',
    roleName: 'Content writer',
    badgeIcon: '✍️',
    accentColor: '#A855F7',
    gender: 'CEWEK',
  },
  'Kimi Hime': {
    roleCode: 'CS',
    roleName: 'Customer Support',
    badgeIcon: '🎧',
    accentColor: '#06B6D4',
    gender: 'CEWEK',
  },
  // Backward compatibility
  Dewi: {
    roleCode: 'PM',
    roleName: 'Project Manager',
    badgeIcon: '📋',
    accentColor: '#8B5CF6',
    gender: 'COWOK',
  },
  Raka: {
    roleCode: 'FE',
    roleName: 'Frontend Developer',
    badgeIcon: '💻',
    accentColor: '#3B82F6',
    gender: 'COWOK',
  },
  Bima: {
    roleCode: 'BE',
    roleName: 'Backend Developer',
    badgeIcon: '🗄️',
    accentColor: '#10B981',
    gender: 'COWOK',
  },
  Naya: {
    roleCode: 'MK',
    roleName: 'Digital Marketing',
    badgeIcon: '📈',
    accentColor: '#F59E0B',
    gender: 'COWOK',
  },
  Dimas: {
    roleCode: 'CS',
    roleName: 'Customer Support',
    badgeIcon: '🎧',
    accentColor: '#06B6D4',
    gender: 'CEWEK',
  },
  Ari: {
    roleCode: 'BE',
    roleName: 'Backend Developer',
    badgeIcon: '🗄️',
    accentColor: '#10B981',
    gender: 'COWOK',
  },
};

export const OfficeAvatarCharacter: React.FC<OfficeAvatarCharacterProps> = ({
  agent,
  isSelected,
  isHovered,
  showAllBubbles,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const meta = ROLE_META[agent.name] || {
    roleCode: agent.role.slice(0, 2).toUpperCase(),
    roleName: agent.role,
    badgeIcon: '💼',
    accentColor: agent.color || '#3b82f6',
    gender: agent.gender || 'COWOK',
  };

  const isCowok = meta.gender === 'COWOK';
  
  // Status Deteksi Gerak (Sangat Kuat: Selama berpindah atau rute aktif, selalu anggap berjalan)
  const isActuallyWalking =
    agent.isWalking ||
    (agent.route && agent.route.length > 0) ||
    agent.currentLocation !== agent.targetLocation;

  const isAtDesk = !isActuallyWalking && agent.currentLocation === 'DESK';
  // Deteksi khusus posisi di depan papan tulis (PM Ito) vs duduk di meja kerja staf (Laras dkk)
  const isWhiteboardSlot = agent.deskIndex === 0 || agent.name === 'Ito' || agent.role.toLowerCase().includes('project manager');
  const isAtWhiteboard = isAtDesk && isWhiteboardSlot;
  const isAtWorkstationDesk = isAtDesk && !isWhiteboardSlot;

  const isWorking = isAtDesk && agent.status === 'WORKING';
  const isPraying = !isActuallyWalking && agent.currentLocation === 'MUSHOLA';
  const isResting = !isActuallyWalking && agent.currentLocation === 'LAPANGAN';
  const isToilet = !isActuallyWalking && agent.currentLocation === 'TOILET';
  const isStandup = !isActuallyWalking && agent.currentLocation === 'STANDUP_AREA';
  const isSleeping = isAtDesk && agent.status === 'OFFLINE';

  // Base Transparent Asset URLs (100% No White Background!)
  const standingSprite = isCowok
    ? '/sprites/bima_transparent.png'
    : '/sprites/dewi_transparent.png';

  const upperSprite = isCowok
    ? '/sprites/bima_upper.png'
    : '/sprites/dewi_upper.png';

  const fallbackFull = isCowok
    ? '/sprites/bima_full.jpg'
    : '/sprites/dewi_full.jpg';

  // 1. Dinamika Langkah Kaki saat Berjalan
  const legCycle = agent.walkFrame || 1;
  const stepBob = isActuallyWalking ? (legCycle === 2 || legCycle === 4 ? -4 : 0) : 0;
  const stepTilt = isActuallyWalking ? (legCycle === 1 ? -3 : legCycle === 3 ? 3 : 0) : 0;
  const isFacingLeft = agent.facing === 'left';

  // Balon Kata Muncul
  const shouldShowBubble = (isSelected || isHovered || showAllBubbles) && !!agent.bubbleText;

  // Render Pose Dinamis dengan Fallback Permanen (TIDAK PERNAH KOSONG / GAADA FOTO)
  const renderCharacterPose = () => {
    // ========================================================
    // A. POSE JALAN (WALKING ANIMATION)
    // ========================================================
    if (isActuallyWalking) {
      return (
        <div
          className="relative flex flex-col items-center animate-walk-bobbing"
          style={{
            transform: isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          {/* Bayangan Langkah Kaki Dinamis di Lantai */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-black/50 blur-[1px] animate-walk-shadow" />

          {/* Foto Karakter Berdiri Penuh Berjalan */}
          <img
            src={standingSprite}
            alt={agent.name}
            className="h-[68px] w-auto object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.65)] pointer-events-none select-none"
            onError={(e) => {
              e.currentTarget.src = fallbackFull;
            }}
          />

          {/* Partikel Debu Langkah Kaki */}
          <span
            className="absolute -bottom-0.5 right-1 text-[7px] opacity-70 animate-ping pointer-events-none"
            style={{ animationDuration: '600ms' }}
          >
            💨
          </span>
        </div>
      );
    }

    // ========================================================
    // B1. POSE PM ITO DI PAPAN TULIS (WHITEBOARD SPRINT PRESENTER)
    // ========================================================
    if (isAtWhiteboard) {
      return (
        <div className="relative flex flex-col items-center">
          {/* Bayangan di Lantai Depan Papan */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-black/45 blur-[1px]" />

          {/* Foto PM Berdiri Tegak Memimpin di Depan Papan Tulis */}
          <div className="relative">
            <img
              src={standingSprite}
              alt={agent.name}
              className="h-[68px] w-auto object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.65)] pointer-events-none select-none"
              onError={(e) => {
                e.currentTarget.src = fallbackFull;
              }}
            />

            {/* Badge Status Papan Sprint di Depan Papan Tulis */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-[7.5px] font-mono font-bold text-indigo-300 flex items-center gap-1 shadow-md whitespace-nowrap">
              <span>📋</span>
              <span>PAPAN SPRINT</span>
            </div>

            {/* Sticky Card Target Floating saat PM Sedang Bekerja / Menganalisa Target */}
            {isWorking && (
              <div className="absolute top-2 -right-3 flex flex-col items-center animate-bounce pointer-events-none">
                <span className="text-[9px] font-mono font-bold text-amber-300 drop-shadow">
                  🎯 SPRINT
                </span>
              </div>
            )}

            {/* Zzz saat Offline / Istirahat */}
            {isSleeping && (
              <div className="absolute -top-4 -right-1 text-[11px] font-mono font-black text-slate-400 animate-pulse pointer-events-none">
                Zzz...
              </div>
            )}
          </div>
        </div>
      );
    }

    // ========================================================
    // B2. POSE BEKERJA DI MEJA (LARAS & STAF LAINNYA DI MEJA KERJA)
    // ========================================================
    if (isAtWorkstationDesk) {
      return (
        <div className="relative flex flex-col items-center">
          {/* Sandaran Kursi Kantor di Belakang Meja */}
          <div
            className="absolute top-2 w-9 h-8 rounded-full border-2 border-slate-900 pointer-events-none"
            style={{ backgroundColor: meta.accentColor + '33' }}
          />

          {/* Karakter Duduk di Meja (Tampak Pinggang ke Atas) */}
          <div className="relative">
            <img
              src={upperSprite}
              alt={agent.name}
              className="h-[50px] w-auto object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)] pointer-events-none select-none"
              style={{
                transform: isSleeping ? 'rotate(12deg) translateY(4px)' : 'none',
              }}
              onError={(e) => {
                e.currentTarget.src = standingSprite;
              }}
            />

            {/* Animasi Partikel Kode / Tulisan Floating saat Mengerjakan Tugas */}
            {isWorking && (
              <div className="absolute -top-3 -right-2 flex flex-col items-center animate-bounce pointer-events-none">
                <span className="text-[9px] font-mono font-bold text-cyan-300 drop-shadow">
                  {meta.roleCode === 'KT' ? '✍️' : '&lt;/&gt;'}
                </span>
              </div>
            )}

            {/* Zzz saat Offline / Tidur di Meja */}
            {isSleeping && (
              <div className="absolute -top-4 -right-1 text-[11px] font-mono font-black text-slate-400 animate-pulse pointer-events-none">
                Zzz...
              </div>
            )}
          </div>

          {/* Laptop di Depan dengan Layar Menyala & Tangan Mengetik */}
          <div className="relative -mt-2.5 z-20 flex flex-col items-center pointer-events-none">
            {/* Layar Laptop Tipis Modern */}
            <div
              className="w-7 h-4 rounded-t-sm bg-slate-900 border border-slate-700 p-0.5 flex items-center justify-center shadow-lg"
              style={{
                boxShadow: isWorking ? `0 0 8px ${meta.accentColor}88` : 'none',
              }}
            >
              <div
                className="w-full h-full rounded-[1px] flex items-center justify-center"
                style={{ backgroundColor: isWorking ? '#0369a1' : '#0f172a' }}
              >
                <span className="text-[5px] text-cyan-200 font-mono">
                  {isWorking ? (meta.roleCode === 'KT' ? 'WRITE' : 'CODE') : 'IDLE'}
                </span>
              </div>
            </div>

            {/* Keyboard Laptop & Tangan Mengetik */}
            <div className="w-8 h-1.5 rounded-sm bg-slate-800 border-t border-slate-600 relative">
              {isWorking && (
                <div className="absolute inset-0 flex justify-around items-center px-1">
                  <span className="w-1 h-1 rounded-full bg-amber-200 animate-ping" />
                  <span
                    className="w-1 h-1 rounded-full bg-amber-200 animate-ping"
                    style={{ animationDelay: '150ms' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ========================================================
    // C. POSE SHOLAT DI MUSHOLA (PRAYING ON SAJADAH)
    // ========================================================
    if (isPraying) {
      return (
        <div className="relative flex flex-col items-center">
          {/* Lingkaran Aura Spiritual Hijau */}
          <div className="absolute -inset-2 rounded-full bg-emerald-500/15 blur-sm animate-pulse pointer-events-none" />

          {/* Karakter Duduk Khusyuk di Sajadah (Lowered Height) */}
          <div className="relative">
            <img
              src={upperSprite}
              alt={agent.name}
              className="h-[44px] w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)] pointer-events-none select-none"
              onError={(e) => {
                e.currentTarget.src = standingSprite;
              }}
            />
          </div>

          {/* Simbol Doa Khusyuk */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-teal-950/90 border border-teal-500/40 text-[9px] text-teal-300 font-mono flex items-center gap-1 shadow-md">
            <span>🤲</span>
            <span className="text-[7.5px] font-bold">DZIKIR</span>
          </div>
        </div>
      );
    }

    // ========================================================
    // D. POSE SANTAI DI TAMAN / NGOPI (COFFEE BREAK)
    // ========================================================
    if (isResting) {
      return (
        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-black/40 blur-[1px]" />
          <div className="relative">
            <img
              src={standingSprite}
              alt={agent.name}
              className="h-[66px] w-auto object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.65)] pointer-events-none select-none"
              onError={(e) => {
                e.currentTarget.src = fallbackFull;
              }}
            />

            {/* Cangkir Kopi Aren di Tangan dengan Uap Hangat */}
            <div
              className="absolute top-7 right-0 flex flex-col items-center pointer-events-none animate-bounce"
              style={{ animationDuration: '2.5s' }}
            >
              <span className="text-[7px] text-amber-200/80 animate-pulse">♨️</span>
              <span className="text-[11px]">☕</span>
            </div>
          </div>
        </div>
      );
    }

    // ========================================================
    // E. POSE SANITASI DI TOILET (WASHING HANDS)
    // ========================================================
    if (isToilet) {
      return (
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <img
              src={upperSprite}
              alt={agent.name}
              className="h-[48px] w-auto object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)] pointer-events-none select-none"
              onError={(e) => {
                e.currentTarget.src = standingSprite;
              }}
            />

            {/* Gelembung Sabun & Percikan Air Segar */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 pointer-events-none">
              <span className="text-[8px] animate-ping">🫧</span>
              <span className="text-[8px] animate-bounce">💧</span>
              <span className="text-[8px] animate-ping" style={{ animationDelay: '200ms' }}>
                🫧
              </span>
            </div>
          </div>
        </div>
      );
    }

    // ========================================================
    // F. POSE APEL PAGI / STANDUP
    // ========================================================
    if (isStandup) {
      return (
        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-2 rounded-full bg-black/40 blur-[1px]" />
          <img
            src={standingSprite}
            alt={agent.name}
            className="h-[68px] w-auto object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.65)] pointer-events-none select-none"
            onError={(e) => {
              e.currentTarget.src = fallbackFull;
            }}
          />
          <div className="absolute -top-2 right-0 px-1 rounded-full bg-amber-500 text-[8px] font-bold text-slate-950 font-mono shadow">
            APEL
          </div>
        </div>
      );
    }

    // ========================================================
    // G. DEFAULT STANDING PERMANENT FALLBACK (TIDAK PERNAH BLANK)
    // ========================================================
    return (
      <div className="relative flex flex-col items-center">
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-2 rounded-full bg-black/40 blur-[1px]" />
        <img
          src={standingSprite}
          alt={agent.name}
          className="h-[68px] w-auto object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.65)] pointer-events-none select-none"
          onError={(e) => {
            e.currentTarget.src = fallbackFull;
          }}
        />
      </div>
    );
  };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute cursor-pointer flex flex-col items-center select-none group"
      style={{
        left: agent.x,
        top: agent.y,
        zIndex: Math.round(agent.y) + (isSelected || isHovered ? 500 : 0),
        transform: 'translate(-50%, -92%)',
        willChange: 'left, top, transform',
      }}
    >
      {/* 1. Realtime Floating Speech Bubble */}
      {shouldShowBubble && (
        <div
          className="absolute bottom-[108%] pointer-events-auto z-50 mb-1"
          style={{ minWidth: 160, maxWidth: 230 }}
        >
          <SpeechBubble
            text={agent.bubbleText || ''}
            type={agent.bubbleType || (isWorking ? 'WORKING' : 'IDLE')}
          />
        </div>
      )}

      {/* 2. Floor Selection Halo Ring (Glow Mewah Arsitektural Tanpa Logo Sims) */}
      {isSelected && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full pointer-events-none animate-pulse z-0"
          style={{
            background: `radial-gradient(ellipse at center, ${meta.accentColor}80 0%, transparent 72%)`,
            border: `1.5px solid ${meta.accentColor}`,
            boxShadow: `0 0 14px ${meta.accentColor}90`,
          }}
        />
      )}

      {/* 3. Action Status Pill (Animasi Aktivitas Berubah-ubah) */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-slate-950/95 border border-slate-700/80 shadow-lg flex items-center gap-1 text-[9px] font-mono text-cyan-200 pointer-events-none whitespace-nowrap animate-fadeIn z-30">
          <span>{meta.badgeIcon}</span>
          <span>
            {isActuallyWalking
              ? `Jalan ke ${agent.targetLocation || 'lokasi'}`
              : isAtWhiteboard
              ? (isWorking ? 'Memimpin Sprint & Papan Target' : 'Standby di Papan Tulis')
              : isWorking
              ? (meta.roleCode === 'KT' ? 'Menulis Konten di Meja' : 'Bekerja di Meja Kantor')
              : isPraying
              ? 'Sholat Al-Ikhlas'
              : isResting
              ? 'Ngopi di Taman'
              : isToilet
              ? 'Cuci Tangan'
              : isStandup
              ? 'Apel Pagi'
              : isSleeping
              ? 'Tertidur Zzz'
              : 'Standby di Meja'}
          </span>
        </div>
      )}

      {/* 4. POSE ANIMASI KARAKTER (SELALU ADA FOTONYA, NO AI SLOP) */}
      <div className="relative flex flex-col items-center">
        {renderCharacterPose()}
      </div>

      {/* 5. Nameplate & Role Badge Mini (Crisp, High-Readability) */}
      <div
        className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-md backdrop-blur-md transition-all group-hover:scale-105 pointer-events-none"
        style={{
          backgroundColor: isSelected ? meta.accentColor : '#090d16e6',
          borderColor: meta.accentColor,
          color: isSelected ? '#000000' : '#ffffff',
        }}
      >
        <span className="text-[9px] font-extrabold tracking-tight font-sans">
          {agent.name}
        </span>
        <span
          className="text-[7.5px] px-1 py-0.2 rounded-full font-black font-mono uppercase"
          style={{
            backgroundColor: isSelected ? '#00000025' : meta.accentColor + '35',
            color: isSelected ? '#000000' : meta.accentColor,
          }}
        >
          {meta.roleCode}
        </span>
      </div>
    </div>
  );
};

export default OfficeAvatarCharacter;
