import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface CyberHeroProps {
  x: number;
  y: number;
  direction: Direction;
  isMoving?: boolean;
}

// Cybersecurity Hero - Unique design with tech visor, hoodie, and glowing accents
export const CyberHero = memo(function CyberHero({
  x,
  y,
  direction,
  isMoving = false,
}: CyberHeroProps) {
  const HERO_WIDTH = 28;
  const HERO_HEIGHT = 36;
  
  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - HERO_WIDTH) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - HERO_HEIGHT) / 2 - 2,
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
    transition: 'left 0.12s linear, top 0.12s linear',
    zIndex: 100 + y,
    imageRendering: 'pixelated',
  }), [x, y]);

  const isFacingLeft = direction === 'left';
  const isFacingUp = direction === 'up';
  const isFacingDown = direction === 'down';

  return (
    <div style={containerStyle}>
      <div 
        className={`relative w-full h-full ${isMoving ? 'animate-cyber-walk' : ''}`}
        style={{ 
          transform: isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        {/* Shadow */}
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full blur-[1px]"
          style={{ 
            width: 20,
            height: 6,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          }}
        />

        {/* === LEGS === */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-px">
          {/* Left leg */}
          <div 
            className={isMoving ? 'animate-leg-walk-left' : ''}
            style={{ 
              width: 7,
              height: 10,
              background: 'linear-gradient(180deg, hsl(220, 30%, 25%) 0%, hsl(220, 25%, 20%) 100%)',
              borderRadius: '0 0 2px 2px',
              transformOrigin: 'top center',
            }}
          >
            {/* Tech boot */}
            <div 
              style={{ 
                position: 'absolute',
                bottom: 0,
                left: -1,
                width: 9,
                height: 4,
                background: 'linear-gradient(180deg, hsl(200, 80%, 35%) 0%, hsl(200, 70%, 25%) 100%)',
                borderRadius: '2px 2px 3px 3px',
                boxShadow: '0 0 4px hsla(180, 100%, 50%, 0.3)',
              }}
            >
              {/* Boot glow strip */}
              <div 
                className="animate-pulse"
                style={{
                  position: 'absolute',
                  bottom: 1,
                  left: 1,
                  right: 1,
                  height: 1,
                  backgroundColor: 'hsl(180, 100%, 60%)',
                  boxShadow: '0 0 3px hsl(180, 100%, 60%)',
                }}
              />
            </div>
          </div>
          {/* Right leg */}
          <div 
            className={isMoving ? 'animate-leg-walk-right' : ''}
            style={{ 
              width: 7,
              height: 10,
              background: 'linear-gradient(180deg, hsl(220, 30%, 25%) 0%, hsl(220, 25%, 20%) 100%)',
              borderRadius: '0 0 2px 2px',
              transformOrigin: 'top center',
            }}
          >
            {/* Tech boot */}
            <div 
              style={{ 
                position: 'absolute',
                bottom: 0,
                left: -1,
                width: 9,
                height: 4,
                background: 'linear-gradient(180deg, hsl(200, 80%, 35%) 0%, hsl(200, 70%, 25%) 100%)',
                borderRadius: '2px 2px 3px 3px',
                boxShadow: '0 0 4px hsla(180, 100%, 50%, 0.3)',
              }}
            >
              <div 
                className="animate-pulse"
                style={{
                  position: 'absolute',
                  bottom: 1,
                  left: 1,
                  right: 1,
                  height: 1,
                  backgroundColor: 'hsl(180, 100%, 60%)',
                  boxShadow: '0 0 3px hsl(180, 100%, 60%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* === BODY - Tech Hoodie === */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ 
            width: 22,
            height: 14,
            background: 'linear-gradient(180deg, hsl(220, 50%, 20%) 0%, hsl(220, 45%, 15%) 100%)',
            borderRadius: '6px 6px 3px 3px',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Hoodie front detail - zipper */}
          <div 
            style={{
              position: 'absolute',
              top: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 2,
              height: 10,
              background: 'linear-gradient(180deg, hsl(220, 40%, 30%) 0%, hsl(220, 35%, 25%) 100%)',
            }}
          />
          
          {/* Glowing circuit lines on hoodie */}
          <div 
            className="animate-pulse"
            style={{
              position: 'absolute',
              top: 4,
              left: 3,
              width: 4,
              height: 1,
              backgroundColor: 'hsl(180, 100%, 50%)',
              boxShadow: '0 0 4px hsl(180, 100%, 50%)',
            }}
          />
          <div 
            className="animate-pulse"
            style={{
              position: 'absolute',
              top: 4,
              right: 3,
              width: 4,
              height: 1,
              backgroundColor: 'hsl(180, 100%, 50%)',
              boxShadow: '0 0 4px hsl(180, 100%, 50%)',
              animationDelay: '0.3s',
            }}
          />
          <div 
            className="animate-pulse"
            style={{
              position: 'absolute',
              top: 7,
              left: 4,
              width: 3,
              height: 1,
              backgroundColor: 'hsl(280, 100%, 60%)',
              boxShadow: '0 0 4px hsl(280, 100%, 60%)',
              animationDelay: '0.5s',
            }}
          />
          
          {/* Logo/badge on chest */}
          <div 
            style={{
              position: 'absolute',
              top: 2,
              right: 3,
              width: 4,
              height: 4,
              background: 'linear-gradient(135deg, hsl(45, 90%, 50%) 0%, hsl(35, 85%, 45%) 100%)',
              borderRadius: '1px',
              boxShadow: '0 0 3px hsla(45, 100%, 50%, 0.5)',
            }}
          />
        </div>

        {/* === ARMS === */}
        {!isFacingUp && (
          <>
            {/* Left arm */}
            <div 
              className={isMoving ? 'animate-arm-cyber-left' : ''}
              style={{ 
                position: 'absolute',
                top: 14,
                left: 0,
                width: 6,
                height: 12,
                background: 'linear-gradient(180deg, hsl(220, 50%, 20%) 0%, hsl(220, 45%, 18%) 100%)',
                borderRadius: '3px 3px 4px 4px',
                transformOrigin: 'top center',
              }}
            >
              {/* Wrist tech band */}
              <div 
                className="animate-pulse"
                style={{
                  position: 'absolute',
                  bottom: 3,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: 'hsl(280, 100%, 60%)',
                  boxShadow: '0 0 4px hsl(280, 100%, 60%)',
                }}
              />
              {/* Hand */}
              <div 
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 6,
                  height: 4,
                  backgroundColor: 'hsl(25, 40%, 65%)',
                  borderRadius: '2px',
                }}
              />
            </div>
            {/* Right arm */}
            <div 
              className={isMoving ? 'animate-arm-cyber-right' : ''}
              style={{ 
                position: 'absolute',
                top: 14,
                right: 0,
                width: 6,
                height: 12,
                background: 'linear-gradient(180deg, hsl(220, 50%, 20%) 0%, hsl(220, 45%, 18%) 100%)',
                borderRadius: '3px 3px 4px 4px',
                transformOrigin: 'top center',
              }}
            >
              {/* Wrist tech band */}
              <div 
                className="animate-pulse"
                style={{
                  position: 'absolute',
                  bottom: 3,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: 'hsl(180, 100%, 50%)',
                  boxShadow: '0 0 4px hsl(180, 100%, 50%)',
                }}
              />
              {/* Hand */}
              <div 
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 6,
                  height: 4,
                  backgroundColor: 'hsl(25, 40%, 65%)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </>
        )}

        {/* === HEAD === */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{ 
            width: 20,
            height: 18,
          }}
        >
          {/* Hair - Styled cyber look */}
          <div 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 10,
              background: 'linear-gradient(180deg, hsl(260, 30%, 15%) 0%, hsl(260, 25%, 12%) 100%)',
              borderRadius: '10px 10px 0 0',
            }}
          >
            {/* Hair highlight */}
            <div 
              style={{
                position: 'absolute',
                top: 2,
                left: 3,
                width: 5,
                height: 2,
                backgroundColor: 'hsl(260, 35%, 25%)',
                borderRadius: '2px',
              }}
            />
            {/* Hair spike accent with color */}
            <div 
              style={{
                position: 'absolute',
                top: -2,
                right: 3,
                width: 6,
                height: 5,
                background: 'linear-gradient(180deg, hsl(180, 100%, 45%) 0%, hsl(260, 30%, 15%) 100%)',
                borderRadius: '3px 3px 0 0',
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              }}
            />
          </div>

          {/* Face */}
          {!isFacingUp && (
            <div 
              style={{ 
                position: 'absolute',
                top: 6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 16,
                height: 12,
                backgroundColor: 'hsl(25, 40%, 70%)',
                borderRadius: '4px 4px 6px 6px',
              }}
            >
              {/* === CYBER VISOR === */}
              <div 
                className="animate-visor-glow"
                style={{ 
                  position: 'absolute',
                  top: 1,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: 'linear-gradient(90deg, hsl(180, 100%, 45%) 0%, hsl(200, 100%, 55%) 50%, hsl(280, 100%, 55%) 100%)',
                  borderRadius: '3px',
                  boxShadow: '0 0 8px hsl(180, 100%, 50%), 0 0 12px hsl(200, 100%, 50%, 0.5)',
                }}
              >
                {/* Visor shine */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 1,
                    left: 2,
                    width: 4,
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: '2px',
                  }}
                />
                {/* Visor data display effect */}
                <div 
                  className="animate-visor-scan"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    borderRadius: '3px',
                  }}
                />
              </div>

              {/* Mouth/chin area */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4,
                  height: 2,
                  backgroundColor: 'hsl(25, 35%, 60%)',
                  borderRadius: '2px',
                }}
              />
            </div>
          )}

          {/* Back of head (when facing up) */}
          {isFacingUp && (
            <>
              <div 
                style={{ 
                  position: 'absolute',
                  top: 5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 12,
                  backgroundColor: 'hsl(260, 30%, 15%)',
                  borderRadius: '4px 4px 6px 6px',
                }}
              />
              {/* Hood up detail */}
              <div 
                style={{
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 10,
                  background: 'linear-gradient(180deg, hsl(220, 50%, 22%) 0%, hsl(220, 45%, 18%) 100%)',
                  borderRadius: '8px 8px 4px 4px',
                }}
              >
                {/* Hood circuit glow */}
                <div 
                  className="animate-pulse"
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 1,
                    backgroundColor: 'hsl(180, 100%, 50%)',
                    boxShadow: '0 0 4px hsl(180, 100%, 50%)',
                  }}
                />
              </div>
            </>
          )}

          {/* Ear piece / comm device (side view only) */}
          {!isFacingUp && !isFacingDown && (
            <div 
              className="animate-pulse"
              style={{
                position: 'absolute',
                top: 7,
                right: -2,
                width: 4,
                height: 4,
                background: 'radial-gradient(circle, hsl(180, 100%, 50%) 0%, hsl(200, 80%, 40%) 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 6px hsl(180, 100%, 50%)',
              }}
            />
          )}
        </div>

        {/* === GLOW AURA === */}
        <div 
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, hsla(180, 100%, 50%, 0.15) 0%, transparent 50%)',
          }}
        />
      </div>
    </div>
  );
});
