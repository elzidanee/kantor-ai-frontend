const API_BASE = 'http://localhost:3000';

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  getOfficeState: () => fetchJson<any>('/office/state'),
  pauseOffice: () => fetchJson<any>('/office/pause', { method: 'POST' }),
  resumeOffice: () => fetchJson<any>('/office/resume', { method: 'POST' }),
  toggleOvertime: (isOvertime: boolean) =>
    fetchJson<any>('/office/overtime', {
      method: 'POST',
      body: JSON.stringify({ isOvertime }),
    }),

  getAgents: () => fetchJson<any[]>('/office/agents'),
  getPresences: () => fetchJson<any[]>('/office/presences'),
  sendToToilet: (agentId: string, duration = 1) =>
    fetchJson<any>(`/office/toilet/${agentId}?duration=${duration}`, { method: 'POST' }),

  getTasks: () => fetchJson<any[]>('/office/tasks'),
  getTask: (id: string) => fetchJson<any>(`/office/tasks/${id}`),
  createTask: (data: { agentId: string; title: string; description: string; acceptanceCriteria?: string[]; priority?: string }) =>
    fetchJson<any>('/office/tasks', { method: 'POST', body: JSON.stringify(data) }),
  approveTask: (id: string) => fetchJson<any>(`/office/tasks/${id}/approve`, { method: 'POST' }),
  reviseTask: (id: string, feedback: string) =>
    fetchJson<any>(`/office/tasks/${id}/revise`, { method: 'POST', body: JSON.stringify({ feedback }) }),
  clarifyTask: (id: string, answer: string) =>
    fetchJson<any>(`/office/tasks/${id}/clarify`, { method: 'POST', body: JSON.stringify({ answer }) }),
  unblockAllTasks: () =>
    fetchJson<any>('/office/unblock-all', { method: 'POST' }),

  getGoals: () => fetchJson<any[]>('/office/goals'),
  getGoal: (id: string) => fetchJson<any>(`/office/goals/${id}`),
  createGoal: (text: string) => fetchJson<any>('/office/goals', { method: 'POST', body: JSON.stringify({ text }) }),
  clarifyGoal: (id: string, answer: string) =>
    fetchJson<any>(`/office/goals/${id}/clarify`, { method: 'POST', body: JSON.stringify({ answer }) }),

  getStats: () => fetchJson<any>('/office/stats'),
  getLogs: (limit = 20) => fetchJson<{ items: any[] }>(`/office/logs?limit=${limit}`),
};
