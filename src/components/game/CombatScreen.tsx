import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Question, Defendo, Enemy } from '@/data/gameTypes';
import { questions } from '@/data/questions';
import { Heart, Shield, Zap, Swords, HelpCircle, CheckCircle, XCircle, Star, BookOpen } from 'lucide-react';

// Import sprites
import passbitSprite from '@/assets/defendos/passbit.png';
import firecubSprite from '@/assets/defendos/firecub.png';
import authySprite from '@/assets/defendos/authy.png';
import linkletSprite from '@/assets/defendos/linklet.png';
import phishlingSprite from '@/assets/enemies/phishling.png';
import phishlingAlfaSprite from '@/assets/enemies/phishling-alfa.png';
import clickbaiterSprite from '@/assets/enemies/clickbaiter.png';

const creatureSprites: Record<string, string> = {
  passbit: passbitSprite,
  firecub: firecubSprite,
  authy: authySprite,
  linklet: linkletSprite,
  phishling: phishlingSprite,
  'phishling-alfa': phishlingAlfaSprite,
  clickbaiter: clickbaiterSprite,
};

interface CombatAction {
  type: 'attack' | 'defend' | 'skill' | 'capture';
  skillName?: string;
}

export function CombatScreen() {
  const { state, dispatch } = useGame();
  const { combat, player } = state;
  
  const [playerHp, setPlayerHp] = useState(combat?.playerDefendo.stats.hp || 0);
  const [enemyHp, setEnemyHp] = useState(combat?.enemyDefendo.stats.hp || 0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'action' | 'question' | 'result' | 'victory' | 'defeat'>('action');
  const [battleLog, setBattleLog] = useState<string[]>(combat?.battleLog || []);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [questionsTotal, setQuestionsTotal] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [animatingAttack, setAnimatingAttack] = useState<'player' | 'enemy' | null>(null);
  
  useEffect(() => {
    if (combat) {
      setPlayerHp(combat.playerDefendo.stats.hp);
      setEnemyHp(combat.enemyDefendo.stats.hp);
    }
  }, [combat]);

  const getRandomQuestion = useCallback((): Question => {
    const regionQuestions = questions.filter(q => 
      q.topic === combat?.playerDefendo.type || 
      q.topic === 'password' || 
      q.topic === 'social'
    );
    return regionQuestions[Math.floor(Math.random() * regionQuestions.length)] || questions[0];
  }, [combat]);

  const addLog = (message: string) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const handleAction = (action: CombatAction) => {
    if (!combat) return;
    
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setBattlePhase('question');
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion || !combat) return;
    
    const correct = selectedAnswer === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
    setQuestionsTotal(prev => prev + 1);
    
    if (correct) {
      setQuestionsCorrect(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (correct) {
        // Player attacks successfully
        setAnimatingAttack('player');
        addLog(`${combat.playerDefendo.name} usou um ataque eficaz!`);
        
        setTimeout(() => {
          const damage = Math.floor(combat.playerDefendo.stats.attack * (1 + Math.random() * 0.5));
          const newEnemyHp = Math.max(0, enemyHp - damage);
          setEnemyHp(newEnemyHp);
          addLog(`Causou ${damage} de dano!`);
          setAnimatingAttack(null);
          
          if (newEnemyHp <= 0) {
            setBattlePhase('victory');
            return;
          }
          
          // Enemy turn
          setTimeout(() => {
            enemyTurn();
          }, 500);
        }, 500);
      } else {
        // Player misses, enemy attacks
        addLog(`Resposta incorreta! ${combat.enemyDefendo.name} contra-ataca!`);
        setTimeout(() => {
          enemyTurn();
        }, 500);
      }
    }, 2000);
  };

  const enemyTurn = () => {
    if (!combat) return;
    
    setAnimatingAttack('enemy');
    addLog(`${combat.enemyDefendo.name} ataca!`);
    
    setTimeout(() => {
      const damage = Math.floor(combat.enemyDefendo.stats.attack * (0.5 + Math.random() * 0.5));
      const newPlayerHp = Math.max(0, playerHp - damage);
      setPlayerHp(newPlayerHp);
      addLog(`Recebeste ${damage} de dano!`);
      setAnimatingAttack(null);
      
      if (newPlayerHp <= 0) {
        setBattlePhase('defeat');
        return;
      }
      
      setBattlePhase('action');
      setIsPlayerTurn(true);
    }, 500);
  };

  const handleVictory = () => {
    if (!combat || !player) return;
    
    const xpGained = combat.isCaptureBattle ? 50 : 100;
    dispatch({ type: 'GAIN_XP', payload: xpGained });
    
    if (combat.isCaptureBattle && questionsCorrect >= 2) {
      // Capture the Defendo
      const capturedDefendo = combat.enemyDefendo as Defendo;
      dispatch({ type: 'ADD_DEFENDO', payload: capturedDefendo });
      addLog(`${capturedDefendo.name} foi capturado!`);
    }
    
    dispatch({ type: 'SET_SCREEN', payload: 'exploration' });
  };

  const handleDefeat = () => {
    // No punishment, just return to exploration
    dispatch({ type: 'SET_SCREEN', payload: 'exploration' });
  };

  const handleFlee = () => {
    addLog('Fugiste da batalha!');
    dispatch({ type: 'SET_SCREEN', payload: 'exploration' });
  };

  if (!combat || !player) {
    return null;
  }

  const playerDefendo = combat.playerDefendo;
  const enemyDefendo = combat.enemyDefendo;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-green-500 flex flex-col">
      {/* Battle Arena */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300/50 to-green-400/50" />
        
        {/* Enemy side */}
        <div className="absolute top-8 right-8 md:right-16">
          {/* Enemy info card */}
          <motion.div 
            className="bg-card/90 backdrop-blur rounded-xl p-3 mb-4 min-w-[200px]"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{enemyDefendo.name}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                Nv. {Math.floor(5 + Math.random() * 5)}
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-red-500 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(enemyHp / enemyDefendo.stats.maxHp) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-500" />
                HP
              </span>
              <span>{enemyHp}/{enemyDefendo.stats.maxHp}</span>
            </div>
          </motion.div>
          
          {/* Enemy sprite */}
          <motion.div
            className="relative"
            animate={animatingAttack === 'enemy' ? { x: [-20, 0] } : { y: [0, -5, 0] }}
            transition={animatingAttack === 'enemy' ? { duration: 0.2 } : { duration: 2, repeat: Infinity }}
          >
            <img 
              src={creatureSprites[enemyDefendo.id] || phishlingSprite}
              alt={enemyDefendo.name}
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-xl"
            />
            {combat.isCaptureBattle && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2"
              >
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Player side */}
        <div className="absolute bottom-24 left-8 md:left-16">
          {/* Player Defendo sprite */}
          <motion.div
            className="relative mb-4"
            animate={animatingAttack === 'player' ? { x: [0, 20, 0] } : {}}
            transition={{ duration: 0.2 }}
          >
            <img 
              src={creatureSprites[playerDefendo.id] || passbitSprite}
              alt={playerDefendo.name}
              className="w-36 h-36 md:w-48 md:h-48 object-contain drop-shadow-xl"
            />
          </motion.div>
          
          {/* Player info card */}
          <motion.div 
            className="bg-card/90 backdrop-blur rounded-xl p-3 min-w-[220px]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{playerDefendo.name}</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                Nv. {player.level}
              </span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(playerHp / playerDefendo.stats.maxHp) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-green-500" />
                HP
              </span>
              <span className="font-bold">{playerHp}/{playerDefendo.stats.maxHp}</span>
            </div>
          </motion.div>
        </div>
        
        {/* Battle log */}
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-auto md:left-1/2 md:-translate-x-1/2 max-w-md">
          <div className="bg-card/80 backdrop-blur rounded-lg p-2 space-y-1 max-h-24 overflow-y-auto">
            {battleLog.slice(-3).map((log, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm"
              >
                {log}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Panel */}
      <div className="bg-card border-t-4 border-primary p-4">
        <AnimatePresence mode="wait">
          {battlePhase === 'action' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-3 max-w-lg mx-auto"
            >
              <button
                onClick={() => handleAction({ type: 'attack' })}
                className="btn-game-primary flex items-center justify-center gap-2 py-4"
              >
                <Swords className="h-5 w-5" />
                <span>Atacar</span>
              </button>
              <button
                onClick={() => handleAction({ type: 'defend' })}
                className="btn-game-secondary flex items-center justify-center gap-2 py-4"
              >
                <Shield className="h-5 w-5" />
                <span>Defender</span>
              </button>
              <button
                onClick={() => handleAction({ type: 'skill' })}
                className="btn-game-secondary flex items-center justify-center gap-2 py-4"
              >
                <Zap className="h-5 w-5" />
                <span>Habilidade</span>
              </button>
              <button
                onClick={handleFlee}
                className="bg-muted hover:bg-muted/80 text-foreground rounded-xl flex items-center justify-center gap-2 py-4 transition-colors"
              >
                <span>Fugir</span>
              </button>
            </motion.div>
          )}
          
          {battlePhase === 'question' && currentQuestion && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="font-medium text-lg">{currentQuestion.question}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`
                      p-4 rounded-xl text-left transition-all border-2
                      ${selectedAnswer === index 
                        ? showResult
                          ? index === currentQuestion.correctIndex
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-red-500 bg-red-500/20'
                          : 'border-primary bg-primary/10'
                        : showResult && index === currentQuestion.correctIndex
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-border hover:border-primary/50 bg-card'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
              
              {showResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-bold">{isCorrect ? 'Correto!' : 'Incorreto!'}</span>
                  </div>
                  <p className="text-sm flex items-start gap-2">
                    <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              ) : (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedAnswer === null}
                  className="btn-game-primary w-full py-4 disabled:opacity-50"
                >
                  Confirmar Resposta
                </button>
              )}
            </motion.div>
          )}
          
          {battlePhase === 'victory' && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Star className="h-16 w-16 text-yellow-400 fill-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-game-title text-primary mb-2">Vitória!</h2>
              <p className="text-muted-foreground mb-2">
                {questionsCorrect}/{questionsTotal} respostas corretas
              </p>
              {combat.isCaptureBattle && questionsCorrect >= 2 && (
                <p className="text-green-500 font-bold mb-4">
                  ✨ {enemyDefendo.name} foi capturado!
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-6">+{combat.isCaptureBattle ? 50 : 100} XP</p>
              <button onClick={handleVictory} className="btn-game-primary px-8 py-3">
                Continuar
              </button>
            </motion.div>
          )}
          
          {battlePhase === 'defeat' && (
            <motion.div
              key="defeat"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <Heart className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-3xl font-game-title text-destructive mb-2">Derrota</h2>
              <p className="text-muted-foreground mb-4">
                Não te preocupes! Aprender com os erros faz parte da jornada.
              </p>
              <p className="text-sm bg-muted/50 p-3 rounded-lg mb-6 max-w-md mx-auto">
                💡 Dica: Responde corretamente às perguntas para causar mais dano!
              </p>
              <button onClick={handleDefeat} className="btn-game-secondary px-8 py-3">
                Tentar Novamente
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
