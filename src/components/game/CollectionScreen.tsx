import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { allDefendos } from '@/data/defendos';
import { ArrowLeft, Lock, Check } from 'lucide-react';

import passbitImg from '@/assets/defendos/passbit.png';
import firecubImg from '@/assets/defendos/firecub.png';
import authyImg from '@/assets/defendos/authy.png';

const defendoImages: Record<string, string> = {
  passbit: passbitImg,
  firecub: firecubImg,
  authy: authyImg
};

const typeColors: Record<string, string> = {
  password: 'bg-type-password',
  network: 'bg-type-network',
  social: 'bg-type-social',
  malware: 'bg-type-malware',
  firewall: 'bg-type-firewall',
  authentication: 'bg-type-auth',
  cloud: 'bg-type-cloud'
};

export function CollectionScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const collectedIds = player?.collection.map(d => d.id) || [];
  const totalDefendos = allDefendos.length;
  const collectedCount = collectedIds.length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-secondary/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: player ? 'worldMap' : 'title' })}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-game-title text-2xl text-primary">Coleção</h1>
              <p className="text-sm text-muted-foreground">
                {collectedCount}/{totalDefendos} Defendos
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(collectedCount / totalDefendos) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <span className="text-sm font-bold">
              {Math.round((collectedCount / totalDefendos) * 100)}%
            </span>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allDefendos.map((defendo, index) => {
            const isCollected = collectedIds.includes(defendo.id);
            const image = defendoImages[defendo.id];

            return (
              <motion.div
                key={defendo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative defendo-card 
                  ${isCollected ? '' : 'opacity-60 grayscale'}
                `}
              >
                {/* Type Badge */}
                <div className={`
                  absolute top-2 right-2 w-6 h-6 rounded-full 
                  ${typeColors[defendo.type]}
                  flex items-center justify-center
                `}>
                  {isCollected ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <Lock className="h-3 w-3 text-white" />
                  )}
                </div>

                {/* Image */}
                <div className="w-20 h-20 mx-auto mb-2">
                  {image ? (
                    <img
                      src={image}
                      alt={defendo.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center text-2xl">
                      ?
                    </div>
                  )}
                </div>

                {/* Name */}
                <p className={`
                  text-center font-bold text-sm
                  ${isCollected ? '' : 'text-muted-foreground'}
                `}>
                  {isCollected ? defendo.name : '???'}
                </p>

                {/* Type */}
                <p className="text-center text-xs text-muted-foreground capitalize">
                  {defendo.type}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {!player && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Começa uma nova aventura para capturar Defendos!
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'title' })}
              className="btn-game-primary"
            >
              Começar Aventura
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
