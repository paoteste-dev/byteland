import { memo, useMemo } from 'react';
import { TILE_SIZE } from '@/data/tileMapConfig';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CreatureType = 'defendo' | 'enemy' | 'boss';

interface PixelCreatureProps {
  type: CreatureType;
  variant: string;
  x: number;
  y: number;
  direction: Direction;
  size?: number;
}

// Creature color schemes - vibrant and distinctive
const creatureStyles: Record<string, {
  bodyColor: string;
  bodyGradient: string;
  eyeColor: string;
  accentColor: string;
  glowColor: string;
  pattern?: string;
}> = {
  // Defendos - Friendly protectors
  passbit: {
    bodyColor: 'hsl(45, 95%, 55%)',
    bodyGradient: 'linear-gradient(180deg, hsl(50, 100%, 65%) 0%, hsl(40, 90%, 50%) 100%)',
    eyeColor: 'hsl(30, 80%, 25%)',
    accentColor: 'hsl(45, 100%, 70%)',
    glowColor: 'hsl(45, 100%, 60%)',
  },
  firecub: {
    bodyColor: 'hsl(15, 100%, 55%)',
    bodyGradient: 'linear-gradient(180deg, hsl(25, 100%, 60%) 0%, hsl(10, 95%, 45%) 100%)',
    eyeColor: 'hsl(0, 0%, 15%)',
    accentColor: 'hsl(40, 100%, 60%)',
    glowColor: 'hsl(20, 100%, 55%)',
  },
  authy: {
    bodyColor: 'hsl(150, 80%, 45%)',
    bodyGradient: 'linear-gradient(180deg, hsl(160, 85%, 55%) 0%, hsl(140, 75%, 40%) 100%)',
    eyeColor: 'hsl(0, 0%, 10%)',
    accentColor: 'hsl(170, 100%, 60%)',
    glowColor: 'hsl(150, 100%, 50%)',
  },
  linklet: {
    bodyColor: 'hsl(200, 90%, 50%)',
    bodyGradient: 'linear-gradient(180deg, hsl(210, 95%, 60%) 0%, hsl(195, 85%, 45%) 100%)',
    eyeColor: 'hsl(220, 100%, 30%)',
    accentColor: 'hsl(180, 100%, 60%)',
    glowColor: 'hsl(200, 100%, 55%)',
  },
  cloudy: {
    bodyColor: 'hsl(200, 100%, 85%)',
    bodyGradient: 'linear-gradient(180deg, hsl(200, 100%, 92%) 0%, hsl(210, 80%, 75%) 100%)',
    eyeColor: 'hsl(210, 80%, 35%)',
    accentColor: 'hsl(200, 100%, 95%)',
    glowColor: 'hsl(200, 100%, 70%)',
  },
  antiviro: {
    bodyColor: 'hsl(120, 80%, 45%)',
    bodyGradient: 'linear-gradient(180deg, hsl(130, 85%, 55%) 0%, hsl(110, 75%, 38%) 100%)',
    eyeColor: 'hsl(0, 0%, 10%)',
    accentColor: 'hsl(90, 100%, 60%)',
    glowColor: 'hsl(120, 100%, 50%)',
  },
  masky: {
    bodyColor: 'hsl(280, 70%, 55%)',
    bodyGradient: 'linear-gradient(180deg, hsl(290, 75%, 65%) 0%, hsl(270, 65%, 45%) 100%)',
    eyeColor: 'hsl(300, 100%, 80%)',
    accentColor: 'hsl(320, 90%, 70%)',
    glowColor: 'hsl(280, 100%, 60%)',
  },
  encryptle: {
    bodyColor: 'hsl(180, 70%, 40%)',
    bodyGradient: 'linear-gradient(180deg, hsl(190, 75%, 50%) 0%, hsl(170, 65%, 35%) 100%)',
    eyeColor: 'hsl(0, 0%, 15%)',
    accentColor: 'hsl(160, 100%, 50%)',
    glowColor: 'hsl(180, 100%, 45%)',
  },
  
  // Enemies - Threatening but cartoonish
  phishling: {
    bodyColor: 'hsl(320, 80%, 50%)',
    bodyGradient: 'linear-gradient(180deg, hsl(330, 85%, 60%) 0%, hsl(310, 75%, 40%) 100%)',
    eyeColor: 'hsl(60, 100%, 50%)',
    accentColor: 'hsl(350, 100%, 55%)',
    glowColor: 'hsl(320, 100%, 55%)',
    pattern: 'warning',
  },
  clickbaiter: {
    bodyColor: 'hsl(45, 100%, 50%)',
    bodyGradient: 'linear-gradient(180deg, hsl(50, 100%, 60%) 0%, hsl(40, 95%, 45%) 100%)',
    eyeColor: 'hsl(0, 0%, 10%)',
    accentColor: 'hsl(30, 100%, 55%)',
    glowColor: 'hsl(45, 100%, 55%)',
    pattern: 'star',
  },
  spambot: {
    bodyColor: 'hsl(200, 80%, 45%)',
    bodyGradient: 'linear-gradient(180deg, hsl(210, 85%, 55%) 0%, hsl(195, 75%, 35%) 100%)',
    eyeColor: 'hsl(0, 100%, 50%)',
    accentColor: 'hsl(180, 100%, 50%)',
    glowColor: 'hsl(200, 100%, 50%)',
    pattern: 'robot',
  },
  malware: {
    bodyColor: 'hsl(0, 80%, 45%)',
    bodyGradient: 'linear-gradient(180deg, hsl(10, 85%, 55%) 0%, hsl(350, 75%, 35%) 100%)',
    eyeColor: 'hsl(60, 100%, 60%)',
    accentColor: 'hsl(20, 100%, 50%)',
    glowColor: 'hsl(0, 100%, 50%)',
    pattern: 'danger',
  },
  datathief: {
    bodyColor: 'hsl(260, 60%, 30%)',
    bodyGradient: 'linear-gradient(180deg, hsl(270, 65%, 40%) 0%, hsl(250, 55%, 22%) 100%)',
    eyeColor: 'hsl(0, 0%, 100%)',
    accentColor: 'hsl(280, 80%, 50%)',
    glowColor: 'hsl(260, 100%, 45%)',
    pattern: 'stealth',
  },
  
  // Bosses - Large and imposing
  'phishling-alfa': {
    bodyColor: 'hsl(300, 70%, 40%)',
    bodyGradient: 'linear-gradient(180deg, hsl(310, 75%, 50%) 0%, hsl(290, 65%, 30%) 100%)',
    eyeColor: 'hsl(0, 100%, 60%)',
    accentColor: 'hsl(330, 100%, 55%)',
    glowColor: 'hsl(300, 100%, 50%)',
    pattern: 'boss',
  },
  masktrick: {
    bodyColor: 'hsl(280, 75%, 35%)',
    bodyGradient: 'linear-gradient(180deg, hsl(290, 80%, 45%) 0%, hsl(270, 70%, 28%) 100%)',
    eyeColor: 'hsl(45, 100%, 60%)',
    accentColor: 'hsl(310, 100%, 60%)',
    glowColor: 'hsl(280, 100%, 55%)',
    pattern: 'boss',
  },
  ransnapper: {
    bodyColor: 'hsl(350, 80%, 40%)',
    bodyGradient: 'linear-gradient(180deg, hsl(0, 85%, 50%) 0%, hsl(340, 75%, 30%) 100%)',
    eyeColor: 'hsl(45, 100%, 55%)',
    accentColor: 'hsl(30, 100%, 55%)',
    glowColor: 'hsl(350, 100%, 50%)',
    pattern: 'boss',
  },
  malwaroo: {
    bodyColor: 'hsl(15, 85%, 45%)',
    bodyGradient: 'linear-gradient(180deg, hsl(25, 90%, 55%) 0%, hsl(5, 80%, 35%) 100%)',
    eyeColor: 'hsl(60, 100%, 50%)',
    accentColor: 'hsl(40, 100%, 55%)',
    glowColor: 'hsl(15, 100%, 50%)',
    pattern: 'boss',
  },
  brutox: {
    bodyColor: 'hsl(0, 70%, 35%)',
    bodyGradient: 'linear-gradient(180deg, hsl(10, 75%, 45%) 0%, hsl(350, 65%, 28%) 100%)',
    eyeColor: 'hsl(0, 100%, 65%)',
    accentColor: 'hsl(20, 100%, 50%)',
    glowColor: 'hsl(0, 100%, 45%)',
    pattern: 'boss',
  },
  authguardian: {
    bodyColor: 'hsl(220, 70%, 40%)',
    bodyGradient: 'linear-gradient(180deg, hsl(230, 75%, 50%) 0%, hsl(210, 65%, 30%) 100%)',
    eyeColor: 'hsl(45, 100%, 60%)',
    accentColor: 'hsl(200, 100%, 55%)',
    glowColor: 'hsl(220, 100%, 50%)',
    pattern: 'boss',
  },
  'zeroday-ghost': {
    bodyColor: 'hsl(270, 50%, 25%)',
    bodyGradient: 'linear-gradient(180deg, hsl(280, 55%, 35%) 0%, hsl(260, 45%, 18%) 100%)',
    eyeColor: 'hsl(300, 100%, 70%)',
    accentColor: 'hsl(290, 100%, 60%)',
    glowColor: 'hsl(280, 100%, 50%)',
    pattern: 'ghost',
  },
};

const defaultStyle = {
  bodyColor: 'hsl(200, 60%, 50%)',
  bodyGradient: 'linear-gradient(180deg, hsl(210, 65%, 60%) 0%, hsl(190, 55%, 40%) 100%)',
  eyeColor: 'hsl(0, 0%, 10%)',
  accentColor: 'hsl(180, 100%, 60%)',
  glowColor: 'hsl(200, 100%, 50%)',
};

export const PixelCreature = memo(function PixelCreature({
  type,
  variant,
  x,
  y,
  direction,
  size = TILE_SIZE - 4,
}: PixelCreatureProps) {
  const style = creatureStyles[variant] || defaultStyle;
  const isBoss = type === 'boss';
  const isEnemy = type === 'enemy' || type === 'boss';
  const actualSize = isBoss ? size + 12 : size;
  
  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: x * TILE_SIZE + (TILE_SIZE - actualSize) / 2,
    top: y * TILE_SIZE + (TILE_SIZE - actualSize) / 2 - (isBoss ? 6 : 0),
    width: actualSize,
    height: actualSize,
    transition: 'left 0.15s ease-out, top 0.15s ease-out',
    zIndex: 50 + y,
  }), [x, y, actualSize, isBoss]);

  const facing = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  const idleAnim = isEnemy ? 'animate-enemy-hover' : 'animate-defendo-float';

  return (
    <div style={containerStyle} className="relative">
      {/* Shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/50 blur-sm"
        style={{ width: actualSize * 0.6, height: actualSize * 0.12 }}
      />
      
      {/* Creature container with idle animation */}
      <div 
        className={`absolute inset-0 ${idleAnim}`}
        style={{ transform: facing }}
      >
        {/* Main body - rounded blob */}
        <div 
          className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-[45%] relative"
          style={{ 
            width: actualSize * 0.85,
            height: actualSize * 0.75,
            background: style.bodyGradient,
            boxShadow: `0 0 ${isBoss ? '20px' : '12px'} ${style.glowColor}`,
          }}
        >
          {/* Body pattern overlay */}
          <div 
            className="absolute inset-2 rounded-[40%] opacity-30"
            style={{ backgroundColor: style.accentColor }}
          />
          
          {/* Eyes container */}
          <div 
            className="absolute flex gap-1.5 items-center justify-center"
            style={{ 
              top: actualSize * 0.15,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Left eye */}
            <div 
              className="rounded-full bg-white flex items-center justify-center relative"
              style={{ 
                width: actualSize * 0.22,
                height: actualSize * 0.22,
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              <div 
                className="rounded-full absolute"
                style={{ 
                  width: actualSize * 0.12,
                  height: actualSize * 0.12,
                  backgroundColor: style.eyeColor,
                }}
              />
              {/* Eye highlight */}
              <div 
                className="absolute rounded-full bg-white"
                style={{ 
                  width: actualSize * 0.05,
                  height: actualSize * 0.05,
                  top: '20%',
                  right: '25%',
                }}
              />
            </div>
            
            {/* Right eye */}
            <div 
              className="rounded-full bg-white flex items-center justify-center relative"
              style={{ 
                width: actualSize * 0.22,
                height: actualSize * 0.22,
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              <div 
                className="rounded-full absolute"
                style={{ 
                  width: actualSize * 0.12,
                  height: actualSize * 0.12,
                  backgroundColor: style.eyeColor,
                }}
              />
              {/* Eye highlight */}
              <div 
                className="absolute rounded-full bg-white"
                style={{ 
                  width: actualSize * 0.05,
                  height: actualSize * 0.05,
                  top: '20%',
                  right: '25%',
                }}
              />
            </div>
          </div>
          
          {/* Mouth/Expression */}
          <div 
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: actualSize * 0.15 }}
          >
            {isEnemy ? (
              // Angry/menacing mouth for enemies
              <div 
                className="rounded-b-full"
                style={{ 
                  width: actualSize * 0.25,
                  height: actualSize * 0.08,
                  backgroundColor: 'hsl(0, 0%, 10%)',
                }}
              >
                {/* Teeth */}
                <div className="flex gap-0.5 justify-center -mt-0.5">
                  <div className="w-1 h-1.5 bg-white rounded-b-sm" />
                  <div className="w-1 h-1.5 bg-white rounded-b-sm" />
                </div>
              </div>
            ) : (
              // Friendly smile for defendos
              <div 
                className="rounded-full"
                style={{ 
                  width: actualSize * 0.18,
                  height: actualSize * 0.1,
                  backgroundColor: style.accentColor,
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.3)',
                }}
              />
            )}
          </div>
          
          {/* Defensive arms/appendages for defendos */}
          {!isEnemy && (
            <>
              <div 
                className="absolute rounded-full animate-arm-wave"
                style={{ 
                  width: actualSize * 0.15,
                  height: actualSize * 0.25,
                  backgroundColor: style.bodyColor,
                  left: -actualSize * 0.08,
                  top: actualSize * 0.25,
                  boxShadow: `inset 2px 2px 0 rgba(255,255,255,0.2)`,
                }}
              />
              <div 
                className="absolute rounded-full animate-arm-wave-reverse"
                style={{ 
                  width: actualSize * 0.15,
                  height: actualSize * 0.25,
                  backgroundColor: style.bodyColor,
                  right: -actualSize * 0.08,
                  top: actualSize * 0.25,
                  boxShadow: `inset 2px 2px 0 rgba(255,255,255,0.2)`,
                }}
              />
            </>
          )}
          
          {/* Enemy tentacles/spikes */}
          {isEnemy && !isBoss && (
            <>
              <div 
                className="absolute animate-tentacle"
                style={{ 
                  width: actualSize * 0.1,
                  height: actualSize * 0.3,
                  background: `linear-gradient(180deg, ${style.bodyColor}, ${style.accentColor})`,
                  left: actualSize * 0.1,
                  top: -actualSize * 0.15,
                  borderRadius: '50% 50% 40% 40%',
                  transformOrigin: 'bottom center',
                }}
              />
              <div 
                className="absolute animate-tentacle"
                style={{ 
                  width: actualSize * 0.1,
                  height: actualSize * 0.25,
                  background: `linear-gradient(180deg, ${style.bodyColor}, ${style.accentColor})`,
                  right: actualSize * 0.1,
                  top: -actualSize * 0.12,
                  borderRadius: '50% 50% 40% 40%',
                  transformOrigin: 'bottom center',
                  animationDelay: '0.2s',
                }}
              />
            </>
          )}
          
          {/* Boss crown/horns */}
          {isBoss && (
            <>
              {/* Crown */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 -top-4 flex gap-0.5"
              >
                <div 
                  className="w-2 h-4 rounded-t-full"
                  style={{ backgroundColor: 'hsl(45, 100%, 50%)', boxShadow: '0 0 6px hsl(45, 100%, 60%)' }}
                />
                <div 
                  className="w-3 h-5 rounded-t-full"
                  style={{ backgroundColor: 'hsl(45, 100%, 55%)', boxShadow: '0 0 8px hsl(45, 100%, 65%)' }}
                />
                <div 
                  className="w-2 h-4 rounded-t-full"
                  style={{ backgroundColor: 'hsl(45, 100%, 50%)', boxShadow: '0 0 6px hsl(45, 100%, 60%)' }}
                />
              </div>
              
              {/* Shoulder spikes */}
              <div 
                className="absolute -left-3 top-1/3 w-3 h-5 rotate-[-30deg]"
                style={{ 
                  background: `linear-gradient(135deg, ${style.accentColor}, ${style.bodyColor})`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              />
              <div 
                className="absolute -right-3 top-1/3 w-3 h-5 rotate-[30deg]"
                style={{ 
                  background: `linear-gradient(135deg, ${style.accentColor}, ${style.bodyColor})`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              />
              
              {/* Boss aura */}
              <div 
                className="absolute -inset-3 rounded-full animate-pulse pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle, ${style.glowColor}40 0%, transparent 70%)`,
                }}
              />
            </>
          )}
        </div>
        
        {/* Floating particles around creature */}
        {isEnemy && (
          <>
            <div 
              className="absolute w-1.5 h-1.5 rounded-full animate-particle-float"
              style={{ 
                backgroundColor: style.accentColor,
                left: '10%',
                top: '20%',
              }}
            />
            <div 
              className="absolute w-1 h-1 rounded-full animate-particle-float"
              style={{ 
                backgroundColor: style.accentColor,
                right: '15%',
                top: '15%',
                animationDelay: '0.5s',
              }}
            />
          </>
        )}
        
        {/* Sparkle for defendos */}
        {!isEnemy && (
          <div 
            className="absolute -top-1 left-1/2 -translate-x-1/2 text-sm animate-spin-slow"
            style={{ color: style.accentColor }}
          >
            ✦
          </div>
        )}
      </div>
    </div>
  );
});
