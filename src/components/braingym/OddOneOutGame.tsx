import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Star, Zap } from 'lucide-react';

interface OddLevel {
  baseEmoji: string;
  oddEmoji: string;
  themeName: string;
}

const LEVEL_TEMPLATES: OddLevel[] = [
  { baseEmoji: '🍎', oddEmoji: '🍊', themeName: 'فواكه لذيذة' },
  { baseEmoji: '🐱', oddEmoji: '🐶', themeName: 'حيوانات أليفة' },
  { baseEmoji: '⭐', oddEmoji: '🌙', themeName: 'سماء الليل' },
  { baseEmoji: '🚗', oddEmoji: '🚲', themeName: 'وسائل النقل' },
  { baseEmoji: '🌸', oddEmoji: '🌻', themeName: 'زهور الحديقة' },
  { baseEmoji: '🦁', oddEmoji: '🐯', themeName: 'غابة الأبطال' },
  { baseEmoji: '🍩', oddEmoji: '🧁', themeName: 'حلويات شهية' },
  { baseEmoji: '⚽', oddEmoji: '🏀', themeName: 'ألعاب رياضية' },
  { baseEmoji: '😀', oddEmoji: '😎', themeName: 'وجوه مرحة' },
  { baseEmoji: '🚀', oddEmoji: '🛸', themeName: 'فضاء ومجرات' },
];

interface OddOneOutGameProps {
  onEarnStars: (stars: number) => void;
}

export const OddOneOutGame: React.FC<OddOneOutGameProps> = ({ onEarnStars }) => {
  const [gridSize, setGridSize] = useState<2 | 3>(2); // 2x2 = 4 items or 3x3 = 9 items
  const [levelIndex, setLevelIndex] = useState(0);
  const [oddIndex, setOddIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const totalCells = gridSize * gridSize;
  const currentTemplate = LEVEL_TEMPLATES[levelIndex % LEVEL_TEMPLATES.length];

  const nextQuestion = () => {
    const nextOdd = Math.floor(Math.random() * totalCells);
    setOddIndex(nextOdd);
    setLevelIndex(i => i + 1);
  };

  useEffect(() => {
    setOddIndex(Math.floor(Math.random() * totalCells));
  }, [gridSize]);

  const handleCellClick = (idx: number) => {
    if (idx === oddIndex) {
      sounds.playSuccess();
      setScore(s => s + 10);
      setStreak(s => s + 1);
      if ((score + 10) % 50 === 0) {
        sounds.playFanfare();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        onEarnStars(2);
      }
      nextQuestion();
    } else {
      sounds.playEncourage();
      setStreak(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl">
            👀
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              لعبة العنصر المختلف (Odd One Out)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ابحث عن الرمز المختلف بين كل الرموز المتشابهة واضغط عليه بأسرع وقت!
            </p>
          </div>
        </div>

        {/* Grid Size Switcher */}
        <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-2xl border border-amber-200">
          <button
            onClick={() => {
              sounds.playPop();
              setGridSize(2);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition btn-bouncy ${
              gridSize === 2 ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            سهل (2x2)
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setGridSize(3);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition btn-bouncy ${
              gridSize === 3 ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            تحدي (3x3)
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-2xl border-2 border-amber-200 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>النقاط: <strong className="font-mono text-sm text-amber-800">{score}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>سلسلة صحيحة: <strong className="font-mono text-sm text-emerald-700">{streak}x 🔥</strong></span>
        </div>
        <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
          الموضوع: {currentTemplate.themeName}
        </div>
      </div>

      {/* Grid Canvas */}
      <div
        className={`grid ${
          gridSize === 2 ? 'grid-cols-2 max-w-xs' : 'grid-cols-3 max-w-sm'
        } gap-3 sm:gap-4 mx-auto w-full py-4`}
      >
        {[...Array(totalCells)].map((_, idx) => {
          const isOdd = idx === oddIndex;
          const emoji = isOdd ? currentTemplate.oddEmoji : currentTemplate.baseEmoji;

          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              className="aspect-square rounded-3xl bg-amber-50 hover:bg-amber-100 border-3 border-amber-200 hover:border-amber-400 flex items-center justify-center text-4xl sm:text-5xl transition-all shadow-sm active:scale-90 hover:scale-105 btn-bouncy"
            >
              <span>{emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
