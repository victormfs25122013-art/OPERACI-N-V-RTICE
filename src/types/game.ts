export type Team = 'amber' | 'cyan'; // Amber = Attack, Cyan = Defense

export type WeaponCategory = 'sidearm' | 'smg' | 'rifle' | 'shotgun' | 'sniper' | 'heavy' | 'melee';

export interface WeaponData {
  id: string;
  name: string;
  category: WeaponCategory;
  price: number;
  damageHead: number;
  damageTorso: number;
  damageLegs: number;
  fireRate: number; // rounds per second
  magazineSize: number;
  reserveAmmo: number;
  reloadTime: number; // seconds
  wallPenetration: 'low' | 'medium' | 'high';
  firstShotAccuracy: number; // 0 to 1
  movingSpreadPenalty: number;
  jumpingSpreadPenalty: number;
  crouchSpreadBonus: number;
  recoilPattern: { x: number; y: number }[]; // sequence of recoil offsets
  recoilRecoveryRate: number;
  effectiveRange: number; // meters
  description: string;
  colorTheme: string;
}

export type AbilitySlot = 'ability1' | 'ability2' | 'passive' | 'ultimate';

export interface AbilityData {
  id: string;
  name: string;
  slot: AbilitySlot;
  cost: number;
  maxCharges: number;
  cooldown: number; // seconds
  ultimatePointsRequired?: number;
  description: string;
  type: 'recon' | 'barrier' | 'dash' | 'flash' | 'smoke' | 'heal' | 'trap' | 'buff';
  keybind: string;
  gamepadPrompt: string;
}

export interface AgentData {
  id: string;
  name: string;
  alias: string;
  role: 'Explorador' | 'Centinela' | 'Infiltrador' | 'Duelista' | 'Controlador' | 'Apoyo';
  description: string;
  lore: string;
  portraitColor: string;
  abilities: AbilityData[];
}

export type GameMode = 'nucleo' | 'eliminacion' | 'duelo' | 'campo_tiro';

export interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  credits: number;
  headshots: number;
  plants: number;
  defuses: number;
  ultimatePoints: number;
}

export interface OperativeActor {
  id: string;
  name: string;
  team: Team;
  agentId: string;
  isBot: boolean;
  isPlayer: boolean;
  health: number;
  maxHealth: number;
  armor: number;
  maxArmor: number;
  isAlive: boolean;
  selectedWeaponId: string;
  currentAmmo: number;
  reserveAmmo: number;
  stats: PlayerStats;
  hasNucleo: boolean;
  position: { x: number; y: number; z: number };
  yaw: number;
}

export type RoundPhase = 'buy' | 'action' | 'planted' | 'ended' | 'halftime' | 'match_end';

export interface KillfeedEntry {
  id: string;
  timestamp: number;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weaponName: string;
  isHeadshot: boolean;
  wallbang: boolean;
}

export interface GameSettings {
  mouseSensitivity: number;
  adsSensitivityMultiplier: number;
  gamepadSensitivity: number;
  gamepadDeadzone: number;
  fov: number;
  crosshairColor: string;
  crosshairSize: number;
  crosshairGap: number;
  crosshairThickness: number;
  crosshairDot: boolean;
  masterVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  musicVolume: number;
  fpsLimit: number;
  colorblindOutline: boolean;
  showHitMarkers: boolean;
}
