import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { getPokemonMap, isTileWalkable, getTileCSSColor, TileTypePokemon } from '@/data/pokemonTileMaps';
import { Button } from '@/components/ui/button';

const TILE_SIZE = 48; // pixels
const MOVEMENT_SPEED = 150; // ms

interface Position {
  x: number;
  y: number;
}

export function PokemonMapScreen() {
  const { state, dispatch } = useGame();
  const { player, selectedRegion } = state;
  const mapData = useMemo(() => selectedRegion ? getPokemonMap(selectedRegion) : null, [selectedRegion]);
  
  const [playerPos, setPlayerPos] = useState<Position>(mapData?.spawnPoint || { x: 10, y: 12 });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const keysPressed = useRef<Record<string, boolean>>({});

  // Detectar entrada do teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDialog) return;

      keysPressed.current[e.key] = true;

      if (e.key === 'ArrowUp') { e.preventDefault(); attemptMove('up'); }
      if (e.key === 'ArrowDown') { e.preventDefault(); attemptMove('down'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); attemptMove('left'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); attemptMove('right'); }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tryInteract(); }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPos, direction, isMoving, showDialog]);

  const playSound = useCallback((frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Audio context não disponível
    }
  }, [soundEnabled]);

  const attemptMove = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    if (!mapData || isMoving) return;

    setDirection(dir);
    let newX = playerPos.x;
    let newY = playerPos.y;

    if (dir === 'up') newY -= 1;
    if (dir === 'down') newY += 1;
    if (dir === 'left') newX -= 1;
    if (dir === 'right') newX += 1;

    // Verificar limites
    if (newX < 0 || newX >= mapData.width || newY < 0 || newY >= mapData.height) return;

    // Verificar colisão
    const tile = mapData.tiles[newY]?.[newX];
    if (!tile || !isTileWalkable(tile as TileTypePokemon)) return;

    playSound(400 + Math.random() * 100, 50);

    setIsMoving(true);
    setTimeout(() => {
      setPlayerPos({ x: newX, y: newY });
      setIsMoving(false);
    }, MOVEMENT_SPEED);
  }, [mapData, playerPos, isMoving, playSound]);

  const tryInteract = useCallback(() => {
    if (!mapData) return;

    const nextPos = { x: playerPos.x, y: playerPos.y };
    
    if (direction === 'up') nextPos.y -= 1;
    if (direction === 'down') nextPos.y += 1;
    if (direction === 'left') nextPos.x -= 1;
    if (direction === 'right') nextPos.x += 1;

    const npc = mapData.npcs.find(n => n.x === nextPos.x && n.y === nextPos.y);
    
    if (npc) {
      playSound(600, 100);
      setShowDialog(npc.id);
      setDialogIndex(0);
    }
  }, [mapData, playerPos, direction, playSound]);

  const nextDialogLine = () => {
    if (!mapData) return;
    const npc = mapData.npcs.find(n => n.id === showDialog);
    if (npc && dialogIndex < npc.dialogue.length - 1) {
      setDialogIndex(dialogIndex + 1);
    } else {
      setShowDialog(null);
      setDialogIndex(0);
      playSound(300, 100);
    }
  };

  if (!mapData || !player) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Carregando mapa...</h1>
        </div>
      </div>
    );
  }

  const currentNPC = mapData.npcs.find(n => n.id === showDialog);

  return (
    <div className={`min-h-screen w-full flex flex-col bg-gradient-to-b ${mapData.theme.background}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b-4 border-black px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'worldMap' })}
              className="p-2 rounded hover:bg-gray-200 transition-all hover:scale-110"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold text-xl">{mapData.name}</h1>
              <p className="text-xs text-gray-600">{mapData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{player.name} • Lvl {player.level}</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded hover:bg-gray-200 transition-all"
              title={soundEnabled ? 'Som ligado' : 'Som desligado'}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white border-4 border-black shadow-2xl"
          style={{
            width: `${mapData.width * TILE_SIZE}px`,
            height: `${mapData.height * TILE_SIZE}px`,
          }}
        >
          {/* Grid de Tiles */}
          <div
            className="relative w-full h-full"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${mapData.width}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${mapData.height}, ${TILE_SIZE}px)`,
              gap: 0,
              overflow: 'hidden',
            }}
          >
            {mapData.tiles.map((row, y) =>
              row.map((tile, x) => {
                const npcHere = mapData.npcs.find(n => n.x === x && n.y === y);
                
                return (
                  <motion.div
                    key={`${x}-${y}`}
                    className={`
                      ${getTileCSSColor(tile as TileTypePokemon)}
                      border border-black/10
                      flex items-center justify-center
                      relative select-none
                      transition-colors duration-100
                    `}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* NPC no tile */}
                    {npcHere && (
                      <motion.div
                        className="text-2xl"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        {npcHere.sprite}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}

            {/* Player sprite */}
            <motion.div
              animate={{ 
                x: playerPos.x * TILE_SIZE, 
                y: playerPos.y * TILE_SIZE,
              }}
              transition={{ duration: MOVEMENT_SPEED / 1000, ease: 'easeInOut' }}
              className="absolute flex items-center justify-center text-4xl z-20"
              style={{ 
                pointerEvents: 'none',
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            >
              <motion.div
                animate={{
                  scaleX: direction === 'left' ? -1 : 1,
                }}
                transition={{ duration: 0.1 }}
              >
                🧑
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Controls Info */}
      <div className="bg-white/90 backdrop-blur border-t-4 border-black px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold">
            ⬆️⬇️⬅️➡️ Mover | <kbd className="bg-gray-300 px-2 py-1 rounded mx-1">Space</kbd> Interagir | Posição: ({playerPos.x}, {playerPos.y})
          </p>
        </div>
      </div>

      {/* NPC Dialog */}
      <AnimatePresence>
        {showDialog && currentNPC && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-6 shadow-2xl z-30"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start gap-4 mb-4">
                <motion.div 
                  className="text-5xl"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {currentNPC.sprite}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentNPC.name}</h3>
                  <p className="text-gray-700 text-sm mt-2">
                    {currentNPC.dialogue[dialogIndex]}
                  </p>
                </div>
              </div>
              <Button
                onClick={nextDialogLine}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
              >
                {dialogIndex === currentNPC.dialogue.length - 1 ? '❌ Fechar' : '➡️ Próximo'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
