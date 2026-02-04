import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

// Tile types for Pokemon-style map
export type PokemonTileType = 
  | 'grass' 
  | 'grass_tall' 
  | 'path' 
  | 'path_corner'
  | 'tree' 
  | 'tree_trunk'
  | 'water' 
  | 'flower_red'
  | 'flower_yellow'
  | 'fence'
  | 'house_wall'
  | 'house_roof'
  | 'sign'
  | 'rock'
  | 'cliff';

interface PokemonStyleTileProps {
  type: PokemonTileType;
  x: number;
  y: number;
}

// Pokemon FireRed/LeafGreen style tiles with CSS pixel art
export const PokemonStyleTile = memo(function PokemonStyleTile({ 
  type, 
  x, 
  y,
}: PokemonStyleTileProps) {
  const baseStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE,
    top: y * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    imageRendering: 'pixelated',
  }), [x, y]);

  // Seed for subtle variations
  const seed = useMemo(() => (x * 31 + y * 17) % 100, [x, y]);

  switch (type) {
    // Basic grass - light green base with subtle texture
    case 'grass':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'hsl(140, 45%, 48%)',
            }}
          />
          {/* Grass texture pattern */}
          <div className="absolute inset-0">
            {/* Subtle grass blades */}
            {seed < 40 && (
              <div 
                className="absolute w-1 h-1.5 rounded-t-full"
                style={{ 
                  backgroundColor: 'hsl(140, 50%, 42%)',
                  left: (seed % 6) * 7 + 4,
                  top: ((seed * 3) % 5) * 8 + 4,
                }}
              />
            )}
            {seed > 30 && seed < 70 && (
              <div 
                className="absolute w-1 h-1"
                style={{ 
                  backgroundColor: 'hsl(140, 55%, 52%)',
                  left: ((seed + 10) % 7) * 6 + 2,
                  top: ((seed * 2 + 5) % 6) * 7 + 2,
                }}
              />
            )}
          </div>
        </div>
      );

    // Tall grass - darker with visible grass pattern
    case 'grass_tall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Tall grass blades pattern */}
          <div className="absolute inset-0 flex flex-wrap items-end justify-center gap-0.5 pb-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="relative"
                style={{
                  width: 6,
                  height: 20 + (i % 3) * 4,
                }}
              >
                {/* Grass blade */}
                <div 
                  className="absolute bottom-0 w-1.5 rounded-t-full"
                  style={{ 
                    height: '100%',
                    backgroundColor: i % 2 === 0 ? 'hsl(130, 55%, 35%)' : 'hsl(135, 50%, 40%)',
                    transform: `rotate(${(i - 2.5) * 4}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                />
                {/* Highlight */}
                <div 
                  className="absolute bottom-2 left-0.5 w-0.5 rounded-full"
                  style={{ 
                    height: 8,
                    backgroundColor: 'hsl(130, 45%, 50%)',
                    transform: `rotate(${(i - 2.5) * 4}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );

    // Dirt/sand path
    case 'path':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'hsl(35, 50%, 55%)',
            }}
          />
          {/* Path texture - sandy pebbles */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{ 
                  backgroundColor: `hsl(35, 45%, ${50 + (seed + i * 11) % 15}%)`,
                  width: 3 + (i % 2),
                  height: 2 + (i % 2),
                  left: ((seed + i * 17) % 40) + 4,
                  top: ((seed + i * 13) % 40) + 4,
                }}
              />
            ))}
          </div>
          {/* Edge shadows */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: 'hsl(35, 40%, 48%)' }}
          />
        </div>
      );

    // Large tree top (covers multiple tiles visually)
    case 'tree':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Grass base behind tree */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Tree foliage - big round shape */}
          <div 
            className="absolute -inset-4 rounded-full"
            style={{ 
              background: `radial-gradient(ellipse at 35% 35%, 
                hsl(130, 55%, 45%) 0%, 
                hsl(125, 50%, 38%) 40%, 
                hsl(120, 45%, 30%) 100%)`,
              boxShadow: 'inset -4px -4px 12px rgba(0,0,0,0.3), inset 3px 3px 8px rgba(255,255,255,0.1)',
            }}
          >
            {/* Light patches */}
            <div 
              className="absolute top-2 left-3 w-4 h-3 rounded-full"
              style={{ backgroundColor: 'hsl(130, 55%, 50%)', opacity: 0.5 }}
            />
            <div 
              className="absolute top-4 left-6 w-3 h-2 rounded-full"
              style={{ backgroundColor: 'hsl(130, 50%, 52%)', opacity: 0.4 }}
            />
          </div>
          {/* Tree canopy bumps */}
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-8 rounded-full"
            style={{ 
              backgroundColor: 'hsl(125, 50%, 40%)',
            }}
          />
          <div 
            className="absolute -top-1 -left-2 w-8 h-7 rounded-full"
            style={{ 
              backgroundColor: 'hsl(130, 48%, 38%)',
            }}
          />
          <div 
            className="absolute -top-1 -right-2 w-8 h-7 rounded-full"
            style={{ 
              backgroundColor: 'hsl(128, 50%, 36%)',
            }}
          />
        </div>
      );

    // Tree trunk (base of tree)
    case 'tree_trunk':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Shadow under tree */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="w-10 h-4 rounded-full"
              style={{ backgroundColor: 'hsl(140, 40%, 32%)' }}
            />
          </div>
        </div>
      );

    // Water tile with wave animation
    case 'water':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'hsl(200, 70%, 50%)',
            }}
          />
          {/* Wave pattern */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  transparent 8px,
                  hsl(200, 75%, 60%) 8px,
                  hsl(200, 75%, 60%) 10px,
                  transparent 10px,
                  transparent 16px
                )
              `,
              animation: 'water-wave 1.5s linear infinite',
            }}
          />
          {/* Sparkle */}
          {seed < 20 && (
            <div 
              className="absolute w-2 h-2 animate-pulse"
              style={{ 
                backgroundColor: 'white',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                left: (seed % 6) * 6 + 4,
                top: ((seed * 3) % 5) * 8 + 4,
              }}
            />
          )}
        </div>
      );

    // Red flower on grass
    case 'flower_red':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Flower cluster */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Flower petals */}
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: 'hsl(350, 80%, 55%)' }}
              />
              <div 
                className="absolute top-0 left-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: 'hsl(355, 85%, 60%)' }}
              />
              <div 
                className="absolute top-2 left-0 w-3 h-3 rounded-full"
                style={{ backgroundColor: 'hsl(345, 75%, 50%)' }}
              />
              {/* Center */}
              <div 
                className="absolute top-1 left-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: 'hsl(45, 90%, 60%)' }}
              />
            </div>
          </div>
        </div>
      );

    // Yellow flower on grass
    case 'flower_yellow':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Flower cluster */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Yellow petals */}
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: 'hsl(45, 95%, 55%)' }}
              />
              <div 
                className="absolute top-0 left-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: 'hsl(50, 90%, 60%)' }}
              />
              <div 
                className="absolute top-2 left-0 w-3 h-3 rounded-full"
                style={{ backgroundColor: 'hsl(40, 85%, 50%)' }}
              />
              {/* Orange center */}
              <div 
                className="absolute top-1 left-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: 'hsl(25, 90%, 50%)' }}
              />
            </div>
          </div>
        </div>
      );

    // Fence piece
    case 'fence':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Wooden fence */}
          <div className="absolute inset-x-0 bottom-2 h-8 flex justify-center gap-1">
            {/* Fence posts */}
            <div 
              className="w-2 h-full rounded-t"
              style={{ 
                backgroundColor: 'hsl(25, 40%, 40%)',
                boxShadow: 'inset 1px 0 0 hsl(25, 35%, 50%)',
              }}
            />
            <div 
              className="w-2 h-full rounded-t"
              style={{ 
                backgroundColor: 'hsl(25, 40%, 38%)',
                boxShadow: 'inset 1px 0 0 hsl(25, 35%, 48%)',
              }}
            />
            <div 
              className="w-2 h-full rounded-t"
              style={{ 
                backgroundColor: 'hsl(25, 40%, 40%)',
                boxShadow: 'inset 1px 0 0 hsl(25, 35%, 50%)',
              }}
            />
          </div>
          {/* Horizontal beam */}
          <div 
            className="absolute inset-x-1 bottom-5 h-1.5"
            style={{ backgroundColor: 'hsl(25, 35%, 45%)' }}
          />
        </div>
      );

    // Rock/boulder
    case 'rock':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Large rock */}
          <div className="absolute inset-1 flex items-center justify-center">
            <div 
              className="w-10 h-8 rounded-lg relative"
              style={{ 
                background: 'linear-gradient(135deg, hsl(30, 10%, 55%) 0%, hsl(30, 8%, 40%) 100%)',
                boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {/* Rock highlight */}
              <div 
                className="absolute top-1 left-2 w-3 h-2 rounded-full"
                style={{ backgroundColor: 'hsl(30, 12%, 65%)', opacity: 0.6 }}
              />
            </div>
          </div>
        </div>
      );

    // Cliff edge
    case 'cliff':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Cliff face */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(180deg, hsl(30, 20%, 50%) 0%, hsl(25, 15%, 35%) 100%)',
            }}
          />
          {/* Cliff texture lines */}
          <div 
            className="absolute inset-x-0 top-2 h-1"
            style={{ backgroundColor: 'hsl(30, 15%, 45%)' }}
          />
          <div 
            className="absolute inset-x-0 top-5 h-0.5"
            style={{ backgroundColor: 'hsl(30, 12%, 40%)' }}
          />
          {/* Grass on top edge */}
          <div 
            className="absolute inset-x-0 top-0 h-2"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Grass tufts */}
          <div className="absolute top-0 left-2 w-1 h-3 rounded-b-full" style={{ backgroundColor: 'hsl(130, 50%, 38%)' }} />
          <div className="absolute top-0 left-5 w-1 h-2 rounded-b-full" style={{ backgroundColor: 'hsl(135, 48%, 40%)' }} />
          <div className="absolute top-0 right-3 w-1 h-3 rounded-b-full" style={{ backgroundColor: 'hsl(128, 52%, 36%)' }} />
        </div>
      );

    // House wall
    case 'house_wall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'hsl(35, 40%, 80%)',
            }}
          />
          {/* Window */}
          <div className="absolute inset-2 flex items-center justify-center">
            <div 
              className="w-6 h-5 rounded-sm"
              style={{ 
                backgroundColor: 'hsl(200, 60%, 70%)',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)',
              }}
            >
              {/* Window frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-full" style={{ backgroundColor: 'hsl(25, 30%, 45%)' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5" style={{ backgroundColor: 'hsl(25, 30%, 45%)' }} />
              </div>
            </div>
          </div>
        </div>
      );

    // House roof
    case 'house_roof':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Roof triangle */}
          <div 
            className="absolute inset-x-0 bottom-0 h-10"
            style={{ 
              backgroundColor: 'hsl(15, 70%, 45%)',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
            }}
          />
          {/* Roof highlight */}
          <div 
            className="absolute left-0 bottom-0 w-6 h-8"
            style={{ 
              backgroundColor: 'hsl(15, 65%, 50%)',
              clipPath: 'polygon(0% 100%, 50% 0%, 50% 100%)',
            }}
          />
        </div>
      );

    // Sign post
    case 'sign':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(140, 45%, 48%)' }}
          />
          {/* Sign post */}
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            {/* Post */}
            <div 
              className="w-1.5 h-6"
              style={{ backgroundColor: 'hsl(25, 35%, 40%)' }}
            />
          </div>
          {/* Sign board */}
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-5 rounded-sm"
            style={{ 
              backgroundColor: 'hsl(25, 40%, 50%)',
              boxShadow: 'inset 1px 1px 0 hsl(25, 35%, 60%)',
            }}
          >
            {/* Text lines */}
            <div className="absolute inset-1 flex flex-col gap-0.5 justify-center">
              <div className="h-0.5 bg-gray-800/40 rounded" />
              <div className="h-0.5 bg-gray-800/40 rounded w-3/4" />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div 
          style={{...baseStyle, backgroundColor: 'hsl(140, 45%, 48%)' }}
        />
      );
  }
});
