import React from 'react';
import { X, Shield, Coins, Check } from 'lucide-react';
import { WEAPONS_DATABASE, ARMOR_OPTIONS } from '../data/weapons';
import { WeaponData } from '../types/game';

interface BuyMenuProps {
  playerCredits: number;
  currentWeaponId: string;
  onBuyWeapon: (weapon: WeaponData) => void;
  onBuyArmor: (armorId: string) => void;
  onClose: () => void;
}

export const BuyMenu: React.FC<BuyMenuProps> = ({
  playerCredits,
  currentWeaponId,
  onBuyWeapon,
  onBuyArmor,
  onClose
}) => {
  const categories = [
    { title: 'PISTOLAS', items: WEAPONS_DATABASE.filter(w => w.category === 'sidearm') },
    { title: 'SUBFUSILES', items: WEAPONS_DATABASE.filter(w => w.category === 'smg') },
    { title: 'FUSILES', items: WEAPONS_DATABASE.filter(w => w.category === 'rifle') },
    { title: 'ESCOPETAS', items: WEAPONS_DATABASE.filter(w => w.category === 'shotgun') },
    { title: 'FRANCOTIRADORES', items: WEAPONS_DATABASE.filter(w => w.category === 'sniper') },
    { title: 'PESADA', items: WEAPONS_DATABASE.filter(w => w.category === 'heavy') }
  ];

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-6 font-tactical select-none">
      <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-wider text-white">MENÚ DE COMPRA TÁCTICA</h2>
            <span className="text-xs text-slate-400">FASE PRE-RONDA (20s)</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-lg">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold font-mono-numbers text-amber-400">{playerCredits} CRÉDITOS</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800 pb-1">
                {cat.title}
              </span>
              <div className="flex flex-col gap-2">
                {cat.items.map((w) => {
                  const isEquipped = currentWeaponId === w.id;
                  const canAfford = playerCredits >= w.price;

                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        if (canAfford) onBuyWeapon(w);
                      }}
                      disabled={!canAfford}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isEquipped
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                          : canAfford
                          ? 'bg-slate-800/60 border-slate-700/60 hover:border-cyan-400 text-slate-200'
                          : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{w.name}</span>
                        <span className="text-[11px] text-slate-400">
                          Cabeza: {w.damageHead} · Torso: {w.damageTorso}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono-numbers font-bold text-sm">
                        {isEquipped ? (
                          <div className="flex items-center gap-1 text-cyan-400 text-xs">
                            <Check className="w-3.5 h-3.5" /> EQUIPADA
                          </div>
                        ) : (
                          <span className={canAfford ? 'text-amber-400' : 'text-slate-600'}>
                            {w.price === 0 ? 'GRATIS' : `${w.price} ¤`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Armor Options */}
        <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 tracking-wider">PROTECCIÓN BALÍSTICA</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARMOR_OPTIONS.map((a) => {
              const canAfford = playerCredits >= a.price;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (canAfford) onBuyArmor(a.id);
                  }}
                  disabled={!canAfford}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    canAfford
                      ? 'bg-slate-800/60 border-slate-700 hover:border-cyan-400 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{a.name} (+{a.armorValue})</span>
                      <span className="text-[11px] text-slate-400">{a.description}</span>
                    </div>
                  </div>
                  <span className="font-mono-numbers font-bold text-amber-400 text-sm">
                    {a.price} ¤
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
