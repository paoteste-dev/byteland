import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { starterDefendos } from '@/data/defendos';
import { Defendo } from '@/data/gameTypes';
import { ChevronLeft, ChevronRight, Check, Zap, Shield, Heart } from 'lucide-react';

// Import defendo images
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
  firewall: 'bg-type-firewall',
  authentication: 'bg-type-auth'
};

export function StarterSelectScreen() {
  const { dispatch } = useGame();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);

  const currentDefendo = starterDefendos[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex(prev => (prev === 0 ? starterDefendos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => (prev === starterDefendos.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = () => {
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    dispatch({
      type: 'START_GAME',
      payload: { name: 'Jogador', starterDefendo: currentDefendo }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-secondary via-background to-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="font-game-title text-4xl md:text-5xl text-primary mb-2">
            Escolhe o Teu Defendo!
          </h1>
          <p className="text-muted-foreground font-nunito">
            Este será o teu primeiro companheiro na proteção de ByteLand
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4 mb-8">
          {/* Prev Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="p-3 rounded-full bg-card border-2 border-border hover:border-primary transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          {/* Defendo Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDefendo.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.3 }}
              className="defendo-card w-full max-w-sm"
            >
              {/* Type Badge */}
              <div className="flex justify-center mb-4">
                <span className={`type-badge ${typeColors[currentDefendo.type]} text-white`}>
                  {currentDefendo.type}
                </span>
              </div>

              {/* Image */}
              <div className="relative w-48 h-48 mx-auto mb-4">
                <motion.img
                  src={defendoImages[currentDefendo.id]}
                  alt={currentDefendo.name}
                  className="w-full h-full object-contain drop-shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* Name */}
              <h2 className="font-game-title text-3xl text-center text-foreground mb-2">
                {currentDefendo.name}
              </h2>

              {/* Description */}
              <p className="text-center text-muted-foreground text-sm mb-4 font-nunito">
                {currentDefendo.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <StatBar icon={Heart} label="HP" value={currentDefendo.stats.hp} max={50} color="bg-success" />
                <StatBar icon={Zap} label="ATK" value={currentDefendo.stats.attack} max={20} color="bg-destructive" />
                <StatBar icon={Shield} label="DEF" value={currentDefendo.stats.defense} max={20} color="bg-primary" />
              </div>

              {/* Abilities */}
              <div className="flex flex-wrap justify-center gap-2">
                {currentDefendo.abilities.map((ability, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground"
                  >
                    {ability}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-3 rounded-full bg-card border-2 border-border hover:border-primary transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Selection Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {starterDefendos.map((defendo, index) => (
            <button
              key={defendo.id}
              onClick={() => setSelectedIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        {/* Confirm Dialog */}
        <AnimatePresence>
          {isConfirming ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card-game p-6 text-center max-w-md mx-auto"
            >
              <p className="text-lg font-bold mb-4">
                Queres escolher <span className="text-primary">{currentDefendo.name}</span> como teu primeiro Defendo?
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsConfirming(false)}
                  className="btn-game-secondary"
                >
                  Voltar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="btn-game-gold flex items-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Confirmar!
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelect}
              className="btn-game-gold w-full max-w-sm mx-auto block"
            >
              Escolher {currentDefendo.name}!
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatBar({ 
  icon: Icon, 
  label, 
  value, 
  max, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  max: number; 
  color: string;
}) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}
