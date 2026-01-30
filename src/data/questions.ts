import { Question } from './gameTypes';

export const questions: Question[] = [
  // Password Questions
  {
    id: 'pw1',
    question: 'Qual é a melhor senha?',
    options: ['123456', 'password', 'M3u_C@ch0rr0_2024!', 'qwerty'],
    correctIndex: 2,
    explanation: 'Senhas fortes combinam letras maiúsculas, minúsculas, números e símbolos. Evite senhas comuns!',
    difficulty: 'easy',
    topic: 'password'
  },
  {
    id: 'pw2',
    question: 'O que é autenticação de dois fatores (2FA)?',
    options: [
      'Usar duas senhas diferentes',
      'Verificar identidade com dois métodos diferentes',
      'Logar em dois dispositivos',
      'Ter duas contas'
    ],
    correctIndex: 1,
    explanation: '2FA usa algo que você sabe (senha) + algo que você tem (telefone) para maior segurança.',
    difficulty: 'easy',
    topic: 'authentication'
  },
  {
    id: 'pw3',
    question: 'Deves usar a mesma senha em todos os sites?',
    options: [
      'Sim, é mais fácil lembrar',
      'Não, se uma for descoberta, todas ficam em risco',
      'Sim, desde que seja forte',
      'Não importa'
    ],
    correctIndex: 1,
    explanation: 'Cada conta deve ter uma senha única. Se uma for comprometida, as outras continuam seguras!',
    difficulty: 'easy',
    topic: 'password'
  },

  // Phishing Questions
  {
    id: 'ph1',
    question: 'O que é phishing?',
    options: [
      'Um tipo de peixe digital',
      'Um ataque que tenta roubar dados através de mensagens falsas',
      'Um programa de proteção',
      'Uma rede social'
    ],
    correctIndex: 1,
    explanation: 'Phishing tenta enganar-te para revelares senhas ou dados pessoais através de emails/mensagens falsas.',
    difficulty: 'easy',
    topic: 'social'
  },
  {
    id: 'ph2',
    question: 'Recebes um email dizendo "URGENTE: Clique aqui para não perder a conta!". O que fazes?',
    options: [
      'Clico imediatamente, é urgente!',
      'Verifico o remetente e o link antes de clicar',
      'Ignoro todos os emails',
      'Respondo pedindo mais informação'
    ],
    correctIndex: 1,
    explanation: 'Mensagens urgentes são táticas comuns de phishing. Verifica sempre o remetente e passa o mouse sobre links!',
    difficulty: 'medium',
    topic: 'social'
  },
  {
    id: 'ph3',
    question: 'Um link parece www.banco.com mas vai para www.banc0.com. Isso é:',
    options: [
      'Normal, são a mesma coisa',
      'Um possível ataque de phishing',
      'Um erro de digitação do banco',
      'Mais seguro que o original'
    ],
    correctIndex: 1,
    explanation: 'Atacantes usam URLs parecidas (com 0 em vez de O, por exemplo) para enganar. Verifica sempre a URL!',
    difficulty: 'medium',
    topic: 'social'
  },

  // Network Questions
  {
    id: 'net1',
    question: 'É seguro usar Wi-Fi público para fazer compras online?',
    options: [
      'Sim, é igual a Wi-Fi de casa',
      'Não, os dados podem ser interceptados',
      'Só se for de um café famoso',
      'Só aos domingos'
    ],
    correctIndex: 1,
    explanation: 'Wi-Fi público pode ser monitorado. Usa VPN ou dados móveis para transações importantes!',
    difficulty: 'easy',
    topic: 'network'
  },
  {
    id: 'net2',
    question: 'O que significa HTTPS no início de um site?',
    options: [
      'O site é mais rápido',
      'A conexão é encriptada e mais segura',
      'O site tem muitas páginas',
      'Não significa nada importante'
    ],
    correctIndex: 1,
    explanation: 'HTTPS significa que os dados são encriptados entre o teu browser e o site. Procura o cadeado! 🔒',
    difficulty: 'easy',
    topic: 'network'
  },

  // Malware Questions
  {
    id: 'mal1',
    question: 'O que é malware?',
    options: [
      'Um tipo de hardware',
      'Software malicioso que danifica sistemas',
      'Uma marca de computadores',
      'Um jogo online'
    ],
    correctIndex: 1,
    explanation: 'Malware inclui vírus, trojans, ransomware - software criado para prejudicar ou roubar dados.',
    difficulty: 'easy',
    topic: 'malware'
  },
  {
    id: 'mal2',
    question: 'Como podes proteger o teu computador contra vírus?',
    options: [
      'Nunca usar a internet',
      'Manter antivírus atualizado e não abrir anexos suspeitos',
      'Usar apenas jogos piratas',
      'Desligar o computador sempre que possível'
    ],
    correctIndex: 1,
    explanation: 'Antivírus atualizado + cuidado com downloads e anexos = proteção forte contra malware!',
    difficulty: 'easy',
    topic: 'malware'
  },
  {
    id: 'mal3',
    question: 'O que é ransomware?',
    options: [
      'Um programa de edição',
      'Malware que encripta ficheiros e pede resgate',
      'Um tipo de antivírus',
      'Uma rede social'
    ],
    correctIndex: 1,
    explanation: 'Ransomware bloqueia os teus ficheiros e exige pagamento. Backups regulares protegem-te!',
    difficulty: 'medium',
    topic: 'malware'
  },

  // Cloud/Backup Questions
  {
    id: 'cloud1',
    question: 'Qual a importância de fazer backups?',
    options: [
      'Não é importante',
      'Protege dados contra perda, roubo ou ransomware',
      'Só para fotos de férias',
      'Ocupa espaço desnecessário'
    ],
    correctIndex: 1,
    explanation: 'Backups regulares garantem que podes recuperar dados em caso de problemas. Regra 3-2-1!',
    difficulty: 'easy',
    topic: 'cloud'
  },
  {
    id: 'cloud2',
    question: 'Qual é a regra 3-2-1 de backup?',
    options: [
      '3 computadores, 2 telemóveis, 1 tablet',
      '3 cópias, 2 tipos de media, 1 offsite',
      '3 senhas, 2 emails, 1 conta',
      '3 dias, 2 horas, 1 minuto'
    ],
    correctIndex: 1,
    explanation: '3 cópias dos dados, em 2 tipos diferentes de armazenamento, com 1 cópia fora do local.',
    difficulty: 'medium',
    topic: 'cloud'
  },

  // Firewall Questions
  {
    id: 'fw1',
    question: 'O que faz uma firewall?',
    options: [
      'Aquece o computador',
      'Controla o tráfego de rede, bloqueando conexões suspeitas',
      'Acelera a internet',
      'Faz backups automáticos'
    ],
    correctIndex: 1,
    explanation: 'Firewalls são como seguranças digitais - monitorizam e controlam quem entra e sai da rede.',
    difficulty: 'easy',
    topic: 'firewall'
  },
  {
    id: 'fw2',
    question: 'O que é um ataque de força bruta?',
    options: [
      'Partir o computador fisicamente',
      'Tentar todas as combinações de senha possíveis',
      'Um tipo de vírus',
      'Uma técnica de backup'
    ],
    correctIndex: 1,
    explanation: 'Ataques de força bruta tentam milhares de senhas. Senhas longas e complexas protegem contra isso!',
    difficulty: 'medium',
    topic: 'firewall'
  },

  // Social Engineering
  {
    id: 'soc1',
    question: 'Partilhar a tua localização em tempo real nas redes sociais é:',
    options: [
      'Sempre seguro',
      'Um risco de privacidade e segurança',
      'Obrigatório',
      'Impossível'
    ],
    correctIndex: 1,
    explanation: 'Partilhar localização pode revelar onde estás (ou não estás), criando riscos de segurança.',
    difficulty: 'easy',
    topic: 'social'
  },
  {
    id: 'soc2',
    question: 'Um "amigo" online que nunca conheceste pede fotos pessoais. O que fazes?',
    options: [
      'Envio, afinal somos amigos',
      'Recuso e conto a um adulto de confiança',
      'Envio só uma',
      'Peço fotos primeiro'
    ],
    correctIndex: 1,
    explanation: 'Nunca partilhes fotos pessoais com desconhecidos online. Conta sempre a um adulto de confiança!',
    difficulty: 'easy',
    topic: 'social'
  },
  {
    id: 'soc3',
    question: 'O que deves incluir numa password para ser forte?',
    options: [
      'Só números',
      'Letras maiúsculas, minúsculas, números e símbolos',
      'O teu nome',
      'A data de aniversário'
    ],
    correctIndex: 1,
    explanation: 'Passwords fortes misturam vários tipos de caracteres e têm pelo menos 12 caracteres!',
    difficulty: 'easy',
    topic: 'password'
  },

  // Authentication Questions
  {
    id: 'auth1',
    question: 'O que é um gestor de passwords?',
    options: [
      'Uma pessoa que guarda senhas',
      'Um programa que armazena senhas de forma segura',
      'Um tipo de vírus',
      'Uma rede social'
    ],
    correctIndex: 1,
    explanation: 'Gestores de passwords criam e armazenam senhas fortes e únicas para cada conta de forma segura.',
    difficulty: 'medium',
    topic: 'authentication'
  },
  {
    id: 'auth2',
    question: 'Qual é a forma mais segura de 2FA?',
    options: [
      'SMS',
      'App autenticadora ou chave física',
      'Email',
      'Pergunta secreta'
    ],
    correctIndex: 1,
    explanation: 'Apps autenticadoras e chaves físicas são mais seguras que SMS, que pode ser interceptado.',
    difficulty: 'hard',
    topic: 'authentication'
  }
];

export const getQuestionsByTopic = (topic: string): Question[] => 
  questions.filter(q => q.topic === topic);

export const getRandomQuestions = (count: number, topic?: string): Question[] => {
  const pool = topic ? getQuestionsByTopic(topic) : questions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
