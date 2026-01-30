import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { regions, getRegionById } from '@/data/regions';
import { allDefendos, getDefendoById, enemies } from '@/data/defendos';
import { getRandomQuestions } from '@/data/questions';
import { Defendo, Enemy, Question } from '@/data/gameTypes';
import { ArrowLeft, Sword, Search, Crown, HelpCircle, Sparkles } from 'lucide-react';

import passbitImg from '@/assets/defendos/passbit.png';
import firecubImg from '@/assets/defendos/firecub.png';
import authyImg from '@/assets/defendos/authy.png';
import phishlingAlfaImg from '@/assets/enemies/phishling-alfa.png';

const defendoImages: Record<string, string> = {
  passbit: passbitImg,
  firecub: firecubImg,
  authy: authyImg,
  'phishling-alfa': phishlingAlfaImg
};

type RegionView = 'menu' | 'explore' | 'capture' | 'boss';

export function RegionScreen() {
  const { state, dispatch } = useGame();
  const [view, setView] = useState<RegionView>('menu');
  const [wildDefendo, setWildDefendo] = useState<Defendo | null>(null);
  const [captureQuestions, setCaptureQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const region = state.selectedRegion ? getRegionById(state.selectedRegion) : null;
  
  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Região não encontrada</p>
      </div>
    );
  }

  const handleExplore = () => {
    // Random chance to find a wild Defendo
    const wildDefendoIds = region.wildDefendos;
    if (wildDefendoIds.length > 0) {
      const randomId = wildDefendoIds[Math.floor(Math.random() * wildDefendoIds.length)];
      const defendo = getDefendoById(randomId);
      if (defendo) {
        setWildDefendo(defendo);
        setCaptureQuestions(getRandomQuestions(3, defendo.type));
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setView('capture');
      }
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const question = captureQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correctIndex;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Show result briefly then move to next
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < captureQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // End of questions - check if captured
        const finalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
        if (finalCorrect === 3 && wildDefendo) {
          // Captured!
          dispatch({ type: 'ADD_DEFENDO', payload: wildDefendo });
          dispatch({ type: 'GAIN_XP', payload: 50 });
        }
        dispatch({ type: 'GAIN_XP', payload: finalCorrect * 10 });
        
        // Reset after showing capture result
        setTimeout(() => {
          setView('menu');
          setWildDefendo(null);
        }, 2000);
      }
    }, 2000);
  };

  const handleBack = () => {
    if (view === 'menu') {
      dispatch({ type: 'SET_SCREEN', payload: 'worldMap' });
    } else {
      setView('menu');
      setWildDefendo(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-secondary/50 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-game-title text-xl text-primary">{region.name}</h1>
            <p className="text-sm text-muted-foreground">{region.theme}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Region Info */}
              <div className="card-game p-6">
                <p className="text-muted-foreground mb-4">{region.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    Defendos: {region.wildDefendos.length} tipos
                  </span>
                  <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                    Boss: {region.boss.name}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExplore}
                  className="card-game p-6 text-left hover:border-primary transition-colors"
                >
                  <Search className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-1">Explorar</h3>
                  <p className="text-sm text-muted-foreground">
                    Procura Defendos selvagens para capturar
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="card-game p-6 text-left hover:border-destructive transition-colors"
                >
                  <Crown className="h-8 w-8 text-destructive mb-3" />
                  <h3 className="font-bold text-lg mb-1">Enfrentar Boss</h3>
                  <p className="text-sm text-muted-foreground">
                    Desafia {region.boss.name}!
                  </p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'capture' && wildDefendo && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Wild Defendo Appeared */}
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-game-title text-2xl text-primary mb-4"
                >
                  Um {wildDefendo.name} selvagem apareceu!
                </motion.p>
                
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative inline-block"
                >
                  <img
                    src={defendoImages[wildDefendo.id] || passbitImg}
                    alt={wildDefendo.name}
                    className="w-40 h-40 object-contain drop-shadow-lg"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary/20 -z-10"
                  />
                </motion.div>
              </div>

              {/* Question Progress */}
              <div className="flex justify-center gap-2">
                {captureQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-2 rounded-full transition-colors ${
                      index < currentQuestionIndex
                        ? correctAnswers > index ? 'bg-success' : 'bg-destructive'
                        : index === currentQuestionIndex
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              {currentQuestionIndex < captureQuestions.length && (
                <div className="card-game p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="font-bold text-lg">
                      {captureQuestions[currentQuestionIndex].question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {captureQuestions[currentQuestionIndex].options.map((option, index) => {
                      const isCorrect = index === captureQuestions[currentQuestionIndex].correctIndex;
                      const isSelected = selectedAnswer === index;
                      
                      return (
                        <motion.button
                          key={index}
                          whileHover={!showResult ? { scale: 1.02 } : {}}
                          whileTap={!showResult ? { scale: 0.98 } : {}}
                          onClick={() => !showResult && handleAnswer(index)}
                          disabled={showResult}
                          className={`
                            w-full p-4 rounded-lg border-2 text-left font-nunito
                            transition-all
                            ${showResult
                              ? isCorrect
                                ? 'bg-success/20 border-success text-success'
                                : isSelected
                                ? 'bg-destructive/20 border-destructive text-destructive'
                                : 'bg-muted border-muted'
                              : 'bg-card border-border hover:border-primary'
                            }
                          `}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-muted rounded-lg"
                      >
                        <p className="text-sm">
                          <span className="font-bold">Explicação: </span>
                          {captureQuestions[currentQuestionIndex].explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Capture Result */}
              {currentQuestionIndex >= captureQuestions.length - 1 && showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-game p-8 text-center"
                >
                  {correctAnswers + (selectedAnswer === captureQuestions[currentQuestionIndex].correctIndex ? 1 : 0) === 3 ? (
                    <>
                      <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
                      <h3 className="font-game-title text-3xl text-accent mb-2">
                        Capturado!
                      </h3>
                      <p className="text-muted-foreground">
                        {wildDefendo.name} juntou-se à tua equipa!
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-game-title text-2xl text-muted-foreground mb-2">
                        Escapou...
                      </h3>
                      <p className="text-muted-foreground">
                        Tenta novamente! Respondeste {correctAnswers + (selectedAnswer === captureQuestions[currentQuestionIndex].correctIndex ? 1 : 0)}/3 corretamente.
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
