import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PlayerState, Defendo, GameScreen, CombatState } from '@/data/gameTypes';
import { starterDefendos } from '@/data/defendos';

interface GameState {
  screen: GameScreen;
  player: PlayerState | null;
  combat: CombatState | null;
  selectedRegion: string | null;
  showIntro: boolean;
}

type GameAction =
  | { type: 'SET_SCREEN'; payload: GameScreen }
  | { type: 'START_GAME'; payload: { name: string; starterDefendo: Defendo } }
  | { type: 'SELECT_REGION'; payload: string }
  | { type: 'START_COMBAT'; payload: CombatState }
  | { type: 'END_COMBAT' }
  | { type: 'UPDATE_PLAYER'; payload: Partial<PlayerState> }
  | { type: 'ADD_DEFENDO'; payload: Defendo }
  | { type: 'GAIN_XP'; payload: number }
  | { type: 'SKIP_INTRO' };

const initialState: GameState = {
  screen: 'title',
  player: null,
  combat: null,
  selectedRegion: null,
  showIntro: true
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };
    
    case 'START_GAME':
      return {
        ...state,
        screen: 'worldMap',
        player: {
          name: action.payload.name,
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          team: [action.payload.starterDefendo],
          collection: [action.payload.starterDefendo],
          currentRegion: 'vila-dos-dados',
          questsCompleted: [],
          badges: []
        }
      };
    
    case 'SELECT_REGION':
      return { ...state, selectedRegion: action.payload, screen: 'exploration' };
    
    case 'START_COMBAT':
      return { ...state, combat: action.payload, screen: 'combat' };
    
    case 'END_COMBAT':
      return { ...state, combat: null, screen: 'exploration' };
    
    case 'UPDATE_PLAYER':
      return state.player
        ? { ...state, player: { ...state.player, ...action.payload } }
        : state;
    
    case 'ADD_DEFENDO':
      if (!state.player) return state;
      const newCollection = [...state.player.collection, action.payload];
      const newTeam = state.player.team.length < 6
        ? [...state.player.team, action.payload]
        : state.player.team;
      return {
        ...state,
        player: { ...state.player, collection: newCollection, team: newTeam }
      };
    
    case 'GAIN_XP':
      if (!state.player) return state;
      const newXp = state.player.xp + action.payload;
      let newLevel = state.player.level;
      let remainingXp = newXp;
      let xpNeeded = state.player.xpToNextLevel;
      
      while (remainingXp >= xpNeeded) {
        remainingXp -= xpNeeded;
        newLevel++;
        xpNeeded = Math.floor(xpNeeded * 1.5);
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          level: newLevel,
          xp: remainingXp,
          xpToNextLevel: xpNeeded
        }
      };
    
    case 'SKIP_INTRO':
      return { ...state, showIntro: false };
    
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
