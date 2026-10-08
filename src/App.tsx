import React, { useState, useEffect, useMemo } from 'react';
import { Agent, AgentPresence, OfficeState, OfficeStats, Goal, Task } from './types';
import { api } from './services/api';
import { useOfficeStream } from './hooks/useOfficeStream';
import { Header } from './components/Header';
import { OfficeMap2D } from './components/OfficeMap2D';
import { GoalSection } from './components/GoalSection';
import { KanbanBoard } from './components/KanbanBoard';
import { ActivityStream } from './components/ActivityStream';
import { AgentModal } from './components/AgentModal';
import { TaskOutputModal } from './components/TaskOutputModal';
import { LayoutGrid, Target, Kanban, BarChart3, FileCode, Sparkles } from 'lucide-react';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<OfficeStats | null>(null);
  const [activeTab, setActiveTab] = useState<'MAP' | 'GOALS' | 'KANBAN' | 'STATS'>('MAP');

  const [selectedAgent, setSelectedAgent] = useState<{ agent: Agent; presence?: AgentPresence } | null>(null);
  const [inspectingTask, setInspectingTask] = useState<Task | null>(null);

  // Hook SSE stream
  const { presences, officeState, logs, isConnected, setPresences, setOfficeState } = useOfficeStream();

  const loadData = async () => {
    try {
      const [agentsData, presencesData, stateData, goalsData, tasksData, statsData, logsData] = await Promise.all([
        api.getAgents(),
        api.getPresences(),
        api.getOfficeState(),
        api.getGoals(),
        api.getTasks(),
        api.getStats(),
        api.getLogs(30),
      ]);
      setAgents(agentsData);
      setPresences(presencesData);
      setOfficeState(stateData);
      setGoals(goalsData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load office data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Polling sinkronisasi tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const handleMoveAgent = (agentId: string, location: any) => {
    setPresences((prev) =>
      prev.map((p) =>
        p.agentId === agentId
          ? {
              ...p,
              location: location,
              status:
                location === 'TOILET'
                  ? 'TOILET'
                  : location === 'MUSHOLA'
                  ? 'PRAYING'
                  : location === 'LAPANGAN'
                  ? 'RESTING'
                  : 'WORKING',
            }
          : p
      )
    );
  };

  const deliverablesCount = useMemo(() => tasks.filter((t) => !!t.result).length, [tasks]);
  const reviewCount = useMemo(() => tasks.filter((t) => t.status === 'REVIEW').length, [tasks]);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Header with Controls */}
      <Header
        officeState={officeState}
        stats={stats}
        isConnected={isConnected}
        onRefresh={loadData}
      />

      {/* Navigation Tabs (Linear-inspired clean professional bar) */}
      <div className="px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('MAP')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'MAP'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Denah Kantor (Live)</span>
          </button>

          <button
            onClick={() => setActiveTab('GOALS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'GOALS'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target Owner (PM Ito)</span>
            {goals.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white font-bold">
                {goals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('KANBAN')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'KANBAN'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board Tugas</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-300 font-bold border border-slate-700">
              {tasks.length}
            </span>
            {reviewCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black animate-pulse">
                {reviewCount} Review
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('STATS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'STATS'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistik & Audit Log</span>
          </button>
        </div>

        {/* Quick Deliverable Output Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('KANBAN');
              const firstWithResult = tasks.find((t) => !!t.result);
              if (firstWithResult) {
                setInspectingTask(firstWithResult);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1.5 transition-all shadow-sm"
            title="Buka ringkasan output hasil kerja yang telah diselesaikan"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{deliverablesCount} Output Hasil Tersedia</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'MAP' && (
          <OfficeMap2D
            agents={agents}
            presences={presences}
            officeState={officeState}
            onSelectAgent={(agent, presence) => setSelectedAgent({ agent, presence })}
          />
        )}

        {activeTab === 'GOALS' && (
          <GoalSection
            goals={goals}
            onRefresh={loadData}
            onInspectTask={(task) => setInspectingTask(task)}
          />
        )}

        {activeTab === 'KANBAN' && (
          <KanbanBoard
            tasks={tasks}
            onRefresh={loadData}
            onInspectTask={(task) => setInspectingTask(task)}
          />
        )}

        {activeTab === 'STATS' && <ActivityStream logs={logs} stats={stats} />}
      </main>

      {/* Agent Details Inspector Modal */}
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent.agent}
          presence={selectedAgent.presence}
          onClose={() => setSelectedAgent(null)}
          onRefresh={loadData}
          onMoveAgent={handleMoveAgent}
        />
      )}

      {/* Enterprise Task Output & Deliverable Inspector Modal */}
      {inspectingTask && (
        <TaskOutputModal
          task={inspectingTask}
          onClose={() => setInspectingTask(null)}
          onApprove={async (id) => {
            await api.approveTask(id);
            loadData();
          }}
          onRevise={async (id, feedback) => {
            await api.reviseTask(id, feedback);
            loadData();
          }}
          onClarify={async (id, answer) => {
            await api.clarifyTask(id, answer);
            loadData();
          }}
        />
      )}
    </div>
  );
}
