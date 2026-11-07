import { AgentData } from '../types/game';

export const AGENTS_DATABASE: AgentData[] = [
  {
    id: 'halcon',
    name: 'Halcón',
    alias: 'El Explorador Vértice',
    role: 'Explorador',
    description: 'Especialista en reconocimiento aéreo y revelación de posiciones enemigas mediante sondas autónomas.',
    lore: 'Antiguo piloto de drones de vigilancia en el Mar del Norte, Halcón domina la obtención de información en territorio hostil.',
    portraitColor: '#38bdf8',
    abilities: [
      {
        id: 'halcon_drone',
        name: 'Dron de Reconocimiento',
        slot: 'ability1',
        cost: 300,
        maxCharges: 1,
        cooldown: 35,
        type: 'recon',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Despliega una micro-sonda que escanea y marca con contorno térmico a los defensores en su línea de visión.'
      },
      {
        id: 'halcon_dart',
        name: 'Dardo Sónico',
        slot: 'ability2',
        cost: 200,
        maxCharges: 2,
        cooldown: 20,
        type: 'recon',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Dispara un proyectil adhesivo que emite tres pulsos reveladores a través de esquinas y coberturas.'
      },
      {
        id: 'halcon_passive',
        name: 'Ojo Avizor',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'recon',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'Detecta de inmediato la trayectoria angular de los disparos enemigos en el minimapa.'
      },
      {
        id: 'halcon_ult',
        name: 'Escaneo Orbital',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 7,
        type: 'recon',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Sobrecarga satelital que revela con silueta fosforescente a los 5 enemigos en cualquier parte del mapa durante 3 segundos.'
      }
    ]
  },
  {
    id: 'muralla',
    name: 'Muralla',
    alias: 'El Baluarte Inmóvil',
    role: 'Centinela',
    description: 'Ingeniero de combate capaz de sellar accesos completos con hormigón molecular de fraguado instantáneo.',
    lore: 'Ex-jefe de fortificaciones civiles de Estación Zeta, construyó defensas impenetrables contra incursiones armadas.',
    portraitColor: '#10b981',
    abilities: [
      {
        id: 'muralla_wall',
        name: 'Barrera de Nano-Concreto',
        slot: 'ability1',
        cost: 350,
        maxCharges: 1,
        cooldown: 40,
        type: 'barrier',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Erige un muro sólido fortificado de 4 segmentos que bloquea el paso físico y las balas durante 30 s.'
      },
      {
        id: 'muralla_turret',
        name: 'Micro-Torreta Centinela',
        slot: 'ability2',
        cost: 200,
        maxCharges: 1,
        cooldown: 45,
        type: 'barrier',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Coloca una torreta de detección que vigila 180° y dispara ráfagas de contención que ralentizan a los intrusos.'
      },
      {
        id: 'muralla_passive',
        name: 'Blindaje Reforzado',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'buff',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'Recibe un 15% menos de daño por explosiones de granadas y proyectiles de penetración.'
      },
      {
        id: 'muralla_ult',
        name: 'Domo Égida',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 8,
        type: 'barrier',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Genera una cúpula blindada semiesférica impenetrable de 12 metros de diámetro donde su equipo puede plantar o desactivar a salvo.'
      }
    ]
  },
  {
    id: 'espectro',
    name: 'Espectro',
    alias: 'La Sombra Cinética',
    role: 'Infiltrador',
    description: 'Agente de operaciones encubiertas con traje de amortiguación sónica y propulsores de vacío.',
    lore: 'Agente fantasma sin registro oficial que se infiltra por las rutas más arriesgadas para eliminar centinelas enemigos.',
    portraitColor: '#8b5cf6',
    abilities: [
      {
        id: 'espectro_dash',
        name: 'Impulso Espectral',
        slot: 'ability1',
        cost: 200,
        maxCharges: 2,
        cooldown: 18,
        type: 'dash',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Se desliza velozmente 6 metros en la dirección de movimiento para esquivar fuego cruzado o reposicionarse.'
      },
      {
        id: 'espectro_silent',
        name: 'Paso Fantasma',
        slot: 'ability2',
        cost: 150,
        maxCharges: 1,
        cooldown: 25,
        type: 'buff',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Silencia por completo los pasos y saltos durante 10 segundos, incluso esprintando a máxima velocidad.'
      },
      {
        id: 'espectro_passive',
        name: 'Evasión Sombría',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'buff',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'La primera bala que impacte en su armadura ve reducido su daño en un 30% por ronda.'
      },
      {
        id: 'espectro_ult',
        name: 'Manto Termo-Óptico',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 7,
        type: 'dash',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Activa invisibilidad parcial y aceleración motriz durante 6 segundos. Se cancela al abrir fuego.'
      }
    ]
  },
  {
    id: 'chispa',
    name: 'Chispa',
    alias: 'La Rompedora Eléctrica',
    role: 'Duelista',
    description: 'Puntera agresiva especializada en abrir zonas con granadas cegadoras de rebote y subidones de adrenalina.',
    lore: 'Competidora clandestina de parkour táctico que adaptó condensadores de alta tensión a su uniforme de combate.',
    portraitColor: '#f59e0b',
    abilities: [
      {
        id: 'chispa_flash',
        name: 'Destello de Rebote',
        slot: 'ability1',
        cost: 250,
        maxCharges: 2,
        cooldown: 0,
        type: 'flash',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Lanza una cápsula lumínica que rebota en paredes y detona cegando la pantalla de cualquiera que mire hacia ella.'
      },
      {
        id: 'chispa_stim',
        name: 'Carga de Adrenalina',
        slot: 'ability2',
        cost: 200,
        maxCharges: 1,
        cooldown: 30,
        type: 'buff',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Inyecta un estimulante sintético que eleva la velocidad de recarga y movimiento un 25% durante 7 segundos.'
      },
      {
        id: 'chispa_passive',
        name: 'Segundo Aliento',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'buff',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'Al conseguir una eliminación, recupera 25 puntos de vida al instante y gana un destello de velocidad.'
      },
      {
        id: 'chispa_ult',
        name: 'Sobrecarga Sináptica',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 6,
        type: 'buff',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Entra en trance cibernético: cadencia de fuego +35%, desenfunde instantáneo y retroceso reducido a la mitad durante 12 s.'
      }
    ]
  },
  {
    id: 'niebla',
    name: 'Niebla',
    alias: 'La Arquitecta del Humo',
    role: 'Controlador',
    description: 'Estratega de visión con granadas de humo polimérico que bloquean líneas de visión clave en los carriles.',
    lore: 'Antigua química industrial del Puerto Cobalto, experta en dispersión de aerosoles pesados para el control de masas.',
    portraitColor: '#06b6d4',
    abilities: [
      {
        id: 'niebla_smoke',
        name: 'Orbe de Humo Denso',
        slot: 'ability1',
        cost: 150,
        maxCharges: 2,
        cooldown: 0,
        type: 'smoke',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Lanza una esfera de humo denso opaco que dura 18 segundos, cortando los ángulos de los francotiradores.'
      },
      {
        id: 'niebla_screen',
        name: 'Cortina de Humo Lineal',
        slot: 'ability2',
        cost: 250,
        maxCharges: 1,
        cooldown: 35,
        type: 'smoke',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Dispara una hilera de 5 micro-generadores que forman un muro de niebla de 20 metros de longitud.'
      },
      {
        id: 'niebla_passive',
        name: 'Visión en Penumbra',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'recon',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'Al entrar en el humo, sus ojos ven el contorno de enemigos a menos de 4 metros antes que ellos.'
      },
      {
        id: 'niebla_ult',
        name: 'Velo Absoluto',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 7,
        type: 'smoke',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Despliega una tormenta de humo ionizado que anula los radares y minimapas enemigos en todo el mapa durante 10 s.'
      }
    ]
  },
  {
    id: 'bisturi',
    name: 'Bisturí',
    alias: 'La Cirujana Táctica',
    role: 'Apoyo',
    description: 'Médica de campo que regenera la salud de los compañeros y estabiliza caídos en el frente de batalla.',
    lore: 'Cirujana de traumas de la unidad de rescate de emergencias de Vértice, armada con suero biopolimérico.',
    portraitColor: '#ec4899',
    abilities: [
      {
        id: 'bisturi_heal',
        name: 'Dardo Bio-Regenerador',
        slot: 'ability1',
        cost: 200,
        maxCharges: 2,
        cooldown: 25,
        type: 'heal',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Dispara un nanodardo teledirigido que cura 60 puntos de vida al compañero seleccionado o a sí misma.'
      },
      {
        id: 'bisturi_field',
        name: 'Campo de Triage',
        slot: 'ability2',
        cost: 300,
        maxCharges: 1,
        cooldown: 40,
        type: 'heal',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Coloca una baliza en el suelo que cura a todos los aliados en un radio de 5 metros a razón de 12 HP/s.'
      },
      {
        id: 'bisturi_passive',
        name: 'Triage Rápido',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'heal',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'La velocidad de desactivación del Núcleo y de reanimación aumenta un 20% cuando la ejecuta Bisturí.'
      },
      {
        id: 'bisturi_ult',
        name: 'Baliza de Resurrección',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 8,
        type: 'heal',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Apunta a un aliado caído en la ronda actual y lo reanima con 100 HP completos para reincorporarlo al combate.'
      }
    ]
  },
  {
    id: 'trampa',
    name: 'Trampa',
    alias: 'El Trampero Cibernético',
    role: 'Centinela',
    description: 'Especialista en emboscadas y aseguramiento perimetral con cables de tracción y minas de aturdimiento.',
    lore: 'Antiguo artificiero militar reconvertido en cazador de recompensas táctico en los bajos fondos de Puerto Cobalto.',
    portraitColor: '#eab308',
    abilities: [
      {
        id: 'trampa_wire',
        name: 'Cable Láser Aturdidor',
        slot: 'ability1',
        cost: 200,
        maxCharges: 2,
        cooldown: 0,
        type: 'trap',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Fija un cable láser invisible entre dos paredes. Si un enemigo lo cruza, queda inmovilizado y revelado 3 s.'
      },
      {
        id: 'trampa_mine',
        name: 'Mina Criogénica',
        slot: 'ability2',
        cost: 200,
        maxCharges: 1,
        cooldown: 30,
        type: 'trap',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Dispositivo enterrable que detona al paso de un hostil, ralentizando sus movimientos un 60% durante 5 segundos.'
      },
      {
        id: 'trampa_passive',
        name: 'Alerta Temprana',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'trap',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'Recibe una señal acústica inmediata en el visor si cualquiera de sus trampas es destruida o activada.'
      },
      {
        id: 'trampa_ult',
        name: 'Red de Confinamiento',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 7,
        type: 'trap',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Inunda un sector de 15x15 metros con una red de haces láser que infligen daño continuo y desorientan a los intrusos.'
      }
    ]
  },
  {
    id: 'eco',
    name: 'Eco',
    alias: 'El Analista Acústico',
    role: 'Explorador',
    description: 'Rastreador táctico que traduce las ondas sonoras del mapa en vectores de posicionamiento 3D exactos.',
    lore: 'Investigador acústico de los laboratorios Vértice que descubrió cómo aislar el resonador óseo de cualquier enemigo.',
    portraitColor: '#14b8a6',
    abilities: [
      {
        id: 'eco_sonar',
        name: 'Sensor Acústico',
        slot: 'ability1',
        cost: 200,
        maxCharges: 2,
        cooldown: 0,
        type: 'recon',
        keybind: 'C',
        gamepadPrompt: 'L1',
        description: 'Coloca un micro-sensor de resonancia que revela en el minimapa cualquier paso o disparo a 15 metros.'
      },
      {
        id: 'eco_pulse',
        name: 'Pulso de Disrupción',
        slot: 'ability2',
        cost: 250,
        maxCharges: 1,
        cooldown: 35,
        type: 'recon',
        keybind: 'X',
        gamepadPrompt: 'R1',
        description: 'Emite una onda de choque ultrasónica que aturde temporalmente a los enemigos cercanos e interrumpe recargas.'
      },
      {
        id: 'eco_passive',
        name: 'Oído Absoluto',
        slot: 'passive',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        type: 'recon',
        keybind: 'PASIVA',
        gamepadPrompt: 'PASIVA',
        description: 'Los pasos enemigos se oyen un 25% más lejos y con dirección espacial 3D claramente resaltada.'
      },
      {
        id: 'eco_ult',
        name: 'Espejo Acústico',
        slot: 'ultimate',
        cost: 0,
        maxCharges: 1,
        cooldown: 0,
        ultimatePointsRequired: 7,
        type: 'recon',
        keybind: 'Z',
        gamepadPrompt: 'L1 + R1',
        description: 'Reconstruye en el minimapa una animación de los movimientos de todos los rivales de los últimos 5 segundos.'
      }
    ]
  }
];
