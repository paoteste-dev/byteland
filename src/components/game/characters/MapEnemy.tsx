import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

export type EnemyType = 'phishling' | 'clickbaiter' | 'spambot' | 'malware';

interface MapEnemyProps {
  x: number;
  y: number;
  type: EnemyType;
  isShaking?: boolean;
}

// CSS-animated enemies for the map
export const MapEnemy = memo(function MapEnemy({
  x,
  y,
  type,
  isShaking = true,
}: MapEnemyProps) {
  const ENEMY_WIDTH = 24;
  const ENEMY_HEIGHT = 28;
  
  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - ENEMY_HEIGHT) / 2 - 4,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    zIndex: 50 + y,
    imageRendering: 'pixelated',
    pointerEvents: 'none',
  }), [x, y]);

  // Different enemy designs based on type
  const EnemyDesign = useMemo(() => {
    switch (type) {
      case 'phishling':
        return <PhishlingSprite isShaking={isShaking} />;
      case 'clickbaiter':
        return <ClickbaiterSprite isShaking={isShaking} />;
      case 'spambot':
        return <SpambotSprite isShaking={isShaking} />;
      case 'malware':
        return <MalwareSprite isShaking={isShaking} />;
      default:
        return <PhishlingSprite isShaking={isShaking} />;
    }
  }, [type, isShaking]);

  return (
    <div style={containerStyle}>
      {EnemyDesign}
    </div>
  );
});

// Phishling - Fish-like phishing creature
function PhishlingSprite({ isShaking }: { isShaking: boolean }) {
  return (
    <div className={`relative w-full h-full ${isShaking ? 'animate-enemy-shake' : ''}`}>
      {/* Shadow */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full blur-[1px]"
        style={{ 
          width: 18,
          height: 4,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Body - Fish shape */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
        style={{
          width: 20,
          height: 16,
          background: 'linear-gradient(180deg, hsl(200, 70%, 60%) 0%, hsl(210, 75%, 45%) 100%)',
          borderRadius: '50% 50% 40% 40%',
          boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        {/* Scales pattern */}
        <div 
          className="absolute inset-1 opacity-30"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 4px)',
          }}
        />
        
        {/* Evil eye */}
        <div 
          className="absolute top-2 left-3"
          style={{
            width: 6,
            height: 6,
            backgroundColor: 'white',
            borderRadius: '50%',
          }}
        >
          <div 
            className="animate-pulse"
            style={{
              position: 'absolute',
              top: 1,
              left: 2,
              width: 3,
              height: 3,
              backgroundColor: 'hsl(0, 80%, 40%)',
              borderRadius: '50%',
            }}
          />
        </div>
        
        {/* Hook */}
        <div 
          className="absolute -top-3 right-2"
          style={{
            width: 4,
            height: 8,
            border: '2px solid hsl(45, 80%, 50%)',
            borderTop: 'none',
            borderLeft: 'none',
            borderRadius: '0 0 6px 0',
          }}
        />
        
        {/* Tail */}
        <div 
          className="absolute -right-4 top-1/2 -translate-y-1/2"
          style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '8px solid hsl(210, 70%, 50%)',
          }}
        />
        
        {/* Mouth with sharp teeth */}
        <div 
          style={{
            position: 'absolute',
            bottom: 3,
            left: 2,
            width: 8,
            height: 4,
            backgroundColor: 'hsl(0, 60%, 30%)',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 1,
              width: 0,
              height: 0,
              borderLeft: '2px solid transparent',
              borderRight: '2px solid transparent',
              borderTop: '3px solid white',
            }}
          />
        </div>
      </div>
      
      {/* Malicious aura */}
      <div 
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, hsla(200, 100%, 50%, 0.2) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}

// Clickbaiter - Trap/bait creature
function ClickbaiterSprite({ isShaking }: { isShaking: boolean }) {
  return (
    <div className={`relative w-full h-full ${isShaking ? 'animate-enemy-shake' : ''}`}>
      {/* Shadow */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full blur-[1px]"
        style={{ 
          width: 18,
          height: 4,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Body - Box/present shape */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
        style={{
          width: 18,
          height: 14,
          background: 'linear-gradient(180deg, hsl(45, 90%, 55%) 0%, hsl(35, 85%, 45%) 100%)',
          borderRadius: '3px',
          boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        {/* Ribbon */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: '100%',
            backgroundColor: 'hsl(350, 80%, 50%)',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            width: '100%',
            height: 3,
            backgroundColor: 'hsl(350, 80%, 50%)',
          }}
        />
        
        {/* Sneaky eyes peeking */}
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          style={{
            width: 16,
            height: 6,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div 
            className="animate-pulse"
            style={{
              width: 5,
              height: 5,
              backgroundColor: 'hsl(0, 80%, 40%)',
              borderRadius: '50%',
              boxShadow: '0 0 4px hsl(0, 100%, 50%)',
            }}
          />
          <div 
            className="animate-pulse"
            style={{
              width: 5,
              height: 5,
              backgroundColor: 'hsl(0, 80%, 40%)',
              borderRadius: '50%',
              boxShadow: '0 0 4px hsl(0, 100%, 50%)',
              animationDelay: '0.2s',
            }}
          />
        </div>
        
        {/* Exclamation lure */}
        <div 
          className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce"
          style={{
            fontSize: '8px',
            fontWeight: 'bold',
            color: 'hsl(350, 100%, 50%)',
            textShadow: '0 0 4px hsl(350, 100%, 60%)',
          }}
        >
          !
        </div>
      </div>
      
      {/* Tempting glow */}
      <div 
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, hsla(45, 100%, 60%, 0.3) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}

// Spambot - Robot creature
function SpambotSprite({ isShaking }: { isShaking: boolean }) {
  return (
    <div className={`relative w-full h-full ${isShaking ? 'animate-enemy-shake' : ''}`}>
      {/* Shadow */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full blur-[1px]"
        style={{ 
          width: 18,
          height: 4,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Body - Metal robot */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
        style={{
          width: 16,
          height: 12,
          background: 'linear-gradient(180deg, hsl(220, 10%, 60%) 0%, hsl(220, 10%, 45%) 100%)',
          borderRadius: '3px',
        }}
      >
        {/* Screen */}
        <div 
          className="absolute inset-1"
          style={{
            backgroundColor: 'hsl(160, 80%, 20%)',
            borderRadius: '2px',
          }}
        >
          {/* Scrolling spam text */}
          <div 
            className="animate-scroll-text overflow-hidden"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4px',
              color: 'hsl(120, 100%, 60%)',
              fontFamily: 'monospace',
            }}
          >
            $$
          </div>
        </div>
      </div>
      
      {/* Head */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        style={{
          width: 14,
          height: 10,
          background: 'linear-gradient(180deg, hsl(220, 10%, 70%) 0%, hsl(220, 10%, 55%) 100%)',
          borderRadius: '4px 4px 2px 2px',
        }}
      >
        {/* Antenna */}
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          style={{
            width: 2,
            height: 4,
            backgroundColor: 'hsl(220, 10%, 50%)',
          }}
        >
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse"
            style={{
              width: 4,
              height: 4,
              backgroundColor: 'hsl(0, 100%, 50%)',
              borderRadius: '50%',
              boxShadow: '0 0 4px hsl(0, 100%, 50%)',
            }}
          />
        </div>
        
        {/* Eyes */}
        <div className="absolute top-2 left-1 w-4 h-3 bg-black rounded-sm">
          <div 
            className="animate-pulse"
            style={{
              position: 'absolute',
              top: 1,
              left: 1,
              width: 2,
              height: 1,
              backgroundColor: 'hsl(0, 100%, 50%)',
            }}
          />
        </div>
        <div className="absolute top-2 right-1 w-4 h-3 bg-black rounded-sm">
          <div 
            className="animate-pulse"
            style={{
              position: 'absolute',
              top: 1,
              left: 1,
              width: 2,
              height: 1,
              backgroundColor: 'hsl(0, 100%, 50%)',
              animationDelay: '0.3s',
            }}
          />
        </div>
      </div>
      
      {/* Arms */}
      <div 
        className="absolute bottom-8 -left-1"
        style={{
          width: 4,
          height: 6,
          backgroundColor: 'hsl(220, 10%, 50%)',
          borderRadius: '2px',
        }}
      />
      <div 
        className="absolute bottom-8 -right-1"
        style={{
          width: 4,
          height: 6,
          backgroundColor: 'hsl(220, 10%, 50%)',
          borderRadius: '2px',
        }}
      />
      
      {/* Spam aura */}
      <div 
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, hsla(120, 100%, 50%, 0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}

// Malware - Virus creature
function MalwareSprite({ isShaking }: { isShaking: boolean }) {
  return (
    <div className={`relative w-full h-full ${isShaking ? 'animate-enemy-shake' : ''}`}>
      {/* Shadow */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full blur-[1px]"
        style={{ 
          width: 18,
          height: 4,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Core body - Virus sphere */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        style={{
          width: 16,
          height: 16,
          background: 'radial-gradient(circle at 30% 30%, hsl(280, 70%, 50%) 0%, hsl(300, 80%, 30%) 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 8px hsl(280, 100%, 50%, 0.5)',
        }}
      >
        {/* Evil face */}
        <div 
          className="absolute top-3 left-2 animate-pulse"
          style={{
            width: 4,
            height: 3,
            backgroundColor: 'hsl(60, 100%, 50%)',
            borderRadius: '50% 50% 0 0',
          }}
        />
        <div 
          className="absolute top-3 right-2 animate-pulse"
          style={{
            width: 4,
            height: 3,
            backgroundColor: 'hsl(60, 100%, 50%)',
            borderRadius: '50% 50% 0 0',
            animationDelay: '0.15s',
          }}
        />
        {/* Jagged mouth */}
        <div 
          style={{
            position: 'absolute',
            bottom: 3,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 3,
            background: 'linear-gradient(90deg, transparent 0%, hsl(60, 100%, 50%) 20%, transparent 40%, hsl(60, 100%, 50%) 60%, transparent 80%, hsl(60, 100%, 50%) 100%)',
          }}
        />
      </div>
      
      {/* Spikes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <div 
          key={i}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: 4,
            height: 8,
            background: 'linear-gradient(180deg, hsl(280, 70%, 50%) 0%, hsl(300, 80%, 40%) 100%)',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-6px)`,
            borderRadius: '50% 50% 0 0',
          }}
        />
      ))}
      
      {/* Toxic aura */}
      <div 
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsla(280, 100%, 50%, 0.3) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
