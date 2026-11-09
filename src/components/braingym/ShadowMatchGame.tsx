import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Star } from 'lucide-react';

interface ShadowLevel {
  id: string;
  name: string;
  emoji: string;
  silhouetteSvg: string; // SVG path or SVG visual representation
  options: { id: string; isCorrect: boolean; label: string; svgD: string }[];
}

const SHADOW_LEVELS = [
  {
    id: 'lion',
    name: 'الأسد الشجاع 🦁',
    emoji: '🦁',
    options: [
      { id: 'opt1', isCorrect: true, label: 'الظل 1', emoji: '🦁' },
      { id: 'opt2', isCorrect: false, label: 'الظل 2', emoji: '🐻' },
      { id: 'opt3', isCorrect: false, label: 'الظل 3', emoji: '🦊' },
    ]
  },
  {
    id: 'elephant',
    name: 'الفيل اللطيف 🐘',
    emoji: '🐘',
    options: [
      { id: 'opt1', isCorrect: false, label: 'الظل 1', emoji: '🦏' },
      { id: 'opt2', isCorrect: true, label: 'الظل 2', emoji: '🐘' },
      { id: 'opt3', isCorrect: false, label: 'الظل 3', emoji: '🦛' },
    ]
  },
  {
    id: 'rocket',
    name: 'الصاروخ الفضائي 🚀',
    emoji: '🚀',
    options: [
      { id: 'opt1', isCorrect: false, label: 'الظل 1', emoji: '✈️' },
      { id: 'opt2', isCorrect: false, label: 'الظل 2', emoji: '🚁' },
      { id: 'opt3', isCorrect: true, label: 'الظل 3', emoji: '🚀' },
    ]
  },
  {
    id: 'butterfly',
    name: 'الفراشة الملونة 🦋',
    emoji: '🦋',
    options: [
      { id: 'opt1', isCorrect: true, label: 'الظل 1', emoji: '🦋' },
      { id: 'opt2', isCorrect: false, label: 'الظل 2', emoji: '🐝' },
      { id: 'opt3', isCorrect: false, label: 'الظل 3', emoji: '🦇' },
    ]
  },
  {
    id: 'turtle',
    name: 'السلحفاة الصبورة 🐢',
    emoji: '🐢',
    options: [
      { id: 'opt1', isCorrect: false, label: 'الظل 1', emoji: '🦎' },
      { id: 'opt2', isCorrect: true, label: 'الظل 2', emoji: '🐢' },
      { id: 'opt3', isCorrect: false, label: 'الظل 3', emoji: '🐌' },
    ]
  },
];

interface ShadowMatchGameProps {
  onEarnStars: (stars: number) => void;
}

export const ShadowMatchGame: React.FC<ShadowMatchGameProps> = ({ onEarnStars }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const level = SHADOW_LEVELS[currentLevelIdx % SHADOW_LEVELS.length];

  const handleSelectOption = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 10);
      setStreak(s => s + 1);

      if ((currentLevelIdx + 1) % SHADOW_LEVELS.length === 0) {
        sounds.playFanfare();
        confetti({ particleCount: 50, spread: 70 });
        onEarnStars(3);
      }

      setCurrentLevelIdx(i => (i + 1) % SHADOW_LEVELS.length);
    } else {
      sounds.playEncourage();
      setStreak(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-emerald-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              لعبة الظل الصحيح (Shadow Match)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              انظر إلى الشكل الملون، واختر ظله الأسود الدقيق من بين الخيارات!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            النقاط: <strong className="font-mono text-amber-800 text-sm">{score}</strong>
          </div>
        </div>
      </div>

      {/* Target Item Display */}
      <div className="flex flex-col items-center justify-center gap-2 py-3">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-amber-50 border-3 border-amber-300 flex items-center justify-center text-6xl shadow-md animate-bounce">
          {level.emoji}
        </div>
        <span className="text-sm font-black text-slate-800 mt-1">{level.name}</span>
      </div>

      {/* Shadow Choices */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 block text-center mb-1">
          أين هو الظل الصحيح لهذا الكائن؟
        </span>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto w-full">
          {level.options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.isCorrect)}
              className="p-4 rounded-3xl bg-slate-900 hover:bg-slate-800 border-3 border-slate-700 flex flex-col items-center justify-center gap-2 transition-all shadow-md active:scale-95 btn-bouncy group"
            >
              {/* Silhouette with pure black brightness filter */}
              <span className="text-4xl filter brightness-0 invert opacity-90 group-hover:scale-110 transition-transform">
                {opt.emoji}
              </span>
              <span className="text-xs font-bold text-slate-300">الظل #{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
