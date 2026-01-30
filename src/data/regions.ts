import { Region } from './gameTypes';
import { enemies } from './defendos';

export const regions: Region[] = [
  {
    id: 'vila-dos-dados',
    name: 'Vila dos Dados',
    theme: 'Passwords & Phishing',
    description: 'Uma vila pacífica onde os habitantes aprendem a proteger suas senhas contra ataques de phishing.',
    boss: enemies.find(e => e.id === 'phishling-alfa')!,
    enemies: ['phishling', 'clickbaiter'],
    wildDefendos: ['passbit', 'linklet', 'encryptle'],
    color: 'region-dados',
    unlocked: true
  },
  {
    id: 'cidade-conectada',
    name: 'Cidade Conectada',
    theme: 'Redes Sociais & Privacidade',
    description: 'Uma metrópole digital onde a privacidade é o bem mais precioso.',
    boss: enemies.find(e => e.id === 'masktrick')!,
    enemies: ['phishling', 'clickbaiter'],
    wildDefendos: ['masky', 'linklet'],
    color: 'region-cidade',
    unlocked: true
  },
  {
    id: 'reino-da-cloud',
    name: 'Reino da Cloud',
    theme: 'Backups & Ransomware',
    description: 'Um reino nas nuvens onde os dados são guardados em segurança... ou eram.',
    boss: enemies.find(e => e.id === 'ransnapper')!,
    enemies: ['phishling'],
    wildDefendos: ['cloudy'],
    color: 'region-cloud',
    unlocked: true
  },
  {
    id: 'florestas-de-servidores',
    name: 'Florestas de Servidores',
    theme: 'Malware',
    description: 'Florestas densas de servidores onde malwares se escondem nas sombras.',
    boss: enemies.find(e => e.id === 'malwaroo')!,
    enemies: ['phishling'],
    wildDefendos: ['antiviro'],
    color: 'region-floresta',
    unlocked: true
  },
  {
    id: 'castelos-de-firewall',
    name: 'Castelos de Firewall',
    theme: 'Defesa & Criptografia',
    description: 'Fortalezas imponentes protegidas por muralhas de fogo digital.',
    boss: enemies.find(e => e.id === 'brutox')!,
    enemies: ['phishling'],
    wildDefendos: ['firecub', 'encryptle'],
    color: 'region-firewall',
    unlocked: true
  },
  {
    id: 'lago-da-autenticacao',
    name: 'Lago da Autenticação',
    theme: 'Identidade & 2FA',
    description: 'Um lago místico onde apenas os verdadeiros podem atravessar.',
    boss: enemies.find(e => e.id === 'authguardian')!,
    enemies: ['phishling'],
    wildDefendos: ['authy'],
    color: 'region-lago',
    unlocked: true
  },
  {
    id: 'dark-web-dungeon',
    name: 'Dark Web Dungeon',
    theme: 'Engenharia Social Avançada',
    description: 'As profundezas escuras da internet onde o ZeroDay Ghost aguarda.',
    boss: enemies.find(e => e.id === 'zeroday-ghost')!,
    enemies: ['phishling', 'clickbaiter'],
    wildDefendos: [],
    color: 'region-darkweb',
    unlocked: false
  }
];

export const getRegionById = (id: string): Region | undefined =>
  regions.find(r => r.id === id);
