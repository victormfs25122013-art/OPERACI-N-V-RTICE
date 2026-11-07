export interface MapCallout {
  name: string;
  x: number;
  z: number;
  radius: number;
}

export interface MapData {
  id: string;
  name: string;
  timeOfDay: string;
  ambientColor: string;
  skyColor: string;
  fogColor: string;
  description: string;
  callouts: MapCallout[];
  siteAPosition: { x: number; y: number; z: number };
  siteBPosition: { x: number; y: number; z: number };
  amberSpawn: { x: number; y: number; z: number };
  cyanSpawn: { x: number; y: number; z: number };
}

export const MAPS_DATABASE: MapData[] = [
  {
    id: 'puerto_cobalto',
    name: 'Puerto Cobalto',
    timeOfDay: 'Amanecer brumoso (06:30)',
    ambientColor: '#1e293b',
    skyColor: '#0f172a',
    fogColor: '#090d16',
    description: 'Muelles comerciales y terminal de contenedores marítimos con grúas de carga, almacenes de aduanas y pasillo central estrecho.',
    siteAPosition: { x: -24, y: 0, z: 20 },
    siteBPosition: { x: 24, y: 0, z: 20 },
    amberSpawn: { x: 0, y: 0, z: -35 },
    cyanSpawn: { x: 0, y: 0, z: 35 },
    callouts: [
      { name: 'Spawn Ámbar', x: 0, z: -35, radius: 10 },
      { name: 'Entrada Larga A', x: -18, z: -15, radius: 8 },
      { name: 'Zona del Núcleo A', x: -24, z: 20, radius: 9 },
      { name: 'Grúa Principal', x: -15, z: 8, radius: 6 },
      { name: 'Pasillo Medio', x: 0, z: 0, radius: 8 },
      { name: 'Conector Central', x: 0, z: 12, radius: 7 },
      { name: 'Zona del Núcleo B', x: 24, z: 20, radius: 9 },
      { name: 'Contenedores B', x: 18, z: -10, radius: 8 },
      { name: 'Almacén Cian', x: 12, z: 28, radius: 7 },
      { name: 'Spawn Cian', x: 0, z: 35, radius: 10 }
    ]
  },
  {
    id: 'estacion_zeta',
    name: 'Estación Zeta',
    timeOfDay: 'Noche con neón (23:15)',
    ambientColor: '#0d1117',
    skyColor: '#040711',
    fogColor: '#03050a',
    description: 'Complejo de investigación subterráneo con laboratorios de antimateria, pasarelas de cristal blindado y puertas presurizadas.',
    siteAPosition: { x: -22, y: 0, z: 18 },
    siteBPosition: { x: 22, y: 0, z: 18 },
    amberSpawn: { x: 0, y: 0, z: -32 },
    cyanSpawn: { x: 0, y: 0, z: 32 },
    callouts: [
      { name: 'Acceso Ámbar', x: 0, z: -32, radius: 10 },
      { name: 'Reactor Central', x: 0, z: 0, radius: 8 },
      { name: 'Laboratorio A', x: -22, z: 18, radius: 9 },
      { name: 'Cámara Criogénica B', x: 22, z: 18, radius: 9 },
      { name: 'Pasarela Superior', x: -10, z: 6, radius: 7 }
    ]
  },
  {
    id: 'mercado_dorado',
    name: 'Mercado Dorado',
    timeOfDay: 'Atardecer cálido (18:45)',
    ambientColor: '#292524',
    skyColor: '#1c1917',
    fogColor: '#120f0d',
    description: 'Bazar táctico con callejones sinuosos, toldos de lona, balcones de tiro elevado y patios interiores con vegetación.',
    siteAPosition: { x: -26, y: 0, z: 18 },
    siteBPosition: { x: 26, y: 0, z: 18 },
    amberSpawn: { x: 0, y: 0, z: -36 },
    cyanSpawn: { x: 0, y: 0, z: 36 },
    callouts: [
      { name: 'Entrada del Bazar', x: 0, z: -36, radius: 10 },
      { name: 'Plaza del Té', x: 0, z: 0, radius: 8 },
      { name: 'Bóveda A', x: -26, z: 18, radius: 9 },
      { name: 'Patio de Especias B', x: 26, z: 18, radius: 9 }
    ]
  },
  {
    id: 'campo_tiro',
    name: 'Campo de Tiro',
    timeOfDay: 'Mediodía despejado (12:00)',
    ambientColor: '#1e293b',
    skyColor: '#0f172a',
    fogColor: '#0a0e17',
    description: 'Instalación de entrenamiento táctico con dianas a diferentes distancias (10m, 20m, 30m), estación de plantado y bots de práctica.',
    siteAPosition: { x: -15, y: 0, z: 15 },
    siteBPosition: { x: 15, y: 0, z: 15 },
    amberSpawn: { x: 0, y: 0, z: -20 },
    cyanSpawn: { x: 0, y: 0, z: 25 },
    callouts: [
      { name: 'Puesto de Tiro 10m', x: -8, z: -5, radius: 5 },
      { name: 'Puesto de Tiro 20m', x: 0, z: -5, radius: 5 },
      { name: 'Puesto de Tiro 30m', x: 8, z: -5, radius: 5 },
      { name: 'Estación del Núcleo', x: 0, z: 15, radius: 8 }
    ]
  }
];
