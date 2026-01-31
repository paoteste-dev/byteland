// Tile Map Configuration for ByteLand regions
// Each region has unique themed tiles

export const TILE_SIZE = 48; // pixels per tile

export type TileType = 
  | 'floor' 
  | 'wall' 
  | 'server' 
  | 'tree' 
  | 'water' 
  | 'lock' 
  | 'data' 
  | 'firewall'
  | 'cloud'
  | 'terminal'
  | 'boss_zone';

export interface Tile {
  type: TileType;
  walkable: boolean;
  variant?: number; // For visual variety
}

export interface TileMapData {
  id: string;
  width: number; // in tiles
  height: number; // in tiles
  tiles: TileType[][];
  spawnPoint: { x: number; y: number };
  theme: RegionTheme;
}

export interface RegionTheme {
  floorColor: string;
  floorAccent: string;
  wallColor: string;
  wallAccent: string;
  decorColor: string;
  glowColor: string;
}

// Theme configurations for each region
export const regionThemes: Record<string, RegionTheme> = {
  'vila-dos-dados': {
    floorColor: 'hsl(220, 30%, 15%)',
    floorAccent: 'hsl(220, 40%, 20%)',
    wallColor: 'hsl(280, 60%, 25%)',
    wallAccent: 'hsl(280, 70%, 35%)',
    decorColor: 'hsl(180, 100%, 50%)',
    glowColor: 'hsl(180, 100%, 60%)',
  },
  'cidade-conectada': {
    floorColor: 'hsl(200, 30%, 12%)',
    floorAccent: 'hsl(200, 40%, 18%)',
    wallColor: 'hsl(210, 50%, 30%)',
    wallAccent: 'hsl(210, 60%, 40%)',
    decorColor: 'hsl(120, 100%, 50%)',
    glowColor: 'hsl(120, 100%, 60%)',
  },
  'reino-da-cloud': {
    floorColor: 'hsl(220, 40%, 18%)',
    floorAccent: 'hsl(220, 50%, 25%)',
    wallColor: 'hsl(230, 60%, 35%)',
    wallAccent: 'hsl(230, 70%, 45%)',
    decorColor: 'hsl(200, 100%, 70%)',
    glowColor: 'hsl(200, 100%, 80%)',
  },
  'florestas-de-servidores': {
    floorColor: 'hsl(140, 30%, 12%)',
    floorAccent: 'hsl(140, 40%, 18%)',
    wallColor: 'hsl(150, 50%, 25%)',
    wallAccent: 'hsl(150, 60%, 35%)',
    decorColor: 'hsl(100, 100%, 50%)',
    glowColor: 'hsl(100, 100%, 60%)',
  },
  'castelos-de-firewall': {
    floorColor: 'hsl(0, 30%, 15%)',
    floorAccent: 'hsl(0, 40%, 20%)',
    wallColor: 'hsl(15, 60%, 30%)',
    wallAccent: 'hsl(15, 70%, 40%)',
    decorColor: 'hsl(30, 100%, 50%)',
    glowColor: 'hsl(30, 100%, 60%)',
  },
  'lago-da-autenticacao': {
    floorColor: 'hsl(200, 50%, 15%)',
    floorAccent: 'hsl(200, 60%, 22%)',
    wallColor: 'hsl(190, 70%, 30%)',
    wallAccent: 'hsl(190, 80%, 40%)',
    decorColor: 'hsl(180, 100%, 50%)',
    glowColor: 'hsl(180, 100%, 60%)',
  },
  'dark-web-dungeon': {
    floorColor: 'hsl(270, 40%, 8%)',
    floorAccent: 'hsl(270, 50%, 12%)',
    wallColor: 'hsl(280, 60%, 20%)',
    wallAccent: 'hsl(280, 70%, 30%)',
    decorColor: 'hsl(300, 100%, 50%)',
    glowColor: 'hsl(300, 100%, 60%)',
  },
};

// Generate a procedural tile map for a region
export function generateTileMap(regionId: string, width = 20, height = 15): TileMapData {
  const theme = regionThemes[regionId] || regionThemes['vila-dos-dados'];
  const tiles: TileType[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < width; x++) {
      // Border walls
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        row.push('wall');
      }
      // Random decorations
      else if (Math.random() < 0.08) {
        const decorTypes: TileType[] = ['server', 'terminal', 'data'];
        row.push(decorTypes[Math.floor(Math.random() * decorTypes.length)]);
      }
      // Random obstacles
      else if (Math.random() < 0.05) {
        row.push('tree');
      }
      // Floor
      else {
        row.push('floor');
      }
    }
    tiles.push(row);
  }
  
  // Add boss zone at top center
  const bossX = Math.floor(width / 2);
  tiles[2][bossX - 1] = 'boss_zone';
  tiles[2][bossX] = 'boss_zone';
  tiles[2][bossX + 1] = 'boss_zone';
  tiles[3][bossX] = 'lock';
  
  // Clear spawn area
  const spawnX = Math.floor(width / 2);
  const spawnY = height - 3;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (tiles[spawnY + dy] && tiles[spawnY + dy][spawnX + dx]) {
        tiles[spawnY + dy][spawnX + dx] = 'floor';
      }
    }
  }
  
  return {
    id: regionId,
    width,
    height,
    tiles,
    spawnPoint: { x: spawnX, y: spawnY },
    theme,
  };
}

// Check if a tile is walkable
export function isTileWalkable(tileType: TileType): boolean {
  const walkableTiles: TileType[] = ['floor', 'data', 'boss_zone'];
  return walkableTiles.includes(tileType);
}
