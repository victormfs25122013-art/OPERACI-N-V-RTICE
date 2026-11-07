import React, { useState, useEffect, useRef } from 'react';
import { GameWorld } from './game3d/GameWorld';
import { TitleScreen } from './components/TitleScreen';
import { TacticalHUD } from './components/TacticalHUD';
import { BuyMenu } from './components/BuyMenu';
import { Scoreboard } from './components/Scoreboard';
import { SettingsModal } from './components/SettingsModal';
import { GodotSuiteModal } from './components/GodotSuiteModal';
import { GameOverModal } from './components/GameOverModal';
import { AGENTS_DATABASE } from './data/agents';
import { WEAPONS_DATABASE } from './data/weapons';
import { AgentData, GameMode, GameSettings, Team, WeaponData } from './types/game';
import { tacticalAudio } from './audio/tacticalAudio';

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const gameWorldRef = useRef<GameWorld | null>(null);

  // Shell State
  const [gameState, setGameState] = useState<'title' | 'playing' | 'gameover'>('title');
  const [selectedAgent, setSelectedAgent] = useState<AgentData>(AGENTS_DATABASE[0]); // Halcón default
  const [selectedMode, setSelectedMode] = useState<GameMode>('nucleo');

  // Modals
  const [showBuyMenu, setShowBuyMenu] = useState<boolean>(false);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showGodotSuite, setShowGodotSuite] = useState<boolean>(false);

  // HUD & Game Live Stats
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [playerArmor, setPlayerArmor] = useState<number>(50);
  const [currentWeapon, setCurrentWeapon] = useState<WeaponData>(WEAPONS_DATABASE[6]); // Élite-24 default
  const [currentAmmo, setCurrentAmmo] = useState<number>(25);
  const [reserveAmmo, setReserveAmmo] = useState<number>(75);
  const [playerCredits, setPlayerCredits] = useState<number>(800);
  const [scoreAmber, setScoreAmber] = useState<number>(0);
  const [scoreCyan, setScoreCyan] = useState<number>(0);
  const [playerKills, setPlayerKills] = useState<number>(0);
  const [playerDeaths, setPlayerDeaths] = useState<number>(0);
  const [playerAssists, setPlayerAssists] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [roundTimer, setRoundTimer] = useState<number>(100);
  const [roundPhase, setRoundPhase] = useState<string>('COMBAT');
  const [nucleoPlanted, setNucleoPlanted] = useState<boolean>(false);
  const [isPlanting, setIsPlanting] = useState<boolean>(false);
  const [plantProgress, setPlantProgress] = useState<number>(0);
  const [isDefusing, setIsDefusing] = useState<boolean>(false);
  const [defuseProgress, setDefuseProgress] = useState<number>(0);
  const [hitmarker, setHitmarker] = useState<'none' | 'normal' | 'headshot'>('none');
  const [flashOpacity, setFlashOpacity] = useState<number>(0);
  const [currentCallout, setCurrentCallout] = useState<string>('MUELLES DE CARGA A');
  const [matchWinner, setMatchWinner] = useState<Team>('amber');

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    mouseSensitivity: 2.2,
    adsSensitivityMultiplier: 0.75,
    gamepadSensitivity: 2.6,
    gamepadDeadzone: 0.15,
    fov: 90,
    crosshairColor: '#06b6d4',
    crosshairSize: 8,
    crosshairGap: 4,
    crosshairThickness: 2,
    crosshairDot: true,
    masterVolume: 0.8,
    sfxVolume: 0.8,
    voiceVolume: 0.9,
    musicVolume: 0.4,
    fpsLimit: 144,
    colorblindOutline: false,
    showHitMarkers: true
  });

  // Handle Game World Lifecycle
  const startGame = () => {
    setGameState('playing');
    setPlayerHealth(100);
    setPlayerArmor(50);
    setPlayerCredits(800);
    setScoreAmber(0);
    setScoreCyan(0);
    setPlayerKills(0);
    setPlayerDeaths(0);
    setPlayerScore(0);
    setRoundTimer(100);
    setRoundPhase('COMBAT');
    setNucleoPlanted(false);

    tacticalAudio.announce('¡Operación iniciada! Aseguren las zonas del Núcleo.');

    // Initialize 3D world on canvas container
    if (canvasContainerRef.current) {
      if (gameWorldRef.current) {
        gameWorldRef.current.dispose();
      }
      gameWorldRef.current = new GameWorld(canvasContainerRef.current, {
        onHealthChanged: (hp, arm) => {
          setPlayerHealth(hp);
          setPlayerArmor(arm);
        },
        onAmmoChanged: (cur, res) => {
          setCurrentAmmo(cur);
          setReserveAmmo(res);
        },
        onHitmarker: (isHeadshot) => {
          setHitmarker(isHeadshot ? 'headshot' : 'normal');
          setTimeout(() => setHitmarker('none'), 120);
        },
        onKill: (victim, isHeadshot) => {
          setPlayerKills(k => k + 1);
          setPlayerScore(s => s + (isHeadshot ? 350 : 200));
          setPlayerCredits(c => Math.min(9000, c + 300));
          tacticalAudio.announce(`Operativo eliminado: ${victim}`);
        },
        onPlantProgress: (prog) => {
          setIsPlanting(prog > 0);
          setPlantProgress(prog);
        },
        onDefuseProgress: (prog) => {
          setIsDefusing(prog > 0);
          setDefuseProgress(prog);
        },
        onNucleoPlanted: (site) => {
          setNucleoPlanted(true);
          setRoundPhase('NUCLEO_PLANTED');
          setRoundTimer(40);
          setPlayerScore(s => s + 300);
          setPlayerCredits(c => Math.min(9000, c + 300));
        },
        onNucleoDefused: () => {
          setNucleoPlanted(false);
          setScoreCyan(s => {
            const next = s + 1;
            if (next >= 13) {
              setMatchWinner('cyan');
              setGameState('gameover');
            }
            return next;
          });
          setPlayerScore(s => s + 300);
          tacticalAudio.announce('¡Núcleo neutralizado! Ronda para Escuadra Cian.');
        },
        onFlashScreen: (duration) => {
          setFlashOpacity(0.9);
          setTimeout(() => setFlashOpacity(0), duration * 1000);
        },
        onPlayerDied: () => {
          setPlayerDeaths(d => d + 1);
        },
        onCalloutChanged: (callout) => {
          setCurrentCallout(callout);
        }
      });
    }
  };

  // Keyboard Shortcuts for Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          startGame();
        }
        return;
      }

      if (e.code === 'KeyB') {
        setShowBuyMenu(prev => !prev);
      }
      if (e.code === 'Tab') {
        e.preventDefault();
        setShowScoreboard(prev => !prev);
      }
      if (e.code === 'Escape') {
        if (showBuyMenu || showScoreboard || showGodotSuite) {
          setShowBuyMenu(false);
          setShowScoreboard(false);
          setShowGodotSuite(false);
        } else {
          setShowSettings(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showBuyMenu, showScoreboard, showGodotSuite]);

  // Handle Buy
  const handleBuyWeapon = (weapon: WeaponData) => {
    if (playerCredits >= weapon.price) {
      setPlayerCredits(c => c - weapon.price);
      setCurrentWeapon(weapon);
      setCurrentAmmo(weapon.magazineSize);
      setReserveAmmo(weapon.reserveAmmo);
      if (gameWorldRef.current) {
        gameWorldRef.current.selectWeapon(weapon.id);
      }
      setShowBuyMenu(false);
    }
  };

  const handleBuyArmor = (armorId: string) => {
    const cost = armorId === 'armor_heavy' ? 1000 : 400;
    const value = armorId === 'armor_heavy' ? 50 : 25;
    if (playerCredits >= cost) {
      setPlayerCredits(c => c - cost);
      setPlayerArmor(value);
      if (gameWorldRef.current) {
        gameWorldRef.current.playerArmor = value;
      }
      setShowBuyMenu(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-tactical">
      {/* 3D WebGL Canvas Container */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full" />

      {/* TITLE SCREEN GAME SHELL */}
      {gameState === 'title' && (
        <TitleScreen
          selectedAgent={selectedAgent}
          selectedMode={selectedMode}
          onSelectAgent={setSelectedAgent}
          onSelectMode={setSelectedMode}
          onStartGame={startGame}
          onOpenGodotSuite={() => setShowGodotSuite(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* ACTIVE GAMEPLAY HUD */}
      {gameState === 'playing' && (
        <TacticalHUD
          health={playerHealth}
          armor={playerArmor}
          currentAmmo={currentAmmo}
          reserveAmmo={reserveAmmo}
          weapon={currentWeapon}
          agent={selectedAgent}
          team="amber"
          scoreAmber={scoreAmber}
          scoreCyan={scoreCyan}
          roundTimer={roundTimer}
          roundPhase={roundPhase}
          isPlanting={isPlanting}
          plantProgress={plantProgress}
          isDefusing={isDefusing}
          defuseProgress={defuseProgress}
          nucleoPlanted={nucleoPlanted}
          hitmarker={hitmarker}
          currentCallout={currentCallout}
          flashOpacity={flashOpacity}
          onOpenBuyMenu={() => setShowBuyMenu(true)}
          onOpenScoreboard={() => setShowScoreboard(true)}
        />
      )}

      {/* BUY MENU (B Key) */}
      {showBuyMenu && (
        <BuyMenu
          playerCredits={playerCredits}
          currentWeaponId={currentWeapon.id}
          onBuyWeapon={handleBuyWeapon}
          onBuyArmor={handleBuyArmor}
          onClose={() => setShowBuyMenu(false)}
        />
      )}

      {/* SCOREBOARD (Tab Key) */}
      {showScoreboard && (
        <Scoreboard
          playerKills={playerKills}
          playerDeaths={playerDeaths}
          playerAssists={playerAssists}
          playerScore={playerScore}
          playerCredits={playerCredits}
          playerTeam="amber"
          playerName="Operativo Vértice"
          bots={gameWorldRef.current ? gameWorldRef.current.bots : []}
          scoreAmber={scoreAmber}
          scoreCyan={scoreCyan}
          onClose={() => setShowScoreboard(false)}
        />
      )}

      {/* GODOT SUITE BROWSER & ZIP DOWNLOAD */}
      {showGodotSuite && (
        <GodotSuiteModal onClose={() => setShowGodotSuite(false)} />
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newOpts) => {
            setSettings(prev => ({ ...prev, ...newOpts }));
            if (newOpts.masterVolume !== undefined || newOpts.sfxVolume !== undefined) {
              tacticalAudio.setVolumes(
                newOpts.masterVolume ?? settings.masterVolume,
                newOpts.sfxVolume ?? settings.sfxVolume,
                settings.voiceVolume,
                settings.musicVolume
              );
            }
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* GAME OVER VICTORY / DEFEAT MODAL */}
      {gameState === 'gameover' && (
        <GameOverModal
          winner={matchWinner}
          scoreAmber={scoreAmber}
          scoreCyan={scoreCyan}
          playerKills={playerKills}
          playerScore={playerScore}
          onRestart={startGame}
          onMainMenu={() => setGameState('title')}
        />
      )}
    </div>
  );
}
