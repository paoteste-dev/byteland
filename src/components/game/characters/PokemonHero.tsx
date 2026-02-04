import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface PokemonHeroProps {
  x: number;
  y: number;
  direction: Direction;
  isMoving?: boolean;
}

// Pokemon FireRed style small hero sprite (16x24 pixel art style)
export const PokemonHero = memo(function PokemonHero({
  x,
  y,
  direction,
  isMoving = false,
}: PokemonHeroProps) {
  const HERO_WIDTH = 24;
  const HERO_HEIGHT = 32;
  
  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - HERO_WIDTH) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - HERO_HEIGHT) / 2 - 4, // Slightly raised
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
    transition: 'left 0.12s linear, top 0.12s linear',
    zIndex: 100 + y,
    imageRendering: 'pixelated',
  }), [x, y]);

  const isFacingLeft = direction === 'left';
  const isFacingRight = direction === 'right';
  const isFacingUp = direction === 'up';
  const isFacingDown = direction === 'down';

  // Walking animation frame
  const walkFrame = isMoving ? 'translate-y-px' : '';

  return (
    <div style={containerStyle}>
      <div 
        className={`relative w-full h-full ${walkFrame}`}
        style={{ 
          transform: isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        {/* Shadow */}
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full"
          style={{ 
            width: 16,
            height: 4,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
        />

        {/* === BODY === */}
        {/* Main body/torso - blue jacket */}
        <div 
          className="absolute bottom-2 left-1/2 -translate-x-1/2"
          style={{ 
            width: 16,
            height: 12,
            backgroundColor: 'hsl(210, 80%, 45%)',
            borderRadius: '3px 3px 4px 4px',
            boxShadow: 'inset 1px 0 0 hsl(210, 75%, 55%)',
          }}
        >
          {/* Jacket center line */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-1"
            style={{ 
              width: 2,
              height: 8,
              backgroundColor: 'hsl(210, 70%, 35%)',
            }}
          />
        </div>

        {/* === LEGS === */}
        {/* Pants/Legs */}
        <div 
          className={`absolute bottom-0 left-1/2 flex gap-0.5 ${isMoving ? 'animate-pokemon-walk' : ''}`}
          style={{ 
            transform: 'translateX(-50%)',
          }}
        >
          {/* Left leg */}
          <div 
            style={{ 
              width: 5,
              height: 6,
              backgroundColor: 'hsl(220, 50%, 25%)',
              borderRadius: '0 0 2px 2px',
            }}
          >
            {/* Shoe */}
            <div 
              className="absolute bottom-0 w-full"
              style={{ 
                height: 2,
                backgroundColor: 'hsl(0, 70%, 40%)',
                borderRadius: '0 0 2px 2px',
              }}
            />
          </div>
          {/* Right leg */}
          <div 
            style={{ 
              width: 5,
              height: 6,
              backgroundColor: 'hsl(220, 50%, 25%)',
              borderRadius: '0 0 2px 2px',
            }}
          >
            {/* Shoe */}
            <div 
              className="absolute bottom-0 w-full"
              style={{ 
                height: 2,
                backgroundColor: 'hsl(0, 70%, 40%)',
                borderRadius: '0 0 2px 2px',
              }}
            />
          </div>
        </div>

        {/* === HEAD === */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{ 
            width: 18,
            height: 16,
          }}
        >
          {/* Hair base */}
          <div 
            className="absolute inset-x-0 top-0"
            style={{ 
              height: 10,
              backgroundColor: 'hsl(25, 60%, 20%)',
              borderRadius: '8px 8px 0 0',
            }}
          />
          
          {/* Hair spikes (front) */}
          {(isFacingDown || isFacingLeft || isFacingRight) && (
            <>
              <div 
                className="absolute top-0"
                style={{ 
                  left: 2,
                  width: 4,
                  height: 5,
                  backgroundColor: 'hsl(25, 60%, 18%)',
                  borderRadius: '4px 4px 0 0',
                  transform: 'rotate(-15deg)',
                }}
              />
              <div 
                className="absolute top-0"
                style={{ 
                  left: 7,
                  width: 5,
                  height: 6,
                  backgroundColor: 'hsl(25, 55%, 15%)',
                  borderRadius: '4px 4px 0 0',
                }}
              />
              <div 
                className="absolute top-0"
                style={{ 
                  right: 2,
                  width: 4,
                  height: 4,
                  backgroundColor: 'hsl(25, 60%, 18%)',
                  borderRadius: '4px 4px 0 0',
                  transform: 'rotate(15deg)',
                }}
              />
            </>
          )}

          {/* Back of head (when facing up) */}
          {isFacingUp && (
            <div 
              className="absolute inset-x-0 top-0"
              style={{ 
                height: 12,
                backgroundColor: 'hsl(25, 60%, 18%)',
                borderRadius: '8px 8px 4px 4px',
              }}
            />
          )}

          {/* Face area */}
          {!isFacingUp && (
            <div 
              className="absolute left-1/2 -translate-x-1/2"
              style={{ 
                top: 6,
                width: 14,
                height: 10,
                backgroundColor: 'hsl(25, 45%, 70%)',
                borderRadius: '3px 3px 5px 5px',
              }}
            >
              {/* Eyes */}
              <div className="absolute top-1.5 left-1.5 flex gap-3">
                <div 
                  style={{ 
                    width: 3,
                    height: 3,
                    backgroundColor: 'hsl(220, 80%, 25%)',
                    borderRadius: '50%',
                  }}
                >
                  {/* Eye highlight */}
                  <div 
                    className="absolute top-0 left-0"
                    style={{ 
                      width: 1,
                      height: 1,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                    }}
                  />
                </div>
                <div 
                  style={{ 
                    width: 3,
                    height: 3,
                    backgroundColor: 'hsl(220, 80%, 25%)',
                    borderRadius: '50%',
                  }}
                >
                  <div 
                    className="absolute top-0 left-0"
                    style={{ 
                      width: 1,
                      height: 1,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cap */}
          <div 
            className="absolute -top-1 left-1/2 -translate-x-1/2"
            style={{ 
              width: 20,
              height: 8,
              backgroundColor: 'hsl(0, 75%, 45%)',
              borderRadius: '10px 10px 2px 2px',
            }}
          >
            {/* Cap brim */}
            {!isFacingUp && (
              <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                style={{ 
                  width: 12,
                  height: 3,
                  backgroundColor: 'hsl(0, 70%, 40%)',
                  borderRadius: '2px',
                }}
              />
            )}
            {/* Cap highlight */}
            <div 
              className="absolute top-1 left-2"
              style={{ 
                width: 6,
                height: 2,
                backgroundColor: 'hsl(0, 80%, 55%)',
                borderRadius: '2px',
              }}
            />
            {/* White semicircle logo */}
            <div 
              className="absolute top-2 left-1/2 -translate-x-1/2"
              style={{ 
                width: 6,
                height: 3,
                backgroundColor: 'white',
                borderRadius: '0 0 6px 6px',
              }}
            />
          </div>
        </div>

        {/* === ARMS === */}
        {/* Arms (visible from side) */}
        {(isFacingLeft || isFacingRight || isFacingDown) && (
          <>
            {/* Left arm */}
            <div 
              className={`absolute ${isMoving ? 'animate-arm-swing-slow' : ''}`}
              style={{ 
                top: 14,
                left: 1,
                width: 4,
                height: 10,
                backgroundColor: 'hsl(210, 80%, 45%)',
                borderRadius: '2px 2px 3px 3px',
                transformOrigin: 'top center',
              }}
            >
              {/* Hand */}
              <div 
                className="absolute bottom-0 left-0"
                style={{ 
                  width: 4,
                  height: 3,
                  backgroundColor: 'hsl(25, 45%, 70%)',
                  borderRadius: '2px',
                }}
              />
            </div>
            {/* Right arm */}
            <div 
              className={`absolute ${isMoving ? 'animate-arm-swing-slow-reverse' : ''}`}
              style={{ 
                top: 14,
                right: 1,
                width: 4,
                height: 10,
                backgroundColor: 'hsl(210, 80%, 45%)',
                borderRadius: '2px 2px 3px 3px',
                transformOrigin: 'top center',
              }}
            >
              {/* Hand */}
              <div 
                className="absolute bottom-0 left-0"
                style={{ 
                  width: 4,
                  height: 3,
                  backgroundColor: 'hsl(25, 45%, 70%)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
});
