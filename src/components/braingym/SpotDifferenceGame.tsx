import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

interface DifferenceScene {
  id: string;
  title: string;
  gridLeft: string[][];
  gridRight: string[][];
  diffCoords: { r: number; c: number }[]; // Coordinates where right differs from left
}

const DIFFERENCE_SCENES: DifferenceScene[] = [
  {
    id: 'scene1',
    title: 'حديقة الحيوانات المرحة 🌴',
    gridLeft: [
      ['🦁', '🌴', '🐒', '🍌'],
      ['🐘', '💧', '🌸', '🦒'],
      ['🦋', '🌱', '☀️', '🐰'],
    ],
    gridRight: [
      ['🦁', '🌴', '🐵', '🍌'], // (0, 2) 🐒 vs 🐵
      ['🐘', '💧', '🌺', '🦒'], // (1, 2) 🌸 vs 🌺
      ['🦋', '🌱', '☀️', '🦊'], // (2, 3) 🐰 vs 🦊
    ],
    diffCoords: [
      { r: 0, c: 2 },
      { r: 1, c: 2 },
      { r: 2, c: 3 },
    ]
  },
  {
    id: 'scene2',
    title: 'سماء الفضاء والمجرات 🚀',
    gridLeft: [
      ['🚀', '⭐', '🪐', '✨'],
      ['🌌', '🛸', '🌙', '☄️'],
      ['🌍', '⭐', '👨‍🚀', '🛰️'],
    ],
    gridRight: [
      ['🚀', '🌟', '🪐', '✨'], // (0, 1) ⭐ vs 🌟
      ['🌌', '🛸', '🌕', '☄️'], // (1, 2) 🌙 vs 🌕
      ['🌍', '⭐', '👾', '🛰️'], // (2, 2) 👨‍🚀 vs 👾
    ],
    diffCoords: [
      { r: 0, c: 1 },
      { r: 1, c: 2 },
      { r: 2, c: 2 },
    ]
  }
];

interface SpotDifferenceGameProps {
  onEarnStars: (stars: number) => void;
}

export const SpotDifferenceGame: React.FC<SpotDifferenceGameProps> = ({ onEarnStars }) => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [foundDiffs, setFoundDiffs] = useState<string[]>([]);

  const currentScene = DIFFERENCE_SCENES[sceneIdx % DIFFERENCE_SCENES.length];

  const handleTileClick = (r: number, c: number) => {
    const coordKey = `${r}-${c}`;
    if (foundDiffs.includes(coordKey)) return;

    const isDifference = currentScene.diffCoords.some(d => d.r === r && d.c === c);

    if (isDifference) {
      sounds.playSuccess();
      const nextFound = [...foundDiffs, coordKey];
      setFoundDiffs(nextFound);

      if (nextFound.length === currentScene.diffCoords.length) {
        sounds.playFanfare();
        confetti({ particleCount: 50, spread: 60 });
        onEarnStars(3);
      }
    } else {
      sounds.playEncourage();
    }
  };

  const handleNextScene = () => {
    sounds.playPop();
    setFoundDiffs([]);
    setSceneIdx(i => (i + 1) % DIFFERENCE_SCENES.length);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-sky-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-2xl">
            🔎
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              دور على الفرق (Spot the Difference)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              قارن بين المشهدين واضغط على الرموز المختلفة في المشهد الأيسر!
            </p>
          </div>
        </div>

        <div className="text-xs font-bold bg-sky-50 px-3 py-1.5 rounded-2xl border border-sky-200 text-sky-800">
          الاختلافات المكتشفة: <strong className="font-mono text-sm">{foundDiffs.length} / {currentScene.diffCoords.length}</strong>
        </div>
      </div>

      {/* Two scenes side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        {/* Left Scene (Reference) */}
        <div className="flex flex-col items-center gap-2 bg-slate-50 p-4 rounded-3xl border-2 border-slate-200">
          <span className="text-xs font-bold text-slate-600">المشهد الأول (الأصلي)</span>
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
            {currentScene.gridLeft.map((row, r) =>
              row.map((emoji, c) => (
                <div
                  key={`${r}-${c}`}
                  className="aspect-square rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-xs"
                >
                  {emoji}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Scene (Clickable Differences) */}
        <div className="flex flex-col items-center gap-2 bg-amber-50/70 p-4 rounded-3xl border-2 border-amber-300">
          <span className="text-xs font-bold text-amber-800">المشهد الثاني (اضغط على الفروقات هنا)</span>
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
            {currentScene.gridRight.map((row, r) =>
              row.map((emoji, c) => {
                const isFound = foundDiffs.includes(`${r}-${c}`);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleTileClick(r, c)}
                    className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-3xl transition-all btn-bouncy ${
                      isFound
                        ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-105 shadow-md'
                        : 'bg-white hover:bg-amber-100 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {foundDiffs.length === currentScene.diffCoords.length && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-3 animate-scale-in">
          <span className="text-xs font-black text-emerald-900">
            🎉 مبروك! اكتشفت جميع الفروقات بدقة متناهية!
          </span>
          <button
            onClick={handleNextScene}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition btn-bouncy"
          >
            المشهد التالي 🚀
          </button>
        </div>
      )}
    </div>
  );
};
