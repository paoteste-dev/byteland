import { memo, useMemo } from 'react';
import { TileType, RegionTheme, TILE_SIZE } from '@/data/tileMapConfig';

interface PixelArtTileProps {
  type: TileType;
  x: number;
  y: number;
  theme: RegionTheme;
  variant?: number;
}

// Pixel art styled tiles with enhanced detail
export const PixelArtTile = memo(function PixelArtTile({ 
  type, 
  x, 
  y, 
  theme,
}: PixelArtTileProps) {
  const baseStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE,
    top: y * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    imageRendering: 'pixelated',
  }), [x, y]);

  // Create varied floor patterns
  const floorPattern = useMemo(() => {
    const isOdd = (x + y) % 2 === 0;
    const hasDecor = ((x * 7 + y * 13) % 11) < 2;
    return { isOdd, hasDecor };
  }, [x, y]);

  switch (type) {
    case 'floor':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Base floor with checkered pattern */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: floorPattern.isOdd ? theme.floorColor : theme.floorAccent,
            }}
          />
          {/* Pixel grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, ${theme.glowColor} 1px, transparent 1px),
                linear-gradient(to bottom, ${theme.glowColor} 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px',
            }} />
          </div>
          {/* Random circuit decoration */}
          {floorPattern.hasDecor && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-1 h-1 rounded-full opacity-60"
                style={{ backgroundColor: theme.glowColor, boxShadow: `0 0 4px ${theme.glowColor}` }}
              />
            </div>
          )}
        </div>
      );

    case 'wall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Wall base with 3D effect */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.wallColor }}
          />
          {/* Brick pattern */}
          <div className="absolute inset-0 p-1">
            <div className="grid grid-cols-2 gap-0.5 h-full">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="rounded-sm"
                  style={{ 
                    backgroundColor: theme.wallAccent,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          </div>
          {/* Top edge highlight */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: theme.wallAccent, filter: 'brightness(1.3)' }}
          />
          {/* Bottom shadow */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
            style={{ backgroundColor: 'black' }}
          />
        </div>
      );

    case 'server':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Server rack - pixel art style */}
          <div className="absolute inset-1.5 rounded-sm flex flex-col gap-0.5 p-1"
            style={{ 
              backgroundColor: 'hsl(220, 25%, 18%)',
              boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.4)',
            }}
          >
            {/* LED indicators */}
            <div className="flex gap-0.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 4px #4ade80' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.3s', boxShadow: '0 0 4px #4ade80' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.6s', boxShadow: '0 0 4px #fbbf24' }} />
            </div>
            {/* Drive bays */}
            <div className="flex-1 flex flex-col gap-0.5">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="flex-1 rounded-sm flex items-center px-0.5"
                  style={{ backgroundColor: 'hsl(220, 20%, 25%)' }}
                >
                  <div className="w-full h-0.5 rounded" style={{ backgroundColor: 'hsl(220, 15%, 35%)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'terminal':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Monitor frame */}
          <div className="absolute inset-1.5 rounded-sm overflow-hidden"
            style={{ 
              backgroundColor: 'hsl(220, 20%, 12%)',
              boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.5)',
            }}
          >
            {/* Screen glow */}
            <div 
              className="absolute inset-0.5 rounded-sm"
              style={{ 
                background: `radial-gradient(ellipse at center, ${theme.glowColor}40 0%, ${theme.glowColor}10 40%, transparent 70%)`,
              }}
            />
            {/* Terminal text */}
            <div className="absolute inset-1 flex flex-col gap-0.5">
              <div 
                className="text-[4px] font-mono animate-pulse"
                style={{ color: theme.glowColor }}
              >
                &gt;_
              </div>
              <div 
                className="h-0.5 w-6 rounded opacity-60"
                style={{ backgroundColor: theme.glowColor }}
              />
              <div 
                className="h-0.5 w-4 rounded opacity-40"
                style={{ backgroundColor: theme.glowColor }}
              />
            </div>
          </div>
          {/* Stand */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1 rounded-t"
            style={{ backgroundColor: 'hsl(220, 15%, 20%)' }}
          />
        </div>
      );

    case 'tree':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Digital tree/data node */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Trunk/pillar */}
            <div 
              className="absolute bottom-1 w-2.5 h-5"
              style={{ 
                backgroundColor: 'hsl(220, 20%, 25%)',
                boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.15)',
              }}
            />
            {/* Data orb */}
            <div 
              className="absolute top-1.5 w-7 h-7 rounded-full animate-pulse-glow"
              style={{ 
                backgroundColor: theme.decorColor,
                boxShadow: `0 0 12px ${theme.glowColor}, inset 2px 2px 4px rgba(255,255,255,0.3)`,
              }}
            >
              {/* Inner highlight */}
              <div 
                className="absolute top-1 left-1 w-2 h-2 rounded-full opacity-60"
                style={{ backgroundColor: 'white' }}
              />
            </div>
          </div>
        </div>
      );

    case 'data':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorAccent }}
          />
          {/* Data stream effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-full text-[3px] font-mono leading-tight opacity-50 animate-scroll-data"
              style={{ color: theme.glowColor }}
            >
              {Array(8).fill(null).map((_, i) => (
                <div key={i}>{'01'.repeat(10)}</div>
              ))}
            </div>
          </div>
          {/* Glow overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ 
              background: `radial-gradient(circle at center, ${theme.glowColor} 0%, transparent 70%)`,
            }}
          />
        </div>
      );

    case 'lock':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Lock body */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-7 h-9 rounded-sm animate-pulse"
              style={{ 
                backgroundColor: 'hsl(45, 80%, 50%)',
                boxShadow: '0 0 8px hsl(45, 90%, 60%), inset 2px 2px 0 rgba(255,255,255,0.3)',
              }}
            >
              {/* Shackle */}
              <div 
                className="absolute -top-2.5 left-1 right-1 h-4 rounded-t-full border-3"
                style={{ 
                  borderColor: 'hsl(45, 70%, 40%)', 
                  backgroundColor: 'transparent',
                  borderWidth: '3px',
                }}
              />
              {/* Keyhole */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="w-2 h-2 rounded-full bg-gray-800" />
                <div className="w-1 h-1.5 bg-gray-800 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'boss_zone':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(0, 40%, 12%)' }}
          />
          {/* Danger stripes */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 3px,
                hsl(0, 60%, 25%) 3px,
                hsl(0, 60%, 25%) 6px
              )`,
            }}
          />
          {/* Pulsing warning glow */}
          <div 
            className="absolute inset-0 animate-pulse"
            style={{ 
              background: 'radial-gradient(circle at center, hsl(0, 100%, 40%, 0.4) 0%, transparent 60%)',
            }}
          />
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 opacity-80" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 opacity-80" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-500 opacity-80" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 opacity-80" />
        </div>
      );

    case 'firewall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Fire barrier */}
          <div 
            className="absolute inset-0.5 rounded"
            style={{
              background: 'linear-gradient(180deg, hsl(30, 100%, 55%) 0%, hsl(15, 100%, 50%) 50%, hsl(0, 100%, 45%) 100%)',
              animation: 'firewall-flicker 0.3s infinite alternate',
            }}
          >
            {/* Flame tips */}
            <div className="absolute -top-1 left-1/4 w-2 h-3 rounded-full opacity-80"
              style={{ backgroundColor: 'hsl(40, 100%, 60%)' }} />
            <div className="absolute -top-2 left-1/2 w-2 h-4 rounded-full opacity-90"
              style={{ backgroundColor: 'hsl(35, 100%, 55%)' }} />
            <div className="absolute -top-1 right-1/4 w-2 h-3 rounded-full opacity-80"
              style={{ backgroundColor: 'hsl(40, 100%, 60%)' }} />
          </div>
        </div>
      );

    case 'water':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(200, 70%, 25%)' }}
          />
          {/* Water wave pattern */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  hsl(200, 80%, 45%, 0.3) 2px,
                  transparent 4px
                )
              `,
              animation: 'water-flow 1.5s linear infinite',
            }}
          />
          {/* Ripple effect */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, hsl(200, 100%, 60%) 0%, transparent 50%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      );

    case 'cloud':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Cloud platform */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative animate-float">
              {/* Main cloud body */}
              <div 
                className="w-9 h-5 rounded-full"
                style={{ 
                  backgroundColor: 'hsl(200, 100%, 95%)',
                  boxShadow: '0 2px 8px rgba(0,150,255,0.3)',
                }}
              />
              {/* Cloud bump left */}
              <div 
                className="absolute -top-1.5 left-1 w-4 h-4 rounded-full"
                style={{ backgroundColor: 'hsl(200, 100%, 95%)' }}
              />
              {/* Cloud bump right */}
              <div 
                className="absolute -top-2 right-1.5 w-5 h-5 rounded-full"
                style={{ backgroundColor: 'hsl(200, 100%, 95%)' }}
              />
            </div>
          </div>
        </div>
      );

    // House tile - new!
    case 'house' as TileType:
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* House structure */}
          <div className="absolute inset-1 flex flex-col items-center">
            {/* Roof */}
            <div 
              className="w-10 h-0 border-l-[20px] border-r-[20px] border-b-[10px]"
              style={{ 
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'hsl(15, 60%, 45%)',
              }}
            />
            {/* Building */}
            <div 
              className="w-8 h-6 relative"
              style={{ 
                backgroundColor: 'hsl(30, 30%, 85%)',
                boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.5)',
              }}
            >
              {/* Window */}
              <div className="absolute top-1 left-1 w-2 h-2 rounded-sm"
                style={{ backgroundColor: 'hsl(200, 100%, 70%)', boxShadow: '0 0 4px hsl(200, 100%, 60%)' }} />
              {/* Door */}
              <div className="absolute bottom-0 right-1.5 w-2.5 h-3 rounded-t-sm"
                style={{ backgroundColor: 'hsl(25, 60%, 35%)' }} />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div 
          style={{...baseStyle, backgroundColor: theme.floorColor }}
        />
      );
  }
});
