import React from 'react';
import { Agent, AgentPresence, OfficeState } from '../types';
import { OfficeStage } from '../stage/OfficeStage';

interface OfficeMap2DProps {
  agents: Agent[];
  presences: AgentPresence[];
  officeState?: OfficeState | null;
  onSelectAgent: (agent: Agent, presence?: AgentPresence) => void;
}

// Gender & Avatar Asset Mapping for the 7 Agents
export const AGENT_CONFIG: Record<string, {
  gender: 'COWOK' | 'CEWEK';
  avatar: string;
  stand: string;
  wave: string;
  typing: string;
  thinking: string;
  coffee: string;
  sleep: string;
  color: string;
}> = {
  Ito: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#8B5CF6',
  },
  Avis: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#3B82F6',
  },
  Zidane: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#10B981',
  },
  Sinta: {
    gender: 'CEWEK',
    avatar: '/sprites/dewi_avatar.png',
    stand: '/sprites/dewi_transparent.png',
    wave: '/sprites/dewi_upper.png',
    typing: '/sprites/dewi_upper.png',
    thinking: '/sprites/dewi_upper.png',
    coffee: '/sprites/dewi_upper.png',
    sleep: '/sprites/dewi_full.jpg',
    color: '#EC4899',
  },
  Muji: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#F59E0B',
  },
  Laras: {
    gender: 'CEWEK',
    avatar: '/sprites/dewi_avatar.png',
    stand: '/sprites/dewi_transparent.png',
    wave: '/sprites/dewi_upper.png',
    typing: '/sprites/dewi_upper.png',
    thinking: '/sprites/dewi_upper.png',
    coffee: '/sprites/dewi_upper.png',
    sleep: '/sprites/dewi_full.jpg',
    color: '#A855F7',
  },
  'Kimi Hime': {
    gender: 'CEWEK',
    avatar: '/sprites/dewi_avatar.png',
    stand: '/sprites/dewi_transparent.png',
    wave: '/sprites/dewi_upper.png',
    typing: '/sprites/dewi_upper.png',
    thinking: '/sprites/dewi_upper.png',
    coffee: '/sprites/dewi_upper.png',
    sleep: '/sprites/dewi_full.jpg',
    color: '#06B6D4',
  },
  // Backward-compatible Aliases
  Dewi: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#8B5CF6',
  },
  Raka: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#3B82F6',
  },
  Bima: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#10B981',
  },
  Naya: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#F59E0B',
  },
  Dimas: {
    gender: 'CEWEK',
    avatar: '/sprites/dewi_avatar.png',
    stand: '/sprites/dewi_transparent.png',
    wave: '/sprites/dewi_upper.png',
    typing: '/sprites/dewi_upper.png',
    thinking: '/sprites/dewi_upper.png',
    coffee: '/sprites/dewi_upper.png',
    sleep: '/sprites/dewi_full.jpg',
    color: '#06B6D4',
  },
  Ari: {
    gender: 'COWOK',
    avatar: '/sprites/bima_avatar.png',
    stand: '/sprites/bima_transparent.png',
    wave: '/sprites/bima_upper.png',
    typing: '/sprites/bima_upper.png',
    thinking: '/sprites/bima_upper.png',
    coffee: '/sprites/bima_upper.png',
    sleep: '/sprites/bima_full.jpg',
    color: '#10B981',
  },
};

// Backward-compatible alias
export const AGENT_SIMS_CONFIG = AGENT_CONFIG;

export const OfficeMap2D: React.FC<OfficeMap2DProps> = ({
  agents,
  presences,
  officeState = null,
  onSelectAgent,
}) => {
  return (
    <OfficeStage
      agents={agents}
      presences={presences}
      officeState={officeState}
      onSelectAgent={onSelectAgent}
    />
  );
};
