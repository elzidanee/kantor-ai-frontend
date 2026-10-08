import React from 'react';
import { Agent, AgentPresence } from '../types';
import { X, Bath, Coffee, Sparkles, Briefcase, Cpu, Zap, Heart, BatteryCharging, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { AGENT_SIMS_CONFIG } from './OfficeMap2D';

import { AgentFullPortrait } from './AgentFullPortrait';

interface AgentModalProps {
  agent: Agent | null;
  presence?: AgentPresence;
  onClose: () => void;
  onRefresh: () => void;
  onMoveAgent?: (agentId: string, location: any) => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({ agent, presence, onClose, onRefresh, onMoveAgent }) => {
  if (!agent) return null;

  const cfg = AGENT_SIMS_CONFIG[agent.name] || AGENT_SIMS_CONFIG['Ari'];

  const handleSendToToilet = async () => {
    try {
      await api.sendToToilet(agent.id, 1);
      onMoveAgent?.(agent.id, 'TOILET');
      onRefresh();
      onClose();
    } catch (e: any) {
      onMoveAgent?.(agent.id, 'TOILET');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950 p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col gap-6 relative overflow-hidden">
        {/* Ambient glow top */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: cfg.color }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Agent Badge */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md border"
            style={{ backgroundColor: `${cfg.color}25`, borderColor: `${cfg.color}55` }}
          >
            <UserCheck className="w-4 h-4" style={{ color: cfg.color }} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
              AI AGENT PROFILE DOSSIER
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              {agent.name}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono font-medium">
                {cfg.gender} • Meja {agent.deskIndex ?? 1}
              </span>
            </h2>
          </div>
        </div>

        {/* Main Body: 2 Columns (Character Model Left + Sims Stats Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Full Standing Character Illustration */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950 border border-slate-800/80 shadow-inner relative group">
            <AgentFullPortrait name={agent.name} />
            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-white block">{agent.role}</span>
              <span className="text-[11px] text-slate-400">ID: {agent.id.slice(0, 8)}...</span>
            </div>
          </div>

          {/* Right Column: Sims Need Meters & Jobdesk */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Realtime Speech Bubble */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pikiran / Status Saat Ini:
              </span>
              <p className="text-sm text-cyan-200 font-medium italic">
                "{presence?.bubbleText || 'Siap mengerjakan instruksi kantor.'}"
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <span>Status: <strong className="text-white uppercase">{presence?.status || 'IDLE'}</strong></span>
                <span>•</span>
                <span>Lokasi: <strong className="text-white">{presence?.location || 'DESK'}</strong></span>
              </div>
            </div>

            {/* Agent Condition & Readiness Meters */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Parameter Kondisi & Kesiapan Agent:
              </span>
              
              {/* Energy */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Energi
                </span>
                <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-emerald-400 rounded-full w-[92%]" />
                </div>
              </div>

              {/* Kafein / Fokus */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" /> Fokus / Kafein
                </span>
                <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-amber-400 rounded-full w-[85%]" />
                </div>
              </div>

              {/* Work Morale */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Mood Kerja
                </span>
                <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-rose-400 rounded-full w-[95%]" />
                </div>
              </div>

              {/* Bladder */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-sky-400" /> Kandung Kemih
                </span>
                <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-sky-400 rounded-full w-[70%]" />
                </div>
              </div>
            </div>

            {/* Jobdesk */}
            <div className="text-xs text-slate-300 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
              <span className="font-bold text-slate-400 block text-[10px] uppercase mb-1">
                Tanggung Jawab:
              </span>
              <p className="line-clamp-2 leading-relaxed text-slate-300">
                {agent.jobdesk}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Perintahkan Lokasi:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                onMoveAgent?.(agent.id, 'DESK');
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/70 hover:bg-amber-800/80 border border-amber-600/40 flex items-center gap-1.5 transition-all shadow-sm"
              title="Perintahkan agent jalan ke meja kerja"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Meja Kerja</span>
            </button>
            <button
              onClick={() => {
                onMoveAgent?.(agent.id, 'MUSHOLA');
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-teal-200 bg-teal-950/70 hover:bg-teal-800/80 border border-teal-600/40 flex items-center gap-1.5 transition-all shadow-sm"
              title="Perintahkan agent jalan ke mushola"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Mushola</span>
            </button>
            <button
              onClick={() => {
                onMoveAgent?.(agent.id, 'LAPANGAN');
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-200 bg-emerald-950/70 hover:bg-emerald-800/80 border border-emerald-600/40 flex items-center gap-1.5 transition-all shadow-sm"
              title="Perintahkan agent jalan ke gazebo taman"
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Taman Kopi</span>
            </button>
            <button
              onClick={handleSendToToilet}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 flex items-center gap-1.5 shadow-lg shadow-sky-600/25 transition-all"
              title="Izin ke bilik toilet"
            >
              <Bath className="w-3.5 h-3.5" />
              <span>Izin Toilet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
