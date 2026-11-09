import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RotateCcw } from 'lucide-react';

interface WhackAMoleGameProps {
  onEarnStars: (stars: number) => void;
}

export const WhackAMoleGame: React.FC<WhackAMoleGameProps> = ({ onEarnStars }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const TOTAL_HOLES = 9; // 3x3 grid

  const startGame = () => {
    sounds.playPop();
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setActiveHole(null);
    setGameState('playing');
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameover');
      sounds.playFanfare();
      confetti({ particleCount: 60, spread: 70 });
      const earned = Math.max(1, Math.floor(score / 50));
      onEarnStars(earned);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Mole pop loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const nextHole = Math.floor(Math.random() * TOTAL_HOLES);
      setActiveHole(nextHole);
      sounds.playPop();

      // Clear after 800ms
      setTimeout(() => {
        setActiveHole(curr => (curr === nextHole ? null : curr));
      }, 750);
    }, 950);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleWhack = (holeIdx: number) => {
    if (gameState !== 'playing') return;

    if (activeHole === holeIdx) {
      sounds.playSuccess();
      setActiveHole(null);
      setScore(s => s + 10 + streak * 2);
      setStreak(st => st + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl">
            🔨
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              امسك الأرنب السريع (Whack-a-Rabbit)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              اضغط على الأرنب بمجرد ظهوره من الجحر لتنمية سرعة رد الفعل والتنسيق البصري الحركي!
            </p>
          </div>
        </div>
      </div>

      {gameState === 'lobby' && (
        <div className="text-center py-8 space-y-4 max-w-md mx-auto">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            تحدي خاطف لمدة 30 ثانية! راقب جحور الحديقة واضغط على الأرنب قبل أن يختفي مجدداً!
          </p>
          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white font-black text-base shadow-md transition btn-bouncy"
          >
            ابدأ اللعبة السريعة (30 ثانية) 🚀
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-2xl border-2 border-amber-200 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-600 animate-bounce' : 'text-slate-600'}`} />
              <span>الوقت: <strong className="font-mono text-sm text-slate-900">{timeLeft} ثانية</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>النقاط: <strong className="font-mono text-sm text-amber-700">{score}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>سلسلة: <strong className="font-mono text-sm text-emerald-700">{streak}x 🔥</strong></span>
            </div>
          </div>

          {/* 3x3 Garden Holes */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-sm mx-auto w-full py-2">
            {[...Array(TOTAL_HOLES)].map((_, idx) => {
              const hasMole = activeHole === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handleWhack(idx)}
                  className="aspect-square rounded-3xl bg-gradient-to-b from-amber-100 to-amber-200 border-3 border-amber-400 shadow-inner flex items-center justify-center relative overflow-hidden cursor-pointer"
                >
                  {/* Grass rim */}
                  <div className="absolute bottom-0 inset-x-0 h-4 bg-emerald-400/50 rounded-b-2xl" />

                  {/* Popping Bunny */}
                  {hasMole && (
                    <button
                      className="text-5xl sm:text-6xl animate-bounce transform active:scale-75 transition-all select-none"
                    >
                      🐰
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center py-6 space-y-4 max-w-md mx-auto">
          <div className="text-5xl animate-bounce">🥕</div>
          <h4 className="text-xl font-black text-slate-800">أداء خاطف! لقد جمعت {score} نقطة</h4>
          <p className="text-xs text-slate-500">استجابة بصرية وحركية ممتازة!</p>
          <button
            onClick={startGame}
            className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm transition btn-bouncy"
          >
            العب مرة ثانية 🔄
          </button>
        </div>
      )}
    </div>
  );
};
