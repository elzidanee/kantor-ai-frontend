import { useState, useEffect, useRef } from 'react';
import { Agent, AgentPresence, AgentLocation, AgentStatus } from '../types';
import { Point, calculateNavigationRoute, getAgentSlot } from './layout';

export interface DynamicAgentState {
  id: string;
  name: string;
  role: string;
  gender: 'COWOK' | 'CEWEK';
  color: string;
  deskIndex: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  currentLocation: AgentLocation;
  targetLocation: AgentLocation;
  isWalking: boolean;
  facing: 'left' | 'right';
  walkFrame: number;
  status: AgentStatus;
  bubbleText?: string | null;
  bubbleType?: string | null;
  route: Point[];
}

export const GENDER_MAP: Record<string, 'COWOK' | 'CEWEK'> = {
  Ito: 'COWOK',
  Avis: 'COWOK',
  Zidane: 'COWOK',
  Sinta: 'CEWEK',
  Muji: 'COWOK',
  Laras: 'CEWEK',
  'Kimi Hime': 'CEWEK',
  // Backward compatibility
  Dewi: 'COWOK',
  Bima: 'COWOK',
  Raka: 'COWOK',
  Naya: 'COWOK',
  Dimas: 'CEWEK',
  Ari: 'COWOK',
};

// Pemetaan nomor meja otoritatif: Ito PM di papan tulis (0), Laras KT di meja 6 (5)
export const AGENT_DESK_INDEX_MAP: Record<string, number> = {
  Ito: 0,        // Papan Tulis Whiteboard Sprint (x: 230, y: 250)
  Avis: 1,       // Meja 2 FE (x: 380, y: 220)
  Zidane: 2,     // Meja 3 BE (x: 500, y: 250)
  Sinta: 3,      // Meja 4 QA (x: 330, y: 340)
  Muji: 4,       // Meja 5 MK (x: 440, y: 340)
  Laras: 5,      // Meja 6 KT (x: 240, y: 440 - Meja kerja Content Writer)
  'Kimi Hime': 6,// Meja 7 CS (x: 330, y: 520 - Meja resepsionis Customer Support)
  // Backward compatibility aliases
  Dewi: 0,
  Raka: 1,
  Bima: 2,
  Naya: 4,
  Dimas: 6,
  Ari: 2,
};

// Helper memberikan offset jalur antar-agent agar tidak bertabrakan, tapi menjaga ambang pintu tetap bersih
function applySafeLaneOffset(rawRoute: Point[], deskIndex: number, is3D: boolean): Point[] {
  const laneOffset = (deskIndex - 3) * 3.5; // -10.5px s/d +10.5px (halus dan proporsional)

  return rawRoute.map((pt, i) => {
    // Jangan beri offset pada titik awal dan titik akhir (posisi duduk/slot target)
    if (i === 0 || i === rawRoute.length - 1) return pt;

    // Cek apakah waypoint ini adalah pintu atau lorong sempit
    if (is3D) {
      // Pintu kantor (645, 340), Pintu mushola (770, 270), Pintu toilet (940, 400), Gapura taman (560, 510)
      const nearDoor =
        Math.hypot(pt.x - 645, pt.y - 340) < 30 ||
        Math.hypot(pt.x - 770, pt.y - 270) < 30 ||
        Math.hypot(pt.x - 940, pt.y - 400) < 30 ||
        Math.hypot(pt.x - 560, pt.y - 510) < 30;
      if (nearDoor) return pt;
      return {
        x: pt.x + (pt.y > 520 ? laneOffset * 0.4 : laneOffset * 0.7),
        y: pt.y + (pt.x > 670 && pt.x < 850 ? laneOffset * 0.5 : 0),
      };
    } else {
      // 2D: Lorong vertikal sempit x ~ 815
      const inNarrowCorridor = Math.abs(pt.x - 815) < 30;
      if (inNarrowCorridor) {
        return { x: pt.x, y: pt.y + laneOffset * 0.4 };
      }
      return {
        x: pt.x + laneOffset,
        y: pt.y,
      };
    }
  });
}

export function useAgentMovement(
  agents: Agent[],
  presences: AgentPresence[],
  is3D = false
) {
  const [agentStates, setAgentStates] = useState<Record<string, DynamicAgentState>>({});
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const agentStatesRef = useRef<Record<string, DynamicAgentState>>({});
  const lastTimeRef = useRef<number>(performance.now());
  const walkFrameTimerRef = useRef<number>(0);

  agentStatesRef.current = agentStates;

  // Sinkronisasi data awal dan update dari props
  useEffect(() => {
    if (!agents.length) return;

    setAgentStates((prev) => {
      const next: Record<string, DynamicAgentState> = { ...prev };

      agents.forEach((agent, idx) => {
        const presence = presences.find((p) => p.agentId === agent.id);
        const reqLocation: AgentLocation = (presence?.location as AgentLocation) || 'DESK';
        const reqStatus: AgentStatus = (presence?.status as AgentStatus) || 'WORKING';
        const bubbleText = presence?.bubbleText;
        const bubbleType = presence?.bubbleType;
        const gender = GENDER_MAP[agent.name] || (idx % 2 === 0 ? 'CEWEK' : 'COWOK');
        const deskIndex = (agent.name in AGENT_DESK_INDEX_MAP)
          ? AGENT_DESK_INDEX_MAP[agent.name]
          : (typeof agent.deskIndex === 'number' ? agent.deskIndex : idx);

        const targetSlot = getAgentSlot(reqLocation, deskIndex, is3D);
        const existing = prev[agent.id];

        if (!existing) {
          next[agent.id] = {
            id: agent.id,
            name: agent.name,
            role: agent.role,
            gender,
            color: agent.color || '#3b82f6',
            deskIndex,
            x: targetSlot.x,
            y: targetSlot.y,
            targetX: targetSlot.x,
            targetY: targetSlot.y,
            currentLocation: reqLocation,
            targetLocation: reqLocation,
            isWalking: false,
            facing: deskIndex === 0 ? 'right' : 'right',
            walkFrame: 1,
            status: reqStatus,
            bubbleText,
            bubbleType,
            route: [],
          };
        } else {
          const deskIndexChanged = existing.deskIndex !== deskIndex;
          const locationChanged = existing.targetLocation !== reqLocation;

          if (locationChanged || deskIndexChanged) {
            if (deskIndexChanged && !locationChanged && existing.currentLocation === 'DESK' && !existing.isWalking) {
              // Jika meja dipindah dan sedang di meja, langsung update koordinat posisi meja baru
              next[agent.id] = {
                ...existing,
                name: agent.name,
                role: agent.role,
                gender,
                color: agent.color || existing.color,
                deskIndex,
                x: targetSlot.x,
                y: targetSlot.y,
                targetX: targetSlot.x,
                targetY: targetSlot.y,
                status: reqStatus,
                bubbleText,
                bubbleType,
                route: [],
                isWalking: false,
              };
            } else {
              const startPos: Point = { x: existing.x, y: existing.y };
              const rawRoute = calculateNavigationRoute(
                startPos,
                targetSlot,
                existing.currentLocation,
                reqLocation,
                is3D
              );

              const route = applySafeLaneOffset(rawRoute, deskIndex, is3D);
              const nextRoute = route.slice(1);
              next[agent.id] = {
                ...existing,
                name: agent.name,
                role: agent.role,
                gender,
                color: agent.color || existing.color,
                deskIndex,
                status: reqStatus,
                bubbleText,
                bubbleType,
                targetLocation: reqLocation,
                targetX: targetSlot.x,
                targetY: targetSlot.y,
                route: nextRoute,
                isWalking: nextRoute.length > 0,
              };
            }
          } else {
            next[agent.id] = {
              ...existing,
              name: agent.name,
              role: agent.role,
              gender,
              color: agent.color || existing.color,
              deskIndex,
              status: reqStatus,
              bubbleText,
              bubbleType,
            };
          }
        }
      });

      return next;
    });
  }, [agents, presences, is3D]);

  // Main Walking Animation & Position Loop (requestAnimationFrame)
  useEffect(() => {
    let animId: number;

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.06); // max 60ms step untuk kelancaran tinggi
      lastTimeRef.current = currentTime;

      const baseSpeed = 110 * speedMultiplier; // 110 px/s kecepatan jalan alami
      walkFrameTimerRef.current += dt;
      const shouldStepFrame = walkFrameTimerRef.current >= 0.12;
      if (shouldStepFrame) {
        walkFrameTimerRef.current = 0;
      }

      const stateMap = agentStatesRef.current;
      let hasChange = false;
      const updated: Record<string, DynamicAgentState> = {};

      for (const id of Object.keys(stateMap)) {
        const ag = { ...stateMap[id] };

        if (ag.route && ag.route.length > 0) {
          hasChange = true;
          let targetWp = ag.route[0];
          let dx = targetWp.x - ag.x;
          let dy = targetWp.y - ag.y;
          let dist = Math.hypot(dx, dy);

          // Hitung sisa jarak untuk perlambatan halus saat tiba di kursi/sajadah (arrival easing)
          let totalRemainingDist = dist;
          for (let r = 1; r < ag.route.length; r++) {
            totalRemainingDist += Math.hypot(
              ag.route[r].x - ag.route[r - 1].x,
              ag.route[r].y - ag.route[r - 1].y
            );
          }

          let currentSpeed = baseSpeed;
          if (totalRemainingDist < 35) {
            // Perlambatan lembut mendekati target akhir
            currentSpeed = Math.max(30 * speedMultiplier, baseSpeed * (totalRemainingDist / 35));
          }

          let step = currentSpeed * dt;

          if (dist <= step || dist < 2.0) {
            // Capai waypoint perantara
            const residualStep = Math.max(0, step - dist);
            ag.x = targetWp.x;
            ag.y = targetWp.y;
            ag.route = ag.route.slice(1);

            if (ag.route.length === 0) {
              // Tiba sempurna di koordinat slot tujuan akhir
              ag.x = ag.targetX;
              ag.y = ag.targetY;
              ag.isWalking = false;
              ag.currentLocation = ag.targetLocation;
              ag.walkFrame = 1;
            } else if (residualStep > 0) {
              // Teruskan sisa jarak ke segmen berikutnya agar tidak ada mikrostutter di sudut belokan
              const nextWp = ag.route[0];
              const ndx = nextWp.x - ag.x;
              const ndy = nextWp.y - ag.y;
              const ndist = Math.hypot(ndx, ndy);
              if (ndist > 0.1) {
                const subStep = Math.min(residualStep, ndist);
                ag.x += (ndx / ndist) * subStep;
                ag.y += (ndy / ndist) * subStep;
              }
            }
          } else {
            // Melangkah mulus sepanjang vektor waypoint
            ag.x += (dx / dist) * step;
            ag.y += (dy / dist) * step;
            ag.isWalking = true;

            // Orientasi hadap dengan threshold anti-jitter
            if (Math.abs(dx) > 0.8) {
              ag.facing = dx > 0 ? 'right' : 'left';
            }

            if (shouldStepFrame) {
              ag.walkFrame = (ag.walkFrame % 4) + 1;
            }
          }
        } else if (ag.isWalking) {
          ag.isWalking = false;
          ag.walkFrame = 1;
          hasChange = true;
        }

        updated[id] = ag;
      }

      if (hasChange) {
        setAgentStates(updated);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speedMultiplier]);

  // Perintah manual agent bergerak ke ruangan
  const moveAgent = (agentId: string, newLocation: AgentLocation, customStatus?: AgentStatus, customBubble?: string) => {
    setAgentStates((prev) => {
      const ag = prev[agentId];
      if (!ag) return prev;

      const targetSlot = getAgentSlot(newLocation, ag.deskIndex, is3D);
      const startPos: Point = { x: ag.x, y: ag.y };
      const rawRoute = calculateNavigationRoute(startPos, targetSlot, ag.currentLocation, newLocation, is3D);
      const route = applySafeLaneOffset(rawRoute, ag.deskIndex, is3D);

      const nextRoute = route.slice(1);
      return {
        ...prev,
        [agentId]: {
          ...ag,
          targetLocation: newLocation,
          targetX: targetSlot.x,
          targetY: targetSlot.y,
          route: nextRoute,
          isWalking: nextRoute.length > 0,
          status: customStatus || (newLocation === 'DESK' ? 'WORKING' : (newLocation === 'MUSHOLA' ? 'PRAYING' : (newLocation === 'TOILET' ? 'TOILET' : 'RESTING'))),
          bubbleText: customBubble ?? (newLocation === 'MUSHOLA' ? 'Menuju mushola untuk sholat...' : (newLocation === 'LAPANGAN' ? 'Santai ngopi di gazebo...' : (newLocation === 'TOILET' ? 'Izin ke toilet...' : 'Kembali fokus ke meja kerja...'))),
          bubbleType: newLocation === 'MUSHOLA' ? 'PRAYING' : (newLocation === 'LAPANGAN' ? 'RESTING' : (newLocation === 'TOILET' ? 'TOILET' : 'WORKING')),
        },
      };
    });
  };

  // Perintah serentak semua agent
  const moveAllAgents = (newLocation: AgentLocation) => {
    setAgentStates((prev) => {
      const next: Record<string, DynamicAgentState> = {};

      for (const id of Object.keys(prev)) {
        const ag = prev[id];
        const targetSlot = getAgentSlot(newLocation, ag.deskIndex, is3D);
        const startPos: Point = { x: ag.x, y: ag.y };
        const rawRoute = calculateNavigationRoute(startPos, targetSlot, ag.currentLocation, newLocation, is3D);
        const route = applySafeLaneOffset(rawRoute, ag.deskIndex, is3D);

        let status: AgentStatus = 'WORKING';
        let bubbleText = 'Kembali bekerja di meja!';
        let bubbleType = 'WORKING';

        if (newLocation === 'MUSHOLA') {
          status = 'PRAYING';
          bubbleText = 'Waktu sholat berjamaah tiba!';
          bubbleType = 'PRAYING';
        } else if (newLocation === 'LAPANGAN') {
          status = 'RESTING';
          bubbleText = 'Istirahat santai sejenak!';
          bubbleType = 'RESTING';
        } else if (newLocation === 'STANDUP_AREA') {
          status = 'STANDUP';
          bubbleText = 'Apel pagi & sprint briefing!';
          bubbleType = 'STANDUP';
        }

        const nextRouteAll = route.slice(1);
        next[id] = {
          ...ag,
          targetLocation: newLocation,
          targetX: targetSlot.x,
          targetY: targetSlot.y,
          route: nextRouteAll,
          isWalking: nextRouteAll.length > 0,
          status,
          bubbleText,
          bubbleType,
        };
      }

      return next;
    });
  };

  return {
    agentStates,
    moveAgent,
    moveAllAgents,
    speedMultiplier,
    setSpeedMultiplier,
  };
}
