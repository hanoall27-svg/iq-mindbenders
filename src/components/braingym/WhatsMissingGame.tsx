import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Eye, HelpCircle } from 'lucide-react';

const ITEMS_COLLECTION = [
  { id: 'apple', emoji: '🍎', label: 'تفاحة' },
  { id: 'banana', emoji: '🍌', label: 'موزة' },
  { id: 'grape', emoji: '🍇', label: 'عنب' },
  { id: 'strawberry', emoji: '🍓', label: 'فراولة' },
  { id: 'watermelon', emoji: '🍉', label: 'بطيخ' },
  { id: 'orange', emoji: '🍊', label: 'برتقال' },
  { id: 'lemon', emoji: '🍋', label: 'ليمون' },
  { id: 'cherry', emoji: '🍒', label: 'كرز' },
];

interface WhatsMissingGameProps {
  onEarnStars: (stars: number) => void;
}

export const WhatsMissingGame: React.FC<WhatsMissingGameProps> = ({ onEarnStars }) => {
  const [currentSet, setCurrentSet] = useState<typeof ITEMS_COLLECTION>([]);
  const [missingItem, setMissingItem] = useState<(typeof ITEMS_COLLECTION)[0] | null>(null);
  const [remainingSet, setRemainingSet] = useState<typeof ITEMS_COLLECTION>([]);
  const [stage, setStage] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const startRound = () => {
    sounds.playPop();
    // Pick 5 random items
    const shuffled = [...ITEMS_COLLECTION].sort(() => Math.random() - 0.5).slice(0, 5);
    setCurrentSet(shuffled);

    // Pick 1 to hide
    const hideIdx = Math.floor(Math.random() * shuffled.length);
    const hidden = shuffled[hideIdx];
    setMissingItem(hidden);

    const leftOver = shuffled.filter((_, idx) => idx !== hideIdx);
    setRemainingSet(leftOver);

    setStage('memorize');

    // After 3 seconds, hide the item and enter recall phase
    setTimeout(() => {
      setStage('recall');
    }, 3200);
  };

  useEffect(() => {
    startRound();
  }, []);

  const handleChoose = (item: (typeof ITEMS_COLLECTION)[0]) => {
    if (stage !== 'recall' || !missingItem) return;

    if (item.id === missingItem.id) {
      sounds.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
      setScore(s => s + 15);
      setStreak(st => st + 1);
      onEarnStars(2);
      setStage('result');
      setTimeout(startRound, 1500);
    } else {
      sounds.playEncourage();
      setStreak(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-indigo-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-2xl">
            🧐
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              إيه اللي اختفى؟ (What's Missing?)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              احفظ العناصر الـ 5 جيداً قبل أن يختفي أحدها، ثم حدد ما هو العنصر المفقود!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            النقاط: <strong className="font-mono text-amber-800 text-sm">{score}</strong>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {stage === 'memorize' && (
          <div className="space-y-4 text-center">
            <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200 inline-block animate-pulse">
              👀 احفظ العناصر الخمسة جيداً الآن...
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {currentSet.map(item => (
                <div
                  key={item.id}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-amber-50 border-3 border-amber-300 flex flex-col items-center justify-center shadow-md animate-scale-in"
                >
                  <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'recall' && (
          <div className="space-y-4 text-center w-full">
            <div className="text-xs font-bold text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 inline-block">
              ❓ لقد اختفى أحد العناصر! أي عنصر مفقود؟
            </div>

            {/* Remaining items on table */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap my-2">
              {remainingSet.map(item => (
                <div
                  key={item.id}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center opacity-80"
                >
                  <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">{item.label}</span>
                </div>
              ))}
              {/* Mystery Box */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-rose-100 border-3 border-dashed border-rose-400 flex flex-col items-center justify-center text-3xl font-black text-rose-600 animate-bounce">
                ؟
              </div>
            </div>

            {/* Options to guess from */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
              {currentSet.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleChoose(item)}
                  className="p-3 rounded-2xl bg-white hover:bg-amber-100 border-2 border-slate-200 hover:border-amber-400 flex flex-col items-center gap-1 transition shadow-xs btn-bouncy"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'result' && missingItem && (
          <div className="text-center p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 animate-scale-in">
            <span className="text-4xl">{missingItem.emoji}</span>
            <h4 className="text-sm font-black text-emerald-900 mt-1">
              إجابة عبقرية! كان العنصر المفقود هو: {missingItem.label} 🌟
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
