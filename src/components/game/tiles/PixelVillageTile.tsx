import { memo, useMemo } from 'react';
import { TileType, RegionTheme, TILE_SIZE } from '@/data/tileMapConfig';

interface PixelVillageTileProps {
  type: TileType;
  x: number;
  y: number;
  theme: RegionTheme;
}

// Vibrant pixel art village tiles - colorful cybersecurity theme
export const PixelVillageTile = memo(function PixelVillageTile({ 
  type, 
  x, 
  y, 
  theme,
}: PixelVillageTileProps) {
  const baseStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE,
    top: y * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    imageRendering: 'pixelated',
  }), [x, y]);

  // Seed for deterministic randomness
  const seed = useMemo(() => (x * 31 + y * 17) % 100, [x, y]);
  const isOdd = (x + y) % 2 === 0;

  switch (type) {
    case 'floor':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Cobblestone/brick floor pattern */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: isOdd ? 'hsl(220, 25%, 22%)' : 'hsl(220, 20%, 18%)',
            }}
          />
          {/* Pixel cobblestone pattern */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px p-px">
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i}
                className="rounded-sm"
                style={{ 
                  backgroundColor: `hsl(220, 20%, ${16 + (seed + i) % 10}%)`,
                }}
              />
            ))}
          </div>
          {/* Random glow dots */}
          {seed < 15 && (
            <div 
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{ 
                backgroundColor: theme.glowColor,
                left: (seed % 4) * 12,
                top: ((seed * 3) % 4) * 12,
                boxShadow: `0 0 4px ${theme.glowColor}`,
              }}
            />
          )}
        </div>
      );

    case 'wall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Wall base - colorful brick */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'hsl(280, 40%, 30%)',
            }}
          />
          {/* Brick pattern with color variation */}
          <div className="absolute inset-0 p-0.5">
            <div className="grid grid-cols-2 gap-0.5 h-1/2">
              <div className="rounded-sm" style={{ backgroundColor: 'hsl(280, 45%, 35%)', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2)' }} />
              <div className="rounded-sm" style={{ backgroundColor: 'hsl(280, 50%, 38%)', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2)' }} />
            </div>
            <div className="grid grid-cols-2 gap-0.5 h-1/2 mt-0.5" style={{ marginLeft: '12px' }}>
              <div className="rounded-sm" style={{ backgroundColor: 'hsl(280, 45%, 35%)', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2)' }} />
              <div className="rounded-sm" style={{ backgroundColor: 'hsl(280, 50%, 38%)', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2)' }} />
            </div>
          </div>
          {/* Top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'hsl(280, 50%, 45%)' }} />
          {/* Bottom shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
        </div>
      );

    case 'server':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 25%, 18%)' }} />
          {/* Server rack - tall computer style */}
          <div 
            className="absolute inset-1 rounded flex flex-col"
            style={{ 
              backgroundColor: 'hsl(215, 30%, 20%)',
              boxShadow: 'inset 2px 2px 0 rgba(100,150,255,0.2), inset -2px -2px 0 rgba(0,0,0,0.4)',
            }}
          >
            {/* Monitor section */}
            <div className="flex-1 m-1 rounded relative" style={{ backgroundColor: 'hsl(220, 50%, 12%)' }}>
              {/* Screen content */}
              <div className="absolute inset-0.5 rounded overflow-hidden">
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `radial-gradient(ellipse at center, ${theme.glowColor}40 0%, transparent 70%)`,
                  }}
                />
                {/* Terminal lines */}
                <div className="p-1 text-[3px] font-mono" style={{ color: theme.glowColor }}>
                  <div className="animate-pulse">&gt;_</div>
                </div>
              </div>
            </div>
            {/* LED strip */}
            <div className="flex gap-0.5 px-1 pb-1 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 4px #4ade80' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s', boxShadow: '0 0 4px #22d3ee' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.4s', boxShadow: '0 0 4px #facc15' }} />
            </div>
          </div>
        </div>
      );

    case 'terminal':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 25%, 18%)' }} />
          {/* Desktop computer */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            {/* Monitor */}
            <div 
              className="w-10 h-7 rounded-sm relative"
              style={{ 
                backgroundColor: 'hsl(210, 20%, 25%)',
                boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {/* Screen */}
              <div 
                className="absolute inset-1 rounded-sm overflow-hidden"
                style={{ backgroundColor: 'hsl(220, 60%, 10%)' }}
              >
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `radial-gradient(ellipse at 30% 30%, hsl(180, 100%, 50%, 0.3) 0%, transparent 50%)`,
                  }}
                />
                <div 
                  className="absolute inset-0.5 text-[3px] font-mono animate-pulse"
                  style={{ color: 'hsl(120, 100%, 50%)' }}
                >
                  C:\&gt;
                </div>
              </div>
            </div>
            {/* Stand */}
            <div className="w-2 h-1" style={{ backgroundColor: 'hsl(210, 15%, 30%)' }} />
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: 'hsl(210, 15%, 35%)' }} />
          </div>
        </div>
      );

    case 'tree':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 25%, 18%)' }} />
          {/* Digital tree / Data antenna */}
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            {/* Trunk */}
            <div 
              className="absolute bottom-1 w-3 h-6 rounded-t"
              style={{ 
                backgroundColor: 'hsl(210, 30%, 25%)',
                boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Rings */}
              <div className="absolute top-1 left-0 right-0 h-0.5 bg-cyan-500/30" />
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-cyan-500/30" />
            </div>
            {/* Glowing orb top */}
            <div 
              className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full animate-pulse-glow"
              style={{ 
                background: `radial-gradient(circle at 30% 30%, hsl(180, 100%, 70%) 0%, hsl(200, 100%, 50%) 50%, hsl(220, 80%, 40%) 100%)`,
                boxShadow: `0 0 15px ${theme.glowColor}`,
              }}
            >
              {/* Highlight */}
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      );

    case 'data':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 30%, 16%)' }} />
          {/* Data flow path - road style */}
          <div className="absolute inset-1" style={{ backgroundColor: 'hsl(220, 35%, 20%)' }} />
          {/* Data stream */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-full text-[4px] font-mono leading-tight opacity-60 animate-scroll-data"
              style={{ color: theme.glowColor }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>{seed % 2 === 0 ? '0110' : '1001'}</div>
              ))}
            </div>
          </div>
          {/* Center glow line */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 opacity-50"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${theme.glowColor}, transparent)`,
            }}
          />
        </div>
      );

    case 'lock':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 25%, 18%)' }} />
          {/* Golden lock */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-8 h-10 rounded animate-pulse"
              style={{ 
                background: 'linear-gradient(180deg, hsl(45, 90%, 60%) 0%, hsl(35, 85%, 45%) 100%)',
                boxShadow: '0 0 10px hsl(45, 90%, 50%, 0.5), inset 1px 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              {/* Shackle */}
              <div 
                className="absolute -top-3 left-1.5 right-1.5 h-5 rounded-t-full"
                style={{ 
                  border: '3px solid hsl(40, 80%, 40%)',
                  backgroundColor: 'transparent',
                }}
              />
              {/* Keyhole */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                <div className="w-1.5 h-2 bg-gray-800 mx-auto -mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'boss_zone':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Dark ominous floor */}
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(280, 50%, 10%)' }} />
          {/* Warning pattern */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 4px,
                hsl(300, 70%, 25%) 4px,
                hsl(300, 70%, 25%) 8px
              )`,
            }}
          />
          {/* Pulsing dark glow */}
          <div 
            className="absolute inset-0 animate-pulse"
            style={{ 
              background: 'radial-gradient(circle at center, hsl(300, 100%, 40%, 0.4) 0%, transparent 60%)',
            }}
          />
          {/* Corner crystals */}
          <div className="absolute top-0.5 left-0.5 w-2 h-2 rotate-45 bg-purple-500/80" />
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rotate-45 bg-purple-500/80" />
          <div className="absolute bottom-0.5 left-0.5 w-2 h-2 rotate-45 bg-purple-500/80" />
          <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rotate-45 bg-purple-500/80" />
        </div>
      );

    case 'firewall':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(15, 60%, 15%)' }} />
          {/* Fire effect */}
          <div className="absolute inset-0 flex items-end justify-center">
            {/* Fire base */}
            <div 
              className="absolute bottom-0 inset-x-0 h-full"
              style={{
                background: 'linear-gradient(0deg, hsl(20, 100%, 50%) 0%, hsl(40, 100%, 55%) 40%, hsl(50, 100%, 60%) 70%, transparent 100%)',
                animation: 'firewall-flicker 0.2s infinite alternate',
              }}
            />
            {/* Flame tongues */}
            <div 
              className="absolute bottom-1/3 left-1/4 w-3 h-6 rounded-full opacity-90"
              style={{ 
                background: 'linear-gradient(0deg, hsl(35, 100%, 55%), hsl(45, 100%, 70%))',
                animation: 'flame-dance 0.3s ease-in-out infinite alternate',
              }}
            />
            <div 
              className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4 h-8 rounded-full opacity-95"
              style={{ 
                background: 'linear-gradient(0deg, hsl(30, 100%, 50%), hsl(50, 100%, 65%))',
                animation: 'flame-dance 0.25s ease-in-out infinite alternate-reverse',
              }}
            />
            <div 
              className="absolute bottom-1/3 right-1/4 w-3 h-5 rounded-full opacity-90"
              style={{ 
                background: 'linear-gradient(0deg, hsl(35, 100%, 55%), hsl(45, 100%, 70%))',
                animation: 'flame-dance 0.35s ease-in-out infinite alternate',
              }}
            />
          </div>
        </div>
      );

    case 'water':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          {/* Deep water */}
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(210, 80%, 25%)' }} />
          {/* Wave animation */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 6px,
                  hsl(200, 90%, 45%, 0.3) 6px,
                  hsl(200, 90%, 45%, 0.3) 8px
                )
              `,
              animation: 'water-flow 2s linear infinite',
            }}
          />
          {/* Sparkle */}
          <div 
            className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"
          />
          <div 
            className="absolute bottom-3 right-2 w-1 h-1 rounded-full bg-white/40 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
      );

    case 'cloud':
      return (
        <div style={baseStyle} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 40%, 20%)' }} />
          {/* Fluffy cloud */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative animate-float">
              {/* Cloud body */}
              <div 
                className="w-10 h-5 rounded-full"
                style={{ 
                  background: 'linear-gradient(180deg, hsl(200, 100%, 95%) 0%, hsl(200, 80%, 85%) 100%)',
                  boxShadow: '0 3px 8px rgba(0,100,200,0.3)',
                }}
              />
              {/* Cloud bumps */}
              <div 
                className="absolute -top-2 left-1 w-5 h-5 rounded-full"
                style={{ backgroundColor: 'hsl(200, 100%, 93%)' }}
              />
              <div 
                className="absolute -top-3 right-1 w-6 h-6 rounded-full"
                style={{ backgroundColor: 'hsl(200, 100%, 95%)' }}
              />
              {/* Highlight */}
              <div className="absolute top-0 left-2 w-2 h-1 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div 
          style={{...baseStyle, backgroundColor: 'hsl(220, 25%, 18%)' }}
        />
      );
  }
});
