import React, { useState, useRef } from 'react';
import { Agent, AgentPresence, OfficeState } from '../types';
import { ROOMS, SLOTS, SLOTS_3D, PROPS, WAYPOINTS, WAYPOINTS_3D, GRAPH_EDGES, GRAPH_EDGES_3D, STAGE_CONFIG } from './layout';
import { useAgentMovement } from './useAgentMovement';
import { OfficeCharacter } from './OfficeCharacter';
import { CharacterSprite } from './CharacterSprite';
import { OfficeAvatarCharacter } from './OfficeAvatarCharacter';
import { WallClock } from './WallClock';
import {
  WhiteboardProp,
  BookshelfProp,
  WaterDispenserProp,
  PrinterStationProp,
  PlantProp,
  SajadahProp,
  QuranCabinetProp,
  ShoeRackProp,
  ToiletStallProp,
  WashbasinProp,
  CoffeeCartProp,
  ParkBenchProp,
  ShadeTreeProp,
  SoccerGoalProp,
  DeskProp,
  ServerRackProp,
  AdhanClockProp,
  ImamNicheProp,
  PrayerGarmentRackProp,
  KoiPondProp,
  GardenLampProp,
  PicnicUmbrellaTableProp,
} from './VectorProps';
import { 
  ZoomIn, ZoomOut, RotateCcw, Bug, Play, Users, 
  Sparkles, Coffee, Bath, Laptop, Compass, MessageSquare,
  Image as ImageIcon, Layers, Eye
} from 'lucide-react';

interface OfficeStageProps {
  agents: Agent[];
  presences: AgentPresence[];
  officeState: OfficeState | null;
  onSelectAgent: (agent: Agent, presence?: AgentPresence) => void;
}

export const OfficeStage: React.FC<OfficeStageProps> = ({
  agents,
  presences,
  officeState,
  onSelectAgent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showAllBubbles, setShowAllBubbles] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'3D_ILLUSTRATION' | 'VECTOR_BLUEPRINT'>('3D_ILLUSTRATION');
  const [charStyle, setCharStyle] = useState<'AVATAR' | 'VECTOR'>('AVATAR');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  // Hook pergerakan agent real-time (Dijkstra waypoint walk, dengan mode 3D terkalibrasi)
  const is3D = mapMode === '3D_ILLUSTRATION';
  const {
    agentStates,
    moveAgent,
    moveAllAgents,
    speedMultiplier,
    setSpeedMultiplier,
  } = useAgentMovement(agents, presences, is3D);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 1.6));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.75));
  const handleZoomReset = () => setZoom(1);

  // Filter pencahayaan berdasarkan status kantor (PRD 2.1)
  const getLightingFilter = () => {
    const status = officeState?.status || 'OPEN';
    switch (status) {
      case 'BREAK':
        return 'bg-amber-500/10 mix-blend-color-burn pointer-events-none';
      case 'CLOSED':
        return 'bg-blue-950/40 mix-blend-multiply pointer-events-none';
      case 'OVERTIME':
        return 'bg-indigo-950/25 mix-blend-color-dodge pointer-events-none';
      default:
        return 'pointer-events-none';
    }
  };

  const activeAgentList = Object.values(agentStates);
  const movingCount = activeAgentList.filter((a) => a.isWalking).length;

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* 1. TOP ARCHITECTURAL CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md shadow-xl">
        {/* Left: Quick Simulation Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5 font-mono">
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            Simulasi Gerak:
          </span>

          <button
            onClick={() => moveAllAgents('DESK')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1.5 transition-all shadow-sm"
            title="Semua agent berjalan ke meja kerja masing-masing"
          >
            <Laptop className="w-3.5 h-3.5 text-amber-400" />
            <span>Jam Kerja (Meja)</span>
          </button>

          <button
            onClick={() => moveAllAgents('STANDUP_AREA')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 flex items-center gap-1.5 transition-all shadow-sm"
            title="Semua agent berbaris ke area apel pagi"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Apel Pagi</span>
          </button>

          <button
            onClick={() => moveAllAgents('MUSHOLA')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 flex items-center gap-1.5 transition-all shadow-sm"
            title="Semua agent berjalan ke mushola untuk sholat"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Waktu Sholat</span>
          </button>

          <button
            onClick={() => moveAllAgents('LAPANGAN')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1.5 transition-all shadow-sm"
            title="Semua agent berjalan ke taman & gazebo kopi"
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Istirahat Kopi</span>
          </button>
        </div>

        {/* Center/Right: View Options (Denah 3D vs Blueprint, Karakter Vektor vs Sprite) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Toggle Map Mode: 3D Master Plan vs Vector Blueprint */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-[11px]">
            <button
              onClick={() => setMapMode('3D_ILLUSTRATION')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mapMode === '3D_ILLUSTRATION'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Denah Ilustrasi 3D Master Plan Asli"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Denah 3D</span>
            </button>
            <button
              onClick={() => setMapMode('VECTOR_BLUEPRINT')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mapMode === 'VECTOR_BLUEPRINT'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Denah Blueprint Vektor Arsitektur"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Blueprint Vektor</span>
            </button>
          </div>

          {/* Toggle Character Style: Avatar 2.5D vs Vector */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-[11px]">
            <button
              onClick={() => setCharStyle('AVATAR')}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                charStyle === 'AVATAR'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Avatar Bima & Dewi 2.5D (Transparan, Animasi Jalan & Kerja Lengkap)"
            >
              <span>Avatar 2.5D</span>
            </button>
            <button
              onClick={() => setCharStyle('VECTOR')}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                charStyle === 'VECTOR'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Vektor Minimalis"
            >
              <span>Vektor</span>
            </button>
          </div>

          {/* Toggle Bubble View Mode */}
          <button
            onClick={() => setShowAllBubbles(!showAllBubbles)}
            className={`px-2 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              showAllBubbles
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Tampilkan semua balon kata atau mode ringkas (hover/klik)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {showAllBubbles ? 'Balon: Semua' : 'Balon: Ringkas'}
            </span>
          </button>

          {/* Speed Multiplier */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-[11px]">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-0.5 rounded-lg font-bold font-mono transition-all ${
                  speedMultiplier === s
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Debug Button */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              showDebug
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Tampilkan waypoint graf Dijkstra & slot posisi"
          >
            <Bug className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 bg-slate-950 rounded-xl p-1 border border-slate-800">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Perbesar (+)"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Perkecil (-)"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Skala"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MASTER ARCHITECTURAL CANVAS CONTAINER (1280 x 800) */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-3xl border-2 border-slate-800/90 bg-[#070b14] shadow-2xl overflow-hidden select-none"
        style={{
          aspectRatio: `${STAGE_CONFIG.width} / ${STAGE_CONFIG.height}`,
        }}
      >
        {/* Scaled World Wrapper */}
        <div
          className="absolute inset-0 origin-top-left transition-transform duration-100 ease-out"
          style={{
            width: STAGE_CONFIG.width,
            height: STAGE_CONFIG.height,
            transform: `scale(${zoom})`,
          }}
        >
          {/* ======================================================== */}
          {/* MODE A: 3D MASTER PLAN ILUSTRASI ASLI                    */}
          {/* ======================================================== */}
          {mapMode === '3D_ILLUSTRATION' && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/sprites/office_master_plan.jpg"
                alt="Master Architectural Office Plan"
                className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.05]"
              />

              {/* Room Annotation Overlays on top of the 3D Render */}
              {/* Ruang Kerja Tag */}
              <div className="absolute top-8 left-10 z-10 flex items-center gap-2 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-amber-600/50 backdrop-blur-md shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-black text-amber-100 font-mono">
                  RUANG KERJA UTAMA
                </span>
                <span className="text-[9px] text-amber-300/80 font-mono">[7 WORKSTATIONS]</span>
              </div>

              {/* Mushola Tag */}
              <div className="absolute top-8 right-[320px] z-10 flex items-center gap-2 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-teal-600/50 backdrop-blur-md shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-black text-teal-100 font-mono">
                  MUSHOLA AL-IKHLAS
                </span>
                <span className="text-[9px] text-teal-300/80 font-mono">[SHAF BERJAMAAH]</span>
              </div>

              {/* Restroom Tag */}
              <div className="absolute top-[280px] right-8 z-10 flex items-center gap-2 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-sky-600/50 backdrop-blur-md shadow-lg">
                <Bath className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-black text-sky-100 font-mono">
                  RESTROOM & TOILET
                </span>
              </div>

              {/* Taman & Gazebo Tag */}
              <div className="absolute bottom-8 left-[380px] z-10 flex items-center gap-2 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-emerald-600/50 backdrop-blur-md shadow-lg">
                <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-black text-emerald-100 font-mono">
                  TAMAN & GAZEBO KOPI AREN
                </span>
              </div>

              {/* Live Wall Clock */}
              <div className="absolute top-10 left-[480px] z-20">
                <WallClock />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODE B: BLUEPRINT VEKTOR ARSITEKTUR                      */}
          {/* ======================================================== */}
          {mapMode === 'VECTOR_BLUEPRINT' && (
            <>
              {/* SVG Textures Definitions */}
              <svg className="absolute w-0 h-0 pointer-events-none">
                <defs>
                  <pattern id="wood-parquet-v2" width="48" height="48" patternUnits="userSpaceOnUse">
                    <rect width="48" height="48" fill="#241a12" />
                    <rect x="0" y="0" width="24" height="12" fill="#2e2117" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="0" y="12" width="24" height="12" fill="#36281c" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="24" y="0" width="12" height="24" fill="#322419" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="36" y="0" width="12" height="24" fill="#2a1e15" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="0" y="24" width="12" height="24" fill="#34261a" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="12" y="24" width="12" height="24" fill="#291c13" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="24" y="24" width="24" height="12" fill="#302217" stroke="#18110b" strokeWidth="0.75" />
                    <rect x="24" y="36" width="24" height="12" fill="#38291d" stroke="#18110b" strokeWidth="0.75" />
                  </pattern>

                  <pattern id="mushola-carpet-v2" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="40" height="40" fill="#06322b" />
                    <rect x="1" y="1" width="38" height="38" fill="#083d34" stroke="#042621" strokeWidth="1" />
                    <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="#14b8a6" strokeWidth="0.6" opacity="0.35" />
                    <circle cx="20" cy="20" r="3" fill="#14b8a6" opacity="0.4" />
                  </pattern>

                  <pattern id="toilet-tiles-v2" width="32" height="32" patternUnits="userSpaceOnUse">
                    <rect width="32" height="32" fill="#0f172a" />
                    <rect x="1" y="1" width="30" height="30" fill="#172236" stroke="#0a0f1d" strokeWidth="1" />
                  </pattern>

                  <pattern id="grass-lawn-v2" width="36" height="36" patternUnits="userSpaceOnUse">
                    <rect width="36" height="36" fill="#064e3b" />
                    <circle cx="10" cy="10" r="1.5" fill="#047857" opacity="0.8" />
                    <circle cx="28" cy="26" r="1.5" fill="#059669" opacity="0.8" />
                  </pattern>
                </defs>
              </svg>

              {/* Ruang Kerja Utama */}
              <div
                className="absolute rounded-2xl overflow-hidden border-4 border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                style={{
                  left: ROOMS.KANTOR.x,
                  top: ROOMS.KANTOR.y,
                  width: ROOMS.KANTOR.w,
                  height: ROOMS.KANTOR.h,
                  backgroundColor: '#241a12',
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect width="100%" height="100%" fill="url(#wood-parquet-v2)" />
                </svg>

                <div className="absolute top-3 left-4 z-20 flex items-center gap-2.5 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-amber-600/40 backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-black text-amber-100 font-mono">
                    {ROOMS.KANTOR.name}
                  </span>
                </div>

                {/* Standup Area Decal */}
                <div className="absolute bottom-3 left-8 right-8 h-12 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest font-mono">
                    ✦ AREA APEL PAGI & SPRINT STANDUP ✦
                  </span>
                </div>

                <div className="absolute top-3 left-[390px] z-20">
                  <WallClock />
                </div>
              </div>

              {/* Mushola Al-Ikhlas */}
              <div
                className="absolute rounded-2xl overflow-hidden border-4 border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                style={{
                  left: ROOMS.MUSHOLA.x,
                  top: ROOMS.MUSHOLA.y,
                  width: ROOMS.MUSHOLA.w,
                  height: ROOMS.MUSHOLA.h,
                  backgroundColor: '#06322b',
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect width="100%" height="100%" fill="url(#mushola-carpet-v2)" />
                </svg>

                <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-teal-600/40 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-black text-teal-100 font-mono">
                    {ROOMS.MUSHOLA.name}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 text-[9.5px] font-mono text-teal-200 bg-teal-950/90 px-2.5 py-1 rounded-lg border border-teal-500/30">
                  <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '24s' }} />
                  <span>Kiblat 295° BL</span>
                </div>
              </div>

              {/* Restroom */}
              <div
                className="absolute rounded-2xl overflow-hidden border-4 border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                style={{
                  left: ROOMS.TOILET.x,
                  top: ROOMS.TOILET.y,
                  width: ROOMS.TOILET.w,
                  height: ROOMS.TOILET.h,
                  backgroundColor: '#0f172a',
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect width="100%" height="100%" fill="url(#toilet-tiles-v2)" />
                </svg>

                <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-sky-600/40 backdrop-blur-md">
                  <Bath className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-black text-sky-100 font-mono">
                    {ROOMS.TOILET.name}
                  </span>
                </div>
              </div>

              {/* Lorong */}
              <div
                className="absolute shadow-inner border-y-4 border-slate-800"
                style={{
                  left: 800,
                  top: 40,
                  width: 30,
                  height: 430,
                  backgroundColor: '#111827',
                }}
              >
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 border-r border-dashed border-slate-600/60" />
              </div>

              {/* Taman & Gazebo */}
              <div
                className="absolute rounded-2xl overflow-hidden border-4 border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                style={{
                  left: ROOMS.LAPANGAN.x,
                  top: ROOMS.LAPANGAN.y,
                  width: ROOMS.LAPANGAN.w,
                  height: ROOMS.LAPANGAN.h,
                  backgroundColor: '#064e3b',
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect width="100%" height="100%" fill="url(#grass-lawn-v2)" />
                </svg>

                <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-emerald-600/40 backdrop-blur-md">
                  <Coffee className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black text-emerald-100 font-mono">
                    {ROOMS.LAPANGAN.name}
                  </span>
                </div>
              </div>

              {/* Props Arsitektural Vector Lengkap (Crisp, High Quality, No AI Slop) */}
              <WhiteboardProp x={80} y={45} />
              <BookshelfProp x={220} y={40} />
              <WaterDispenserProp x={325} y={42} />
              <ServerRackProp x={480} y={42} />
              <PrinterStationProp x={55} y={350} />
              <PlantProp x={50} y={45} />
              <PlantProp x={740} y={45} />

              {/* 7 Workstation Meja Fisik Lengkap dengan Monitor, Keyboard & Kursi Ergonomis */}
              <DeskProp x={98} y={150} label="01 PM" chairColor="#701a75" />
              <DeskProp x={258} y={150} label="02 FE" chairColor="#0284c7" />
              <DeskProp x={418} y={150} label="03 BE" chairColor="#1e3a8a" />
              <DeskProp x={578} y={150} label="04 QA" chairColor="#c2410c" />
              <DeskProp x={178} y={320} label="05 MK" chairColor="#be185d" />
              <DeskProp x={338} y={320} label="06 KT" chairColor="#b45309" />
              <DeskProp x={498} y={320} label="07 CS" chairColor="#0369a1" />

              {/* Mushola: Mihrab, Jadwal Adhan, Rak Mukena, Lemari Kitab, Rak Sepatu */}
              <ImamNicheProp x={850} y={45} />
              <AdhanClockProp x={950} y={45} />
              <PrayerGarmentRackProp x={1080} y={45} />
              <QuranCabinetProp x={1170} y={45} />
              <ShoeRackProp x={845} y={215} />

              {/* 7 Sajadah Sholat Mewah di Mushola */}
              <SajadahProp x={860} y={90} color="#047857" borderColor="#f59e0b" />
              <SajadahProp x={940} y={90} color="#1e3a8a" borderColor="#f59e0b" />
              <SajadahProp x={1020} y={90} color="#581c87" borderColor="#f59e0b" />
              <SajadahProp x={1100} y={90} color="#991b1b" borderColor="#f59e0b" />

              <SajadahProp x={900} y={190} color="#047857" borderColor="#f59e0b" />
              <SajadahProp x={980} y={190} color="#1e3a8a" borderColor="#f59e0b" />
              <SajadahProp x={1060} y={190} color="#581c87" borderColor="#f59e0b" />

              {/* Toilet Stalls & Washbasin */}
              <WashbasinProp x={845} y={330} />
              <ToiletStallProp x={930} y={345} isOccupied={false} />
              <ToiletStallProp x={1090} y={345} isOccupied={false} />

              {/* Taman Outdoor & Area Rekreasi */}
              <CoffeeCartProp x={440} y={530} />
              <ParkBenchProp x={260} y={635} />
              <ParkBenchProp x={720} y={635} />
              <ShadeTreeProp x={60} y={510} />
              <SoccerGoalProp x={1110} y={570} />

              <KoiPondProp x={870} y={530} />
              <PicnicUmbrellaTableProp x={570} y={630} />
              <GardenLampProp x={230} y={535} />
              <GardenLampProp x={800} y={535} />
            </>
          )}

          {/* ======================================================== */}
          {/* LAPISAN KARAKTER AGENT (WALKING & ANIMATED CHARACTERS)   */}
          {/* ======================================================== */}
          {activeAgentList.map((ag) => {
            const isSelected = selectedAgentId === ag.id;
            const isHovered = hoveredAgentId === ag.id;
            const onSelect = () => {
              setSelectedAgentId(ag.id);
              const realAgent = agents.find((a) => a.id === ag.id);
              const realPresence = presences.find((p) => p.agentId === ag.id);
              if (realAgent) {
                onSelectAgent(realAgent, realPresence);
              }
            };
            const onMouseEnter = () => setHoveredAgentId(ag.id);
            const onMouseLeave = () => setHoveredAgentId(null);

            if (charStyle === 'AVATAR') {
              return (
                <OfficeAvatarCharacter
                  key={ag.id}
                  agent={ag}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  showAllBubbles={showAllBubbles}
                  onSelect={onSelect}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              );
            }

            return (
              <OfficeCharacter
                key={ag.id}
                agent={ag}
                isSelected={isSelected}
                isHovered={isHovered}
                showAllBubbles={showAllBubbles}
                onSelect={onSelect}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            );
          })}

          {/* ======================================================== */}
          {/* LAPISAN DEBUG OVERLAY                                    */}
          {/* ======================================================== */}
          {showDebug && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              {(() => {
                const activeWp = is3D ? WAYPOINTS_3D : WAYPOINTS;
                const activeEdges = is3D ? GRAPH_EDGES_3D : GRAPH_EDGES;
                const activeSlots = is3D ? SLOTS_3D : SLOTS;

                return (
                  <>
                    <svg className="absolute inset-0 w-full h-full">
                      {activeEdges.map(([from, to], i) => {
                        const p1 = activeWp[from];
                        const p2 = activeWp[to];
                        if (!p1 || !p2) return null;
                        return (
                          <line
                            key={`edge-${i}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#c084fc"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            opacity="0.85"
                          />
                        );
                      })}
                    </svg>

                    {Object.entries(activeWp).map(([k, pt]) => (
                      <div
                        key={`wp-${k}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto cursor-pointer"
                        style={{ left: pt.x, top: pt.y }}
                        title={`Waypoint: ${k} (${pt.x}, ${pt.y})`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-white shadow-sm" />
                        <span className="absolute top-2.5 text-[8px] font-mono text-purple-200 bg-purple-950/90 px-1 rounded whitespace-nowrap">
                          {k}
                        </span>
                      </div>
                    ))}

                    {Object.entries(activeSlots).flatMap(([roomKey, slots]) =>
                      slots.map((s) => (
                        <div
                          key={`slot-${s.id}`}
                          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ left: s.x, top: s.y }}
                        >
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-emerald-300" />
                          </div>
                          <span className="absolute top-3 -left-4 text-[7.5px] font-mono text-emerald-300 bg-emerald-950/80 px-1 rounded whitespace-nowrap">
                            {s.name}
                          </span>
                        </div>
                      ))
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Ambient Lighting Overlay */}
          <div className={`absolute inset-0 ${getLightingFilter()}`} />
        </div>
      </div>

      {/* 3. QUICK AGENT COMMAND DRAWER (KONTROL PERORANGAN) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Perintah Jalan Agent Perorangan:
          </span>
          <span className="text-xs text-slate-400 hidden lg:inline">
            Klik tombol aksi untuk melihat karakter berjalan menyusuri lorong dan pintu denah secara mulus.
          </span>
        </div>

        {/* Buttons per individual agent */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeAgentList.map((ag) => (
            <div
              key={ag.id}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ag.color }}
              />
              <span className="font-bold text-white text-[11px] mr-1">
                {ag.name}
              </span>

              {/* Quick room triggers */}
              <button
                onClick={() => moveAgent(ag.id, 'DESK')}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-300 transition-colors"
                title={`Kirim ${ag.name} ke Meja Kerja`}
              >
                Meja
              </button>
              <button
                onClick={() => moveAgent(ag.id, 'MUSHOLA')}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 transition-colors"
                title={`Kirim ${ag.name} ke Mushola`}
              >
                Sholat
              </button>
              <button
                onClick={() => moveAgent(ag.id, 'LAPANGAN')}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-colors"
                title={`Kirim ${ag.name} ke Taman Kopi`}
              >
                Taman
              </button>
              <button
                onClick={() => moveAgent(ag.id, 'TOILET')}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 transition-colors"
                title={`Kirim ${ag.name} ke Toilet`}
              >
                WC
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
