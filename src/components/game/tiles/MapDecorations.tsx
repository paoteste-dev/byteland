import { memo, useMemo } from 'react';
import { TILE_SIZE, RegionTheme } from '@/data/tileMapConfig';

interface MapDecorationsProps {
  mapWidth: number;
  mapHeight: number;
  theme: RegionTheme;
  regionId: string;
}

// Decorative elements for the map (lamp posts, signs, etc.)
export const MapDecorations = memo(function MapDecorations({
  mapWidth,
  mapHeight,
  theme,
  regionId,
}: MapDecorationsProps) {
  // Generate decorations based on region
  const decorations = useMemo(() => {
    const items: Array<{
      type: 'lamppost' | 'sign' | 'gps' | 'shield' | 'binary';
      x: number;
      y: number;
    }> = [];

    // Seed-based placement for consistency
    const seed = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Add lamp posts along edges
    for (let i = 2; i < mapWidth - 2; i += 4) {
      if ((seed + i) % 3 === 0) {
        items.push({ type: 'lamppost', x: i, y: 1 });
        items.push({ type: 'lamppost', x: i, y: mapHeight - 2 });
      }
    }

    // Add warning signs
    for (let i = 3; i < mapWidth - 3; i += 6) {
      for (let j = 3; j < mapHeight - 3; j += 5) {
        if ((seed + i + j) % 7 === 0) {
          items.push({ type: 'sign', x: i, y: j });
        }
      }
    }

    // Add floating binary particles
    for (let i = 0; i < 8; i++) {
      items.push({
        type: 'binary',
        x: (seed * (i + 1) * 7) % mapWidth,
        y: (seed * (i + 1) * 11) % mapHeight,
      });
    }

    return items;
  }, [mapWidth, mapHeight, regionId]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {decorations.map((decor, index) => {
        const left = decor.x * TILE_SIZE;
        const top = decor.y * TILE_SIZE;

        switch (decor.type) {
          case 'lamppost':
            return (
              <div 
                key={`lamp-${index}`}
                className="absolute"
                style={{ left: left + TILE_SIZE / 2, top: top, zIndex: 5 }}
              >
                {/* Lamp post */}
                <div className="relative">
                  <div 
                    className="w-1 h-8 mx-auto"
                    style={{ backgroundColor: 'hsl(220, 20%, 30%)' }}
                  />
                  {/* Lamp head */}
                  <div 
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-3 rounded-t-full"
                    style={{ backgroundColor: 'hsl(220, 15%, 40%)' }}
                  />
                  {/* Light glow */}
                  <div 
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full opacity-40 animate-pulse"
                    style={{ 
                      background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
                    }}
                  />
                </div>
              </div>
            );

          case 'sign':
            return (
              <div 
                key={`sign-${index}`}
                className="absolute flex items-center justify-center"
                style={{ 
                  left, 
                  top, 
                  width: TILE_SIZE, 
                  height: TILE_SIZE,
                  zIndex: 4,
                }}
              >
                <div className="relative">
                  {/* Sign post */}
                  <div 
                    className="w-0.5 h-5 mx-auto"
                    style={{ backgroundColor: 'hsl(220, 20%, 35%)' }}
                  />
                  {/* Sign board */}
                  <div 
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-4 rounded-sm flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'hsl(45, 80%, 55%)',
                      boxShadow: '1px 1px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="text-[6px] font-bold text-gray-800">⚠️</span>
                  </div>
                </div>
              </div>
            );

          case 'binary':
            return (
              <div 
                key={`binary-${index}`}
                className="absolute text-[8px] font-mono opacity-20 animate-float"
                style={{ 
                  left, 
                  top,
                  color: theme.glowColor,
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                {Math.random() > 0.5 ? '01' : '10'}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
});
