import React from 'react';
import { DynamicAgentState } from './useAgentMovement';
import { SpeechBubble } from '../components/SpeechBubble';

interface CharacterSpriteProps {
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

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  agent,
  isSelected,
  isHovered,
  showAllBubbles,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const roleCode = ROLE_CODES[agent.name] || agent.role.slice(0, 2).toUpperCase();
  const isWalking = agent.isWalking;
  const isAtDesk = agent.currentLocation === 'DESK' && !isWalking;
  const isWorking = isAtDesk && agent.status === 'WORKING';

  const isWhiteboard = isAtDesk && (agent.deskIndex === 0 || agent.name === 'Ito' || roleCode === 'PM');
  const isSitting = isAtDesk && !isWhiteboard;

  // Pilih sprite yang tepat berdasarkan status & lokasi (100% Transparent Bima & Dewi, No White BG)
  const isCowok = agent.gender === 'COWOK';
  const getSpriteSrc = () => {
    if (isSitting) {
      return isCowok ? '/sprites/bima_upper.png' : '/sprites/dewi_upper.png';
    }
    return isCowok ? '/sprites/bima_transparent.png' : '/sprites/dewi_transparent.png';
  };

  const spriteSrc = getSpriteSrc();

  // Dimensi konsisten dan proporsional (TIDAK MELOMPAT-LOMPAT/RAKSASA)
  // - Pose berdiri/jalan/papan tulis: tinggi 66px, lebar auto (~20px)
  // - Pose duduk di meja: tinggi 54px, lebar auto (~72px)
  const spriteHeight = isSitting ? 54 : 66;

  // Sedikit goyangan langkah saat berjalan (frame 2 & 4 sedikit naik 2px)
  const stepBob = isWalking && (agent.walkFrame === 2 || agent.walkFrame === 4) ? -2 : 0;

  // Balon kata hanya muncul saat dipilih, di-hover, atau mode tampilkan semua aktif
  const shouldShowBubble = (isSelected || isHovered || showAllBubbles) && !!agent.bubbleText;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute cursor-pointer flex flex-col items-center select-none transition-all duration-75"
      style={{
        left: agent.x,
        top: agent.y,
        // Depth-sorting murni: y lebih tinggi di depan
        zIndex: Math.round(agent.y) + (isSelected || isHovered ? 400 : 0),
        transform: `translate(-50%, -92%) translateY(${stepBob}px)`,
      }}
    >
      {/* 1. Balon Kata (Floating Speech Bubble) - Tampil rapi tanpa saling menumpuk */}
      {shouldShowBubble && (
        <div 
          className="absolute bottom-[105%] pointer-events-auto z-50 mb-1"
          style={{ minWidth: 160, maxWidth: 220 }}
        >
          <SpeechBubble
            text={agent.bubbleText || ''}
            type={agent.bubbleType || (isWorking ? 'WORKING' : 'IDLE')}
          />
        </div>
      )}

      {/* 2. Floor Selection Ring */}
      {isSelected && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full pointer-events-none animate-pulse z-0"
          style={{
            background: `radial-gradient(ellipse at center, ${agent.color}70 0%, transparent 70%)`,
            border: `1.5px solid ${agent.color}`,
            boxShadow: `0 0 12px ${agent.color}90`,
          }}
        />
      )}

      {/* 3. Tubuh Karakter & Sprite */}
      <div className="relative flex flex-col items-center">
        {/* Kontainer Orientasi Hadap (scaleX flip) */}
        <div
          className="relative transition-transform duration-100 ease-out"
          style={{
            transform: `scaleX(${agent.facing === 'left' ? -1 : 1})`,
          }}
        >
          <img
            src={spriteSrc}
            alt={agent.name}
            style={{
              height: `${spriteHeight}px`,
              width: 'auto',
              maxWidth: isSitting ? '76px' : '36px',
            }}
            onError={(e) => {
              e.currentTarget.src = isCowok ? '/sprites/bima_full.jpg' : '/sprites/dewi_full.jpg';
            }}
            className={`object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] pointer-events-none transition-all ${
              isHovered ? 'brightness-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]' : ''
            }`}
          />
        </div>

        {/* Lencana Kode Peran di Dada (PM, FE, BE, QA, dll) */}
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded text-[7.5px] font-black tracking-tight text-white shadow-sm border border-white/50 pointer-events-none"
          style={{ backgroundColor: agent.color }}
        >
          {roleCode}
        </div>

        {/* Efek Sparkle ketik layar jika sedang aktif bekerja di meja */}
        {isWorking && (
          <div className="absolute top-4 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping pointer-events-none" />
        )}

        {/* Efek "zzz" tidur jika offline */}
        {agent.status === 'OFFLINE' && isAtDesk && (
          <span className="absolute -top-3 right-0 text-[10px] font-bold text-slate-300 animate-pulse pointer-events-none">
            zzz...
          </span>
        )}
      </div>

      {/* 4. Bayangan Kaki Lembut (Ground Contact Shadow) */}
      <div
        className="bg-black/50 rounded-full blur-[1.5px] -mt-1 pointer-events-none transition-all"
        style={{
          width: isSitting ? '44px' : '22px',
          height: '6px',
        }}
      />

      {/* 5. Pelat Nama Ringkas (Sleek Modern Name Badge) */}
      <div
        className={`mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${
          isSelected || isHovered
            ? 'bg-slate-900 border-cyan-400 scale-105 opacity-100 shadow-cyan-500/20'
            : 'bg-slate-950/85 border-slate-700/80 opacity-90'
        }`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: agent.color }}
        />
        <span className="text-[9.5px] font-bold text-white tracking-tight">
          {agent.name}
        </span>
        {isWalking && (
          <span className="text-[8.5px] text-cyan-300 font-mono animate-pulse">
            • jalan
          </span>
        )}
      </div>
    </div>
  );
};
