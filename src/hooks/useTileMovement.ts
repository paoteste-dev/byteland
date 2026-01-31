import { useState, useCallback, useEffect, useRef } from 'react';
import { TILE_SIZE, TileMapData, isTileWalkable } from '@/data/tileMapConfig';
import { Direction } from '@/components/game/characters/AnimatedCharacter';

interface TilePosition {
  x: number;
  y: number;
}

interface UseTileMovementOptions {
  initialPosition: TilePosition;
  tileMap: TileMapData;
  onMove?: (position: TilePosition, direction: Direction) => void;
  onInteract?: (position: TilePosition) => void;
}

export function useTileMovement({
  initialPosition,
  tileMap,
  onMove,
  onInteract,
}: UseTileMovementOptions) {
  const [position, setPosition] = useState<TilePosition>(initialPosition);
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeoutRef = useRef<number | null>(null);
  const lastMoveRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const moveIntervalRef = useRef<number | null>(null);
  
  const MOVE_DELAY = 150; // ms between tile moves
  
  const canMoveTo = useCallback((x: number, y: number): boolean => {
    // Check bounds
    if (x < 0 || x >= tileMap.width || y < 0 || y >= tileMap.height) {
      return false;
    }
    // Check tile walkability
    const tile = tileMap.tiles[y]?.[x];
    if (!tile) return false;
    return isTileWalkable(tile);
  }, [tileMap]);
  
  const move = useCallback((dir: Direction) => {
    const now = Date.now();
    if (now - lastMoveRef.current < MOVE_DELAY) return;
    
    let newX = position.x;
    let newY = position.y;
    
    switch (dir) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }
    
    setDirection(dir);
    
    if (canMoveTo(newX, newY)) {
      setIsMoving(true);
      setPosition({ x: newX, y: newY });
      lastMoveRef.current = now;
      
      if (onMove) {
        onMove({ x: newX, y: newY }, dir);
      }
      
      // Reset moving state after animation
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
      }, MOVE_DELAY);
    }
  }, [position, canMoveTo, onMove]);
  
  const processInput = useCallback(() => {
    // Priority: up > down > left > right
    if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
      move('up');
    } else if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
      move('down');
    } else if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
      move('left');
    } else if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
      move('right');
    }
  }, [move]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Movement keys
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        
        // Start continuous movement
        if (!moveIntervalRef.current) {
          processInput();
          moveIntervalRef.current = window.setInterval(processInput, MOVE_DELAY);
        }
      }
      
      // Interaction keys
      if (key === ' ' || key === 'enter' || key === 'e') {
        e.preventDefault();
        if (onInteract) {
          onInteract(position);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      
      // Stop interval if no movement keys pressed
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
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [processInput, onInteract, position]);
  
  return {
    position,
    direction,
    isMoving,
    setPosition,
  };
}
