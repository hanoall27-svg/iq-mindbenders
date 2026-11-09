import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Sparkles, Zap, Play } from 'lucide-react';

interface GridMemoryGameProps {
  onEarnStars: (stars: number) => void;
}

export const GridMemoryGame: React.FC<GridMemoryGameProps> = ({ onEarnStars }) => {
  const GRID_SIZE = 4; // 4x4 = 16 tiles
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

  const [level, setLevel] = useState(1);
  const [targetCount, setTargetCount] = useState(3); // Start with 3 tiles
  const [activeTiles, setActiveTiles] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<'idle' | 'memorizing' | 'recalling' | 'success' | 'failed'>('idle');
  const [score, setScore] = useState(0);

  const startRound = (lvl = level, count = targetCount) => {
    sounds.playPop();
    setSelectedTiles(new Set());
    setGameState('memorizing');

    // Pick random unique tiles
    const chosen = new Set<number>();
    while (chosen.size < count) {
      chosen.add(Math.floor(Math.random() * TOTAL_TILES));
    }
    setActiveTiles(chosen);
    setRevealed(true);

    // Show tiles for 1.3 seconds, then hide
    setTimeout(() => {
      setRevealed(false);
      setGameState('recalling');
    }, 1400);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'recalling') return;
    if (selectedTiles.has(index)) return;

    sounds.playPop();
    const nextSelected = new Set(selectedTiles);
    nextSelected.add(index);
    setSelectedTiles(nextSelected);

    if (activeTiles.has(index)) {
      // Correct tile clicked!
      if (nextSelected.size === activeTiles.size) {
        // Successfully recalled all tiles!
        sounds.playSuccess();
        setGameState('success');
        setScore(s => s + targetCount * 10);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        onEarnStars(2);

        setTimeout(() => {
          const nextLvl = level + 1;
          const nextCount = Math.min(8, 3 + Math.floor(nextLvl / 2));
          setLevel(nextLvl);
          setTargetCount(nextCount);
          startRound(nextLvl, nextCount);
        }, 1200);
      }
    } else {
      // Wrong tile clicked
      sounds.playEncourage();
      setGameState('failed');
      setRevealed(true); // show what the correct pattern was
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-emerald-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-2xl">
            🧩
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              الذاكرة المكانية والشبكية (Spatial Grid Memory)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              تذكر مواقع المربعات المضيئة واضغط عليها بعد اختفائها!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
            المستوى: <strong className="font-mono text-emerald-800 text-sm">{level}</strong>
          </div>
          <div className="bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            النقاط: <strong className="font-mono text-amber-800 text-sm">{score}</strong>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-xs sm:max-w-sm w-full p-4 bg-slate-50 rounded-3xl border-3 border-slate-200 shadow-inner">
          {[...Array(TOTAL_TILES)].map((_, idx) => {
            const isTarget = activeTiles.has(idx);
            const isSelected = selectedTiles.has(idx);
            const isLighted = revealed && isTarget;

            let bgColor = 'bg-white border-slate-200 hover:border-emerald-300';
            if (isLighted) {
              bgColor = 'bg-emerald-400 border-emerald-500 shadow-md scale-95';
            } else if (isSelected) {
              if (isTarget) {
                bgColor = 'bg-emerald-500 border-emerald-600 shadow-md text-white';
              } else {
                bgColor = 'bg-rose-400 border-rose-500 shadow-md text-white';
              }
            }

            return (
              <button
                key={idx}
                disabled={gameState !== 'recalling'}
                onClick={() => handleTileClick(idx)}
                className={`aspect-square rounded-2xl border-2 sm:border-3 transition-all duration-200 transform btn-bouncy ${bgColor}`}
              />
            );
          })}
        </div>

        {/* State Notice & Control */}
        <div className="mt-4 text-center text-xs font-bold">
          {gameState === 'idle' && (
            <button
              onClick={() => startRound(1, 3)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm transition btn-bouncy shadow-md"
            >
              ابدأ تدريب الذاكرة المكانية 🚀
            </button>
          )}

          {gameState === 'memorizing' && (
            <span className="text-amber-600 animate-pulse text-sm">
              👀 احفظ أماكن المربعات الخضراء ({targetCount} مربعات)...
            </span>
          )}

          {gameState === 'recalling' && (
            <span className="text-emerald-700 text-sm">
              👉 اضغط على المربعات التي كانت مضيئة ({selectedTiles.size} / {targetCount})
            </span>
          )}

          {gameState === 'success' && (
            <span className="text-emerald-600 text-sm font-black animate-bounce">
              🎉 رائع! ذاكرة بصرية استثنائية! الانتقال للمستوى التالي...
            </span>
          )}

          {gameState === 'failed' && (
            <div className="space-y-2">
              <span className="text-rose-600 block text-sm">
                ❌ لم تكن هذه هي الأماكن الصحيحة تماماً!
              </span>
              <button
                onClick={() => startRound(1, 3)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition btn-bouncy"
              >
                إعادة المحاولة من المستوى الأول 🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
