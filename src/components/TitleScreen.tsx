import React from 'react';
import { Play, Shield, Code, Settings, Trophy, Crosshair } from 'lucide-react';
import { AGENTS_DATABASE } from '../data/agents';
import { AgentData, GameMode } from '../types/game';

interface TitleScreenProps {
  selectedAgent: AgentData;
  selectedMode: GameMode;
  onSelectAgent: (agent: AgentData) => void;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenGodotSuite: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedAgent,
  selectedMode,
  onSelectAgent,
  onSelectMode,
  onStartGame,
  onOpenGodotSuite,
  onOpenSettings
}) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950/95 flex flex-col justify-between p-8 font-tactical select-none z-40 overflow-hidden">
      {/* Subtle Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* TOP BAR: GAME BRAND & SYSTEM TOOLS */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Crosshair className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-cyan-400">TACTICAL FPS 5v5</span>
            <span className="text-sm font-bold text-slate-300">COMPATIBLE GODOT 4 & PC/PS4</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenGodotSuite}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-bold transition-all shadow-lg"
          >
            <Code className="w-4 h-4 text-cyan-400" />
            <span>CENTRO DE DESARROLLO GODOT 4</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CENTER: BESPOKE INLINE SVG TITLE LOCKUP & START CTA */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto z-10 my-auto">
        {/* Bespoke Inline SVG Title */}
        <div className="mb-4">
          <svg className="w-full max-w-2xl h-24" viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text
              x="50%"
              y="60%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-tactical font-extrabold tracking-widest"
              fill="url(#titleGradient)"
              fontSize="48"
              letterSpacing="0.25em"
            >
              OPERACIÓN VÉRTICE
            </text>
            <defs>
              <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="45%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p className="text-slate-400 text-sm max-w-xl mb-8 leading-relaxed">
          Shooter táctico 5 contra 5 en primera persona por rondas. Escuadra Ámbar (Ataque) vs Escuadra Cian (Defensa). Disparo hitscan milimétrico, agentes con habilidades modulares y control total con teclado/ratón o mando PS4.
        </p>

        {/* Primary Start CTA Button */}
        <button
          onClick={onStartGame}
          className="group relative flex items-center gap-4 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-lg tracking-wider transition-all transform hover:scale-105 shadow-[0_0_35px_rgba(6,182,212,0.4)] cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>INICIAR DESPLIEGUE TÁCTICO</span>
        </button>

        {/* Flat single control-hint line as mandated */}
        <p className="text-slate-500 text-xs font-mono-numbers mt-4 tracking-wide">
          WASD Mover · Clic Disparar · Espacio Saltar · Q/E Inclinarse · B Compra · F Núcleo · Esc Pausa
        </p>
      </div>

      {/* BOTTOM SELECTION: AGENT & GAME MODE SELECTOR */}
      <div className="flex flex-col gap-4 z-10">
        {/* Game Mode Selector */}
        <div className="flex items-center justify-center gap-3">
          {[
            { id: 'nucleo', label: 'MODO NÚCLEO 5v5 (PRINCIPAL)' },
            { id: 'eliminacion', label: 'ELIMINACIÓN RÁPIDA' },
            { id: 'duelo', label: 'DUELO 1v1' },
            { id: 'campo_tiro', label: 'CAMPO DE TIRO' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id as GameMode)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                selectedMode === mode.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* 8 Original Agents Strip */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-5xl mx-auto w-full">
          {AGENTS_DATABASE.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mb-1.5 flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: `${agent.portraitColor}25`, color: agent.portraitColor }}
                >
                  {agent.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white tracking-wide">{agent.name}</span>
                <span className="text-[10px] text-slate-400">{agent.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
