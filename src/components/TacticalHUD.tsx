import React from 'react';
import { Shield, Heart, Zap, Crosshair, Bomb, Radio } from 'lucide-react';
import { AgentData, Team, WeaponData } from '../types/game';

interface TacticalHUDProps {
  health: number;
  armor: number;
  currentAmmo: number;
  reserveAmmo: number;
  weapon: WeaponData;
  agent: AgentData;
  team: Team;
  scoreAmber: number;
  scoreCyan: number;
  roundTimer: number;
  roundPhase: string;
  isPlanting: boolean;
  plantProgress: number;
  isDefusing: boolean;
  defuseProgress: number;
  nucleoPlanted: boolean;
  hitmarker: 'none' | 'normal' | 'headshot';
  currentCallout: string;
  flashOpacity: number;
  onOpenBuyMenu: () => void;
  onOpenScoreboard: () => void;
}

export const TacticalHUD: React.FC<TacticalHUDProps> = ({
  health,
  armor,
  currentAmmo,
  reserveAmmo,
  weapon,
  agent,
  team,
  scoreAmber,
  scoreCyan,
  roundTimer,
  roundPhase,
  isPlanting,
  plantProgress,
  isDefusing,
  defuseProgress,
  nucleoPlanted,
  hitmarker,
  currentCallout,
  flashOpacity,
  onOpenBuyMenu
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-tactical">
      {/* Flashbang Whiteout Screen */}
      <div
        className="absolute inset-0 bg-white transition-opacity duration-75 pointer-events-none"
        style={{ opacity: flashOpacity }}
      />

      {/* Dynamic Tactical Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Crosshair Lines */}
          <div className="absolute w-[2px] h-3 bg-cyan-400 -top-3 shadow-sm" />
          <div className="absolute w-[2px] h-3 bg-cyan-400 -bottom-3 shadow-sm" />
          <div className="absolute h-[2px] w-3 bg-cyan-400 -left-3 shadow-sm" />
          <div className="absolute h-[2px] w-3 bg-cyan-400 -right-3 shadow-sm" />
          <div className="w-1 h-1 bg-cyan-300 rounded-full" />

          {/* Hitmarker X */}
          {hitmarker !== 'none' && (
            <div className={`absolute w-7 h-7 border-2 ${hitmarker === 'headshot' ? 'border-red-500 scale-125' : 'border-white'} rotate-45 animate-ping opacity-90`} />
          )}
        </div>
      </div>

      {/* TOP HEADER: 5v5 TEAM BAR & ROUND CLOCK */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-950/85 border border-slate-800/80 px-6 py-2 rounded-lg backdrop-blur-md shadow-2xl">
        {/* Amber Team (Attack) */}
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold tracking-wider text-sm">ESCUADRA ÁMBAR</span>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-amber-500/30 border border-amber-500/60 rounded-sm flex items-center justify-center text-[10px] text-amber-300">
                ●
              </div>
            ))}
          </div>
          <span className="text-2xl font-bold font-mono-numbers text-amber-400 ml-2">{scoreAmber}</span>
        </div>

        {/* Round Clock & Spike Status */}
        <div className="flex flex-col items-center px-4 border-x border-slate-800">
          <div className="flex items-center gap-2">
            {nucleoPlanted && <Bomb className="w-4 h-4 text-red-500 animate-pulse" />}
            <span className={`text-2xl font-bold font-mono-numbers ${nucleoPlanted ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>
              {Math.floor(roundTimer / 60)}:{(Math.floor(roundTimer % 60)).toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">
            {roundPhase === 'BUY' ? 'FASE DE COMPRA [B]' : nucleoPlanted ? 'NÚCLEO ARMADO' : 'COMBATE'}
          </span>
        </div>

        {/* Cyan Team (Defense) */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold font-mono-numbers text-cyan-400 mr-2">{scoreCyan}</span>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-cyan-500/30 border border-cyan-500/60 rounded-sm flex items-center justify-center text-[10px] text-cyan-300">
                ●
              </div>
            ))}
          </div>
          <span className="text-cyan-400 font-bold tracking-wider text-sm">ESCUADRA CIAN</span>
        </div>
      </div>

      {/* TOP LEFT: MINIMAP RADAR & CALLOUT */}
      <div className="absolute top-4 left-6 flex flex-col gap-2">
        <div className="w-44 h-44 rounded-lg bg-slate-950/90 border border-slate-800/80 p-2 relative overflow-hidden shadow-xl">
          {/* Radar background grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          {/* Sites & Layout Markings */}
          <div className="absolute left-6 top-8 text-[11px] font-bold text-amber-400 border border-amber-500/40 px-1 rounded bg-amber-500/10">
            SITIO A
          </div>
          <div className="absolute right-6 top-8 text-[11px] font-bold text-cyan-400 border border-cyan-500/40 px-1 rounded bg-cyan-500/10">
            SITIO B
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-slate-400">
            MEDIO
          </div>

          {/* Player Dot in center */}
          <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex items-center justify-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute -top-3 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-cyan-400" />
          </div>
        </div>

        {/* Current Callout Name */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-300 w-fit">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tracking-wide uppercase">{currentCallout || 'MUELLES DE CARGA A'}</span>
        </div>
      </div>

      {/* CENTER: INTERACTION PROGRESS (Planting / Defusing) */}
      {(isPlanting || isDefusing) && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-slate-950/90 border border-amber-500/60 p-4 rounded-xl shadow-2xl">
          <span className="text-sm font-bold tracking-widest text-amber-400 animate-pulse">
            {isPlanting ? 'PLANTANDO NÚCLEO...' : 'DESACTIVANDO NÚCLEO...'}
          </span>
          <div className="w-56 h-3 bg-slate-900 border border-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${isPlanting ? 'bg-amber-500' : 'bg-cyan-500'} transition-all duration-75`}
              style={{ width: `${(isPlanting ? plantProgress : defuseProgress) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* BOTTOM LEFT: HEALTH, ARMOR & AGENT BADGE */}
      <div className="absolute bottom-6 left-6 flex items-end gap-4">
        {/* Agent Avatar Badge */}
        <div
          className="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center p-1 bg-slate-950/90 shadow-2xl"
          style={{ borderColor: agent.portraitColor }}
        >
          <span className="text-[10px] text-slate-400 uppercase">{agent.role}</span>
          <span className="text-xs font-bold text-white tracking-wide">{agent.name}</span>
        </div>

        {/* Health & Armor Bars */}
        <div className="flex flex-col gap-2 bg-slate-950/85 border border-slate-800/80 p-3 rounded-xl backdrop-blur-md shadow-2xl min-w-[200px]">
          {/* Armor */}
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>BLINDAJE</span>
            </div>
            <span className="font-mono-numbers text-sm">{armor} / 50</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all duration-150" style={{ width: `${(armor / 50) * 100}%` }} />
          </div>

          {/* Health */}
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mt-1">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              <span>SALUD</span>
            </div>
            <span className="font-mono-numbers text-sm">{health} / 100</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className={`h-full ${health < 30 ? 'bg-red-500' : 'bg-emerald-400'} transition-all duration-150`} style={{ width: `${health}%` }} />
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER: ABILITY SLOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/85 border border-slate-800/80 px-5 py-2.5 rounded-xl backdrop-blur-md shadow-2xl">
        {agent.abilities.map((ability, idx) => (
          <div key={ability.id} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center relative group">
              <Zap className={`w-5 h-5 ${ability.slot === 'ultimate' ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`} />
              <span className="text-[9px] font-mono-numbers text-slate-400 absolute bottom-0.5 right-1">
                {ability.maxCharges}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="font-bold text-cyan-400">{ability.keybind}</span>
              <span>·</span>
              <span className="text-slate-500">{ability.gamepadPrompt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM RIGHT: WEAPON SILHOUETTE & AMMO */}
      <div className="absolute bottom-6 right-6 flex items-end gap-3 bg-slate-950/85 border border-slate-800/80 p-3 rounded-xl backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">{weapon.category}</span>
          <span className="text-base font-bold text-white tracking-wide">{weapon.name}</span>
          <div className="flex items-baseline gap-1 mt-1 font-mono-numbers">
            <span className={`text-3xl font-bold ${currentAmmo <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {currentAmmo}
            </span>
            <span className="text-slate-500 text-sm">/ {reserveAmmo}</span>
          </div>
        </div>
        <div className="w-16 h-14 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-2">
          <Crosshair className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
