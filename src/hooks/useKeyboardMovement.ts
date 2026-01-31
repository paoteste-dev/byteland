import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseKeyboardMovementOptions {
  initialPosition: Position;
  speed: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  onMove?: (position: Position, direction: string) => void;
}

export function useKeyboardMovement({
  initialPosition,
  speed,
  bounds,
  onMove
}: UseKeyboardMovementOptions) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 });
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrame = useRef<number>();
  const lastUpdate = useRef<number>(0);

  const updatePosition = useCallback((timestamp: number) => {
    if (lastUpdate.current === 0) lastUpdate.current = timestamp;
    const delta = timestamp - lastUpdate.current;
    
    if (delta >= 16) { // ~60fps
      let dx = 0;
      let dy = 0;
      let newDirection = direction;
      
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        dy -= speed;
        newDirection = 'up';
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        dy += speed;
        newDirection = 'down';
      }
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        dx -= speed;
        newDirection = 'left';
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        dx += speed;
        newDirection = 'right';
      }
      
      // Update velocity for 8-direction detection
      setVelocity({ x: dx, y: dy });
      
      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);
        setDirection(newDirection);
        
        setPosition(prev => {
          const newX = Math.max(bounds.minX, Math.min(bounds.maxX, prev.x + dx));
          const newY = Math.max(bounds.minY, Math.min(bounds.maxY, prev.y + dy));
          
          if (onMove) {
            onMove({ x: newX, y: newY }, newDirection);
          }
          
          return { x: newX, y: newY };
        });
      } else {
        setIsMoving(false);
      }
      
      lastUpdate.current = timestamp;
    }
    
    animationFrame.current = requestAnimationFrame(updatePosition);
  }, [speed, bounds, direction, onMove]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    animationFrame.current = requestAnimationFrame(updatePosition);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [updatePosition]);

  return { position, direction, isMoving, velocity, setPosition };
}
