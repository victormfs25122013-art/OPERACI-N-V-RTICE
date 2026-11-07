import React from 'react';
import { Trophy, RotateCcw, Home, Award } from 'lucide-react';
import { Team } from '../types/game';

interface GameOverModalProps {
  winner: Team;
  scoreAmber: number;
  scoreCyan: number;
  playerKills: number;
  playerScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  scoreAmber,
  scoreCyan,
  playerKills,
  playerScore,
  onRestart,
  onMainMenu
}) => {
  const isAmber = winner === 'amber';

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6 font-tactical select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-6">
        <div className={`p-4 rounded-full ${isAmber ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
          <Trophy className="w-12 h-12" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-slate-400">FIN DE LA PARTIDA</span>
          <h2 className="text-3xl font-extrabold text-white">
            VICTORIA DE LA {isAmber ? 'ESCUADRA ÁMBAR' : 'ESCUADRA CIAN'}
          </h2>
        </div>

        {/* Final Score */}
        <div className="flex items-center gap-8 bg-slate-950/60 border border-slate-800 px-8 py-4 rounded-xl">
          <div className="flex flex-col items-center">
            <span className="text-xs text-amber-400 font-bold">ÁMBAR</span>
            <span className="text-3xl font-bold font-mono-numbers text-amber-400">{scoreAmber}</span>
          </div>
          <span className="text-2xl text-slate-600 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xs text-cyan-400 font-bold">CIAN</span>
            <span className="text-3xl font-bold font-mono-numbers text-cyan-400">{scoreCyan}</span>
          </div>
        </div>

        {/* Player Stats MVP */}
        <div className="w-full bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="text-xs text-slate-400">TUS ESTADÍSTICAS</span>
              <p className="text-sm font-bold text-white">{playerKills} Eliminaciones · {playerScore} Puntos</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            OPERATIVO DESTACADO
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>JUGAR DE NUEVO</span>
          </button>
          <button
            onClick={onMainMenu}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-colors border border-slate-700 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MENÚ PRINCIPAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
