import { memo } from 'react';
import { TileType, RegionTheme, TILE_SIZE } from '@/data/tileMapConfig';

interface TileRendererProps {
  type: TileType;
  x: number;
  y: number;
  theme: RegionTheme;
  variant?: number;
}

export const TileRenderer = memo(function TileRenderer({ 
  type, 
  x, 
  y, 
  theme,
  variant = 0 
}: TileRendererProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: x * TILE_SIZE,
    top: y * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
  };

  switch (type) {
    case 'floor':
      return (
        <div 
          style={style}
          className="relative"
        >
          {/* Base floor */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: (x + y) % 2 === 0 ? theme.floorColor : theme.floorAccent,
            }}
          />
          {/* Grid lines */}
          <div 
            className="absolute inset-0 border-r border-b opacity-20"
            style={{ borderColor: theme.glowColor }}
          />
          {/* Random data bits */}
          {Math.random() > 0.8 && (
            <div 
              className="absolute text-[6px] opacity-30 font-mono"
              style={{ 
                color: theme.glowColor,
                top: Math.random() * 30 + 5,
                left: Math.random() * 30 + 5,
              }}
            >
              {Math.random() > 0.5 ? '01' : '10'}
            </div>
          )}
        </div>
      );

    case 'wall':
      return (
        <div style={style} className="relative">
          {/* Wall base */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.wallColor }}
          />
          {/* Wall pattern - bricks */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px p-1">
            <div style={{ backgroundColor: theme.wallAccent }} className="rounded-sm" />
            <div style={{ backgroundColor: theme.wallAccent }} className="rounded-sm" />
            <div style={{ backgroundColor: theme.wallAccent }} className="rounded-sm" />
            <div style={{ backgroundColor: theme.wallAccent }} className="rounded-sm" />
          </div>
          {/* Top highlight */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: theme.wallAccent }}
          />
        </div>
      );

    case 'server':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Server rack */}
          <div 
            className="absolute inset-2 rounded-sm flex flex-col justify-between p-1"
            style={{ backgroundColor: 'hsl(220, 30%, 25%)' }}
          >
            {/* Server lights */}
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            {/* Server slots */}
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-700 rounded-sm" />
              <div className="h-1.5 bg-gray-700 rounded-sm" />
              <div className="h-1.5 bg-gray-700 rounded-sm" />
            </div>
          </div>
        </div>
      );

    case 'terminal':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Terminal screen */}
          <div 
            className="absolute inset-2 rounded-sm overflow-hidden"
            style={{ backgroundColor: 'hsl(220, 50%, 10%)' }}
          >
            {/* Screen glow */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{ 
                background: `radial-gradient(ellipse at center, ${theme.glowColor} 0%, transparent 70%)`,
              }}
            />
            {/* Terminal text */}
            <div className="p-1 text-[5px] font-mono" style={{ color: theme.glowColor }}>
              <div className="animate-pulse">&gt;_</div>
            </div>
          </div>
        </div>
      );

    case 'tree':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Digital tree/antenna */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Trunk */}
            <div 
              className="absolute bottom-2 w-2 h-4 rounded-t"
              style={{ backgroundColor: 'hsl(30, 40%, 30%)' }}
            />
            {/* Canopy - digital orb */}
            <div 
              className="absolute top-2 w-6 h-6 rounded-full animate-pulse"
              style={{ 
                backgroundColor: theme.decorColor,
                boxShadow: `0 0 10px ${theme.glowColor}`,
              }}
            />
          </div>
        </div>
      );

    case 'data':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorAccent }}
          />
          {/* Data stream effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-full h-full opacity-40 text-[4px] font-mono leading-none animate-scroll-data"
              style={{ color: theme.glowColor }}
            >
              01100101 11001010 00110101
            </div>
          </div>
        </div>
      );

    case 'lock':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Lock icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-6 h-8 rounded-sm relative animate-pulse"
              style={{ backgroundColor: 'hsl(45, 80%, 50%)' }}
            >
              {/* Lock shackle */}
              <div 
                className="absolute -top-2 left-1 right-1 h-3 rounded-t-full border-2"
                style={{ borderColor: 'hsl(45, 70%, 40%)', backgroundColor: 'transparent' }}
              />
              {/* Keyhole */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-gray-800 rounded-sm" />
            </div>
          </div>
        </div>
      );

    case 'boss_zone':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(0, 50%, 15%)' }}
          />
          {/* Danger pattern */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 4px,
                hsl(0, 70%, 25%) 4px,
                hsl(0, 70%, 25%) 8px
              )`,
            }}
          />
          {/* Pulsing glow */}
          <div 
            className="absolute inset-0 animate-pulse opacity-30"
            style={{ 
              background: 'radial-gradient(circle at center, hsl(0, 100%, 50%) 0%, transparent 70%)',
            }}
          />
        </div>
      );

    case 'firewall':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Firewall barrier */}
          <div 
            className="absolute inset-1 rounded"
            style={{
              background: `linear-gradient(180deg, hsl(15, 100%, 50%) 0%, hsl(30, 100%, 50%) 50%, hsl(15, 100%, 50%) 100%)`,
              animation: 'firewall-flicker 0.5s infinite alternate',
            }}
          />
        </div>
      );

    case 'water':
      return (
        <div style={style} className="relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(200, 70%, 30%)' }}
          />
          {/* Water waves */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 4px,
                hsl(200, 80%, 50%) 4px,
                hsl(200, 80%, 50%) 6px
              )`,
              animation: 'water-flow 2s linear infinite',
            }}
          />
        </div>
      );

    case 'cloud':
      return (
        <div style={style} className="relative">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: theme.floorColor }}
          />
          {/* Cloud icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-8 h-5 rounded-full opacity-80 animate-float"
              style={{ backgroundColor: 'hsl(200, 100%, 90%)' }}
            >
              <div 
                className="absolute -top-1 left-2 w-4 h-4 rounded-full"
                style={{ backgroundColor: 'hsl(200, 100%, 90%)' }}
              />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div 
          style={{...style, backgroundColor: theme.floorColor }}
        />
      );
  }
});
