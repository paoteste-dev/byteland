import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PokemonStyleTile, PokemonTileType } from '@/components/game/tiles/PokemonStyleTile';
import { PokemonHero } from '@/components/game/characters/PokemonHero';
import { TILE_SIZE } from '@/data/tileMapConfig';

const MOVEMENT_SPEED = 120; // ms per tile

interface Position {
  x: number;
  y: number;
}

interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  dialogue: string[];
}

// Generate Pokemon-style village map
function generateVillageMap(): {
  tiles: PokemonTileType[][];
  width: number;
  height: number;
  spawnPoint: Position;
  npcs: NPC[];
} {
  const width = 24;
  const height = 18;
  const tiles: PokemonTileType[][] = [];

  // Initialize with grass
  for (let y = 0; y < height; y++) {
    const row: PokemonTileType[] = [];
    for (let x = 0; x < width; x++) {
      row.push('grass');
    }
    tiles.push(row);
  }

  // Add trees around borders
  for (let x = 0; x < width; x++) {
    tiles[0][x] = 'tree';
    tiles[1][x] = x % 3 === 0 ? 'tree' : 'grass';
    tiles[height - 1][x] = 'tree';
    if (x < 4 || x > width - 5) {
      tiles[height - 2][x] = 'tree';
    }
  }
  for (let y = 0; y < height; y++) {
    tiles[y][0] = 'tree';
    tiles[y][width - 1] = 'tree';
    if (y < 4 || y > height - 4) {
      tiles[y][1] = 'tree';
      tiles[y][width - 2] = 'tree';
    }
  }

  // Add main vertical path
  const pathX = 12;
  for (let y = 3; y < height - 2; y++) {
    tiles[y][pathX - 1] = 'path';
    tiles[y][pathX] = 'path';
    tiles[y][pathX + 1] = 'path';
  }

  // Add horizontal path
  for (let x = 4; x < width - 4; x++) {
    tiles[9][x] = 'path';
    tiles[10][x] = 'path';
  }

  // Add tall grass patches
  const tallGrassPatches = [
    { x: 4, y: 4, w: 4, h: 3 },
    { x: 17, y: 5, w: 4, h: 4 },
    { x: 5, y: 12, w: 5, h: 3 },
    { x: 16, y: 13, w: 4, h: 2 },
  ];
  
  for (const patch of tallGrassPatches) {
    for (let dy = 0; dy < patch.h; dy++) {
      for (let dx = 0; dx < patch.w; dx++) {
        const tx = patch.x + dx;
        const ty = patch.y + dy;
        if (tx > 0 && tx < width - 1 && ty > 0 && ty < height - 1) {
          if (tiles[ty][tx] === 'grass') {
            tiles[ty][tx] = 'grass_tall';
          }
        }
      }
    }
  }

  // Add flowers
  const flowers: [number, number, 'flower_red' | 'flower_yellow'][] = [
    [6, 7, 'flower_red'],
    [7, 8, 'flower_yellow'],
    [19, 11, 'flower_red'],
    [18, 12, 'flower_yellow'],
    [5, 15, 'flower_red'],
    [20, 6, 'flower_yellow'],
    [3, 5, 'flower_yellow'],
    [21, 15, 'flower_red'],
  ];

  for (const [fx, fy, ftype] of flowers) {
    if (tiles[fy]?.[fx] === 'grass') {
      tiles[fy][fx] = ftype;
    }
  }

  // Add tree clusters inside
  const treeClusters = [
    { x: 4, y: 3 },
    { x: 19, y: 3 },
    { x: 7, y: 11 },
    { x: 18, y: 10 },
    { x: 4, y: 15 },
    { x: 20, y: 14 },
  ];

  for (const tree of treeClusters) {
    if (tiles[tree.y]?.[tree.x] === 'grass' || tiles[tree.y]?.[tree.x] === 'grass_tall') {
      tiles[tree.y][tree.x] = 'tree';
    }
  }

  // Add signs
  tiles[8][11] = 'sign';
  tiles[4][15] = 'sign';

  // Add rocks
  tiles[6][20] = 'rock';
  tiles[14][4] = 'rock';

  // Add fences
  for (let x = 16; x < 20; x++) {
    tiles[8][x] = 'fence';
  }

  // Water pond
  for (let y = 5; y < 8; y++) {
    for (let x = 3; x < 6; x++) {
      if (x !== 3 || y !== 5) { // Leave corner
        tiles[y][x] = 'water';
      }
    }
  }

  // NPCs for education
  const npcs: NPC[] = [
    {
      id: 'professor',
      name: 'Professor Seguro',
      x: 14,
      y: 8,
      sprite: '👨‍🔬',
      dialogue: [
        'Bem-vindo à Vila dos Dados!',
        'Aqui aprendes a proteger informações digitais.',
        'Nunca partilhes as tuas passwords com ninguém!',
      ],
    },
    {
      id: 'guard',
      name: 'Guarda Firewall',
      x: 10,
      y: 5,
      sprite: '👮',
      dialogue: [
        'Olá! Eu protejo esta vila contra invasores.',
        'Um bom firewall bloqueia acessos não autorizados.',
        'Mantém sempre o teu sistema atualizado!',
      ],
    },
    {
      id: 'kid',
      name: 'Byte',
      x: 17,
      y: 14,
      sprite: '👧',
      dialogue: [
        'Ei! Queres saber um segredo?',
        'Passwords fortes têm letras, números e símbolos!',
        'Tipo: MeuCao@2024! é muito melhor que "123456"',
      ],
    },
  ];

  return {
    tiles,
    width,
    height,
    spawnPoint: { x: 12, y: 14 },
    npcs,
  };
}

// Check if tile is walkable
function isTileWalkable(tile: PokemonTileType): boolean {
  const walkable: PokemonTileType[] = ['grass', 'grass_tall', 'path', 'flower_red', 'flower_yellow'];
  return walkable.includes(tile);
}

export function PokemonExplorationScreen() {
  const { state, dispatch } = useGame();
  const { player, selectedRegion } = state;
  
  // Generate map once
  const mapData = useMemo(() => generateVillageMap(), []);
  
  const [playerPos, setPlayerPos] = useState<Position>(mapData.spawnPoint);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const moveIntervalRef = useRef<number | null>(null);
  const lastMoveRef = useRef<number>(0);

  // Sound effect
  const playSound = useCallback((frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Audio not available
    }
  }, [soundEnabled]);

  // Movement logic
  const attemptMove = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    const now = Date.now();
    if (now - lastMoveRef.current < MOVEMENT_SPEED) return;
    
    setDirection(dir);
    
    let newX = playerPos.x;
    let newY = playerPos.y;

    if (dir === 'up') newY -= 1;
    if (dir === 'down') newY += 1;
    if (dir === 'left') newX -= 1;
    if (dir === 'right') newX += 1;

    // Check bounds
    if (newX < 0 || newX >= mapData.width || newY < 0 || newY >= mapData.height) return;

    // Check tile walkability
    const tile = mapData.tiles[newY]?.[newX];
    if (!tile || !isTileWalkable(tile)) return;

    // Check NPC collision
    const npcBlocking = mapData.npcs.some(n => n.x === newX && n.y === newY);
    if (npcBlocking) return;

    playSound(440 + Math.random() * 60, 40);
    
    setIsMoving(true);
    setPlayerPos({ x: newX, y: newY });
    lastMoveRef.current = now;
    
    setTimeout(() => setIsMoving(false), MOVEMENT_SPEED - 20);
  }, [playerPos, mapData, playSound]);

  // Process input continuously
  const processInput = useCallback(() => {
    if (showDialog) return;
    
    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      attemptMove('up');
    } else if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      attemptMove('down');
    } else if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      attemptMove('left');
    } else if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      attemptMove('right');
    }
  }, [attemptMove, showDialog]);

  // Interaction with NPCs
  const tryInteract = useCallback(() => {
    const nextPos = { x: playerPos.x, y: playerPos.y };
    
    if (direction === 'up') nextPos.y -= 1;
    if (direction === 'down') nextPos.y += 1;
    if (direction === 'left') nextPos.x -= 1;
    if (direction === 'right') nextPos.x += 1;

    const npc = mapData.npcs.find(n => n.x === nextPos.x && n.y === nextPos.y);
    
    if (npc) {
      playSound(600, 80);
      setShowDialog(npc.id);
      setDialogIndex(0);
    }
  }, [playerPos, direction, mapData.npcs, playSound]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        
        if (!moveIntervalRef.current && !showDialog) {
          processInput();
          moveIntervalRef.current = window.setInterval(processInput, MOVEMENT_SPEED);
        }
      }
      
      if ((key === ' ' || key === 'enter' || key === 'e') && !showDialog) {
        e.preventDefault();
        tryInteract();
      }
      
      if ((key === ' ' || key === 'enter' || key === 'e') && showDialog) {
        e.preventDefault();
        nextDialogLine();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      
      const movementKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
      const anyPressed = movementKeys.some(k => keysPressed.current.has(k));
      
      if (!anyPressed && moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [processInput, tryInteract, showDialog]);

  const nextDialogLine = () => {
    const npc = mapData.npcs.find(n => n.id === showDialog);
    if (npc && dialogIndex < npc.dialogue.length - 1) {
      playSound(500, 50);
      setDialogIndex(dialogIndex + 1);
    } else {
      playSound(350, 80);
      setShowDialog(null);
      setDialogIndex(0);
    }
  };

  const currentNPC = mapData.npcs.find(n => n.id === showDialog);

  // Camera offset to center on player
  const cameraOffset = useMemo(() => {
    const viewportTilesX = 16;
    const viewportTilesY = 12;
    
    let offsetX = playerPos.x - Math.floor(viewportTilesX / 2);
    let offsetY = playerPos.y - Math.floor(viewportTilesY / 2);
    
    // Clamp to map bounds
    offsetX = Math.max(0, Math.min(offsetX, mapData.width - viewportTilesX));
    offsetY = Math.max(0, Math.min(offsetY, mapData.height - viewportTilesY));
    
    return { x: offsetX, y: offsetY };
  }, [playerPos, mapData.width, mapData.height]);

  if (!player) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const viewportWidth = 16 * TILE_SIZE;
  const viewportHeight = 12 * TILE_SIZE;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-950 p-4">
      {/* Header */}
      <div className="w-full max-w-3xl mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'worldMap' })}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <h1 className="font-bold text-lg">Vila dos Dados</h1>
            <p className="text-xs opacity-80">ByteLand • {player.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-white" />
            ) : (
              <VolumeX className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Game Viewport - Pokemon GBA style */}
      <div 
        className="relative overflow-hidden rounded-lg shadow-2xl"
        style={{
          width: viewportWidth,
          height: viewportHeight,
          border: '4px solid #1a1a2e',
          boxShadow: '0 0 0 4px #2d2d44, 0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Map container that moves with camera */}
        <motion.div
          className="absolute"
          animate={{
            x: -cameraOffset.x * TILE_SIZE,
            y: -cameraOffset.y * TILE_SIZE,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{
            width: mapData.width * TILE_SIZE,
            height: mapData.height * TILE_SIZE,
          }}
        >
          {/* Render all tiles */}
          {mapData.tiles.map((row, y) =>
            row.map((tile, x) => (
              <PokemonStyleTile key={`${x}-${y}`} type={tile} x={x} y={y} />
            ))
          )}

          {/* Render NPCs */}
          {mapData.npcs.map(npc => (
            <motion.div
              key={npc.id}
              className="absolute flex items-center justify-center text-2xl"
              style={{
                left: npc.x * TILE_SIZE,
                top: npc.y * TILE_SIZE - 4,
                width: TILE_SIZE,
                height: TILE_SIZE,
                zIndex: 50 + npc.y,
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              {npc.sprite}
            </motion.div>
          ))}

          {/* Render Hero */}
          <PokemonHero
            x={playerPos.x}
            y={playerPos.y}
            direction={direction}
            isMoving={isMoving}
          />
        </motion.div>
      </div>

      {/* Controls info */}
      <div className="w-full max-w-3xl mt-3 text-center">
        <p className="text-white/80 text-sm">
          <span className="inline-flex items-center gap-1 mr-3">
            <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">↑↓←→</kbd> ou
            <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">WASD</kbd> Mover
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">E</kbd> ou
            <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">Space</kbd> Interagir
          </span>
        </p>
      </div>

      {/* NPC Dialog */}
      <AnimatePresence>
        {showDialog && currentNPC && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div 
              className="max-w-2xl mx-auto m-4 p-4 rounded-xl"
              style={{
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                border: '4px solid #1a1a2e',
                boxShadow: '0 0 0 4px #2d2d44, 0 -8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="text-4xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {currentNPC.sprite}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{currentNPC.name}</h3>
                  <p className="text-gray-700 mt-1">
                    {currentNPC.dialogue[dialogIndex]}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={nextDialogLine}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                  {dialogIndex === currentNPC.dialogue.length - 1 ? 'Fechar' : 'Próximo ▶'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
