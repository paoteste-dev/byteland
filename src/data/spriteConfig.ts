// Sprite configurations for characters and creatures
import heroSprite from '@/assets/characters/hero-8dir.png';
import passbitSprite from '@/assets/defendos/passbit.png';
import firecubSprite from '@/assets/defendos/firecub.png';
import authySprite from '@/assets/defendos/authy.png';
import linkletSprite from '@/assets/defendos/linklet.png';
import phishlingSprite from '@/assets/enemies/phishling.png';
import clickbaiterSprite from '@/assets/enemies/clickbaiter.png';
import phishlingAlfaSprite from '@/assets/enemies/phishling-alfa.png';

// Hero sprite configuration for 8-directional movement
export interface HeroSpriteConfig {
  image: string;
  frameWidth: number;
  frameHeight: number;
  directions: {
    [key: string]: { row: number; col: number };
  };
}

export const heroConfig: HeroSpriteConfig = {
  image: heroSprite,
  frameWidth: 128, // Each frame in the sprite sheet
  frameHeight: 128,
  directions: {
    // Top row: N, NE, E, SE
    'north': { row: 0, col: 0 },
    'northeast': { row: 0, col: 1 },
    'east': { row: 0, col: 2 },
    'southeast': { row: 0, col: 3 },
    // Bottom row: S, SW, W, NW
    'south': { row: 1, col: 0 },
    'southwest': { row: 1, col: 1 },
    'west': { row: 1, col: 2 },
    'northwest': { row: 1, col: 3 },
  },
};

// Direction mapping from movement keys to 8 directions
export type Direction8 = 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest';

export const getDirectionFrom8 = (dx: number, dy: number): Direction8 => {
  if (dx === 0 && dy < 0) return 'north';
  if (dx > 0 && dy < 0) return 'northeast';
  if (dx > 0 && dy === 0) return 'east';
  if (dx > 0 && dy > 0) return 'southeast';
  if (dx === 0 && dy > 0) return 'south';
  if (dx < 0 && dy > 0) return 'southwest';
  if (dx < 0 && dy === 0) return 'west';
  if (dx < 0 && dy < 0) return 'northwest';
  return 'south'; // Default facing down
};

// Creature sprites
export const creatureSprites: Record<string, string> = {
  // Defendos
  passbit: passbitSprite,
  firecub: firecubSprite,
  authy: authySprite,
  linklet: linkletSprite,
  // Enemies
  phishling: phishlingSprite,
  clickbaiter: clickbaiterSprite,
  'phishling-alfa': phishlingAlfaSprite,
};

export const getCreatureSprite = (id: string): string => {
  return creatureSprites[id] || passbitSprite;
};

// Metadata for the hero character
export const heroMetadata = {
  name: 'CyberDefender',
  description: 'Jovem herói de cibersegurança que protege ByteLand contra ameaças digitais',
  size: 48,
  hitbox: {
    width: 32,
    height: 32,
    offsetX: 8,
    offsetY: 12,
  },
  keypoints: {
    head: { x: 24, y: 8 },
    body: { x: 24, y: 24 },
    leftHand: { x: 12, y: 24 },
    rightHand: { x: 36, y: 24 },
    leftFoot: { x: 16, y: 44 },
    rightFoot: { x: 32, y: 44 },
  },
};
