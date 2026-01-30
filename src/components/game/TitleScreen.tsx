import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Shield, Play, BookOpen, Users } from 'lucide-react';
import titleBg from '@/assets/backgrounds/title-bg.jpg';

export function TitleScreen() {
  const { dispatch } = useGame();

  const handleNewGame = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'intro' });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${titleBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 text-center"
        >
          <h1 className="font-game-title text-6xl md:text-8xl tracking-wider drop-shadow-lg">
            <span className="text-primary">BYTE</span>
            <span className="text-accent">LAND</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-lg md:text-xl font-nunito font-bold text-foreground/90"
          >
            O Despertar da Defesa Digital
          </motion.p>
        </motion.div>

        {/* Floating Shield Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="rounded-full bg-primary/20 p-6 backdrop-blur-sm">
            <Shield className="h-16 w-16 text-primary" />
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewGame}
            className="btn-game-gold flex items-center justify-center gap-3 text-lg"
          >
            <Play className="h-5 w-5" />
            Nova Aventura
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-game-primary flex items-center justify-center gap-3"
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'collection' })}
          >
            <Users className="h-5 w-5" />
            Coleção
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-game-secondary flex items-center justify-center gap-3"
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'encyclopedia' })}
          >
            <BookOpen className="h-5 w-5" />
            Enciclopédia
          </motion.button>
        </motion.div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 text-sm text-muted-foreground"
        >
          Versão 1.0 • Aprende Cibersegurança a Jogar!
        </motion.p>
      </div>
    </div>
  );
}
