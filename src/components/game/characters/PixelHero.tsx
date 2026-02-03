import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface PixelHeroProps {
  x: number;
  y: number;
  direction: Direction;
  isMoving?: boolean;
  size?: number;
}

// Redesigned pixel art hero - cybersecurity defender
export const PixelHero = memo(function PixelHero({
  x,
  y,
  direction,
  isMoving = false,
  size = TILE_SIZE - 4,
}: PixelHeroProps) {
  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - size) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - size) / 2,
    width: size,
    height: size,
    transition: 'left 0.15s ease-out, top 0.15s ease-out',
    zIndex: 100 + y,
  }), [x, y, size]);

  const facing = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  const isBackView = direction === 'up';
  const isSideView = direction === 'left' || direction === 'right';

  return (
    <div style={containerStyle} className="relative">
      {/* Shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/50 blur-sm"
        style={{ width: size * 0.7, height: size * 0.15 }}
      />
      
      {/* Character container */}
      <div 
        className={`absolute inset-0 ${isMoving ? 'animate-hero-bounce' : ''}`}
        style={{ transform: facing }}
      >
        {/* Legs */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          <div 
            className={`w-3 h-4 rounded-b-lg ${isMoving ? 'animate-leg-left' : ''}`}
            style={{ 
              backgroundColor: 'hsl(220, 50%, 25%)',
              boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Shoe */}
            <div className="absolute bottom-0 w-full h-1.5 rounded-b bg-gray-800" />
          </div>
          <div 
            className={`w-3 h-4 rounded-b-lg ${isMoving ? 'animate-leg-right' : ''}`}
            style={{ 
              backgroundColor: 'hsl(220, 50%, 25%)',
              boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Shoe */}
            <div className="absolute bottom-0 w-full h-1.5 rounded-b bg-gray-800" />
          </div>
        </div>
        
        {/* Body / Jacket */}
        <div 
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-9 rounded-lg relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, hsl(210, 90%, 45%) 0%, hsl(220, 85%, 35%) 100%)',
            boxShadow: '0 0 10px hsl(210, 100%, 50%, 0.3)',
          }}
        >
          {/* Jacket detail - center line */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-cyan-300/60" />
          {/* Jacket pockets */}
          <div className="absolute bottom-1 left-1 w-2.5 h-2 rounded-sm" style={{ backgroundColor: 'hsl(210, 80%, 30%)' }} />
          <div className="absolute bottom-1 right-1 w-2.5 h-2 rounded-sm" style={{ backgroundColor: 'hsl(210, 80%, 30%)' }} />
          {/* Collar glow */}
          <div 
            className="absolute top-0 left-1 right-1 h-1.5 rounded-b animate-pulse"
            style={{ 
              background: 'linear-gradient(90deg, hsl(180, 100%, 50%), hsl(200, 100%, 60%))',
              boxShadow: '0 0 4px hsl(180, 100%, 60%)',
            }}
          />
        </div>
        
        {/* Arms */}
        <div 
          className={`absolute bottom-5 -left-0.5 w-2.5 h-6 rounded-full ${isMoving ? 'animate-arm-swing' : ''}`}
          style={{ 
            backgroundColor: 'hsl(210, 85%, 40%)',
            transformOrigin: 'top center',
          }}
        >
          {/* Glove */}
          <div 
            className="absolute bottom-0 w-full h-2 rounded-b-full"
            style={{ backgroundColor: 'hsl(180, 70%, 40%)' }}
          />
        </div>
        <div 
          className={`absolute bottom-5 -right-0.5 w-2.5 h-6 rounded-full ${isMoving ? 'animate-arm-swing-reverse' : ''}`}
          style={{ 
            backgroundColor: 'hsl(210, 85%, 40%)',
            transformOrigin: 'top center',
          }}
        >
          {/* Glove */}
          <div 
            className="absolute bottom-0 w-full h-2 rounded-b-full"
            style={{ backgroundColor: 'hsl(180, 70%, 40%)' }}
          />
        </div>
        
        {/* Head */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl relative"
          style={{ 
            backgroundColor: 'hsl(25, 50%, 65%)',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          {/* Hair */}
          <div 
            className="absolute -top-1 left-0 right-0 h-5 rounded-t-xl"
            style={{ 
              background: 'linear-gradient(180deg, hsl(30, 40%, 20%) 0%, hsl(25, 35%, 25%) 100%)',
            }}
          >
            {/* Hair spikes */}
            <div className="absolute -top-1 left-1 w-2 h-3 rounded-t-full" style={{ backgroundColor: 'hsl(30, 40%, 18%)' }} />
            <div className="absolute -top-2 left-3 w-2.5 h-4 rounded-t-full" style={{ backgroundColor: 'hsl(30, 40%, 15%)' }} />
            <div className="absolute -top-1 right-2 w-2 h-3 rounded-t-full" style={{ backgroundColor: 'hsl(30, 40%, 18%)' }} />
          </div>
          
          {/* Face */}
          {!isBackView && (
            <>
              {/* Cyber visor/glasses */}
              <div 
                className="absolute top-4 left-0.5 right-0.5 h-3 rounded-lg"
                style={{ 
                  background: 'linear-gradient(90deg, hsl(280, 100%, 60%), hsl(320, 100%, 55%), hsl(280, 100%, 60%))',
                  boxShadow: '0 0 8px hsl(300, 100%, 60%, 0.8)',
                }}
              >
                {/* Visor shine */}
                <div className="absolute top-0.5 left-1 w-2 h-1 rounded-full bg-white/50" />
                {/* Visor glow animation */}
                <div 
                  className="absolute inset-0 rounded-lg animate-pulse opacity-60"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent 0%, hsl(300, 100%, 70%) 50%, transparent 100%)',
                  }}
                />
              </div>
              
              {/* Mouth */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-rose-400" />
            </>
          )}
          
          {/* Back of head detail */}
          {isBackView && (
            <div 
              className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-2"
              style={{ backgroundColor: 'hsl(30, 40%, 22%)' }}
            />
          )}
          
          {/* Ear (side view) */}
          {!isBackView && (
            <div 
              className="absolute top-4 -right-0.5 w-1.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'hsl(25, 45%, 60%)' }}
            />
          )}
        </div>
        
        {/* Backpack / Tech gear (back view) */}
        {isBackView && (
          <div 
            className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-6 rounded"
            style={{ 
              backgroundColor: 'hsl(220, 60%, 30%)',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" 
              style={{ boxShadow: '0 0 4px hsl(180, 100%, 50%)' }} 
            />
          </div>
        )}
        
        {/* Hero glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 animate-pulse pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at 50% 70%, hsl(210, 100%, 60%, 0.3) 0%, transparent 60%)',
          }}
        />
      </div>
    </div>
  );
});
