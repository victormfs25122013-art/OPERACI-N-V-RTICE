import React from 'react';
import { X, Award } from 'lucide-react';
import { BotActor } from '../game3d/BotActor';
import { Team } from '../types/game';

interface ScoreboardProps {
  playerKills: number;
  playerDeaths: number;
  playerAssists: number;
  playerScore: number;
  playerCredits: number;
  playerTeam: Team;
  playerName: string;
  bots: BotActor[];
  scoreAmber: number;
  scoreCyan: number;
  onClose: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  playerKills,
  playerDeaths,
  playerAssists,
  playerScore,
  playerCredits,
  playerTeam,
  playerName,
  bots,
  scoreAmber,
  scoreCyan,
  onClose
}) => {
  const amberPlayers = [
    {
      id: 'player_amber',
      name: playerTeam === 'amber' ? playerName : 'Ámbar-01 (Líder)',
      kills: playerTeam === 'amber' ? playerKills : 3,
      deaths: playerTeam === 'amber' ? playerDeaths : 1,
      assists: playerTeam === 'amber' ? playerAssists : 2,
      score: playerTeam === 'amber' ? playerScore : 1450,
      credits: playerTeam === 'amber' ? playerCredits : 3200,
      ping: '14ms',
      isAlive: true
    },
    ...bots.filter(b => b.team === 'amber').map((b, i) => ({
      id: b.id,
      name: b.name,
      kills: 2 + i,
      deaths: 1 + (i % 2),
      assists: 1,
      score: 950 + i * 180,
      credits: 2400 + i * 200,
      ping: '16ms',
      isAlive: b.isAlive
    }))
  ].slice(0, 5);

  const cyanPlayers = [
    {
      id: 'player_cyan',
      name: playerTeam === 'cyan' ? playerName : 'Cian-01 (Comandante)',
      kills: playerTeam === 'cyan' ? playerKills : 4,
      deaths: playerTeam === 'cyan' ? playerDeaths : 2,
      assists: playerTeam === 'cyan' ? playerAssists : 1,
      score: playerTeam === 'cyan' ? playerScore : 1600,
      credits: playerTeam === 'cyan' ? playerCredits : 3600,
      ping: '18ms',
      isAlive: true
    },
    ...bots.filter(b => b.team === 'cyan').map((b, i) => ({
      id: b.id,
      name: b.name,
      kills: 1 + i,
      deaths: 2,
      assists: 2,
      score: 820 + i * 140,
      credits: 2100 + i * 150,
      ping: '19ms',
      isAlive: b.isAlive
    }))
  ].slice(0, 5);

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-6 font-tactical select-none">
      <div className="w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-wider text-white">MARCADOR TÁCTICO DE LA PARTIDA</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono-numbers text-slate-400">PUERTO COBALTO · 5v5 NÚCLEO</span>
            <button onClick={onClose} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amber Team Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-amber-500/15 border-l-2 border-amber-500 px-4 py-2 rounded">
            <span className="font-bold text-amber-400 text-sm">ESCUADRA ÁMBAR (ATAQUE)</span>
            <span className="font-bold font-mono-numbers text-amber-400 text-lg">{scoreAmber} RONDAS</span>
          </div>
          <div className="grid grid-cols-12 text-[11px] text-slate-400 font-bold px-4 py-1 border-b border-slate-800">
            <span className="col-span-5">OPERATIVO</span>
            <span className="col-span-2 text-center">PUNTOS</span>
            <span className="col-span-1 text-center">K</span>
            <span className="col-span-1 text-center">D</span>
            <span className="col-span-1 text-center">A</span>
            <span className="col-span-1 text-center">CRÉDITOS</span>
            <span className="col-span-1 text-right">PING</span>
          </div>
          {amberPlayers.map((p) => (
            <div
              key={p.id}
              className={`grid grid-cols-12 items-center px-4 py-2 rounded-lg text-xs font-mono-numbers ${
                p.name.includes(playerName) ? 'bg-amber-500/20 text-white font-bold' : 'bg-slate-800/40 text-slate-300'
              }`}
            >
              <div className="col-span-5 flex items-center gap-2 font-tactical">
                <span className={`w-2 h-2 rounded-full ${p.isAlive ? 'bg-amber-400' : 'bg-slate-600'}`} />
                <span>{p.name}</span>
              </div>
              <span className="col-span-2 text-center text-amber-300">{p.score}</span>
              <span className="col-span-1 text-center">{p.kills}</span>
              <span className="col-span-1 text-center text-slate-400">{p.deaths}</span>
              <span className="col-span-1 text-center text-slate-400">{p.assists}</span>
              <span className="col-span-1 text-center text-emerald-400">{p.credits}¤</span>
              <span className="col-span-1 text-right text-slate-500">{p.ping}</span>
            </div>
          ))}
        </div>

        {/* Cyan Team Table */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between bg-cyan-500/15 border-l-2 border-cyan-500 px-4 py-2 rounded">
            <span className="font-bold text-cyan-400 text-sm">ESCUADRA CIAN (DEFENSA)</span>
            <span className="font-bold font-mono-numbers text-cyan-400 text-lg">{scoreCyan} RONDAS</span>
          </div>
          <div className="grid grid-cols-12 text-[11px] text-slate-400 font-bold px-4 py-1 border-b border-slate-800">
            <span className="col-span-5">OPERATIVO</span>
            <span className="col-span-2 text-center">PUNTOS</span>
            <span className="col-span-1 text-center">K</span>
            <span className="col-span-1 text-center">D</span>
            <span className="col-span-1 text-center">A</span>
            <span className="col-span-1 text-center">CRÉDITOS</span>
            <span className="col-span-1 text-right">PING</span>
          </div>
          {cyanPlayers.map((p) => (
            <div
              key={p.id}
              className={`grid grid-cols-12 items-center px-4 py-2 rounded-lg text-xs font-mono-numbers ${
                p.name.includes(playerName) ? 'bg-cyan-500/20 text-white font-bold' : 'bg-slate-800/40 text-slate-300'
              }`}
            >
              <div className="col-span-5 flex items-center gap-2 font-tactical">
                <span className={`w-2 h-2 rounded-full ${p.isAlive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                <span>{p.name}</span>
              </div>
              <span className="col-span-2 text-center text-cyan-300">{p.score}</span>
              <span className="col-span-1 text-center">{p.kills}</span>
              <span className="col-span-1 text-center text-slate-400">{p.deaths}</span>
              <span className="col-span-1 text-center text-slate-400">{p.assists}</span>
              <span className="col-span-1 text-center text-emerald-400">{p.credits}¤</span>
              <span className="col-span-1 text-right text-slate-500">{p.ping}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
