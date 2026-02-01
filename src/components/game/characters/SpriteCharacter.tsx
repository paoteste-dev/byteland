import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';
import { getCreatureSprite } from '@/data/spriteConfig';

// Re-export Direction from AnimatedCharacter for consistency
export type { Direction } from './AnimatedCharacter';
export type CharacterType = 'hero' | 'defendo' | 'enemy' | 'boss';

type Direction = 'up' | 'down' | 'left' | 'right';

interface SpriteCharacterProps {
  type: CharacterType;
  spriteId: string;
  x: number;
  y: number;
  direction: Direction;
  isMoving?: boolean;
  size?: number;
}

// Character using PNG sprites with CSS animations
export const SpriteCharacter = memo(function SpriteCharacter({
  type,
  spriteId,
  x,
  y,
  direction,
  isMoving = false,
  size = TILE_SIZE - 8,
}: SpriteCharacterProps) {
  const spriteSrc = getCreatureSprite(spriteId);
  
  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - size) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - size) / 2,
    width: size,
    height: size,
    transition: 'left 0.15s ease-out, top 0.15s ease-out',
    zIndex: 10 + y,
  }), [x, y, size]);

  const spriteTransform = useMemo(() => {
    let transform = '';
    if (direction === 'left') {
      transform = 'scaleX(-1)';
    }
    return transform;
  }, [direction]);

  const animationClass = useMemo(() => {
    if (isMoving) {
      return 'animate-sprite-walk';
    }
    if (type === 'enemy' || type === 'boss') {
      return 'animate-sprite-enemy-idle';
    }
    return 'animate-sprite-idle';
  }, [isMoving, type]);

  return (
    <div style={containerStyle} className="relative">
      {/* Shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/40 blur-sm"
        style={{ width: size * 0.6, height: size * 0.15 }}
      />
      
      {/* Sprite container */}
      <div 
        className={`absolute inset-0 ${animationClass}`}
        style={{ transform: spriteTransform }}
      >
        {/* Sprite image */}
        <img 
          src={spriteSrc}
          alt={spriteId}
          className="w-full h-full object-contain"
          style={{ 
            imageRendering: 'auto',
            filter: type === 'boss' ? 'drop-shadow(0 0 8px rgba(255, 0, 100, 0.6))' : undefined,
          }}
          draggable={false}
        />
        
        {/* Glow effect for special types */}
        {type === 'defendo' && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse opacity-30"
            style={{ 
              background: 'radial-gradient(circle, rgba(100, 255, 200, 0.4) 0%, transparent 60%)',
            }}
          />
        )}
        
        {type === 'enemy' && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse opacity-20"
            style={{ 
              background: 'radial-gradient(circle, rgba(255, 100, 100, 0.4) 0%, transparent 60%)',
            }}
          />
        )}
        
        {type === 'boss' && (
          <>
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{ 
                background: 'radial-gradient(circle, rgba(255, 0, 100, 0.3) 0%, transparent 70%)',
              }}
            />
            {/* Boss crown/indicator */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
              👑
            </div>
          </>
        )}
      </div>
    </div>
  );
});
