import { memo, useMemo } from 'react';
import { TILE_SIZE, RegionTheme } from '@/data/tileMapConfig';

interface VillageDecorationsProps {
  mapWidth: number;
  mapHeight: number;
  theme: RegionTheme;
  regionId: string;
}

// Enhanced decorations for a vibrant village map
export const VillageDecorations = memo(function VillageDecorations({
  mapWidth,
  mapHeight,
  theme,
  regionId,
}: VillageDecorationsProps) {
  // Generate decorations based on region
  const decorations = useMemo(() => {
    const items: Array<{
      type: 'lamppost' | 'sign' | 'bush' | 'flower' | 'binary-particle' | 'house';
      x: number;
      y: number;
      variant?: number;
    }> = [];

    // Seed for consistent placement
    const seed = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Add lamp posts
    for (let i = 3; i < mapWidth - 3; i += 5) {
      if ((seed + i) % 3 === 0) {
        items.push({ type: 'lamppost', x: i, y: 2, variant: i % 2 });
        items.push({ type: 'lamppost', x: i, y: mapHeight - 3, variant: i % 2 });
      }
    }

    // Add warning/info signs
    for (let i = 4; i < mapWidth - 4; i += 7) {
      for (let j = 4; j < mapHeight - 4; j += 6) {
        if ((seed + i + j) % 9 === 0) {
          items.push({ type: 'sign', x: i, y: j, variant: (i + j) % 3 });
        }
      }
    }
    
    // Add decorative bushes
    for (let i = 2; i < mapWidth - 2; i += 3) {
      for (let j = 2; j < mapHeight - 2; j += 4) {
        if ((seed * i + j) % 11 === 0) {
          items.push({ type: 'bush', x: i, y: j, variant: (i * j) % 3 });
        }
      }
    }
    
    // Add flowers near paths
    for (let i = 1; i < mapWidth - 1; i += 2) {
      for (let j = 1; j < mapHeight - 1; j += 3) {
        if ((seed + i * 3 + j * 5) % 15 === 0) {
          items.push({ type: 'flower', x: i, y: j, variant: (i + j) % 4 });
        }
      }
    }

    // Add floating binary particles
    for (let i = 0; i < 12; i++) {
      items.push({
        type: 'binary-particle',
        x: (seed * (i + 1) * 7) % mapWidth,
        y: (seed * (i + 1) * 11) % mapHeight,
        variant: i % 4,
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
                style={{ left: left + TILE_SIZE / 2, top: top, zIndex: 6 }}
              >
                <div className="relative">
                  {/* Pole */}
                  <div 
                    className="w-1.5 h-10 mx-auto rounded-t"
                    style={{ 
                      backgroundColor: 'hsl(220, 25%, 30%)',
                      boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.15)',
                    }}
                  />
                  {/* Lamp head */}
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-4 rounded-t-lg"
                    style={{ 
                      background: 'linear-gradient(180deg, hsl(45, 100%, 70%) 0%, hsl(40, 90%, 55%) 100%)',
                      boxShadow: `0 0 15px hsl(45, 100%, 60%, 0.8)`,
                    }}
                  />
                  {/* Light glow effect */}
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full animate-pulse"
                    style={{ 
                      background: `radial-gradient(circle, hsl(45, 100%, 70%, 0.4) 0%, transparent 60%)`,
                    }}
                  />
                </div>
              </div>
            );

          case 'sign':
            const signTypes = ['⚠️', '🔒', '🛡️'];
            const signText = signTypes[decor.variant || 0];
            return (
              <div 
                key={`sign-${index}`}
                className="absolute flex items-center justify-center"
                style={{ 
                  left, 
                  top, 
                  width: TILE_SIZE, 
                  height: TILE_SIZE,
                  zIndex: 6,
                }}
              >
                <div className="relative">
                  {/* Sign post */}
                  <div 
                    className="w-1 h-6 mx-auto rounded"
                    style={{ backgroundColor: 'hsl(25, 60%, 35%)' }}
                  />
                  {/* Sign board */}
                  <div 
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6 rounded flex items-center justify-center"
                    style={{ 
                      background: 'linear-gradient(180deg, hsl(45, 80%, 60%) 0%, hsl(40, 75%, 50%) 100%)',
                      boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
                      border: '2px solid hsl(35, 70%, 40%)',
                    }}
                  >
                    <span className="text-[10px]">{signText}</span>
                  </div>
                </div>
              </div>
            );
            
          case 'bush':
            const bushColors = ['hsl(140, 70%, 35%)', 'hsl(160, 65%, 40%)', 'hsl(130, 75%, 30%)'];
            return (
              <div 
                key={`bush-${index}`}
                className="absolute"
                style={{ 
                  left: left + 4, 
                  top: top + 4, 
                  zIndex: 4,
                }}
              >
                {/* Bush cluster */}
                <div className="relative">
                  <div 
                    className="w-5 h-4 rounded-full"
                    style={{ 
                      backgroundColor: bushColors[decor.variant || 0],
                      boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                  <div 
                    className="absolute -top-1 left-1 w-4 h-3 rounded-full"
                    style={{ backgroundColor: bushColors[(decor.variant || 0) + 1 % 3] }}
                  />
                  <div 
                    className="absolute -top-0.5 right-0 w-3 h-3 rounded-full"
                    style={{ backgroundColor: bushColors[(decor.variant || 0) + 2 % 3] }}
                  />
                </div>
              </div>
            );
            
          case 'flower':
            const flowerColors = ['hsl(340, 80%, 60%)', 'hsl(45, 90%, 60%)', 'hsl(280, 70%, 60%)', 'hsl(200, 80%, 60%)'];
            return (
              <div 
                key={`flower-${index}`}
                className="absolute animate-sway"
                style={{ 
                  left: left + 8, 
                  top: top + 10, 
                  zIndex: 3,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Stem */}
                <div className="w-0.5 h-4 bg-green-600 mx-auto" />
                {/* Flower head */}
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: flowerColors[decor.variant || 0],
                    boxShadow: `0 0 4px ${flowerColors[decor.variant || 0]}`,
                  }}
                >
                  {/* Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-yellow-300" />
                </div>
              </div>
            );

          case 'binary-particle':
            return (
              <div 
                key={`binary-${index}`}
                className="absolute text-[6px] font-mono opacity-30 animate-float-up"
                style={{ 
                  left, 
                  top,
                  color: theme.glowColor,
                  animationDelay: `${(decor.variant || 0) * 0.5}s`,
                }}
              >
                {(decor.variant || 0) % 2 === 0 ? '01' : '10'}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
});
