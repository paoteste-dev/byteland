import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { regions } from '@/data/regions';
import { MapPin, Lock, Star, ArrowLeft, Users, BookOpen } from 'lucide-react';
import mapaByteland from '@/assets/mapa-byteland.png';

const regionPositions: Record<string, { x: string; y: string }> = {
  'vila-dos-dados': { x: '15%', y: '25%' },
  'cidade-conectada': { x: '40%', y: '15%' },
  'reino-da-cloud': { x: '75%', y: '20%' },
  'florestas-de-servidores': { x: '10%', y: '55%' },
  'castelos-de-firewall': { x: '45%', y: '50%' },
  'lago-da-autenticacao': { x: '40%', y: '80%' },
  'dark-web-dungeon': { x: '75%', y: '60%' }
};

const regionColors: Record<string, string> = {
  'vila-dos-dados': 'bg-region-dados',
  'cidade-conectada': 'bg-region-cidade',
  'reino-da-cloud': 'bg-region-cloud',
  'florestas-de-servidores': 'bg-region-floresta',
  'castelos-de-firewall': 'bg-region-firewall',
  'lago-da-autenticacao': 'bg-region-lago',
  'dark-web-dungeon': 'bg-region-darkweb'
};

export function WorldMapScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const handleRegionClick = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (region?.unlocked) {
      dispatch({ type: 'SELECT_REGION', payload: regionId });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'title' })}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-game-title text-2xl text-primary">ByteLand</h1>
              {player && (
                <p className="text-sm text-muted-foreground">
                  {player.name} • Nível {player.level}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'collection' })}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Coleção"
            >
              <Users className="h-5 w-5" />
            </button>
            <button 
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'encyclopedia' })}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Enciclopédia"
            >
              <BookOpen className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Map Image */}
          <img 
            src={mapaByteland} 
            alt="Mapa de ByteLand" 
            className="w-full h-auto"
          />

          {/* Region Markers */}
          {regions.map((region, index) => {
            const pos = regionPositions[region.id];
            if (!pos) return null;

            return (
              <motion.button
                key={region.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleRegionClick(region.id)}
                disabled={!region.unlocked}
                style={{ left: pos.x, top: pos.y }}
                className={`
                  absolute transform -translate-x-1/2 -translate-y-1/2
                  group cursor-pointer
                  ${!region.unlocked ? 'opacity-60' : ''}
                `}
              >
                {/* Marker */}
                <motion.div
                  whileHover={region.unlocked ? { scale: 1.2 } : {}}
                  className={`
                    relative w-10 h-10 md:w-12 md:h-12 rounded-full 
                    ${regionColors[region.id]} 
                    border-4 border-white shadow-lg
                    flex items-center justify-center
                    ${region.unlocked ? 'animate-bounce-slow' : ''}
                  `}
                >
                  {region.unlocked ? (
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  ) : (
                    <Lock className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  )}
                </motion.div>

                {/* Tooltip */}
                <div className="
                  absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                  opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none z-10
                ">
                  <div className="bg-card rounded-lg shadow-lg border border-border px-3 py-2 whitespace-nowrap">
                    <p className="font-bold text-sm">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.theme}</p>
                    {region.boss && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3" />
                        Boss: {region.boss.name}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {regions.slice(0, 4).map(region => (
            <motion.button
              key={region.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRegionClick(region.id)}
              disabled={!region.unlocked}
              className={`
                card-game p-3 text-left
                ${!region.unlocked ? 'opacity-60' : 'hover:border-primary'}
                transition-all
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${regionColors[region.id]}`} />
                <span className="font-bold text-sm">{region.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{region.theme}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
