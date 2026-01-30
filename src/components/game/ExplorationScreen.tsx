import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useKeyboardMovement } from '@/hooks/useKeyboardMovement';
import { getRegionById } from '@/data/regions';
import { allDefendos, enemies } from '@/data/defendos';
import { ArrowLeft, Heart, Star, MapPin } from 'lucide-react';

// Import assets
import heroSprite from '@/assets/characters/hero-sprite.png';
import vilaDosDadosBg from '@/assets/maps/vila-dos-dados-bg.jpg';
import passbitSprite from '@/assets/defendos/passbit.png';
import linkletSprite from '@/assets/defendos/linklet.png';
import phishlingSprite from '@/assets/enemies/phishling.png';
import clickbaiterSprite from '@/assets/enemies/clickbaiter.png';

interface Creature {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  isEnemy: boolean;
  type: string;
}

const creatureSprites: Record<string, string> = {
  passbit: passbitSprite,
  linklet: linkletSprite,
  phishling: phishlingSprite,
  clickbaiter: clickbaiterSprite,
};

const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1080;
const PLAYER_SIZE = 64;
const CREATURE_SIZE = 56;
const INTERACTION_DISTANCE = 80;

export function ExplorationScreen() {
  const { state, dispatch } = useGame();
  const { player, selectedRegion } = state;
  const region = selectedRegion ? getRegionById(selectedRegion) : null;
  
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [nearbyCreature, setNearbyCreature] = useState<Creature | null>(null);
  const [showInteraction, setShowInteraction] = useState(false);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  
  const containerRef = useState<HTMLDivElement | null>(null);

  // Initialize creatures for the region
  useEffect(() => {
    if (!region) return;
    
    const spawnCreatures: Creature[] = [];
    
    // Spawn wild Defendos
    region.wildDefendos.forEach((defendoId, index) => {
      const defendo = allDefendos.find(d => d.id === defendoId);
      if (defendo) {
        spawnCreatures.push({
          id: `wild-${defendoId}-${index}`,
          name: defendo.name,
          x: 300 + Math.random() * (MAP_WIDTH - 600),
          y: 200 + Math.random() * (MAP_HEIGHT - 400),
          sprite: creatureSprites[defendoId] || passbitSprite,
          isEnemy: false,
          type: defendo.type,
        });
      }
    });
    
    // Spawn enemies
    region.enemies.forEach((enemyId, index) => {
      const enemy = enemies.find(e => e.id === enemyId);
      if (enemy) {
        spawnCreatures.push({
          id: `enemy-${enemyId}-${index}`,
          name: enemy.name,
          x: 400 + Math.random() * (MAP_WIDTH - 800),
          y: 300 + Math.random() * (MAP_HEIGHT - 600),
          sprite: creatureSprites[enemyId] || phishlingSprite,
          isEnemy: true,
          type: enemy.type,
        });
      }
    });
    
    // Spawn boss
    if (region.boss) {
      spawnCreatures.push({
        id: `boss-${region.boss.id}`,
        name: region.boss.name,
        x: MAP_WIDTH / 2,
        y: 200,
        sprite: creatureSprites[region.boss.id] || phishlingSprite,
        isEnemy: true,
        type: region.boss.type,
      });
    }
    
    setCreatures(spawnCreatures);
  }, [region]);

  // Player movement
  const { position, direction, isMoving } = useKeyboardMovement({
    initialPosition: { x: MAP_WIDTH / 2, y: MAP_HEIGHT - 200 },
    speed: 5,
    bounds: {
      minX: PLAYER_SIZE / 2,
      maxX: MAP_WIDTH - PLAYER_SIZE / 2,
      minY: PLAYER_SIZE / 2,
      maxY: MAP_HEIGHT - PLAYER_SIZE / 2,
    },
  });

  // Update viewport to follow player
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 120; // Account for UI
    
    let offsetX = position.x - viewportWidth / 2;
    let offsetY = position.y - viewportHeight / 2;
    
    // Clamp viewport
    offsetX = Math.max(0, Math.min(MAP_WIDTH - viewportWidth, offsetX));
    offsetY = Math.max(0, Math.min(MAP_HEIGHT - viewportHeight, offsetY));
    
    setViewportOffset({ x: offsetX, y: offsetY });
  }, [position]);

  // Check for nearby creatures
  useEffect(() => {
    let closest: Creature | null = null;
    let closestDistance = Infinity;
    
    creatures.forEach(creature => {
      const dx = creature.x - position.x;
      const dy = creature.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < INTERACTION_DISTANCE && distance < closestDistance) {
        closest = creature;
        closestDistance = distance;
      }
    });
    
    setNearbyCreature(closest);
    setShowInteraction(closest !== null);
  }, [position, creatures]);

  // Handle interaction
  const handleInteract = useCallback(() => {
    if (!nearbyCreature || !player) return;
    
    const defendo = allDefendos.find(d => d.id === nearbyCreature.id.replace(/^wild-|^enemy-|-\d+$/g, ''));
    const enemy = enemies.find(e => e.id === nearbyCreature.id.replace(/^boss-|^enemy-|-\d+$/g, ''));
    
    if (nearbyCreature.isEnemy && enemy) {
      // Start combat with enemy
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
      // Start capture attempt
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

  // Handle keyboard interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleInteract();
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'SET_SCREEN', payload: 'worldMap' });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteract, dispatch]);

  // Get player sprite position based on direction
  const getSpriteOffset = () => {
    switch (direction) {
      case 'down': return { x: 0, y: 0 };
      case 'right': return { x: 1, y: 0 };
      case 'up': return { x: 0, y: 1 };
      case 'left': return { x: 1, y: 1 };
      default: return { x: 0, y: 0 };
    }
  };

  if (!region || !player) {
    return null;
  }

  const spriteOffset = getSpriteOffset();

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Game World */}
      <div 
        className="relative"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate(${-viewportOffset.x}px, ${-viewportOffset.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Background Map */}
        <img 
          src={vilaDosDadosBg}
          alt={region.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Creatures */}
        {creatures.map(creature => (
          <motion.div
            key={creature.id}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              y: [0, -5, 0],
            }}
            transition={{
              scale: { duration: 0.3 },
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute"
            style={{
              left: creature.x - CREATURE_SIZE / 2,
              top: creature.y - CREATURE_SIZE / 2,
              width: CREATURE_SIZE,
              height: CREATURE_SIZE,
            }}
          >
            <img 
              src={creature.sprite}
              alt={creature.name}
              className="w-full h-full object-contain drop-shadow-lg"
              draggable={false}
            />
            {/* Exclamation mark for enemies/boss */}
            {creature.isEnemy && (
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-6 left-1/2 -translate-x-1/2"
              >
                <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-xs font-bold">
                  !
                </div>
              </motion.div>
            )}
            {/* Star for wild Defendos */}
            {!creature.isEnemy && (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 left-1/2 -translate-x-1/2"
              >
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {/* Player Character */}
        <motion.div
          className="absolute z-10"
          style={{
            left: position.x - PLAYER_SIZE / 2,
            top: position.y - PLAYER_SIZE / 2,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
          animate={isMoving ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 0.2, repeat: isMoving ? Infinity : 0 }}
        >
          <div
            className="w-full h-full bg-no-repeat"
            style={{
              backgroundImage: `url(${heroSprite})`,
              backgroundSize: '200% 200%',
              backgroundPosition: `${spriteOffset.x * 100}% ${spriteOffset.y * 100}%`,
            }}
          />
          {/* Player shadow */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/30 rounded-full blur-sm"
          />
        </motion.div>
      </div>
      
      {/* UI Overlay */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'worldMap' })}
              className="p-2 rounded-lg bg-card/80 hover:bg-card transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-card/80 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-game-title text-lg">{region.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{region.theme}</p>
            </div>
          </div>
          
          <div className="bg-card/80 rounded-lg px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-bold">{player.team[0]?.stats.hp}/{player.team[0]?.stats.maxHp}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Nível:</span>
                <span className="font-bold ml-1">{player.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="fixed bottom-4 left-4 z-20 bg-card/80 rounded-lg px-4 py-2">
        <p className="text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">W A S D</kbd>
          <span className="ml-2">para mover</span>
        </p>
      </div>
      
      {/* Interaction prompt */}
      <AnimatePresence>
        {showInteraction && nearbyCreature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={handleInteract}
              className="btn-game-primary flex items-center gap-3 px-6 py-3"
            >
              <span className="text-lg font-bold">
                {nearbyCreature.isEnemy ? '⚔️ Batalhar' : '✨ Capturar'}
              </span>
              <span className="text-sm opacity-80">{nearbyCreature.name}</span>
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESPAÇO</kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Team display */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="bg-card/80 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-2">Equipa Ativa</p>
          <div className="flex gap-2">
            {player.team.slice(0, 3).map((defendo, i) => (
              <div 
                key={defendo.id + i}
                className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center"
              >
                <img 
                  src={creatureSprites[defendo.id] || passbitSprite}
                  alt={defendo.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
