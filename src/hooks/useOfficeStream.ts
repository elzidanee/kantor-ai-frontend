import { useEffect, useState, useRef } from 'react';
import { AgentPresence, OfficeState, Task, ActivityLog } from '../types';

const STREAM_URL = 'http://localhost:3000/office/stream';

export function useOfficeStream(initialPresences: AgentPresence[] = []) {
  const [presences, setPresences] = useState<AgentPresence[]>(initialPresences);
  const [officeState, setOfficeState] = useState<OfficeState | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource(STREAM_URL);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
      };

      es.onerror = () => {
        setIsConnected(false);
      };

      es.addEventListener('office.status', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setOfficeState((prev) => (prev ? { ...prev, ...data } : data));
        } catch {}
      });

      es.addEventListener('agent.presence', (e: MessageEvent) => {
        try {
          const updated: AgentPresence = JSON.parse(e.data);
          setPresences((prev) => {
            const index = prev.findIndex((p) => p.agentId === updated.agentId);
            if (index >= 0) {
              const copy = [...prev];
              copy[index] = { ...copy[index], ...updated };
              return copy;
            }
            return [...prev, updated];
          });
        } catch {}
      });

      es.addEventListener('task.updated', (e: MessageEvent) => {
        try {
          const taskData = JSON.parse(e.data);
          setRecentTasks((prev) => {
            const exists = prev.find((t) => t.id === taskData.id);
            if (exists) {
              return prev.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t));
            }
            return [taskData, ...prev.slice(0, 19)];
          });
        } catch {}
      });

      es.addEventListener('run.finished', (e: MessageEvent) => {
        try {
          const runData = JSON.parse(e.data);
          setLogs((prev) => [
            {
              id: String(Date.now()),
              timestamp: new Date().toISOString(),
              eventType: 'RUN_FINISHED',
              taskId: runData.taskId,
              agentId: runData.agentId,
              description: `Run selesai: ${runData.model} (${runData.latencyMs}ms, ${runData.totalTokens || 0} tokens)`,
            },
            ...prev.slice(0, 29),
          ]);
        } catch {}
      });
    } catch (err) {
      setIsConnected(false);
    }

    return () => {
      if (es) es.close();
    };
  }, []);

  return {
    presences,
    setPresences,
    officeState,
    setOfficeState,
    recentTasks,
    logs,
    isConnected,
  };
}
