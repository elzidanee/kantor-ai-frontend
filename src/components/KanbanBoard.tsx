import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import {
  RotateCcw,
  HelpCircle,
  X,
  Check,
  Search,
  FileCode,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  LayoutGrid,
  List,
  Sparkles,
  Bot,
  User,
  ArrowUpDown,
  Filter,
  CheckCheck,
  PlayCircle,
  XCircle,
  Flame,
  AlertCircle,
  FileText,
  Database,
  Terminal,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { AgentAvatar } from './AgentAvatar';

interface KanbanBoardProps {
  tasks: Task[];
  onRefresh: () => void;
  onInspectTask?: (task: Task) => void;
}

// Deteksi badge deliverable ringkas dari isi teks task
function getDeliverableBadge(task: Task) {
  if (!task.result) return null;
  const raw = task.result.toLowerCase();
  if (raw.includes('.html') || raw.includes('<!doctype') || raw.includes('<html')) {
    return { label: 'Web Page (HTML)', icon: FileCode, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
  }
  if (raw.includes('.sql') || raw.includes('create table') || raw.includes('select ')) {
    return { label: 'Database (SQL)', icon: Database, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
  }
  if (raw.includes('api') || raw.includes('endpoint') || raw.includes('json')) {
    return { label: 'API Contract', icon: Terminal, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  }
  return { label: 'Output Solusi AI', icon: FileText, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onRefresh, onInspectTask }) => {
  const [revisingTaskId, setRevisingTaskId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [clarifyingTask, setClarifyingTask] = useState<Task | null>(null);
  const [clarifyAnswerText, setClarifyAnswerText] = useState('');
  const [isSubmittingClarify, setIsSubmittingClarify] = useState(false);

  const handleClarifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarifyingTask || !clarifyAnswerText.trim() || isSubmittingClarify) return;
    try {
      setIsSubmittingClarify(true);
      await api.clarifyTask(clarifyingTask.id, clarifyAnswerText.trim());
      setClarifyingTask(null);
      setClarifyAnswerText('');
      onRefresh();
    } catch (err: any) {
      alert(`Gagal mengirim klarifikasi: ${err.message}`);
    } finally {
      setIsSubmittingClarify(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'WITH_OUTPUT' | 'REVIEW' | 'RUNNING' | 'DONE'>('ALL');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'BOARD' | 'LIST'>('BOARD');

  const handleApprove = async (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await api.approveTask(taskId);
      onRefresh();
    } catch (e: any) {
      alert(`Gagal approve task: ${e.message}`);
    }
  };

  const handleRevise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisingTaskId || !feedbackText.trim()) return;

    try {
      await api.reviseTask(revisingTaskId, feedbackText);
      setRevisingTaskId(null);
      setFeedbackText('');
      onRefresh();
    } catch (e: any) {
      alert(`Gagal meminta revisi: ${e.message}`);
    }
  };

  // Kumpulan unik Agent untuk filter
  const agentList = useMemo(() => {
    const map = new Map<string, { id: string; name: string; role: string }>();
    tasks.forEach((t) => {
      if (t.agent) {
        map.set(t.agent.id, { id: t.agent.id, name: t.agent.name, role: t.agent.role });
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  // Statistik ringkas
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'DONE').length;
    const review = tasks.filter((t) => t.status === 'REVIEW').length;
    const running = tasks.filter((t) => t.status === 'RUNNING').length;
    const queued = tasks.filter((t) => t.status === 'QUEUED' || t.status === 'PENDING').length;
    const withOutput = tasks.filter((t) => !!t.result).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, review, running, queued, withOutput, percent };
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Filter status
      if (filterType === 'WITH_OUTPUT' && !t.result) return false;
      if (filterType === 'REVIEW' && t.status !== 'REVIEW') return false;
      if (filterType === 'RUNNING' && t.status !== 'RUNNING') return false;
      if (filterType === 'DONE' && t.status !== 'DONE') return false;

      // 2. Filter agent
      if (selectedAgentId !== 'ALL' && t.agentId !== selectedAgentId) return false;

      // 3. Filter query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchKey = (t.taskKey || '').toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchAgent = (t.agent?.name || '').toLowerCase().includes(q);
      const matchRole = (t.agent?.role || '').toLowerCase().includes(q);

      return matchTitle || matchKey || matchDesc || matchAgent || matchRole;
    });
  }, [tasks, searchQuery, filterType, selectedAgentId]);

  const columns = [
    {
      title: 'QUEUED',
      label: 'Antrean',
      badge: 'border-slate-700/80 text-slate-400 bg-slate-900',
      dot: 'bg-slate-500',
      emptyText: 'Tidak ada tugas dalam antrean',
      items: filteredTasks.filter((t) => t.status === 'QUEUED' || t.status === 'PENDING'),
    },
    {
      title: 'RUNNING',
      label: 'Dikerjakan',
      badge: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
      dot: 'bg-cyan-400 animate-pulse',
      emptyText: 'Semua agen sedang rehat / menunggu',
      items: filteredTasks.filter((t) => t.status === 'RUNNING'),
    },
    {
      title: 'REVIEW',
      label: 'Review Owner',
      badge: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
      dot: 'bg-amber-400 animate-ping',
      emptyText: 'Semua tugas telah disetujui',
      items: filteredTasks.filter((t) => t.status === 'REVIEW'),
    },
    {
      title: 'BLOCKED',
      label: 'Terkendala',
      badge: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
      dot: 'bg-rose-400',
      emptyText: '✓ Bebas kendala (0 Blocked)',
      items: filteredTasks.filter((t) => t.status === 'BLOCKED'),
    },
    {
      title: 'DONE',
      label: 'Selesai',
      badge: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
      dot: 'bg-emerald-400',
      emptyText: 'Belum ada tugas selesai',
      items: filteredTasks.filter((t) => t.status === 'DONE'),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ======================================================== */}
      {/* 1. TOP METRICS & PROGRESS RIBBON                         */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-slate-800 bg-[#070b15]/90 backdrop-blur-xl shadow-md">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Kemajuan Pekerjaan
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
              {stats.done} / {stats.total} Selesai ({stats.percent}%)
            </span>
          </div>

          {/* Mini Progress Bar */}
          <div className="w-32 sm:w-44 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          {/* Action Attention Badge if review > 0 */}
          {stats.review > 0 && (
            <button
              onClick={() => setFilterType('REVIEW')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all shadow-sm animate-pulse"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{stats.review} Butuh Tindakan Owner</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Board vs List */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('BOARD')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'BOARD'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Papan Kanban"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Papan Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'LIST'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tabel / Daftar"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daftar Rinci</span>
            </button>
          </div>

          {/* Tombol Segarkan */}
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Segarkan Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ADVANCED SEARCH & FILTER COMMAND BAR                  */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#090d18] p-3 backdrop-blur-xl shadow-lg">
        {/* Left: Search input */}
        <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800/90 rounded-xl px-3 py-1.5 flex-1 min-w-[240px] max-w-sm focus-within:border-cyan-500/60 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, ID (T-1), atau staf AI..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-white px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Middle: Agent Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">Agen:</span>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="ALL">Semua Agen ({agentList.length})</option>
            {agentList.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.role})
              </option>
            ))}
          </select>
        </div>

        {/* Right: Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              filterType === 'ALL'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Semua ({tasks.length})
          </button>

          <button
            onClick={() => setFilterType('REVIEW')}
            className={`px-3 py-1 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'REVIEW'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Butuh Review ({stats.review})</span>
          </button>

          <button
            onClick={() => setFilterType('WITH_OUTPUT')}
            className={`px-3 py-1 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'WITH_OUTPUT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Output Ada ({stats.withOutput})</span>
          </button>

          <button
            onClick={() => setFilterType('DONE')}
            className={`px-3 py-1 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'DONE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Selesai ({stats.done})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. VIEW MODE A: KANBAN BOARD (VIEWPORT-CONTAINED HEIGHT) */}
      {/* ======================================================== */}
      {viewMode === 'BOARD' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 h-[calc(100vh-250px)] min-h-[580px] overflow-x-auto pb-2">
          {columns.map((col) => (
            <div
              key={col.title}
              className="flex flex-col rounded-2xl border border-slate-800/90 bg-[#070b16]/90 shadow-xl overflow-hidden min-w-[260px]"
            >
              {/* Sleek Column Header (Fixed Top) */}
              <div className="flex items-center justify-between px-3.5 py-3 bg-slate-950 border-b border-slate-800/80 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {col.label}
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border ${col.badge}`}>
                  {col.items.length}
                </span>
              </div>

              {/* Scrollable Card Container per Column (No Infinite Page Scroll!) */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {col.items.length === 0 ? (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-xs text-slate-500 font-sans italic">
                      {col.emptyText}
                    </span>
                  </div>
                ) : (
                  col.items.map((task) => {
                    const agentName = task.agent?.name || 'Staff AI';
                    const roleName = task.agent?.role || 'Spesialis';
                    const hasResult = !!task.result;
                    const deliverableBadge = getDeliverableBadge(task);

                    return (
                      <div
                        key={task.id}
                        onClick={() => onInspectTask?.(task)}
                        className={`group rounded-xl border bg-[#0a1020]/90 p-3 flex flex-col gap-2.5 transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 ${
                          hasResult
                            ? 'border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
                            : 'border-slate-800/70 hover:border-slate-700 hover:shadow-slate-900/40'
                        }`}
                      >
                        {/* Top Row: Task Key & Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {task.taskKey && (
                              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {task.taskKey}
                              </span>
                            )}
                            {task.status === 'REVIEW' && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Butuh Review
                              </span>
                            )}
                          </div>

                          {/* Priority Pill */}
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                              task.priority === 'HIGH'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : task.priority === 'LOW'
                                ? 'bg-slate-900 text-slate-500 border-slate-800'
                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                            }`}
                          >
                            {task.priority || 'NORMAL'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                          {task.title}
                        </h4>

                        {/* Description Preview */}
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Deliverable Badge (Clean & Elegant, No Heavy Raw Code Dump!) */}
                        {hasResult && deliverableBadge && (
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                            <span
                              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${deliverableBadge.color}`}
                            >
                              <deliverableBadge.icon className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{deliverableBadge.label}</span>
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onInspectTask?.(task);
                              }}
                              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/btn transition-colors shrink-0"
                            >
                              <span>Lihat Output</span>
                              <ExternalLink className="w-3 h-3 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        )}

                        {/* Action buttons if BLOCKED (Unblock Flow) */}
                        {task.status === 'BLOCKED' && (
                          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                            <div className="text-[10px] text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg px-2 py-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0 text-rose-400" />
                              <span className="truncate">Terkendala: Butuh info Owner</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setClarifyingTask(task);
                              }}
                              className="w-full py-1.5 px-2 rounded-lg text-[11px] font-bold bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Beri Klarifikasi & Jalankan Lagi</span>
                            </button>
                          </div>
                        )}

                        {/* Action buttons if in REVIEW */}
                        {task.status === 'REVIEW' && (
                          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                            <button
                              onClick={(e) => handleApprove(task.id, e)}
                              className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-sm transition-all"
                              title="Setujui hasil kerja ini"
                            >
                              <Check className="w-3 h-3" />
                              Setujui
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setClarifyingTask(task);
                              }}
                              className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold bg-cyan-600/25 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 flex items-center justify-center gap-1 transition-all"
                              title="Beri klarifikasi arahan agar agen melanjutkan"
                            >
                              <HelpCircle className="w-3 h-3" />
                              Klarifikasi
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRevisingTaskId(task.id);
                              }}
                              className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40 flex items-center justify-center gap-1 transition-all"
                              title="Minta revisi"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Revisi
                            </button>
                          </div>
                        )}

                        {/* Card Bottom: Agent Assignee & Revision Count */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <AgentAvatar name={agentName} size={20} showStatus={false} />
                            <span className="truncate font-medium">{agentName}</span>
                          </div>

                          <div className="flex items-center gap-1 font-mono shrink-0">
                            {task.revisionCount > 0 && (
                              <span className="text-amber-400 font-bold bg-amber-950/40 px-1 rounded border border-amber-800/40">
                                Rev {task.revisionCount}
                              </span>
                            )}
                            <span>
                              {task.finishedAt
                                ? '✓ Selesai'
                                : task.status === 'RUNNING'
                                ? '⚡ Aktif'
                                : 'Antre'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ======================================================== */
        /* 3. VIEW MODE B: COMPACT LIST / TABLE VIEW (LINEAR STYLE) */
        /* ======================================================== */
        <div className="rounded-2xl border border-slate-800 bg-[#070b16] shadow-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-250px)] min-h-[580px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4">Kunci</th>
                  <th className="py-3 px-4">Judul Tugas</th>
                  <th className="py-3 px-4">Agen Penanggung Jawab</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Prioritas</th>
                  <th className="py-3 px-4">Deliverable / Output</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 italic">
                      Tidak ada tugas yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const agentName = task.agent?.name || 'Staff AI';
                    const roleName = task.agent?.role || 'Spesialis';
                    const deliverableBadge = getDeliverableBadge(task);

                    return (
                      <tr
                        key={task.id}
                        onClick={() => onInspectTask?.(task)}
                        className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                      >
                        {/* Kunci */}
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                          {task.taskKey || 'T-?'}
                        </td>

                        {/* Judul & Deskripsi */}
                        <td className="py-3 px-4 max-w-sm">
                          <span className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors block">
                            {task.title}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {task.description}
                          </span>
                        </td>

                        {/* Agen */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <AgentAvatar name={agentName} size={24} showStatus={false} />
                            <div>
                              <span className="font-semibold text-slate-200 block leading-tight">
                                {agentName}
                              </span>
                              <span className="text-[10px] text-slate-500 block leading-tight">
                                {roleName}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border inline-flex items-center gap-1 ${
                              task.status === 'DONE'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : task.status === 'REVIEW'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : task.status === 'RUNNING'
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            {task.status === 'DONE'
                              ? '✓ Selesai'
                              : task.status === 'REVIEW'
                              ? '⚠ Review'
                              : task.status === 'RUNNING'
                              ? '⚡ Berjalan'
                              : task.status}
                          </span>
                        </td>

                        {/* Prioritas */}
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-400 uppercase">
                          {task.priority || 'NORMAL'}
                        </td>

                        {/* Deliverable Badge */}
                        <td className="py-3 px-4">
                          {deliverableBadge ? (
                            <span
                              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-lg border inline-flex items-center gap-1.5 ${deliverableBadge.color}`}
                            >
                              <deliverableBadge.icon className="w-3 h-3" />
                              <span>{deliverableBadge.label}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-600 italic">-</span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {task.result && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onInspectTask?.(task);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 text-xs font-bold transition-colors inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Lihat Output</span>
                              </button>
                            )}
                            {(task.status === 'BLOCKED' || task.status === 'REVIEW') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClarifyingTask(task);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition-all inline-flex items-center gap-1"
                              >
                                <HelpCircle className="w-3 h-3" />
                                <span>Klarifikasi</span>
                              </button>
                            )}
                            {task.status === 'REVIEW' && (
                              <button
                                onClick={(e) => handleApprove(task.id, e)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                              >
                                <Check className="w-3 h-3" />
                                <span>Setujui</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL DIALOG KLARIFIKASI TASK OWNER (AGAR JALAN LAGI) */}
      {/* ======================================================== */}
      {clarifyingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#090e1d] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Klarifikasi Tugas untuk {clarifyingTask.agent?.name || 'Agen'}</h3>
                  <p className="text-[11px] text-slate-400">Tugas akan langsung dimasukkan antrean & berjalan kembali</p>
                </div>
              </div>
              <button
                onClick={() => setClarifyingTask(null)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 flex flex-col gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">Judul Tugas:</span>
              <h4 className="text-xs font-bold text-slate-200">{clarifyingTask.title}</h4>
              {clarifyingTask.outputEnvelope?.open_questions && clarifyingTask.outputEnvelope.open_questions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-900">
                  <span className="text-[10px] font-bold text-amber-400">Pertanyaan / Kebutuhan Agen:</span>
                  <ul className="text-xs text-amber-200/90 list-disc list-inside mt-1 space-y-0.5">
                    {clarifyingTask.outputEnvelope.open_questions.map((q: string, idx: number) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <form onSubmit={handleClarifySubmit} className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-300">
                Jawaban / Klarifikasi Arahan dari Owner:
              </label>
              <textarea
                value={clarifyAnswerText}
                onChange={(e) => setClarifyAnswerText(e.target.value)}
                placeholder="Tuliskan arahan, jawaban atas pertanyaan agen, atau data spesifik yang dibutuhkan..."
                rows={4}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans resize-none shadow-inner"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setClarifyingTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClarify || !clarifyAnswerText.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmittingClarify ? 'Mengirim & Menjalankan...' : 'Kirim Klarifikasi & Jalankan Lagi 🚀'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL DIALOG REVISI OWNER                             */}
      {/* ======================================================== */}
      {revisingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#080d18] p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Catatan Revisi dari Owner
            </h3>
            <p className="text-xs text-slate-400">
              Agen akan menerima instruksi spesifik ini dan memperbaiki kode/solusi sesuai masukan Anda.
            </p>
            <form onSubmit={handleRevise} className="flex flex-col gap-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tuliskan feedback spesifik untuk agent agar hasilnya sempurna..."
                rows={4}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRevisingTaskId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30 transition-all"
                >
                  Kirim Revisi ke Agen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
