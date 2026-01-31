import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useTileMovement } from '@/hooks/useTileMovement';
import { getRegionById } from '@/data/regions';
import { allDefendos, enemies } from '@/data/defendos';
import { TileRenderer } from './tiles/TileRenderer';
import { AnimatedCharacter, Direction } from './characters/AnimatedCharacter';
import { generateTileMap, TILE_SIZE, TileMapData, regionThemes } from '@/data/tileMapConfig';
import { ArrowLeft, Heart, MapPin, AlertTriangle, Star } from 'lucide-react';

interface Creature {
  id: string;
  name: string;
  tileX: number;
  tileY: number;
  isEnemy: boolean;
  variant: string;
  direction: Direction;
}

const INTERACTION_RANGE = 1; // tiles

export function TileExplorationScreen() {
  const { state, dispatch } = useGame();
  const { player, selectedRegion } = state;
  const region = selectedRegion ? getRegionById(selectedRegion) : null;
  const theme = selectedRegion ? regionThemes[selectedRegion] || regionThemes['vila-dos-dados'] : regionThemes['vila-dos-dados'];
  
  const [tileMap, setTileMap] = useState<TileMapData | null>(null);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [nearbyCreature, setNearbyCreature] = useState<Creature | null>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate tile map for region
  useEffect(() => {
    if (!selectedRegion) return;
    const map = generateTileMap(selectedRegion, 24, 18);
    setTileMap(map);
  }, [selectedRegion]);
  
  // Spawn creatures
  useEffect(() => {
    if (!region || !tileMap) return;
    
    const spawnedCreatures: Creature[] = [];
    
    // Spawn wild Defendos
    region.wildDefendos.forEach((defendoId, index) => {
      const defendo = allDefendos.find(d => d.id === defendoId);
      if (defendo) {
        // Find a valid spawn position
        let spawnX = 4 + Math.floor(Math.random() * (tileMap.width - 8));
        let spawnY = 4 + Math.floor(Math.random() * (tileMap.height - 8));
        
        // Avoid spawn point
        while (
          Math.abs(spawnX - tileMap.spawnPoint.x) < 3 && 
          Math.abs(spawnY - tileMap.spawnPoint.y) < 3
        ) {
          spawnX = 4 + Math.floor(Math.random() * (tileMap.width - 8));
          spawnY = 4 + Math.floor(Math.random() * (tileMap.height - 8));
        }
        
        spawnedCreatures.push({
          id: `wild-${defendoId}-${index}`,
          name: defendo.name,
          tileX: spawnX,
          tileY: spawnY,
          isEnemy: false,
          variant: defendoId,
          direction: 'down',
        });
      }
    });
    
    // Spawn enemies
    region.enemies.forEach((enemyId, index) => {
      const enemy = enemies.find(e => e.id === enemyId);
      if (enemy) {
        let spawnX = 3 + Math.floor(Math.random() * (tileMap.width - 6));
        let spawnY = 3 + Math.floor(Math.random() * (tileMap.height - 6));
        
        spawnedCreatures.push({
          id: `enemy-${enemyId}-${index}`,
          name: enemy.name,
          tileX: spawnX,
          tileY: spawnY,
          isEnemy: true,
          variant: enemyId,
          direction: 'down',
        });
      }
    });
    
    // Spawn boss near top
    if (region.boss) {
      spawnedCreatures.push({
        id: `boss-${region.boss.id}`,
        name: region.boss.name,
        tileX: Math.floor(tileMap.width / 2),
        tileY: 3,
        isEnemy: true,
        variant: region.boss.id,
        direction: 'down',
      });
    }
    
    setCreatures(spawnedCreatures);
  }, [region, tileMap]);
  
  // Handle interaction
  const handleInteract = useCallback((playerPos: { x: number; y: number }) => {
    if (!nearbyCreature || !player) return;
    
    const defendo = allDefendos.find(d => d.id === nearbyCreature.variant);
    const enemy = enemies.find(e => e.id === nearbyCreature.variant);
    
    if (nearbyCreature.isEnemy && enemy) {
      dispatch({
        type: 'START_COMBAT',
        payload: {
          playerDefendo: player.team[0],
          enemyDefendo: enemy,
          turn: 'player',
          isCaptureBattle: false,
          questionsAnswered: 0,
          correctAnswers: 0,
          battleLog: [`${enemy.name} apareceu!`],
        },
      });
    } else if (!nearbyCreature.isEnemy && defendo) {
      dispatch({
        type: 'START_COMBAT',
        payload: {
          playerDefendo: player.team[0],
          enemyDefendo: defendo,
          turn: 'player',
          isCaptureBattle: true,
          questionsAnswered: 0,
          correctAnswers: 0,
          battleLog: [`Um ${defendo.name} selvagem apareceu!`],
        },
      });
    }
  }, [nearbyCreature, player, dispatch]);
  
  // Tile movement hook
  const { position, direction, isMoving, setPosition } = useTileMovement({
    initialPosition: tileMap?.spawnPoint || { x: 12, y: 15 },
    tileMap: tileMap || { id: '', width: 24, height: 18, tiles: [], spawnPoint: { x: 12, y: 15 }, theme },
    onMove: (pos, dir) => {
      // Check for nearby creatures
      let closest: Creature | null = null;
      creatures.forEach(creature => {
        const dx = Math.abs(creature.tileX - pos.x);
        const dy = Math.abs(creature.tileY - pos.y);
        if (dx <= INTERACTION_RANGE && dy <= INTERACTION_RANGE) {
          closest = creature;
        }
      });
      setNearbyCreature(closest);
    },
    onInteract: handleInteract,
  });
  
  // Reset position when map changes
  useEffect(() => {
    if (tileMap) {
      setPosition(tileMap.spawnPoint);
    }
  }, [tileMap, setPosition]);
  
  // Update camera to follow player
  useEffect(() => {
    if (!containerRef.current || !tileMap) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const mapPixelWidth = tileMap.width * TILE_SIZE;
    const mapPixelHeight = tileMap.height * TILE_SIZE;
    
    let offsetX = position.x * TILE_SIZE - containerWidth / 2 + TILE_SIZE / 2;
    let offsetY = position.y * TILE_SIZE - containerHeight / 2 + TILE_SIZE / 2;
    
    // Clamp camera
    offsetX = Math.max(0, Math.min(mapPixelWidth - containerWidth, offsetX));
    offsetY = Math.max(0, Math.min(mapPixelHeight - containerHeight, offsetY));
    
    setCameraOffset({ x: offsetX, y: offsetY });
  }, [position, tileMap]);
  
  // Check for nearby creatures on position change
  useEffect(() => {
    let closest: Creature | null = null;
    creatures.forEach(creature => {
      const dx = Math.abs(creature.tileX - position.x);
      const dy = Math.abs(creature.tileY - position.y);
      if (dx <= INTERACTION_RANGE && dy <= INTERACTION_RANGE) {
        closest = creature;
      }
    });
    setNearbyCreature(closest);
  }, [position, creatures]);
  
  // Memoized tile grid
  const tileGrid = useMemo(() => {
    if (!tileMap) return null;
    
    return (
      <>
        {tileMap.tiles.map((row, y) => (
          row.map((tileType, x) => (
            <TileRenderer
              key={`${x}-${y}`}
              type={tileType}
              x={x}
              y={y}
              theme={tileMap.theme}
            />
          ))
        ))}
      </>
    );
  }, [tileMap]);
  
  if (!region || !player || !tileMap) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-lg animate-pulse">A carregar...</div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 overflow-hidden bg-black" ref={containerRef}>
      {/* Game World */}
      <div 
        className="relative"
        style={{
          width: tileMap.width * TILE_SIZE,
          height: tileMap.height * TILE_SIZE,
          transform: `translate(${-cameraOffset.x}px, ${-cameraOffset.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Tile Map */}
        {tileGrid}
        
        {/* Creatures */}
        {creatures.map(creature => (
          <div key={creature.id} className="relative">
            <AnimatedCharacter
              type={creature.isEnemy ? 'enemy' : 'defendo'}
              variant={creature.variant}
              x={creature.tileX}
              y={creature.tileY}
              direction={creature.direction}
              isAnimating={true}
            />
            {/* Indicator above creature */}
            <div 
              className="absolute z-20 flex items-center justify-center"
              style={{
                left: creature.tileX * TILE_SIZE + TILE_SIZE / 2 - 8,
                top: creature.tileY * TILE_SIZE - 16,
              }}
            >
              {creature.isEnemy ? (
                <AlertTriangle className="h-4 w-4 text-destructive animate-bounce" />
              ) : (
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 animate-spin-slow" />
              )}
            </div>
          </div>
        ))}
        
        {/* Player Character */}
        <AnimatedCharacter
          type="hero"
          x={position.x}
          y={position.y}
          direction={direction}
          isMoving={isMoving}
        />
      </div>
      
      {/* UI Overlay - Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'worldMap' })}
              className="p-2 rounded-lg bg-card/90 hover:bg-card transition-colors border border-border"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="bg-card/90 rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="font-game-title text-sm">{region.name}</span>
              </div>
            </div>
          </div>
          
          {/* Health display */}
          <div className="bg-card/90 rounded-lg px-3 py-2 border border-border flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <div className="flex gap-0.5">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className={`w-5 h-2 rounded-sm ${
                      i <= Math.ceil((player.team[0]?.stats.hp / player.team[0]?.stats.maxHp) * 3) 
                        ? 'bg-green-500' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Nv. <span className="text-foreground font-bold">{player.level}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="fixed bottom-4 left-4 z-30 bg-card/90 rounded-lg px-3 py-2 border border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">W</kbd>
            <div className="flex gap-0.5">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">A</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">S</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">D</kbd>
            </div>
          </div>
          <span>Mover</span>
        </div>
      </div>
      
      {/* Interaction prompt */}
      <AnimatePresence>
        {nearbyCreature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30"
          >
            <button
              onClick={() => handleInteract(position)}
              className="btn-game-primary flex items-center gap-2 px-4 py-2"
            >
              <span className="text-sm font-bold">
                {nearbyCreature.isEnemy ? '⚔️ Batalhar' : '✨ Capturar'}
              </span>
              <span className="text-xs opacity-80">{nearbyCreature.name}</span>
              <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">E</kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Team display */}
      <div className="fixed bottom-4 right-4 z-30">
        <div className="bg-card/90 rounded-lg p-2 border border-border">
          <p className="text-[10px] text-muted-foreground mb-1.5">Equipa</p>
          <div className="flex gap-1.5">
            {player.team.slice(0, 3).map((defendo, i) => (
              <div 
                key={defendo.id + i}
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.floorAccent }}
              >
                <AnimatedCharacter
                  type="defendo"
                  variant={defendo.id}
                  x={0}
                  y={0}
                  direction="down"
                  size={28}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
