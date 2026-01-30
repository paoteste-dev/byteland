import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { questions } from '@/data/questions';
import { DefendoType } from '@/data/gameTypes';
import { ArrowLeft, Search, Shield, Wifi, Users, Bug, Flame, Key, Cloud } from 'lucide-react';

const topicIcons: Record<string, React.ElementType> = {
  password: Key,
  network: Wifi,
  social: Users,
  malware: Bug,
  firewall: Flame,
  authentication: Shield,
  cloud: Cloud
};

const topicLabels: Record<string, string> = {
  password: 'Passwords',
  network: 'Redes',
  social: 'Redes Sociais',
  malware: 'Malware',
  firewall: 'Firewall',
  authentication: 'Autenticação',
  cloud: 'Cloud'
};

const typeColors: Record<string, string> = {
  password: 'bg-type-password text-black',
  network: 'bg-type-network text-white',
  social: 'bg-type-social text-white',
  malware: 'bg-type-malware text-white',
  firewall: 'bg-type-firewall text-white',
  authentication: 'bg-type-auth text-white',
  cloud: 'bg-type-cloud text-white'
};

export function EncyclopediaScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [selectedTopic, setSelectedTopic] = useState<DefendoType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const topics = [...new Set(questions.map(q => q.topic))] as DefendoType[];
  
  const filteredQuestions = questions.filter(q => {
    const matchesTopic = !selectedTopic || q.topic === selectedTopic;
    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-primary/10 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: player ? 'worldMap' : 'title' })}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-game-title text-2xl text-primary">Enciclopédia</h1>
            <p className="text-sm text-muted-foreground">
              Aprende sobre Cibersegurança
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar tópicos..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-card focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              !selectedTopic
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
            }`}
          >
            Todos
          </button>
          {topics.map(topic => {
            const Icon = topicIcons[topic] || Shield;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
                  selectedTopic === topic
                    ? typeColors[topic]
                    : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                }`}
              >
                <Icon className="h-4 w-4" />
                {topicLabels[topic]}
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => {
            const Icon = topicIcons[question.topic] || Shield;
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="card-game p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${typeColors[question.topic]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground mb-1">{question.question}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                      question.difficulty === 'easy' 
                        ? 'bg-success/20 text-success' 
                        : question.difficulty === 'medium'
                        ? 'bg-accent/20 text-accent-foreground'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </span>
                  </div>
                </div>

                <div className="bg-success/10 border border-success/30 rounded-lg p-3 mb-3">
                  <p className="text-sm font-bold text-success">
                    ✓ {question.options[question.correctIndex]}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">💡 Dica: </span>
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma pergunta encontrada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
