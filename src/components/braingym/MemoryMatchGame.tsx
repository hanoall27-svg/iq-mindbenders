import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Timer, Sparkles, Star, Zap } from 'lucide-react';

interface Card {
  id: number;
  pairId: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_POOL = ['🦁', '🐘', '🦒', '🐼', '🦊', '🐰', '🐸', '🐵', '🦄', '🐬', '🍎', '🍓', '🍌', '🍇', '🍉', '🍕', '🚀', '⭐'];

interface MemoryMatchGameProps {
  onEarnStars: (stars: number) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onEarnStars }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Pair counts: easy: 6 pairs (12 cards - 4x3), medium: 8 pairs (16 cards - 4x4), hard: 12 pairs (24 cards - 6x4)
  const getPairCount = () => {
    switch (difficulty) {
      case 'easy': return 6;
      case 'medium': return 8;
      case 'hard': return 12;
    }
  };

  const initGame = () => {
    sounds.playPop();
    const pairCount = getPairCount();
    const selectedEmojis = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const deck: Card[] = [];

    selectedEmojis.forEach((emoji, idx) => {
      deck.push({ id: idx * 2, pairId: idx, emoji, isFlipped: false, isMatched: false });
      deck.push({ id: idx * 2 + 1, pairId: idx, emoji, isFlipped: false, isMatched: false });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  // Timer tick
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || isGameOver) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedCards.length === 2) return;

    sounds.playPop();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        // Matched!
        sounds.playSuccess();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        setMatches(m => {
          const next = m + 1;
          if (next === getPairCount()) {
            setIsGameOver(true);
            sounds.playFanfare();
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            const starsAward = difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 2;
            onEarnStars(starsAward);
          }
          return next;
        });
      } else {
        // Mismatch
        sounds.playEncourage();
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 850);
      }
    }
  };

  const getGridColsClass = () => {
    if (difficulty === 'easy') return 'grid-cols-3 sm:grid-cols-4';
    if (difficulty === 'medium') return 'grid-cols-4';
    return 'grid-cols-4 sm:grid-cols-6';
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl">
            🃏
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              لعبة اقلب الكروت (Memory Match)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              تطابق الكروت وتنمية الذاكرة الفوتوغرافية والتركيز الحسي
            </p>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-2xl border border-amber-200">
          {(['easy', 'medium', 'hard'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition btn-bouncy ${
                difficulty === lvl
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl === 'easy' ? 'سهل (4x3)' : lvl === 'medium' ? 'متوسط (4x4)' : 'صعب (6x4)'}
            </button>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-2xl border-2 border-amber-200 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-amber-600" />
          <span>الوقت: <strong className="font-mono text-sm text-slate-900">{timer} ثانية</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span>الحركات: <strong className="font-mono text-sm text-slate-900">{moves}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-600" />
          <span>المتطابقات: <strong className="font-mono text-sm text-emerald-700">{matches} / {getPairCount()}</strong></span>
        </div>
        <button
          onClick={initGame}
          className="p-1.5 rounded-xl bg-white hover:bg-amber-100 text-slate-700 border border-amber-300 transition"
          title="إعادة اللعب"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className={`grid ${getGridColsClass()} gap-2.5 sm:gap-3.5 max-w-xl mx-auto w-full py-2`}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-2xl border-3 flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 transform btn-bouncy ${
              card.isFlipped || card.isMatched
                ? 'bg-amber-50 border-amber-400 shadow-sm scale-100 rotate-0'
                : 'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-600 shadow-md hover:scale-105 active:scale-95'
            } ${card.isMatched ? 'opacity-80 ring-2 ring-emerald-400' : ''}`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-scale-in">{card.emoji}</span>
            ) : (
              <span className="text-xl sm:text-2xl text-white font-black drop-shadow-xs">❓</span>
            )}
          </button>
        ))}
      </div>

      {/* Game Over Celebration Modal */}
      {isGameOver && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 animate-scale-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🏆</span>
            <div>
              <h4 className="text-sm font-black text-emerald-900">أداء عبقري! لقد طابقت كل الكروت بنجاح!</h4>
              <p className="text-xs text-emerald-700">أنهيت التحدي في {moves} حركة خلال {timer} ثانية، وحصلت على نجوم جديدة! ⭐</p>
            </div>
          </div>
          <button
            onClick={initGame}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition shadow-sm btn-bouncy shrink-0"
          >
            العب مرة أخرى 🚀
          </button>
        </div>
      )}
    </div>
  );
};
