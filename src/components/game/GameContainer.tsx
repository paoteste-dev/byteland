import { GameProvider, useGame } from '@/contexts/GameContext';
import { TitleScreen } from './TitleScreen';
import { IntroScreen } from './IntroScreen';
import { StarterSelectScreen } from './StarterSelectScreen';
import { WorldMapScreen } from './WorldMapScreen';
import { RegionScreen } from './RegionScreen';
import { TileExplorationScreen } from './TileExplorationScreen';
import { PokemonMapScreen } from './PokemonMapScreen';
import { CombatScreen } from './CombatScreen';
import { CollectionScreen } from './CollectionScreen';
import { EncyclopediaScreen } from './EncyclopediaScreen';

function GameScreens() {
  const { state } = useGame();

  switch (state.screen) {
    case 'title':
      return <TitleScreen />;
    case 'intro':
      return <IntroScreen />;
    case 'starterSelect':
      return <StarterSelectScreen />;
    case 'worldMap':
      return <WorldMapScreen />;
    case 'region':
      return <RegionScreen />;
    case 'exploration':
      return <TileExplorationScreen />;
    case 'pokemon-exploration':
      return <PokemonMapScreen />;
    case 'combat':
      return <CombatScreen />;
    case 'collection':
      return <CollectionScreen />;
    case 'encyclopedia':
      return <EncyclopediaScreen />;
    default:
      return <TitleScreen />;
  }
}

export function GameContainer() {
  return (
    <GameProvider>
      <GameScreens />
    </GameProvider>
  );
}
