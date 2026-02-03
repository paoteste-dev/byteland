// Configuração de mapas Pokémon para cada região do ByteLand
// Cada mapa é um grid de tiles renderizável como Pokémon

export type TileTypePokemon = 
  | 'grass'       // Grama (walkable)
  | 'path'        // Caminho (walkable)
  | 'water'       // Água (não walkable)
  | 'rock'        // Rochas (não walkable)
  | 'tree'        // Árvores (não walkable)
  | 'building'    // Casas/Edifícios (não walkable)
  | 'wall'        // Paredes borda (não walkable)
  | 'boss_zone'   // Zona do Boss (walkable)
  | 'sand'        // Areia (walkable)
  | 'flower';     // Flores decorativas (não walkable)

export interface PokemonMapData {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  tiles: TileTypePokemon[][];
  spawnPoint: { x: number; y: number };
  npcs: NPC[];
  encounters: {
    wildDefendos: string[];
    enemies: string[];
    bossId: string;
    bossLocation: { x: number; y: number };
  };
  theme: {
    background: string;
    grass: string;
    path: string;
    water: string;
    building: string;
  };
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  type: 'trainer' | 'npc' | 'gym-leader' | 'professor';
  dialogue: string[];
}

// VILA DOS DADOS
const generateVilaDosDadosMap = (): TileTypePokemon[][] => [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'path', 'building', 'building', 'grass', 'grass', 'grass', 'grass', 'boss_zone', 'boss_zone', 'boss_zone', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'building', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'building', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'building', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'building', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

export const vilaDosDadosMap: PokemonMapData = {
  id: 'vila-dos-dados',
  name: '🗺️ Vila dos Dados',
  description: 'Uma vila pacífica onde aprendem sobre Passwords',
  width: 20,
  height: 15,
  spawnPoint: { x: 10, y: 12 },
  theme: {
    background: 'from-sky-300 to-sky-200',
    grass: 'bg-green-600',
    path: 'bg-yellow-200',
    water: 'bg-blue-400',
    building: 'bg-amber-700',
  },
  tiles: generateVilaDosDadosMap(),
  npcs: [
    {
      id: 'prof-cyber',
      name: 'Prof. Cyber',
      x: 3,
      y: 3,
      sprite: '🧑‍🔬',
      type: 'professor',
      dialogue: [
        'Bem-vindo à Vila dos Dados!',
        'Aqui aprenderás sobre Passwords e Phishing.',
        'Encontra Defendos selvagens para tua equipa.',
        'Cuidado com o Phishing Alfa no Ginásio ao norte!',
      ],
    },
    {
      id: 'trainer-joao',
      name: 'Trainer João',
      x: 16,
      y: 9,
      sprite: '🧑',
      type: 'trainer',
      dialogue: [
        'E aí! Quer testar seus Defendos?',
        'Vou usar um Phishling meu!',
      ],
    },
  ],
  encounters: {
    wildDefendos: ['passbit', 'linklet', 'encryptle'],
    enemies: ['phishling', 'clickbaiter'],
    bossId: 'phishling-alfa',
    bossLocation: { x: 10, y: 3 },
  },
};

// CIDADE CONECTADA
const generateCidadeConectadaMap = (): TileTypePokemon[][] => [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'boss_zone', 'boss_zone', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'building', 'building', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
  ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

export const cidadeConectadaMap: PokemonMapData = {
  id: 'cidade-conectada',
  name: '🏙️ Cidade Conectada',
  description: 'Metrópole digital com edifícios altos',
  width: 20,
  height: 15,
  spawnPoint: { x: 10, y: 12 },
  theme: {
    background: 'from-gray-300 to-gray-200',
    grass: 'bg-gray-500',
    path: 'bg-gray-300',
    water: 'bg-blue-400',
    building: 'bg-blue-700',
  },
  tiles: generateCidadeConectadaMap(),
  npcs: [
    {
      id: 'hacker-girl',
      name: 'Hacker Girl',
      x: 5,
      y: 5,
      sprite: '👩‍💻',
      type: 'trainer',
      dialogue: [
        'Cuidado com privacidade nessa cidade!',
        'Não compartilhes dados pessoais.',
      ],
    },
  ],
  encounters: {
    wildDefendos: ['masky', 'linklet'],
    enemies: ['phishling', 'clickbaiter'],
    bossId: 'masktrick',
    bossLocation: { x: 11, y: 4 },
  },
};

// MAPA GLOBAL DE TODOS OS MAPAS
export const pokemonMaps: Record<string, PokemonMapData> = {
  'vila-dos-dados': vilaDosDadosMap,
  'cidade-conectada': cidadeConectadaMap,
};

// FUNÇÕES UTILITÁRIAS
export const getPokemonMap = (regionId: string): PokemonMapData | null => {
  return pokemonMaps[regionId] || null;
};

export const isTileWalkable = (tileType: TileTypePokemon): boolean => {
  const walkableTiles: TileTypePokemon[] = ['grass', 'path', 'boss_zone', 'sand'];
  return walkableTiles.includes(tileType);
};

export const getTileCSSColor = (tileType: TileTypePokemon): string => {
  const colors: Record<TileTypePokemon, string> = {
    grass: 'bg-green-600 hover:bg-green-700',
    path: 'bg-yellow-200 hover:bg-yellow-300',
    water: 'bg-blue-500 hover:bg-blue-600',
    rock: 'bg-gray-400 hover:bg-gray-500',
    tree: 'bg-green-800 hover:bg-green-900',
    building: 'bg-amber-700 hover:bg-amber-800',
    wall: 'bg-gray-800 hover:bg-gray-900',
    boss_zone: 'bg-red-600 hover:bg-red-700 animate-pulse',
    sand: 'bg-yellow-600 hover:bg-yellow-700',
    flower: 'bg-pink-400 hover:bg-pink-500',
  };
  
  return colors[tileType] || 'bg-gray-300';
};

export const getTileEmoji = (tileType: TileTypePokemon): string => {
  const emojis: Record<TileTypePokemon, string> = {
    grass: '🌿',
    path: '🛤️',
    water: '💧',
    rock: '🪨',
    tree: '🌲',
    building: '🏠',
    wall: '⬛',
    boss_zone: '👑',
    sand: '🏜️',
    flower: '🌸',
  };
  
  return emojis[tileType] || '⬜';
};
