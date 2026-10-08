export interface Agent {
  id: string;
  name: string;
  role: string;
  jobdesk: string;
  color: string;
  model?: string;
  deskIndex?: number;
  active: boolean;
}

export type AgentStatus = 'WORKING' | 'IDLE' | 'STANDUP' | 'PRAYING' | 'RESTING' | 'TOILET' | 'OFFLINE' | 'THINKING';
export type AgentLocation = 'DESK' | 'STANDUP_AREA' | 'MUSHOLA' | 'TOILET' | 'LAPANGAN';

export interface AgentPresence {
  agentId: string;
  status: AgentStatus;
  location: AgentLocation;
  currentTaskId?: string | null;
  bubbleText?: string | null;
  bubbleType?: string | null;
  updatedAt: string;
  agent?: Agent;
}

export type TaskStatus = 'PENDING' | 'QUEUED' | 'RUNNING' | 'REVIEW' | 'DONE' | 'FAILED' | 'BLOCKED';

export interface Task {
  id: string;
  taskKey?: string | null;
  goalId?: string | null;
  agentId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  deliverableType?: string | null;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  status: TaskStatus;
  dependsOn: string[];
  needsReview: boolean;
  result?: string | null;
  outputEnvelope?: any;
  error?: string | null;
  revisionCount: number;
  revisionNotes?: string | null;
  modelUsed?: string | null;
  totalTokens?: number | null;
  createdAt: string;
  finishedAt?: string | null;
  agent?: Agent;
}

export interface Goal {
  id: string;
  title: string;
  text: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'DONE' | 'NEEDS_CLARIFICATION' | 'CANCELLED';
  classification?: string | null;
  summary?: string | null;
  assumptions: string[];
  openQuestions: string[];
  createdAt: string;
  tasks: Task[];
  progress?: {
    total: number;
    done: number;
    blocked: number;
    queued: number;
    running: number;
    percent: number;
  };
}

export interface OfficeState {
  isOpen: boolean;
  status: 'OPEN' | 'BREAK' | 'CLOSED' | 'PAUSED' | 'OVERTIME';
  currentTime: string;
  currentDay: string;
  timezone: string;
  isPaused: boolean;
  isOvertime: boolean;
  activeBlock?: {
    id: string;
    name: string;
    type: string;
    startTime: string;
    endTime: string;
  };
  suggestedPresence: {
    status: AgentStatus;
    location: AgentLocation;
  };
  summary: string;
}

export interface OfficeStats {
  today: {
    totalRuns: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    avgLatencyMs: number;
    quota: {
      tokensToday: number;
      tokenLimit: number;
      runsToday: number;
      runLimit: number;
      tokenPercent: number;
      runPercent: number;
    };
  };
  tasks: {
    total: number;
    done: number;
    queued: number;
    running: number;
    review: number;
    blocked: number;
    failed: number;
  };
  agents: Array<{
    agentId: string;
    name: string;
    role: string;
    color: string;
    runsCount: number;
    totalTokens: number;
    avgLatencyMs: number;
    successRate: number;
  }>;
  models: Array<{
    model: string;
    runsCount: number;
    totalTokens: number;
  }>;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  eventType: string;
  agentId?: string | null;
  taskId?: string | null;
  goalId?: string | null;
  description: string;
  metadata?: any;
}
