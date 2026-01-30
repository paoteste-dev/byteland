import { Defendo, Enemy } from './gameTypes';

// Starter Defendos - Base forms
export const starterDefendos: Defendo[] = [
  {
    id: 'passbit',
    name: 'Passbit',
    type: 'password',
    evolution: 'base',
    description: 'Um pequeno guardião de senhas. Protege dados com sua chave dourada.',
    stats: { hp: 45, maxHp: 45, attack: 12, defense: 10, speed: 8 },
    abilities: ['Chave Forte', 'Escudo de Hash'],
    sprite: 'passbit',
    evolutionChain: { base: 'passbit', advanced: 'passcore', elite: 'passtitan' }
  },
  {
    id: 'firecub',
    name: 'Firecub',
    type: 'firewall',
    evolution: 'base',
    description: 'Uma pequena chama protetora que bloqueia ameaças.',
    stats: { hp: 40, maxHp: 40, attack: 14, defense: 12, speed: 6 },
    abilities: ['Barreira de Fogo', 'Bloqueio Total'],
    sprite: 'firecub',
    evolutionChain: { base: 'firecub', advanced: 'wallhorn', elite: 'firewallion' }
  },
  {
    id: 'authy',
    name: 'Authy',
    type: 'authentication',
    evolution: 'base',
    description: 'Um guardião de identidade com dois fatores de proteção.',
    stats: { hp: 42, maxHp: 42, attack: 10, defense: 14, speed: 7 },
    abilities: ['Verificação Dupla', 'Token Seguro'],
    sprite: 'authy',
    evolutionChain: { base: 'authy', advanced: 'twofawn', elite: 'authlord' }
  }
];

// All Defendos
export const allDefendos: Defendo[] = [
  ...starterDefendos,
  {
    id: 'linklet',
    name: 'Linklet',
    type: 'network',
    evolution: 'base',
    description: 'Um ser conectado que navega pelas redes com segurança.',
    stats: { hp: 38, maxHp: 38, attack: 11, defense: 9, speed: 12 },
    abilities: ['Verificar URL', 'Conexão Segura'],
    sprite: 'linklet',
    evolutionChain: { base: 'linklet', advanced: 'urlock', elite: 'netseal' }
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    type: 'cloud',
    evolution: 'base',
    description: 'Uma nuvem fofa que guarda dados em segurança no céu digital.',
    stats: { hp: 44, maxHp: 44, attack: 9, defense: 11, speed: 9 },
    abilities: ['Backup Rápido', 'Restaurar Dados'],
    sprite: 'cloudy',
    evolutionChain: { base: 'cloudy', advanced: 'backupon', elite: 'restorex' }
  },
  {
    id: 'antiviro',
    name: 'Antiviro',
    type: 'malware',
    evolution: 'base',
    description: 'Um caçador de vírus que protege sistemas contra ameaças.',
    stats: { hp: 40, maxHp: 40, attack: 13, defense: 8, speed: 10 },
    abilities: ['Scan Completo', 'Quarentena'],
    sprite: 'antiviro',
    evolutionChain: { base: 'antiviro', advanced: 'cleanox', elite: 'secureon' }
  },
  {
    id: 'masky',
    name: 'Masky',
    type: 'social',
    evolution: 'base',
    description: 'Um detetive digital que revela perfis falsos.',
    stats: { hp: 36, maxHp: 36, attack: 10, defense: 10, speed: 14 },
    abilities: ['Revelar Identidade', 'Privacidade Ativa'],
    sprite: 'masky',
    evolutionChain: { base: 'masky', advanced: 'trueface', elite: 'identityon' }
  },
  {
    id: 'encryptle',
    name: 'Encryptle',
    type: 'password',
    evolution: 'base',
    description: 'Uma tartaruga que encripta tudo ao seu redor.',
    stats: { hp: 50, maxHp: 50, attack: 8, defense: 15, speed: 4 },
    abilities: ['Criptografia AES', 'Escudo Cifrado'],
    sprite: 'encryptle',
    evolutionChain: { base: 'encryptle', advanced: 'cryptor', elite: 'cipheron' }
  }
];

// Enemies
export const enemies: Enemy[] = [
  {
    id: 'phishling',
    name: 'Phishling',
    type: 'social',
    description: 'Uma criatura enganadora que envia mensagens falsas.',
    stats: { hp: 30, maxHp: 30, attack: 10, defense: 6, speed: 8 },
    abilities: ['Email Falso', 'Link Suspeito'],
    sprite: 'phishling',
    isBoss: false
  },
  {
    id: 'clickbaiter',
    name: 'ClickBaiter',
    type: 'social',
    description: 'Um trapaceiro que atrai cliques com promessas falsas.',
    stats: { hp: 25, maxHp: 25, attack: 8, defense: 5, speed: 10 },
    abilities: ['Isca Digital', 'Promessa Vazia'],
    sprite: 'clickbaiter',
    isBoss: false
  },
  {
    id: 'phishling-alfa',
    name: 'Phishling Alfa',
    type: 'social',
    description: 'O mestre dos golpes de phishing. Cuidado com suas mensagens!',
    stats: { hp: 80, maxHp: 80, attack: 18, defense: 12, speed: 10 },
    abilities: ['Ataque Phishing', 'Mensagem Urgente', 'Roubo de Credenciais'],
    sprite: 'phishling-alfa',
    isBoss: true
  },
  {
    id: 'masktrick',
    name: 'MaskTrick',
    type: 'social',
    description: 'Um manipulador de identidades falsas nas redes sociais.',
    stats: { hp: 90, maxHp: 90, attack: 16, defense: 14, speed: 12 },
    abilities: ['Perfil Falso', 'Manipulação Social', 'Roubo de Identidade'],
    sprite: 'masktrick',
    isBoss: true
  },
  {
    id: 'ransnapper',
    name: 'Ransnapper Rei',
    type: 'malware',
    description: 'O rei do ransomware. Bloqueia dados e exige resgate.',
    stats: { hp: 100, maxHp: 100, attack: 20, defense: 16, speed: 8 },
    abilities: ['Encriptar Dados', 'Exigir Resgate', 'Bloquear Sistema'],
    sprite: 'ransnapper',
    isBoss: true
  },
  {
    id: 'malwaroo',
    name: 'Malwaroo Beta',
    type: 'malware',
    description: 'Um canguru digital que espalha malware por onde passa.',
    stats: { hp: 85, maxHp: 85, attack: 17, defense: 10, speed: 14 },
    abilities: ['Infeção Viral', 'Trojan Drop', 'Corrupção de Arquivos'],
    sprite: 'malwaroo',
    isBoss: true
  },
  {
    id: 'brutox',
    name: 'Brutox Prime',
    type: 'password',
    description: 'Um atacante que tenta milhares de senhas por segundo.',
    stats: { hp: 95, maxHp: 95, attack: 22, defense: 8, speed: 16 },
    abilities: ['Ataque de Força Bruta', 'Dicionário de Senhas', 'Quebra de Hash'],
    sprite: 'brutox',
    isBoss: true
  },
  {
    id: 'authguardian',
    name: 'AuthGuardian',
    type: 'authentication',
    description: 'Um guardião corrompido que testa a verdadeira identidade.',
    stats: { hp: 88, maxHp: 88, attack: 15, defense: 18, speed: 10 },
    abilities: ['Teste de Identidade', 'Bypass de 2FA', 'Sessão Roubada'],
    sprite: 'authguardian',
    isBoss: true
  },
  {
    id: 'zeroday-ghost',
    name: 'ZeroDay Ghost',
    type: 'network',
    description: 'O fantasma final. Explora vulnerabilidades desconhecidas.',
    stats: { hp: 120, maxHp: 120, attack: 25, defense: 20, speed: 18 },
    abilities: ['Explorar Zero-Day', 'Ataque Invisível', 'Persistência Avançada', 'Exfiltração de Dados'],
    sprite: 'zeroday-ghost',
    isBoss: true
  }
];

export const getDefendoById = (id: string): Defendo | undefined => 
  allDefendos.find(d => d.id === id);

export const getEnemyById = (id: string): Enemy | undefined => 
  enemies.find(e => e.id === id);
