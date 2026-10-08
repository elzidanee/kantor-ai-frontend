import React from 'react';
import { ActivityLog, OfficeStats } from '../types';
import { Activity, Cpu, Sparkles, Zap, CheckCircle2, Gauge } from 'lucide-react';
import { AGENT_SIMS_CONFIG } from './OfficeMap2D';
import { AgentAvatar } from './AgentAvatar';

interface ActivityStreamProps {
  logs: ActivityLog[];
  stats: OfficeStats | null;
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ logs, stats }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Quota Card (UNLIMITED) */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-cyan-950/20 to-slate-950/80 p-5 backdrop-blur-xl shadow-lg shadow-cyan-950/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Kuota Token Harian
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black tracking-wide">
              BEBAS BATAS
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-300 flex items-center gap-2">
              UNLIMITED <span className="text-3xl leading-none text-emerald-400">∞</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Terpakai:{' '}
              <span className="text-white font-bold">
                {stats?.today.totalTokens.toLocaleString('id-ID') || 0}
              </span>{' '}
              token (Tanpa Limit)
            </p>
          </div>
        </div>

        {/* Total AI Task Runs */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              Total Eksekusi AI
            </span>
            <span className="text-[10px] font-mono text-slate-500">Hari Ini</span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300">
              {stats?.today.totalRuns || 0}{' '}
              <span className="text-sm font-normal text-slate-400">Runs</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Batas Harian: <span className="text-emerald-400 font-bold">Unlimited (∞)</span>
            </p>
          </div>
        </div>

        {/* Tasks Progress */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Penyelesaian Tugas
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {stats?.tasks.total ? Math.round(((stats.tasks.done || 0) / stats.tasks.total) * 100) : 0}%
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {stats?.tasks.done || 0}{' '}
              <span className="text-sm font-normal text-slate-400">/ {stats?.tasks.total || 0} Task</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.tasks.running || 0} Sedang Aktif Dikerjakan
            </p>
          </div>
        </div>

        {/* Average Latency */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Gauge className="w-4 h-4 text-indigo-400" />
              Kecepatan Respon
            </span>
            <span className="text-[10px] font-mono text-indigo-400">Avg Latency</span>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-300">
              {Math.round((stats?.today.avgLatencyMs || 0) / 1000)}{' '}
              <span className="text-sm font-normal text-slate-400">Detik</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Model AI LLM Processing Time
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Audit Logs & Agent Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Log Stream */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Jejak Audit Realtime (Activity Logs)
              </h3>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
              Live updates
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-2">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 italic">Belum ada aktivitas terekam.</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex flex-col gap-1.5 text-xs hover:border-slate-700 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40">
                      {log.eventType}
                    </span>
                    <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">{log.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leaderboard per Agent with Face Avatars */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Statistik Penggunaan Agent</h3>
          </div>

          <div className="flex flex-col gap-3">
            {(stats?.agents || []).map((ag) => {
              const cfg = AGENT_SIMS_CONFIG[ag.name] || AGENT_SIMS_CONFIG['Ari'];

              return (
                <div
                  key={ag.agentId}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <AgentAvatar
                      name={ag.name}
                      size={40}
                      showStatus={true}
                      status="WORKING"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {ag.name}
                        <span className="text-[10px] font-normal text-slate-400 font-mono">
                          ({cfg.gender})
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{ag.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400 block">
                      {ag.totalTokens.toLocaleString('id-ID')} tkn
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono">{ag.runsCount} Run</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
