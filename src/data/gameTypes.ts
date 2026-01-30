// ByteLand Game Types

export type DefendoType = 
  | 'password' 
  | 'network' 
  | 'social' 
  | 'malware' 
  | 'firewall' 
  | 'authentication' 
  | 'cloud';

export type DefendoEvolution = 'base' | 'advanced' | 'elite';

export interface DefendoStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Defendo {
  id: string;
  name: string;
  type: DefendoType;
  evolution: DefendoEvolution;
  description: string;
  stats: DefendoStats;
  abilities: string[];
  sprite: string;
  evolutionChain: {
    base: string;
    advanced: string;
    elite: string;
  };
}

export interface Enemy {
  id: string;
  name: string;
  type: DefendoType;
  description: string;
  stats: DefendoStats;
  abilities: string[];
  sprite: string;
  isBoss: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: DefendoType;
}

export interface Region {
  id: string;
  name: string;
  theme: string;
  description: string;
  boss: Enemy;
  enemies: string[];
  wildDefendos: string[];
  color: string;
  unlocked: boolean;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  team: Defendo[];
  collection: Defendo[];
  currentRegion: string;
  questsCompleted: string[];
  badges: string[];
}

export interface CombatState {
  playerDefendo: Defendo;
  enemyDefendo: Enemy | Defendo;
  turn: 'player' | 'enemy';
  isCaptureBattle: boolean;
  questionsAnswered: number;
  correctAnswers: number;
  battleLog: string[];
}

export type GameScreen = 
  | 'title' 
  | 'intro' 
  | 'starterSelect' 
  | 'worldMap' 
  | 'region' 
  | 'exploration'
  | 'combat' 
  | 'capture' 
  | 'collection' 
  | 'encyclopedia';
