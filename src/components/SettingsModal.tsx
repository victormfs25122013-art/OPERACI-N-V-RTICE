import React from 'react';
import { X, Sliders, Volume2, Eye, Gamepad2, MousePointer } from 'lucide-react';
import { GameSettings } from '../types/game';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-6 font-tactical select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-wider text-white">AJUSTES Y CONFIGURACIÓN</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mouse & Controller Controls */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-cyan-400" />
            <span>SENSIBILIDAD Y APUNTADO</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Sensibilidad Ratón</span>
                <span className="font-mono">{settings.mouseSensitivity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={settings.mouseSensitivity}
                onChange={(e) => onUpdateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Multiplicador Zoom (ADS)</span>
                <span className="font-mono">{settings.adsSensitivityMultiplier.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.5"
                step="0.05"
                value={settings.adsSensitivityMultiplier}
                onChange={(e) => onUpdateSettings({ adsSensitivityMultiplier: parseFloat(e.target.value) })}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* PS4 Gamepad Section */}
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>MANDO DUALSHOCK 4 (PS4)</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Sensibilidad Sticks</span>
                <span className="font-mono">{settings.gamepadSensitivity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={settings.gamepadSensitivity}
                onChange={(e) => onUpdateSettings({ gamepadSensitivity: parseFloat(e.target.value) })}
                className="accent-amber-400 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Zona Muerta Stick</span>
                <span className="font-mono">{settings.gamepadDeadzone.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.02"
                value={settings.gamepadDeadzone}
                onChange={(e) => onUpdateSettings({ gamepadDeadzone: parseFloat(e.target.value) })}
                className="accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* FOV & Visuals */}
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>VISUAL Y CAMPO DE VISIÓN (FOV)</span>
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Campo de Visión (FOV)</span>
              <span className="font-mono">{settings.fov}°</span>
            </div>
            <input
              type="range"
              min="75"
              max="110"
              step="1"
              value={settings.fov}
              onChange={(e) => onUpdateSettings({ fov: parseInt(e.target.value) })}
              className="accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Audio Sliders */}
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>VOLUMEN Y AUDIO 3D</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Volumen General</span>
                <span className="font-mono">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => onUpdateSettings({ masterVolume: parseFloat(e.target.value) })}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Efectos de Armas (SFX)</span>
                <span className="font-mono">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
