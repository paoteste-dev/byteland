import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetailedTile, DetailedTileType } from '@/components/game/tiles/DetailedTile';
import { CyberHero } from '@/components/game/characters/CyberHero';
import { TILE_SIZE } from '@/data/tileMapConfig';

const MOVEMENT_SPEED = 120;

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

interface EncounterZone {
  x: number;
  y: number;
  enemyType: 'phishling' | 'clickbaiter' | 'spambot' | 'malware';
  active: boolean;
}

// Generate detailed village map with encounter zones
function generateDetailedMap(): {
  tiles: DetailedTileType[][];
  width: number;
  height: number;
  spawnPoint: Position;
  npcs: NPC[];
  encounters: EncounterZone[];
} {
  const width = 28;
  const height = 20;
  const tiles: DetailedTileType[][] = [];
  const encounters: EncounterZone[] = [];

  // Initialize with varied grass
  for (let y = 0; y < height; y++) {
    const row: DetailedTileType[] = [];
    for (let x = 0; x < width; x++) {
      const seed = (x * 31 + y * 17) % 100;
      if (seed < 15) {
        row.push('grass_flowers');
      } else if (seed < 30) {
        row.push('grass_detailed');
      } else {
        row.push('grass');
      }
    }
    tiles.push(row);
  }

  // Border trees
  for (let x = 0; x < width; x++) {
    tiles[0][x] = 'tree';
    tiles[1][x] = x % 2 === 0 ? 'tree' : 'tree_shadow';
    tiles[height - 1][x] = 'tree';
    if (x < 3 || x > width - 4) {
      tiles[height - 2][x] = 'tree';
    }
  }
  for (let y = 0; y < height; y++) {
    tiles[y][0] = 'tree';
    tiles[y][width - 1] = 'tree';
    if (y < 3 || y > height - 4) {
      tiles[y][1] = 'tree';
      tiles[y][width - 2] = 'tree';
    }
  }

  // Main paths
  const pathCenterX = 14;
  for (let y = 3; y < height - 2; y++) {
    tiles[y][pathCenterX - 1] = 'path';
    tiles[y][pathCenterX] = 'path_worn';
    tiles[y][pathCenterX + 1] = 'path';
  }
  for (let x = 4; x < width - 4; x++) {
    tiles[10][x] = 'path';
    tiles[11][x] = 'path_worn';
  }

  // Encounter grass zones (tall grass that shakes)
  const encounterPatches = [
    { x: 4, y: 4, w: 5, h: 4 },
    { x: 20, y: 5, w: 5, h: 4 },
    { x: 5, y: 13, w: 6, h: 4 },
    { x: 19, y: 14, w: 5, h: 3 },
    { x: 8, y: 7, w: 3, h: 2 },
    { x: 22, y: 10, w: 3, h: 2 },
  ];

  const enemyTypes: ('phishling' | 'clickbaiter' | 'spambot' | 'malware')[] = [
    'phishling', 'clickbaiter', 'spambot', 'malware'
  ];

  for (const patch of encounterPatches) {
    for (let dy = 0; dy < patch.h; dy++) {
      for (let dx = 0; dx < patch.w; dx++) {
        const tx = patch.x + dx;
        const ty = patch.y + dy;
        if (tx > 1 && tx < width - 2 && ty > 1 && ty < height - 2) {
          if (tiles[ty][tx].startsWith('grass')) {
            tiles[ty][tx] = 'grass_encounter';
            // 30% chance of having an active encounter in each tile
            if (Math.random() < 0.3) {
              encounters.push({
                x: tx,
                y: ty,
                enemyType: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
                active: true,
              });
            }
          }
        }
      }
    }
  }

  // Trees inside map
  const treeClusters = [
    { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 22, y: 3 }, { x: 23, y: 3 },
    { x: 3, y: 10 },
    { x: 24, y: 11 },
    { x: 4, y: 17 }, { x: 5, y: 17 },
    { x: 22, y: 17 },
  ];
  for (const tree of treeClusters) {
    if (tiles[tree.y]?.[tree.x]) {
      tiles[tree.y][tree.x] = 'tree';
      if (tiles[tree.y + 1]?.[tree.x]) {
        tiles[tree.y + 1][tree.x] = 'tree_shadow';
      }
    }
  }

  // Water pond
  for (let y = 5; y < 9; y++) {
    for (let x = 8; x < 12; x++) {
      if (y === 5) {
        tiles[y][x] = 'water_edge';
      } else {
        tiles[y][x] = 'water';
      }
    }
  }

  // Flowers along paths
  const flowerSpots: [number, number, DetailedTileType][] = [
    [6, 9, 'flower_red'],
    [7, 10, 'flower_yellow'],
    [17, 9, 'flower_blue'],
    [18, 10, 'flower_red'],
    [21, 8, 'flower_yellow'],
    [5, 12, 'flower_blue'],
    [24, 6, 'flower_red'],
    [25, 7, 'flower_yellow'],
  ];
  for (const [fx, fy, ftype] of flowerSpots) {
    if (tiles[fy]?.[fx]?.startsWith('grass') && tiles[fy][fx] !== 'grass_encounter') {
      tiles[fy][fx] = ftype;
    }
  }

  // Fences
  for (let x = 17; x < 22; x++) {
    tiles[8][x] = 'fence';
  }
  for (let x = 3; x < 7; x++) {
    tiles[12][x] = 'fence';
  }

  // Rocks
  tiles[6][23] = 'rock';
  tiles[15][4] = 'rock';
  tiles[13][21] = 'rock';

  // Signs
  tiles[9][13] = 'sign';
  tiles[4][18] = 'sign';

  // Buildings
  // House 1
  tiles[3][6] = 'building_roof';
  tiles[3][7] = 'building_roof';
  tiles[4][6] = 'building_wall';
  tiles[4][7] = 'building_door';
  
  // House 2
  tiles[3][20] = 'building_roof';
  tiles[3][21] = 'building_roof';
  tiles[4][20] = 'building_wall';
  tiles[4][21] = 'building_door';

  // NPCs
  const npcs: NPC[] = [
    {
      id: 'professor',
      name: 'Professor SecureNet',
      x: 15,
      y: 9,
      sprite: '👨‍💻',
      dialogue: [
        'Bem-vindo à Vila dos Dados, jovem CyberDefender!',
        'Esta vila é o primeiro passo para dominares a cibersegurança.',
        'Vês aquela relva alta a mexer? Cuidado! Inimigos digitais escondem-se lá.',
        'Anda pela relva e treina os teus Defendos em combate!',
      ],
    },
    {
      id: 'guard',
      name: 'Guarda Firewall',
      x: 7, 
      y: 5,
      sprite: '🛡️',
      dialogue: [
        'Alto! Eu protejo esta vila de ameaças.',
        'Um bom firewall bloqueia acessos não autorizados.',
        'Mantém sempre o teu sistema atualizado!',
      ],
    },
    {
      id: 'kid',
      name: 'ByteKid',
      x: 20,
      y: 15,
      sprite: '👧',
      dialogue: [
        'Psst! Queres uma dica?',
        'Na relva alta encontras Phishlings e Clickbaiters!',
        'Derrota-os respondendo bem às perguntas de segurança!',
        'Passwords fortes: letras + números + símbolos = 💪',
      ],
    },
    {
      id: 'researcher',
      name: 'Dr. Encryption',
      x: 21,
      y: 4,
      sprite: '🔬',
      dialogue: [
        'Estou a investigar novos métodos de encriptação.',
        'Sabias que a encriptação transforma dados em código secreto?',
        'Só quem tem a chave certa pode descodificar!',
      ],
    },
  ];

  return {
    tiles,
    width,
    height,
    spawnPoint: { x: 14, y: 15 },
    npcs,
    encounters,
  };
}

// Check if tile is walkable
function isTileWalkable(tile: DetailedTileType): boolean {
  const walkable: DetailedTileType[] = [
    'grass', 'grass_detailed', 'grass_flowers', 'grass_encounter',
    'path', 'path_worn', 'flower_red', 'flower_yellow', 'flower_blue',
    'tree_shadow',
  ];
  return walkable.includes(tile);
}

export function PokemonExplorationScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;
  
  const mapData = useMemo(() => generateDetailedMap(), []);
  
  const [playerPos, setPlayerPos] = useState<Position>(mapData.spawnPoint);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [encounters, setEncounters] = useState<EncounterZone[]>(mapData.encounters);
  const [encounterWarning, setEncounterWarning] = useState<Position | null>(null);
  const [showEncounterTransition, setShowEncounterTransition] = useState(false);
  const [currentEncounter, setCurrentEncounter] = useState<EncounterZone | null>(null);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const moveIntervalRef = useRef<number | null>(null);
  const lastMoveRef = useRef<number>(0);

  // Sound effect
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'square') => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {}
  }, [soundEnabled]);

  // Check for encounter
  const checkEncounter = useCallback((pos: Position) => {
    const encounter = encounters.find(e => e.x === pos.x && e.y === pos.y && e.active);
    if (encounter) {
      // Remove encounter from list
      setEncounters(prev => prev.map(e => 
        e.x === pos.x && e.y === pos.y ? { ...e, active: false } : e
      ));
      
      // Start encounter transition
      setCurrentEncounter(encounter);
      setShowEncounterTransition(true);
      
      // Play encounter sound
      playSound(300, 100, 'sawtooth');
      setTimeout(() => playSound(400, 100, 'sawtooth'), 100);
      setTimeout(() => playSound(500, 150, 'sawtooth'), 200);
      
      // After animation, go to combat
      setTimeout(() => {
        dispatch({ type: 'SET_SCREEN', payload: 'combat' });
      }, 1500);
    }
  }, [encounters, playSound, dispatch]);

  // Movement logic
  const attemptMove = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    const now = Date.now();
    if (now - lastMoveRef.current < MOVEMENT_SPEED) return;
    if (showEncounterTransition) return;
    
    setDirection(dir);
    
    let newX = playerPos.x;
    let newY = playerPos.y;

    if (dir === 'up') newY -= 1;
    if (dir === 'down') newY += 1;
    if (dir === 'left') newX -= 1;
    if (dir === 'right') newX += 1;

    if (newX < 0 || newX >= mapData.width || newY < 0 || newY >= mapData.height) return;

    const tile = mapData.tiles[newY]?.[newX];
    if (!tile || !isTileWalkable(tile)) return;

    const npcBlocking = mapData.npcs.some(n => n.x === newX && n.y === newY);
    if (npcBlocking) return;

    // Play step sound
    if (tile.includes('grass')) {
      playSound(200 + Math.random() * 50, 30, 'sine');
    } else {
      playSound(150 + Math.random() * 30, 25, 'triangle');
    }
    
    setIsMoving(true);
    setPlayerPos({ x: newX, y: newY });
    lastMoveRef.current = now;
    
    // Check for encounter warning (adjacent tiles)
    const adjacentEncounter = encounters.find(e => 
      e.active && (
        (Math.abs(e.x - newX) <= 1 && Math.abs(e.y - newY) <= 1)
      )
    );
    if (adjacentEncounter && tile === 'grass_encounter') {
      setEncounterWarning({ x: newX, y: newY });
    } else {
      setEncounterWarning(null);
    }
    
    // Check for encounter on this tile
    checkEncounter({ x: newX, y: newY });
    
    setTimeout(() => setIsMoving(false), MOVEMENT_SPEED - 20);
  }, [playerPos, mapData, playSound, encounters, checkEncounter, showEncounterTransition]);

  // Process input
  const processInput = useCallback(() => {
    if (showDialog || showEncounterTransition) return;
    
    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      attemptMove('up');
    } else if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      attemptMove('down');
    } else if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      attemptMove('left');
    } else if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      attemptMove('right');
    }
  }, [attemptMove, showDialog, showEncounterTransition]);

  // NPC interaction
  const tryInteract = useCallback(() => {
    const nextPos = { x: playerPos.x, y: playerPos.y };
    
    if (direction === 'up') nextPos.y -= 1;
    if (direction === 'down') nextPos.y += 1;
    if (direction === 'left') nextPos.x -= 1;
    if (direction === 'right') nextPos.x += 1;

    const npc = mapData.npcs.find(n => n.x === nextPos.x && n.y === nextPos.y);
    
    if (npc) {
      playSound(600, 80, 'sine');
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
        
        if (!moveIntervalRef.current && !showDialog && !showEncounterTransition) {
          processInput();
          moveIntervalRef.current = window.setInterval(processInput, MOVEMENT_SPEED);
        }
      }
      
      if ((key === ' ' || key === 'enter' || key === 'e') && !showDialog && !showEncounterTransition) {
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
  }, [processInput, tryInteract, showDialog, showEncounterTransition]);

  const nextDialogLine = () => {
    const npc = mapData.npcs.find(n => n.id === showDialog);
    if (npc && dialogIndex < npc.dialogue.length - 1) {
      playSound(500, 50, 'sine');
      setDialogIndex(dialogIndex + 1);
    } else {
      playSound(350, 80, 'sine');
      setShowDialog(null);
      setDialogIndex(0);
    }
  };

  const currentNPC = mapData.npcs.find(n => n.id === showDialog);

  // Camera
  const cameraOffset = useMemo(() => {
    const viewportTilesX = 18;
    const viewportTilesY = 14;
    
    let offsetX = playerPos.x - Math.floor(viewportTilesX / 2);
    let offsetY = playerPos.y - Math.floor(viewportTilesY / 2);
    
    offsetX = Math.max(0, Math.min(offsetX, mapData.width - viewportTilesX));
    offsetY = Math.max(0, Math.min(offsetY, mapData.height - viewportTilesY));
    
    return { x: offsetX, y: offsetY };
  }, [playerPos, mapData.width, mapData.height]);

  if (!player) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const viewportWidth = 18 * TILE_SIZE;
  const viewportHeight = 14 * TILE_SIZE;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'worldMap' })}
            className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <span className="text-cyan-400">⬡</span> Vila dos Dados
            </h1>
            <p className="text-xs opacity-70">CyberDefender: {player.name} • Nível {player.level}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Encounter indicator */}
          <div className="px-3 py-1 bg-white/10 backdrop-blur rounded-lg border border-white/20">
            <p className="text-xs text-white/80">
              <span className="text-yellow-400">⚠</span> Inimigos na relva alta
            </p>
          </div>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-white" />
            ) : (
              <VolumeX className="h-5 w-5 text-white/50" />
            )}
          </button>
        </div>
      </div>

      {/* Game Viewport */}
      <div 
        className="relative overflow-hidden rounded-xl shadow-2xl"
        style={{
          width: viewportWidth,
          height: viewportHeight,
          border: '4px solid hsl(220, 40%, 20%)',
          boxShadow: '0 0 0 2px hsl(200, 80%, 50%), 0 0 40px hsla(200, 100%, 50%, 0.3), inset 0 0 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Map container */}
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
          {/* Render tiles */}
          {mapData.tiles.map((row, y) =>
            row.map((tile, x) => {
              const hasActiveEncounter = encounters.some(e => e.x === x && e.y === y && e.active);
              return (
                <DetailedTile 
                  key={`${x}-${y}`} 
                  type={tile} 
                  x={x} 
                  y={y}
                  hasEncounter={hasActiveEncounter}
                />
              );
            })
          )}

          {/* NPCs */}
          {mapData.npcs.map(npc => (
            <motion.div
              key={npc.id}
              className="absolute flex items-center justify-center"
              style={{
                left: npc.x * TILE_SIZE,
                top: npc.y * TILE_SIZE - 6,
                width: TILE_SIZE,
                height: TILE_SIZE,
                zIndex: 50 + npc.y,
                fontSize: '28px',
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              {npc.sprite}
              {/* NPC interaction indicator */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-400 animate-pulse"
              >
                ▼
              </div>
            </motion.div>
          ))}

          {/* Hero */}
          <CyberHero
            x={playerPos.x}
            y={playerPos.y}
            direction={direction}
            isMoving={isMoving}
          />
        </motion.div>

        {/* Encounter transition overlay */}
        <AnimatePresence>
          {showEncounterTransition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
            >
              {/* Flash effect */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0, 1, 0, 1, 0],
                  backgroundColor: ['#000', '#fff', '#000', '#fff', '#000', '#fff', '#000']
                }}
                transition={{ duration: 0.8, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] }}
              />
              {/* Enemy reveal */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                className="text-8xl"
              >
                {currentEncounter?.enemyType === 'phishling' && '🎣'}
                {currentEncounter?.enemyType === 'clickbaiter' && '🪤'}
                {currentEncounter?.enemyType === 'spambot' && '🤖'}
                {currentEncounter?.enemyType === 'malware' && '🦠'}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="absolute bottom-20 text-white text-2xl font-bold"
              >
                Inimigo encontrado!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="w-full max-w-4xl mt-3 flex justify-between items-center">
        <p className="text-white/60 text-sm">
          <kbd className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/20">WASD</kbd> Mover
          <span className="mx-2">•</span>
          <kbd className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/20">E</kbd> Interagir
        </p>
        <p className="text-white/40 text-xs">
          Posição: ({playerPos.x}, {playerPos.y})
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
              className="max-w-2xl mx-auto m-4 p-5 rounded-xl backdrop-blur-sm"
              style={{
                background: 'linear-gradient(180deg, hsla(220, 40%, 15%, 0.95) 0%, hsla(220, 35%, 10%, 0.98) 100%)',
                border: '2px solid hsl(200, 80%, 50%)',
                boxShadow: '0 0 30px hsla(200, 100%, 50%, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="text-5xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {currentNPC.sprite}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-400">{currentNPC.name}</h3>
                  <p className="text-white/90 mt-2 leading-relaxed">
                    {currentNPC.dialogue[dialogIndex]}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-white/40 text-xs">
                  {dialogIndex + 1} / {currentNPC.dialogue.length}
                </span>
                <Button
                  onClick={nextDialogLine}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 border border-cyan-400/30"
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
