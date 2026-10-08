import React, { useState } from 'react';
import { Goal, Task } from '../types';
import { Target, Send, Sparkles, AlertCircle, CheckCircle, HelpCircle, Layers, Lightbulb, FileCode, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { AgentAvatar } from './AgentAvatar';

interface GoalSectionProps {
  goals: Goal[];
  onRefresh: () => void;
  onInspectTask?: (task: Task) => void;
}

export const GoalSection: React.FC<GoalSectionProps> = ({ goals, onRefresh, onInspectTask }) => {
  const [goalText, setGoalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clarifyGoalId, setClarifyGoalId] = useState<string | null>(null);
  const [clarifyAnswer, setClarifyAnswer] = useState('');

  const samplePrompts = [
    'Buatkan landing page kampanye kopi susu gula aren dengan copywriting memikat dan API endpoint pemesanan',
    'Rancang skema database PostgreSQL dan CRUD endpoint untuk modul absensi karyawan kantor',
    'Buat pengujian QA komprehensif untuk alur login dan checkout pembayaran',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await api.createGoal(goalText.trim());
      setGoalText('');
      onRefresh();
    } catch (err: any) {
      alert(`Gagal membuat target: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClarify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarifyGoalId || !clarifyAnswer.trim()) return;

    try {
      await api.clarifyGoal(clarifyGoalId, clarifyAnswer.trim());
      setClarifyGoalId(null);
      setClarifyAnswer('');
      onRefresh();
    } catch (err: any) {
      alert(`Gagal mengirim klarifikasi: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Boss-to-PM Goal Intake Box with Dewi Avatar */}
      <div className="relative rounded-3xl border border-pink-500/30 bg-slate-950/85 p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 mb-6">
          <div className="relative shrink-0">
            <AgentAvatar name="Ito" size={64} showBadge={true} />
          </div>

          <div className="flex-1">
            <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
              ITO (PRODUCT MANAGER & LEAD AGENT)
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              "Halo Bos! Berikan saya arahan atau target bisnis hari ini. Saya yang akan menganalisa, memecah tugas secara otomatis ke programmer, QA, dan copywriter, lalu memonitor eksekusinya!"
            </p>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Coba Prompt Cepat:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setGoalText(prompt)}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-pink-500/50 hover:bg-slate-800 transition-all text-left truncate max-w-xs"
            >
              "{prompt.slice(0, 38)}..."
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Ketik target atau kebutuhan Anda di sini (misal: 'Bangun fitur landing page promosi dan backend API-nya')..."
            rows={3}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all resize-none leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !goalText.trim()}
              className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-600/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Ito PM Sedang Menganalisa...' : 'Tugaskan ke Ito PM'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Goal List & Decomposition Tree */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Daftar Target & Pohon Dekomposisi ({goals.length})
        </h3>

        {goals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
            Belum ada target yang dibuat. Masukkan target pertama Anda di atas.
          </div>
        ) : (
          goals.map((g) => (
            <div
              key={g.id}
              className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6 flex flex-col gap-5 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    {g.title}
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                      {g.classification || 'MULTI_TASK'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">{g.summary || g.text}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-400">
                      {g.progress?.percent || 0}% Selesai
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {g.progress?.done || 0}/{g.progress?.total || 0} Tugas Selesai
                    </p>
                  </div>
                  <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                      style={{ width: `${g.progress?.percent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Clarification prompt banner if needed */}
              {g.status === 'NEEDS_CLARIFICATION' && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <HelpCircle className="w-4 h-4" />
                    <span>Ito PM Membutuhkan Klarifikasi:</span>
                  </div>
                  <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-1">
                    {(g.openQuestions || []).map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setClarifyGoalId(g.id)}
                    className="self-start px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md"
                  >
                    Jawab Klarifikasi
                  </button>
                </div>
              )}

              {/* Sub-tasks Tree */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Daftar Tugas yang Didelegasikan:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(g.tasks || []).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => t.result && onInspectTask?.(t)}
                      className={`rounded-2xl border p-3.5 flex flex-col justify-between gap-2.5 shadow-sm transition-all ${
                        t.result
                          ? 'border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-900 cursor-pointer shadow-cyan-500/5'
                          : 'border-slate-800/80 bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white line-clamp-1">
                          {t.taskKey ? `[${t.taskKey}] ` : ''}{t.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            t.status === 'DONE'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : t.status === 'BLOCKED'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : t.status === 'RUNNING'
                              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{t.description}</p>

                      {/* Prominent Buka Output Button */}
                      {t.result && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectTask?.(t);
                          }}
                          className="w-full py-1.5 px-2.5 rounded-xl text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 flex items-center justify-center gap-1.5 transition-all shadow-sm group/btn"
                        >
                          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Buka Output Hasil Kerja</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800 font-mono">
                        <span className="text-slate-300 font-medium">Petugas: <strong className="text-white">{t.agent?.name || 'Otomatis'}</strong></span>
                        {t.dependsOn && t.dependsOn.length > 0 && (
                          <span className="text-rose-400">Tergantung ({t.dependsOn.length})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clarification Modal Dialog */}
      {clarifyGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Klarifikasi untuk Ito PM
            </h3>
            <form onSubmit={handleClarify} className="flex flex-col gap-4">
              <textarea
                value={clarifyAnswer}
                onChange={(e) => setClarifyAnswer(e.target.value)}
                placeholder="Tuliskan jawaban klarifikasi Anda..."
                rows={4}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-sm text-white focus:outline-none focus:border-pink-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClarifyGoalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 shadow-lg shadow-pink-600/30"
                >
                  Kirim Jawaban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
