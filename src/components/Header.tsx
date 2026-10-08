import React from 'react';
import { OfficeState, OfficeStats } from '../types';
import { Radio, Sun, Moon, Pause, Play, Flame, FastForward, Sparkles, Building2 } from 'lucide-react';
import { api } from '../services/api';

interface HeaderProps {
  officeState: OfficeState | null;
  stats: OfficeStats | null;
  isConnected: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ officeState, stats, isConnected, onRefresh }) => {
  const handleToggleOvertime = async () => {
    try {
      await api.toggleOvertime(!officeState?.isOvertime);
      onRefresh();
    } catch (e) {
      alert('Gagal toggle lembur');
    }
  };

  const handleTogglePause = async () => {
    try {
      if (officeState?.isPaused) {
        await api.resumeOffice();
      } else {
        await api.pauseOffice();
      }
      onRefresh();
    } catch (e) {
      alert('Gagal toggle pause');
    }
  };

  const getStatusBadge = () => {
    if (!officeState) return null;
    switch (officeState.status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(34,197,94,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            KANTOR AKTIF
          </span>
        );
      case 'BREAK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            JAM ISTIRAHAT ({officeState.activeBlock?.name || 'Jeda'})
          </span>
        );
      case 'OVERTIME':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            MODE LEMBUR CEPAT
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/40">
            <Pause className="w-3.5 h-3.5" />
            SIMULASI DI-PAUSE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            <Moon className="w-3.5 h-3.5 text-slate-400" />
            KANTOR TUTUP
          </span>
        );
    }
  };

  const isNight = false;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Left: Modern AI Office Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-wide flex items-center gap-2">
              KANTOR AI
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 font-mono tracking-wider">
                AUTONOMOUS WORKSPACE
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1">
                {isNight ? <Moon className="w-3 h-3 text-indigo-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                Jakarta (WIB)
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-bold">{officeState?.currentTime || '13:55'} WIB</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-800" />
        <div className="hidden sm:flex items-center gap-2">{getStatusBadge()}</div>
      </div>

      {/* Right: Simulation Speed Controls & Quota */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Token Quota Meter (UNLIMITED) */}
        <div className="hidden md:flex flex-col gap-1 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs shadow-inner shadow-cyan-950/50">
          <div className="flex justify-between items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Kuota Token:
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-[10px] font-mono tracking-wider font-black">
                UNLIMITED (∞)
              </span>
            </span>
            <span className="font-mono text-emerald-400 font-extrabold flex items-center gap-1">
              {stats?.today.totalTokens.toLocaleString('id-ID') || 0}
              <span className="text-slate-400 text-[10px] font-normal">/ ∞ Tak Terbatas</span>
            </span>
          </div>
          <div className="w-52 h-2 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 animate-pulse rounded-full opacity-80" />
          </div>
        </div>

        {/* Live SSE status indicator */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border font-semibold ${
            isConnected
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
              : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isConnected ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{isConnected ? 'Live Sync' : 'Offline'}</span>
        </div>

        {/* Autonomous Office Simulation Controls */}
        <div className="flex items-center rounded-2xl bg-slate-900/90 border border-slate-800 p-1 shadow-md">
          {/* Pause Button */}
          <button
            onClick={handleTogglePause}
            className={`p-1.5 rounded-xl transition-all ${
              officeState?.isPaused
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Pause Operasional Kantor"
          >
            <Pause className="w-4 h-4" />
          </button>

          {/* Normal Play Button */}
          <button
            onClick={() => {
              if (officeState?.isPaused) handleTogglePause();
              if (officeState?.isOvertime) handleToggleOvertime();
            }}
            className={`p-1.5 rounded-xl transition-all ${
              !officeState?.isPaused && !officeState?.isOvertime
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Kecepatan Normal"
          >
            <Play className="w-4 h-4" />
          </button>

          {/* Overtime / Fast Forward Button */}
          <button
            onClick={handleToggleOvertime}
            className={`px-2 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              officeState?.isOvertime
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Mode Lembur (Fast-Forward)"
          >
            <FastForward className="w-4 h-4" />
            <span className="text-[11px] font-mono">Lembur</span>
          </button>
        </div>
      </div>
    </header>
  );
};
