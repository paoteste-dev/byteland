import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

// Enhanced tile types with encounter zones
export type DetailedTileType = 
  | 'grass' 
  | 'grass_detailed'
  | 'grass_flowers'
  | 'grass_encounter'  // Shaking grass - triggers combat
  | 'path' 
  | 'path_worn'
  | 'tree' 
  | 'tree_shadow'
  | 'water' 
  | 'water_edge'
  | 'flower_red'
  | 'flower_yellow'
  | 'flower_blue'
  | 'fence'
  | 'fence_post'
  | 'rock'
  | 'rock_small'
  | 'sign'
  | 'building_wall'
  | 'building_door'
  | 'building_roof';

interface DetailedTileProps {
  type: DetailedTileType;
  x: number;
  y: number;
  hasEncounter?: boolean;  // Shaking grass indicator
}

// High-detail pixel art tiles with rich textures
export const DetailedTile = memo(function DetailedTile({ 
  type, 
  x, 
  y,
  hasEncounter = false,
}: DetailedTileProps) {
  const baseStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE,
    top: y * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    imageRendering: 'pixelated',
  }), [x, y]);

  // Deterministic seed for variations
  const seed = useMemo(() => (x * 31 + y * 17) % 100, [x, y]);
  const seed2 = useMemo(() => (x * 13 + y * 41) % 100, [x, y]);

  switch (type) {
    // Rich detailed grass with multiple shades
    case 'grass':
    case 'grass_detailed':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Base grass color */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: seed % 3 === 0 ? 'hsl(125, 45%, 42%)' : 'hsl(130, 48%, 45%)',
            }}
          />
          {/* Grass texture - subtle blades */}
          <div className="absolute inset-0">
            {/* Dark grass patches */}
            {seed < 60 && (
              <div 
                className="absolute rounded-full"
                style={{ 
                  backgroundColor: 'hsl(130, 40%, 38%)',
                  width: 4 + (seed % 4),
                  height: 3 + (seed % 3),
                  left: (seed % 8) * 5,
                  top: (seed2 % 8) * 5,
                }}
              />
            )}
            {seed2 > 40 && (
              <div 
                className="absolute rounded-full"
                style={{ 
                  backgroundColor: 'hsl(135, 50%, 50%)',
                  width: 3 + (seed2 % 3),
                  height: 2 + (seed2 % 2),
                  left: ((seed + 20) % 9) * 5,
                  top: ((seed2 + 15) % 9) * 5,
                }}
              />
            )}
            {/* Small grass blade details */}
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: 1,
                  height: 3,
                  backgroundColor: 'hsl(125, 42%, 36%)',
                  left: ((seed + i * 17) % 40) + 4,
                  top: ((seed2 + i * 13) % 38) + 5,
                  borderRadius: '0 0 1px 1px',
                }}
              />
            ))}
          </div>
        </div>
      );

    // Grass with flowers scattered
    case 'grass_flowers':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(130, 48%, 45%)' }}
          />
          {/* Small flowers */}
          {[0, 1, 2].map(i => {
            const flowerX = ((seed + i * 23) % 32) + 8;
            const flowerY = ((seed2 + i * 19) % 32) + 8;
            const color = i % 3 === 0 ? 'hsl(350, 80%, 60%)' : i % 3 === 1 ? 'hsl(50, 90%, 60%)' : 'hsl(200, 80%, 60%)';
            return (
              <div key={i} className="absolute" style={{ left: flowerX, top: flowerY }}>
                <div 
                  style={{ 
                    width: 4, 
                    height: 4, 
                    backgroundColor: color,
                    borderRadius: '50%',
                  }}
                />
                <div 
                  style={{ 
                    position: 'absolute',
                    top: 1,
                    left: 1,
                    width: 2, 
                    height: 2, 
                    backgroundColor: 'hsl(45, 95%, 65%)',
                    borderRadius: '50%',
                  }}
                />
              </div>
            );
          })}
        </div>
      );

    // Encounter grass - shakes to indicate wild creature
    case 'grass_encounter':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(130, 48%, 45%)' }}
          />
          {/* Tall grass that shakes */}
          <div 
            className={`absolute inset-0 flex items-end justify-center ${hasEncounter ? 'animate-grass-shake' : ''}`}
          >
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={hasEncounter ? 'animate-grass-blade' : ''}
                style={{
                  width: 4,
                  height: 18 + (i % 3) * 4,
                  background: `linear-gradient(180deg, hsl(120, 50%, ${35 + (i % 2) * 8}%) 0%, hsl(130, 55%, ${42 + (i % 3) * 5}%) 100%)`,
                  borderRadius: '2px 2px 0 0',
                  marginLeft: i === 0 ? 0 : -1,
                  transform: `rotate(${(i - 2.5) * 6}deg)`,
                  transformOrigin: 'bottom center',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
          {/* Exclamation indicator when encounter is active */}
          {hasEncounter && (
            <div 
              className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce"
              style={{
                width: 10,
                height: 14,
                background: 'linear-gradient(180deg, hsl(45, 100%, 55%) 0%, hsl(35, 95%, 50%) 100%)',
                borderRadius: '3px 3px 50% 50%',
                boxShadow: '0 0 8px hsl(45, 100%, 50%)',
                zIndex: 10,
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 6,
                  backgroundColor: 'hsl(30, 80%, 25%)',
                  borderRadius: '1px',
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 2,
                  backgroundColor: 'hsl(30, 80%, 25%)',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}
        </div>
      );

    // Dirt path with worn texture
    case 'path':
    case 'path_worn':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'hsl(30, 45%, 50%)',
            }}
          />
          {/* Path texture - pebbles and wear */}
          <div className="absolute inset-0">
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: `hsl(30, 40%, ${45 + ((seed + i * 11) % 15)}%)`,
                  width: 2 + (i % 3),
                  height: 2 + ((i + 1) % 2),
                  left: ((seed + i * 19) % 40) + 4,
                  top: ((seed2 + i * 17) % 40) + 4,
                }}
              />
            ))}
            {/* Worn track marks */}
            <div 
              className="absolute"
              style={{
                top: 18,
                left: 8,
                right: 8,
                height: 2,
                backgroundColor: 'hsl(30, 38%, 42%)',
                borderRadius: '1px',
              }}
            />
            <div 
              className="absolute"
              style={{
                top: 28,
                left: 10,
                right: 10,
                height: 2,
                backgroundColor: 'hsl(30, 38%, 42%)',
                borderRadius: '1px',
              }}
            />
          </div>
          {/* Edge grass tufts */}
          {seed % 4 === 0 && (
            <>
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 2,
                  width: 3,
                  height: 5,
                  backgroundColor: 'hsl(130, 45%, 40%)',
                  borderRadius: '2px 2px 0 0',
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 4,
                  width: 2,
                  height: 4,
                  backgroundColor: 'hsl(125, 48%, 42%)',
                  borderRadius: '2px 2px 0 0',
                }}
              />
            </>
          )}
        </div>
      );

    // Detailed tree with depth
    case 'tree':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Grass base */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(130, 48%, 45%)' }}
          />
          {/* Tree canopy layers for depth */}
          <div 
            className="absolute"
            style={{
              top: -16,
              left: -12,
              width: 72,
              height: 56,
            }}
          >
            {/* Back layer - darkest */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: 8,
                left: 8,
                width: 56,
                height: 44,
                background: 'radial-gradient(ellipse at 40% 40%, hsl(120, 45%, 32%) 0%, hsl(115, 40%, 25%) 100%)',
              }}
            />
            {/* Middle layer */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: 12,
                left: 12,
                width: 48,
                height: 40,
                background: 'radial-gradient(ellipse at 35% 35%, hsl(125, 50%, 38%) 0%, hsl(120, 45%, 30%) 100%)',
              }}
            />
            {/* Front layer - lightest */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: 16,
                left: 16,
                width: 40,
                height: 34,
                background: 'radial-gradient(ellipse at 30% 30%, hsl(130, 55%, 45%) 0%, hsl(125, 48%, 36%) 100%)',
              }}
            />
            {/* Highlight spots */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: 34,
                left: 22,
                width: 10,
                height: 8,
                backgroundColor: 'hsl(130, 52%, 52%)',
                opacity: 0.7,
              }}
            />
            <div 
              className="absolute rounded-full"
              style={{
                bottom: 28,
                left: 36,
                width: 8,
                height: 6,
                backgroundColor: 'hsl(135, 50%, 50%)',
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      );

    // Shadow under tree
    case 'tree_shadow':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(130, 48%, 45%)' }}
          />
          {/* Circular shadow */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ 
              width: 40,
              height: 20,
              background: 'radial-gradient(ellipse, hsl(130, 40%, 32%) 0%, transparent 70%)',
            }}
          />
        </div>
      );

    // Animated water with waves
    case 'water':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(180deg, hsl(200, 75%, 45%) 0%, hsl(210, 80%, 40%) 100%)',
            }}
          />
          {/* Animated wave lines */}
          <div 
            className="absolute inset-0 animate-water-shimmer"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  transparent 10px,
                  hsla(200, 90%, 65%, 0.4) 10px,
                  hsla(200, 90%, 65%, 0.4) 12px
                )
              `,
            }}
          />
          {/* Sparkles */}
          {seed < 30 && (
            <div 
              className="absolute animate-twinkle"
              style={{
                left: (seed % 6) * 7 + 5,
                top: (seed2 % 5) * 8 + 5,
                width: 4,
                height: 4,
                background: 'radial-gradient(circle, white 0%, transparent 70%)',
              }}
            />
          )}
          {seed > 60 && (
            <div 
              className="absolute animate-twinkle"
              style={{
                left: ((seed + 20) % 7) * 6 + 3,
                top: ((seed2 + 15) % 6) * 7 + 3,
                width: 3,
                height: 3,
                background: 'radial-gradient(circle, white 0%, transparent 70%)',
                animationDelay: '0.5s',
              }}
            />
          )}
        </div>
      );

    // Water edge with shore
    case 'water_edge':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(200, 75%, 45%)' }}
          />
          {/* Shore foam */}
          <div 
            className="absolute top-0 left-0 right-0 h-3 animate-foam"
            style={{
              background: 'linear-gradient(180deg, hsl(40, 50%, 75%) 0%, hsl(200, 70%, 50%) 100%)',
            }}
          />
          {/* Foam bubbles */}
          <div 
            className="absolute"
            style={{ top: 2, left: 8, width: 4, height: 2, backgroundColor: 'white', borderRadius: '50%', opacity: 0.6 }}
          />
          <div 
            className="absolute"
            style={{ top: 1, left: 20, width: 3, height: 2, backgroundColor: 'white', borderRadius: '50%', opacity: 0.5 }}
          />
          <div 
            className="absolute"
            style={{ top: 3, left: 32, width: 5, height: 2, backgroundColor: 'white', borderRadius: '50%', opacity: 0.6 }}
          />
        </div>
      );

    // Individual flowers
    case 'flower_red':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative animate-flower-sway">
              {/* Stem */}
              <div style={{ position: 'absolute', bottom: -8, left: 4, width: 2, height: 12, backgroundColor: 'hsl(120, 40%, 35%)', borderRadius: '1px' }} />
              {/* Petals */}
              <div style={{ width: 10, height: 10, backgroundColor: 'hsl(350, 85%, 55%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: -2, left: 2, width: 6, height: 6, backgroundColor: 'hsl(355, 90%, 60%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 2, left: -2, width: 6, height: 6, backgroundColor: 'hsl(345, 80%, 50%)', borderRadius: '50%' }} />
              {/* Center */}
              <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, backgroundColor: 'hsl(45, 95%, 55%)', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      );

    case 'flower_yellow':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative animate-flower-sway" style={{ animationDelay: '0.3s' }}>
              <div style={{ position: 'absolute', bottom: -8, left: 4, width: 2, height: 12, backgroundColor: 'hsl(120, 40%, 35%)', borderRadius: '1px' }} />
              <div style={{ width: 10, height: 10, backgroundColor: 'hsl(48, 95%, 55%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: -2, left: 2, width: 6, height: 6, backgroundColor: 'hsl(52, 98%, 60%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 2, left: -2, width: 6, height: 6, backgroundColor: 'hsl(44, 90%, 50%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, backgroundColor: 'hsl(25, 90%, 50%)', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      );

    case 'flower_blue':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative animate-flower-sway" style={{ animationDelay: '0.6s' }}>
              <div style={{ position: 'absolute', bottom: -8, left: 4, width: 2, height: 12, backgroundColor: 'hsl(120, 40%, 35%)', borderRadius: '1px' }} />
              <div style={{ width: 10, height: 10, backgroundColor: 'hsl(220, 80%, 55%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: -2, left: 2, width: 6, height: 6, backgroundColor: 'hsl(225, 85%, 60%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 2, left: -2, width: 6, height: 6, backgroundColor: 'hsl(215, 75%, 50%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, backgroundColor: 'hsl(45, 95%, 60%)', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      );

    // Fence pieces
    case 'fence':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          {/* Fence pickets */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-0.5">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 22,
                  background: 'linear-gradient(90deg, hsl(30, 35%, 50%) 0%, hsl(30, 40%, 60%) 50%, hsl(30, 35%, 45%) 100%)',
                  borderRadius: '2px 2px 0 0',
                  boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.2)',
                }}
              >
                {/* Pointed top */}
                <div 
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: 0,
                    width: 6,
                    height: 6,
                    backgroundColor: 'hsl(30, 38%, 55%)',
                    clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                  }}
                />
              </div>
            ))}
          </div>
          {/* Horizontal beam */}
          <div 
            style={{
              position: 'absolute',
              bottom: 10,
              left: 2,
              right: 2,
              height: 3,
              backgroundColor: 'hsl(30, 35%, 45%)',
              borderRadius: '1px',
            }}
          />
        </div>
      );

    // Rock with detail
    case 'rock':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              style={{
                width: 36,
                height: 28,
                background: 'linear-gradient(135deg, hsl(30, 12%, 55%) 0%, hsl(30, 10%, 42%) 50%, hsl(30, 8%, 35%) 100%)',
                borderRadius: '40% 50% 45% 55%',
                boxShadow: 'inset 3px 3px 6px rgba(255,255,255,0.2), inset -3px -3px 6px rgba(0,0,0,0.3)',
              }}
            >
              {/* Rock highlights */}
              <div 
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 6,
                  width: 8,
                  height: 4,
                  backgroundColor: 'hsl(30, 15%, 62%)',
                  borderRadius: '50%',
                  opacity: 0.6,
                }}
              />
              {/* Crack detail */}
              <div 
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 14,
                  width: 10,
                  height: 1,
                  backgroundColor: 'hsl(30, 8%, 30%)',
                  transform: 'rotate(25deg)',
                }}
              />
            </div>
          </div>
        </div>
      );

    // Signpost
    case 'sign':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          {/* Post */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 24,
              background: 'linear-gradient(90deg, hsl(25, 40%, 40%) 0%, hsl(25, 45%, 50%) 50%, hsl(25, 40%, 38%) 100%)',
            }}
          />
          {/* Sign board */}
          <div 
            style={{
              position: 'absolute',
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 32,
              height: 18,
              background: 'linear-gradient(180deg, hsl(30, 45%, 55%) 0%, hsl(25, 40%, 45%) 100%)',
              borderRadius: '2px',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {/* Text lines */}
            <div style={{ position: 'absolute', top: 4, left: 4, right: 4, height: 2, backgroundColor: 'hsl(30, 30%, 30%)', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', top: 8, left: 4, right: 8, height: 2, backgroundColor: 'hsl(30, 30%, 30%)', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', top: 12, left: 4, right: 12, height: 2, backgroundColor: 'hsl(30, 30%, 30%)', borderRadius: '1px' }} />
          </div>
        </div>
      );

    // Building wall
    case 'building_wall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(180deg, hsl(35, 35%, 82%) 0%, hsl(35, 30%, 75%) 100%)',
            }}
          />
          {/* Window */}
          <div 
            style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 20,
              height: 24,
              backgroundColor: 'hsl(200, 50%, 70%)',
              borderRadius: '2px',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
            }}
          >
            {/* Window frame */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: 'hsl(25, 35%, 45%)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, backgroundColor: 'hsl(25, 35%, 45%)' }} />
            {/* Curtain */}
            <div style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 10, backgroundColor: 'hsl(350, 60%, 70%)', borderRadius: '0 0 2px 2px' }} />
          </div>
        </div>
      );

    // Building door
    case 'building_door':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(35, 30%, 75%)' }}
          />
          {/* Door */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 28,
              height: 38,
              background: 'linear-gradient(180deg, hsl(25, 50%, 40%) 0%, hsl(20, 45%, 32%) 100%)',
              borderRadius: '4px 4px 0 0',
              boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.15)',
            }}
          >
            {/* Door panels */}
            <div style={{ position: 'absolute', top: 4, left: 3, right: 3, height: 14, backgroundColor: 'hsl(25, 45%, 35%)', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 3, right: 3, height: 14, backgroundColor: 'hsl(25, 45%, 35%)', borderRadius: '2px' }} />
            {/* Door knob */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: 4,
                width: 4,
                height: 4,
                backgroundColor: 'hsl(45, 70%, 55%)',
                borderRadius: '50%',
                boxShadow: '0 0 3px hsl(45, 70%, 50%)',
              }}
            />
          </div>
        </div>
      );

    // Roof tile
    case 'building_roof':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(130, 48%, 45%)' }} />
          {/* Roof */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: -4,
              right: -4,
              height: 40,
              background: 'linear-gradient(180deg, hsl(15, 75%, 45%) 0%, hsl(10, 70%, 38%) 100%)',
              clipPath: 'polygon(0% 100%, 50% 10%, 100% 100%)',
            }}
          >
            {/* Roof tiles pattern */}
            {[0, 1, 2].map(row => (
              <div key={row} className="absolute flex" style={{ bottom: row * 10, left: 4 + row * 6, right: 4 + row * 6 }}>
                {[0, 1, 2, 3, 4].slice(0, 5 - row).map(i => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: `hsl(15, ${70 - row * 5}%, ${42 + (i % 2) * 5}%)`,
                      borderRadius: '0 0 3px 3px',
                      marginRight: 1,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div style={{...baseStyle, backgroundColor: 'hsl(130, 48%, 45%)'}} />
      );
  }
});
