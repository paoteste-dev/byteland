import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useTileMovement } from '@/hooks/useTileMovement';
import { getRegionById } from '@/data/regions';
import { allDefendos, enemies } from '@/data/defendos';
import { PixelVillageTile } from './tiles/PixelVillageTile';
import { VillageDecorations } from './tiles/VillageDecorations';
import { PixelHero } from './characters/PixelHero';
import { PixelCreature } from './characters/PixelCreature';
import { generateTileMap, TILE_SIZE, TileMapData, regionThemes } from '@/data/tileMapConfig';
import { ArrowLeft, Heart, MapPin, AlertTriangle, Star, Zap, Shield } from 'lucide-react';

interface Creature {
  id: string;
  name: string;
  tileX: number;
  tileY: number;
  isEnemy: boolean;
  isBoss: boolean;
  variant: string;
  direction: 'up' | 'down' | 'left' | 'right';
}

const INTERACTION_RANGE = 1;

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
    const map = generateTileMap(selectedRegion, 28, 20);
    setTileMap(map);
  }, [selectedRegion]);
  
  // Spawn creatures with collision awareness
  useEffect(() => {
    if (!region || !tileMap) return;
    
    const spawnedCreatures: Creature[] = [];
    const occupiedTiles = new Set<string>();
    
    // Mark non-walkable tiles as occupied
    tileMap.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile !== 'floor' && tile !== 'data' && tile !== 'boss_zone') {
          occupiedTiles.add(`${x},${y}`);
        }
      });
    });
    
    // Helper to find free spawn position
    const findFreeSpot = (minX: number, maxX: number, minY: number, maxY: number): { x: number; y: number } | null => {
      for (let attempts = 0; attempts < 20; attempts++) {
        const x = minX + Math.floor(Math.random() * (maxX - minX));
        const y = minY + Math.floor(Math.random() * (maxY - minY));
        const key = `${x},${y}`;
        
        if (!occupiedTiles.has(key) && 
            Math.abs(x - tileMap.spawnPoint.x) >= 3 || 
            Math.abs(y - tileMap.spawnPoint.y) >= 3) {
          occupiedTiles.add(key);
          return { x, y };
        }
      }
      return null;
    };
    
    // Spawn wild Defendos
    region.wildDefendos.forEach((defendoId, index) => {
      const defendo = allDefendos.find(d => d.id === defendoId);
      if (defendo) {
        const spot = findFreeSpot(4, tileMap.width - 4, 5, tileMap.height - 5);
        if (spot) {
          spawnedCreatures.push({
            id: `wild-${defendoId}-${index}`,
            name: defendo.name,
            tileX: spot.x,
            tileY: spot.y,
            isEnemy: false,
            isBoss: false,
            variant: defendoId,
            direction: 'down',
          });
        }
      }
    });
    
    // Spawn enemies
    region.enemies.forEach((enemyId, index) => {
      const enemy = enemies.find(e => e.id === enemyId);
      if (enemy) {
        const spot = findFreeSpot(3, tileMap.width - 3, 4, tileMap.height - 4);
        if (spot) {
          spawnedCreatures.push({
            id: `enemy-${enemyId}-${index}`,
            name: enemy.name,
            tileX: spot.x,
            tileY: spot.y,
            isEnemy: true,
            isBoss: enemy.isBoss || false,
            variant: enemyId,
            direction: 'down',
          });
        }
      }
    });
    
    // Spawn boss near top center
    if (region.boss) {
      const bossX = Math.floor(tileMap.width / 2);
      const bossY = 4;
      spawnedCreatures.push({
        id: `boss-${region.boss.id}`,
        name: region.boss.name,
        tileX: bossX,
        tileY: bossY,
        isEnemy: true,
        isBoss: true,
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
    initialPosition: tileMap?.spawnPoint || { x: 14, y: 17 },
    tileMap: tileMap || { id: '', width: 28, height: 20, tiles: [], spawnPoint: { x: 14, y: 17 }, theme },
    onMove: (pos) => {
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
  
  // Update camera to follow player smoothly
  useEffect(() => {
    if (!containerRef.current || !tileMap) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const mapPixelWidth = tileMap.width * TILE_SIZE;
    const mapPixelHeight = tileMap.height * TILE_SIZE;
    
    let offsetX = position.x * TILE_SIZE - containerWidth / 2 + TILE_SIZE / 2;
    let offsetY = position.y * TILE_SIZE - containerHeight / 2 + TILE_SIZE / 2;
    
    offsetX = Math.max(0, Math.min(mapPixelWidth - containerWidth, offsetX));
    offsetY = Math.max(0, Math.min(mapPixelHeight - containerHeight, offsetY));
    
    setCameraOffset({ x: offsetX, y: offsetY });
  }, [position, tileMap]);
  
  // Check for nearby creatures
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
            <PixelVillageTile
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
        <div className="text-lg animate-pulse font-game-title">A carregar ByteLand...</div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 overflow-hidden" ref={containerRef}
      style={{ backgroundColor: 'hsl(220, 35%, 12%)' }}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, ${theme.glowColor}15 0%, transparent 40%),
            radial-gradient(ellipse at 50% 100%, hsl(280, 60%, 20%, 0.3) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Stars/particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30 animate-pulse"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Game World */}
      <div 
        className="relative"
        style={{
          width: tileMap.width * TILE_SIZE,
          height: tileMap.height * TILE_SIZE,
          transform: `translate(${-cameraOffset.x}px, ${-cameraOffset.y}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Tile Map */}
        {tileGrid}
        
        {/* Map Decorations */}
        <VillageDecorations 
          mapWidth={tileMap.width}
          mapHeight={tileMap.height}
          theme={tileMap.theme}
          regionId={selectedRegion || 'vila-dos-dados'}
        />
        
        {/* Creatures - CSS animated "living" creatures */}
        {creatures.map(creature => (
          <div key={creature.id}>
            <PixelCreature
              type={creature.isBoss ? 'boss' : creature.isEnemy ? 'enemy' : 'defendo'}
              variant={creature.variant}
              x={creature.tileX}
              y={creature.tileY}
              direction={creature.direction}
            />
            {/* Indicator above creature */}
            <div 
              className="absolute z-50 flex items-center justify-center"
              style={{
                left: creature.tileX * TILE_SIZE + TILE_SIZE / 2 - 10,
                top: creature.tileY * TILE_SIZE - 24,
              }}
            >
              {creature.isBoss ? (
                <div className="flex flex-col items-center animate-bounce">
                  <span className="text-xl drop-shadow-lg" style={{ textShadow: '0 0 8px gold' }}>👑</span>
                </div>
              ) : creature.isEnemy ? (
                <AlertTriangle className="h-5 w-5 text-red-400 animate-bounce drop-shadow-lg" />
              ) : (
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-spin-slow drop-shadow-lg" />
              )}
            </div>
          </div>
        ))}
        
        {/* Player Character - Redesigned CSS animated hero */}
        <PixelHero
          x={position.x}
          y={position.y}
          direction={direction}
          isMoving={isMoving}
        />
      </div>
      
      {/* UI Overlay - Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'worldMap' })}
              className="p-2.5 rounded-xl bg-card/95 hover:bg-card transition-all border-2 border-border hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-card/95 rounded-xl px-4 py-2.5 border-2 border-border shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-game-title text-base tracking-wide">{region.name}</span>
              </div>
            </div>
          </div>
          
          {/* Stats display */}
          <div className="flex items-center gap-3">
            {/* Health */}
            <div className="bg-card/95 rounded-xl px-4 py-2.5 border-2 border-border flex items-center gap-3 shadow-lg backdrop-blur-sm">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className={`w-6 h-3 rounded-sm transition-all ${
                      i <= Math.ceil((player.team[0]?.stats.hp / player.team[0]?.stats.maxHp) * 3) 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-sm shadow-green-500/50' 
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Level */}
            <div className="bg-card/95 rounded-xl px-4 py-2.5 border-2 border-border flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold">Nv. {player.level}</span>
            </div>
            
            {/* Defendos count */}
            <div className="bg-card/95 rounded-xl px-4 py-2.5 border-2 border-border flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-bold">{player.team.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="fixed bottom-4 left-4 z-40 bg-card/95 rounded-xl px-4 py-3 border-2 border-border shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-center gap-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono font-bold shadow-sm border border-border">W</kbd>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono font-bold shadow-sm border border-border">A</kbd>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono font-bold shadow-sm border border-border">S</kbd>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono font-bold shadow-sm border border-border">D</kbd>
            </div>
          </div>
          <span className="text-muted-foreground font-medium">Mover</span>
        </div>
      </div>
      
      {/* Interaction prompt */}
      <AnimatePresence>
        {nearbyCreature && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
          >
            <button
              onClick={() => handleInteract(position)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 border-2 ${
                nearbyCreature.isEnemy 
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 border-red-400/50' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-cyan-400/50'
              }`}
            >
              <span className="text-xl">
                {nearbyCreature.isBoss ? '⚔️' : nearbyCreature.isEnemy ? '🗡️' : '✨'}
              </span>
              <span className="text-base">
                {nearbyCreature.isBoss ? 'Desafiar Boss' : nearbyCreature.isEnemy ? 'Batalhar' : 'Capturar'}
              </span>
              <span className="text-sm opacity-90 font-normal">{nearbyCreature.name}</span>
              <kbd className="px-2.5 py-1 bg-white/20 rounded text-xs font-mono font-bold border border-white/30">E</kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Team display */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-card/95 rounded-xl p-3 border-2 border-border shadow-lg backdrop-blur-sm">
          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Equipa</p>
          <div className="flex gap-2">
            {player.team.slice(0, 3).map((defendo, i) => (
              <div 
                key={defendo.id + i}
                className="w-14 h-14 rounded-lg flex items-center justify-center border-2 border-primary/50 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20"
              >
                <div className="w-10 h-10 relative">
                  <PixelCreature
                    type="defendo"
                    variant={defendo.id}
                    x={0}
                    y={0}
                    direction="down"
                    size={40}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mini-map */}
      <div className="fixed top-24 right-4 z-40 bg-card/90 rounded-xl p-2 border-2 border-border shadow-lg backdrop-blur-sm">
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{ 
            width: 100, 
            height: 75,
            backgroundColor: 'hsl(220, 30%, 15%)',
          }}
        >
          {/* Mini-map tiles (simplified) */}
          <div className="absolute inset-1">
            {/* Walls on border */}
            <div className="absolute inset-0 border-2 border-purple-800/60 rounded" />
          </div>
          
          {/* Player dot */}
          <div 
            className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"
            style={{
              left: (position.x / tileMap.width) * 100 - 5,
              top: (position.y / tileMap.height) * 75 - 5,
              boxShadow: '0 0 6px rgba(59, 130, 246, 0.9)',
            }}
          />
          
          {/* Creature dots */}
          {creatures.map(creature => (
            <div 
              key={creature.id}
              className={`absolute w-2 h-2 rounded-full ${
                creature.isBoss ? 'bg-purple-500 animate-pulse' : creature.isEnemy ? 'bg-red-400' : 'bg-green-400'
              }`}
              style={{
                left: (creature.tileX / tileMap.width) * 100 - 4,
                top: (creature.tileY / tileMap.height) * 75 - 4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
