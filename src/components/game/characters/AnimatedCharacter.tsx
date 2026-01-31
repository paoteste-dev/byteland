import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CharacterType = 'hero' | 'defendo' | 'enemy' | 'boss';

interface AnimatedCharacterProps {
  type: CharacterType;
  variant?: string; // e.g., 'passbit', 'phishling', etc.
  x: number; // tile position
  y: number; // tile position
  direction: Direction;
  isMoving?: boolean;
  isAnimating?: boolean;
  size?: number;
}

// Color schemes for different character types
const characterStyles = {
  hero: {
    body: 'hsl(200, 100%, 50%)',
    accent: 'hsl(180, 100%, 60%)',
    visor: 'hsl(280, 100%, 70%)',
    glow: 'hsl(180, 100%, 50%)',
  },
  passbit: {
    body: 'hsl(45, 90%, 55%)',
    accent: 'hsl(40, 100%, 45%)',
    visor: 'hsl(0, 0%, 20%)',
    glow: 'hsl(45, 100%, 60%)',
  },
  firecub: {
    body: 'hsl(15, 100%, 55%)',
    accent: 'hsl(30, 100%, 50%)',
    visor: 'hsl(45, 100%, 70%)',
    glow: 'hsl(20, 100%, 60%)',
  },
  authy: {
    body: 'hsl(140, 70%, 45%)',
    accent: 'hsl(120, 80%, 40%)',
    visor: 'hsl(0, 0%, 90%)',
    glow: 'hsl(140, 100%, 50%)',
  },
  linklet: {
    body: 'hsl(210, 90%, 55%)',
    accent: 'hsl(220, 100%, 65%)',
    visor: 'hsl(180, 100%, 70%)',
    glow: 'hsl(210, 100%, 60%)',
  },
  phishling: {
    body: 'hsl(280, 70%, 50%)',
    accent: 'hsl(290, 80%, 40%)',
    visor: 'hsl(0, 100%, 50%)',
    glow: 'hsl(280, 100%, 60%)',
  },
  clickbaiter: {
    body: 'hsl(0, 80%, 50%)',
    accent: 'hsl(350, 90%, 40%)',
    visor: 'hsl(45, 100%, 50%)',
    glow: 'hsl(0, 100%, 60%)',
  },
  'phishling-alfa': {
    body: 'hsl(270, 80%, 40%)',
    accent: 'hsl(280, 90%, 50%)',
    visor: 'hsl(0, 100%, 60%)',
    glow: 'hsl(270, 100%, 70%)',
  },
};

type StyleKey = keyof typeof characterStyles;

export const AnimatedCharacter = memo(function AnimatedCharacter({
  type,
  variant,
  x,
  y,
  direction,
  isMoving = false,
  isAnimating = true,
  size = TILE_SIZE - 8,
}: AnimatedCharacterProps) {
  const styleKey = (variant || type) as StyleKey;
  const colors = characterStyles[styleKey] || characterStyles.hero;
  
  const characterStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - size) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - size) / 2,
    width: size,
    height: size,
    transition: 'left 0.15s ease-out, top 0.15s ease-out',
    zIndex: 10 + y,
  }), [x, y, size]);

  // Direction-based rotation/facing
  const getFacing = () => {
    switch (direction) {
      case 'up': return 'scaleX(1)';
      case 'down': return 'scaleX(1)';
      case 'left': return 'scaleX(-1)';
      case 'right': return 'scaleX(1)';
    }
  };

  if (type === 'hero') {
    return (
      <div style={characterStyle} className="relative">
        {/* Shadow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-black/40 blur-sm"
        />
        
        {/* Character container with bounce */}
        <div 
          className={`absolute inset-0 ${isMoving ? 'animate-character-walk' : ''}`}
          style={{ transform: getFacing() }}
        >
          {/* Body */}
          <div 
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-7 rounded-lg"
            style={{ 
              backgroundColor: colors.body,
              boxShadow: `0 0 8px ${colors.glow}`,
            }}
          >
            {/* Jacket lines */}
            <div 
              className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-4"
              style={{ backgroundColor: colors.accent }}
            />
          </div>
          
          {/* Head */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-8 rounded-t-full rounded-b-lg"
            style={{ backgroundColor: 'hsl(30, 50%, 70%)' }}
          >
            {/* Hair */}
            <div 
              className="absolute -top-1 left-0 right-0 h-4 rounded-t-full"
              style={{ backgroundColor: 'hsl(30, 30%, 25%)' }}
            />
            
            {/* Visor/Glasses */}
            <div 
              className="absolute top-3 left-1 right-1 h-2.5 rounded"
              style={{ 
                backgroundColor: colors.visor,
                boxShadow: `0 0 6px ${colors.glow}`,
              }}
            >
              {/* Visor light */}
              <div 
                className="absolute top-0.5 left-1 w-1 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: colors.glow }}
              />
            </div>
          </div>
          
          {/* Arms */}
          <div 
            className={`absolute bottom-2 -left-1 w-2 h-4 rounded-full ${isMoving ? 'animate-arm-swing' : ''}`}
            style={{ backgroundColor: colors.body }}
          />
          <div 
            className={`absolute bottom-2 -right-1 w-2 h-4 rounded-full ${isMoving ? 'animate-arm-swing-reverse' : ''}`}
            style={{ backgroundColor: colors.body }}
          />
          
          {/* Legs */}
          <div 
            className={`absolute -bottom-1 left-2 w-2.5 h-3 rounded-b-lg ${isMoving ? 'animate-leg-walk' : ''}`}
            style={{ backgroundColor: 'hsl(220, 30%, 30%)' }}
          />
          <div 
            className={`absolute -bottom-1 right-2 w-2.5 h-3 rounded-b-lg ${isMoving ? 'animate-leg-walk-reverse' : ''}`}
            style={{ backgroundColor: 'hsl(220, 30%, 30%)' }}
          />
        </div>
      </div>
    );
  }

  // Defendo or Enemy character
  return (
    <div style={characterStyle} className="relative">
      {/* Shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-2 rounded-full bg-black/40 blur-sm"
      />
      
      {/* Character with idle animation */}
      <div 
        className={`absolute inset-0 ${isAnimating ? 'animate-creature-idle' : ''}`}
        style={{ transform: getFacing() }}
      >
        {/* Body - blob shape */}
        <div 
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full"
          style={{ 
            backgroundColor: colors.body,
            boxShadow: `0 0 12px ${colors.glow}`,
          }}
        >
          {/* Inner pattern */}
          <div 
            className="absolute inset-2 rounded-full opacity-50"
            style={{ backgroundColor: colors.accent }}
          />
          
          {/* Eyes */}
          <div className="absolute top-2 left-1.5 flex gap-1.5">
            <div 
              className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center"
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.visor }}
              />
            </div>
            <div 
              className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center"
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.visor }}
              />
            </div>
          </div>
          
          {/* Mouth or feature */}
          {type === 'enemy' && (
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full"
              style={{ backgroundColor: colors.visor }}
            />
          )}
          
          {type === 'defendo' && (
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
          )}
        </div>
        
        {/* Floating particles for enemies */}
        {type === 'enemy' && (
          <>
            <div 
              className="absolute top-0 left-1 w-1.5 h-1.5 rounded-full animate-float-particle"
              style={{ backgroundColor: colors.glow }}
            />
            <div 
              className="absolute top-1 right-1 w-1 h-1 rounded-full animate-float-particle"
              style={{ backgroundColor: colors.glow, animationDelay: '0.3s' }}
            />
          </>
        )}
        
        {/* Star/sparkle for Defendos */}
        {type === 'defendo' && (
          <div 
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 animate-spin-slow"
            style={{ color: colors.glow }}
          >
            ✦
          </div>
        )}
      </div>
    </div>
  );
});
