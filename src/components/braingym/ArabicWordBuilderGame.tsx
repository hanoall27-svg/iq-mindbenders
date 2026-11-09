import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2, Check, ArrowRight } from 'lucide-react';

interface WordPuzzle {
  id: string;
  word: string;         // e.g. "أرنب"
  emoji: string;        // e.g. "🐰"
  meaning: string;
  letters: string[];    // Scrambled or ordered letters
}

const ARABIC_WORD_PUZZLES: WordPuzzle[] = [
  { id: 'rabbit', word: 'أرنب', emoji: '🐰', meaning: 'حيوان لطيف يحب الجزر', letters: ['أ', 'ر', 'ن', 'ب'] },
  { id: 'lion', word: 'أسد', emoji: '🦁', meaning: 'ملك الغابة الشجاع', letters: ['أ', 'س', 'د'] },
  { id: 'apple', word: 'تفاح', emoji: '🍎', meaning: 'فاكهة لذيذة ومفيدة', letters: ['ت', 'ف', 'ا', 'ح'] },
  { id: 'cat', word: 'قطة', emoji: '🐱', meaning: 'تموء بلطف وتحب الحليب', letters: ['ق', 'ط', 'ة'] },
  { id: 'sun', word: 'شمس', emoji: '☀️', meaning: 'تضيء نهارنا بالدفء', letters: ['ش', 'م', 'س'] },
  { id: 'star', word: 'نجمة', emoji: '⭐', meaning: 'تلمع في سماء الليل', letters: ['ن', 'ج', 'م', 'ة'] },
];

interface ArabicWordBuilderGameProps {
  onEarnStars: (stars: number) => void;
}

export const ArabicWordBuilderGame: React.FC<ArabicWordBuilderGameProps> = ({ onEarnStars }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentPuzzle = ARABIC_WORD_PUZZLES[currentIdx % ARABIC_WORD_PUZZLES.length];
  const targetLetters = currentPuzzle.word.split('');

  // Scrambled pool
  const [letterPool, setLetterPool] = useState<string[]>(() => {
    return [...currentPuzzle.letters].sort(() => Math.random() - 0.5);
  });

  const loadPuzzle = (index: number) => {
    const p = ARABIC_WORD_PUZZLES[index % ARABIC_WORD_PUZZLES.length];
    setAssembledLetters([]);
    setLetterPool([...p.letters].sort(() => Math.random() - 0.5));
  };

  const handlePickLetter = (letter: string, poolIndex: number) => {
    const nextAssembled = [...assembledLetters, letter];
    const nextExpectedLetter = targetLetters[assembledLetters.length];

    if (letter === nextExpectedLetter) {
      sounds.playPop();
      setAssembledLetters(nextAssembled);
      const nextPool = [...letterPool];
      nextPool.splice(poolIndex, 1);
      setLetterPool(nextPool);

      // Check if word is complete
      if (nextAssembled.length === targetLetters.length) {
        sounds.playSuccess();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setScore(s => s + 20);
        setStreak(s => s + 1);
        onEarnStars(2);

        // Speak the full completed word
        sounds.speakArabic(currentPuzzle.word);

        setTimeout(() => {
          const nextIndex = currentIdx + 1;
          setCurrentIdx(nextIndex);
          loadPuzzle(nextIndex);
        }, 1300);
      }
    } else {
      sounds.playEncourage();
      setStreak(0);
    }
  };

  const resetCurrent = () => {
    sounds.playPop();
    loadPuzzle(currentIdx);
  };

  const handleSpeakLetter = (ltr: string) => {
    sounds.speakArabic(ltr);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-emerald-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl">
            ✍️
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              وصّل وركّب الحروف العربية (Arabic Word Builder)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              اضغط على الحروف بالترتيب الصحيح لتكوين الكلمة وسماع نطقها!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            النقاط: <strong className="font-mono text-amber-800 text-sm">{score}</strong>
          </div>
        </div>
      </div>

      {/* Target Word Showcase */}
      <div className="flex flex-col items-center justify-center gap-2 py-3 bg-emerald-50/50 rounded-3xl border-2 border-emerald-200">
        <span className="text-6xl animate-bounce">{currentPuzzle.emoji}</span>
        <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200">
          {currentPuzzle.meaning}
        </span>

        {/* Listen button */}
        <button
          onClick={() => sounds.speakArabic(currentPuzzle.word)}
          className="mt-1 px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition btn-bouncy"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع لنطق الكلمة</span>
        </button>
      </div>

      {/* Word Slots */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
        {targetLetters.map((targetLtr, i) => {
          const filled = assembledLetters[i];
          return (
            <div
              key={i}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-black font-sans transition-all ${
                filled
                  ? 'bg-emerald-400 border-emerald-600 text-white shadow-md animate-scale-in'
                  : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {filled || '؟'}
            </div>
          );
        })}
      </div>

      {/* Available Letters Pool */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
          <span>الحروف المتاحة (اضغط على الحرف لوضعه في الكلمة):</span>
          <button
            onClick={resetCurrent}
            className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة ترتيب
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {letterPool.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handlePickLetter(letter, idx)}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white hover:bg-amber-100 border-3 border-amber-300 hover:border-amber-500 text-slate-800 font-black text-2xl sm:text-3xl transition-all shadow-sm active:scale-90 btn-bouncy flex items-center justify-center"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
