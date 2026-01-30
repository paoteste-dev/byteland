import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { ChevronRight, MessageCircle } from 'lucide-react';

const introDialogues = [
  {
    speaker: 'Sistema',
    text: 'Bem-vindo a ByteLand, um mundo digital onde dados são o bem mais precioso...',
    emotion: 'neutral'
  },
  {
    speaker: 'Mentor Byte',
    text: 'Olá, jovem Aprendiz Digital! Algo terrível está a acontecer...',
    emotion: 'worried'
  },
  {
    speaker: 'Mentor Byte',
    text: 'Ameaças digitais estão a invadir o nosso mundo! Phishing, Malware, Ransomware...',
    emotion: 'serious'
  },
  {
    speaker: 'Mentor Byte',
    text: 'Mas não temas! Com conhecimento e os Defendos ao teu lado, podemos proteger ByteLand!',
    emotion: 'hopeful'
  },
  {
    speaker: 'Mentor Byte',
    text: 'Os Defendos são criaturas que representam boas práticas de cibersegurança. Vais capturá-los respondendo a perguntas!',
    emotion: 'excited'
  },
  {
    speaker: 'Mentor Byte',
    text: 'Primeiro, diz-me... Qual é o teu nome, jovem defensor?',
    emotion: 'curious'
  }
];

export function IntroScreen() {
  const { dispatch } = useGame();
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const currentDialogue = introDialogues[dialogueIndex];
  const isLastDialogue = dialogueIndex === introDialogues.length - 1;

  const handleNext = () => {
    if (isLastDialogue) {
      setShowNameInput(true);
    } else {
      setDialogueIndex(prev => prev + 1);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      dispatch({ type: 'SKIP_INTRO' });
      dispatch({ type: 'SET_SCREEN', payload: 'starterSelect' });
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SKIP_INTRO' });
    dispatch({ type: 'SET_SCREEN', payload: 'starterSelect' });
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-primary/20 via-background to-background">
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Saltar Intro →
      </button>

      {/* Content */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!showNameInput ? (
            <motion.div
              key={dialogueIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl"
            >
              {/* Speaker */}
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary">{currentDialogue.speaker}</span>
              </div>

              {/* Dialogue Box */}
              <div className="card-game p-6 mb-6">
                <p className="text-lg leading-relaxed font-nunito">
                  {currentDialogue.text}
                </p>
              </div>

              {/* Continue Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="btn-game-primary w-full flex items-center justify-center gap-2"
              >
                Continuar
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleNameSubmit}
              className="w-full max-w-md"
            >
              <div className="card-game p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Como te chamas?</h2>
                
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="O teu nome..."
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-center text-lg font-nunito focus:border-primary focus:outline-none transition-colors mb-6"
                  autoFocus
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!playerName.trim()}
                  className="btn-game-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Começar Aventura!
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Progress Dots */}
        {!showNameInput && (
          <div className="flex gap-2 mt-8">
            {introDialogues.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === dialogueIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
