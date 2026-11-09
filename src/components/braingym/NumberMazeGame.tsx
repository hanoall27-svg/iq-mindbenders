import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RotateCcw } from 'lucide-react';

interface NumberMazeGameProps {
  onEarnStars: (stars: number) => void;
}

export const NumberMazeGame: React.FC<NumberMazeGameProps> = ({ onEarnStars }) => {
  const MAX_NUMBER = 20;
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentExpected, setCurrentExpected] = useState(1);
  const [timer, setTimer] = useState(0); // in tenths of a second
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const initGame = () => {
    sounds.playPop();
    const arr = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1);
    // Shuffle
    const shuffled = arr.sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
    setCurrentExpected(1);
    setTimer(0);
    setIsFinished(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (!isPlaying || isFinished) return;
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, isFinished]);

  const handleNumberClick = (num: number) => {
    if (!isPlaying || isFinished) return;

    if (num === currentExpected) {
      sounds.playPop();
      if (num === MAX_NUMBER) {
        // Finished!
        sounds.playFanfare();
        setIsFinished(true);
        setIsPlaying(false);
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        onEarnStars(3);

        const finalSec = timer / 10;
        if (bestTime === null || finalSec < bestTime) {
          setBestTime(finalSec);
        }
      } else {
        setCurrentExpected(c => c + 1);
      }
    } else {
      sounds.playEncourage();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl">
            🔢
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              المتاهة الرقمية السريعة (Number Maze 1 - 20)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              اضغط على الأرقام بالترتيب التصاعدي من 1 إلى 20 بأسرع وقت ممكن!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bestTime !== null && (
            <div className="text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 text-amber-800">
              أفضل توقيت: <strong className="font-mono">{bestTime.toFixed(1)} ثانية</strong> ⚡
            </div>
          )}
        </div>
      </div>

      {/* HUD Bar */}
      <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-2xl border-2 border-amber-200 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-amber-600" />
          <span>الوقت: <strong className="font-mono text-sm text-slate-900">{(timer / 10).toFixed(1)} ثانية</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span>الرقم المطلوب الآن: <strong className="font-mono text-base text-rose-600">{currentExpected}</strong></span>
        </div>
        <button
          onClick={initGame}
          className="p-1.5 rounded-xl bg-white hover:bg-amber-100 text-slate-700 border border-amber-300 transition"
          title="إعادة تشغيل"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4x5 or 5x4 Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 max-w-md mx-auto w-full py-2">
        {numbers.map(num => {
          const isDone = num < currentExpected;
          const isCurrent = num === currentExpected;

          return (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={isDone || isFinished}
              className={`aspect-square rounded-2xl border-2 sm:border-3 font-mono font-black text-lg sm:text-xl transition-all btn-bouncy flex items-center justify-center shadow-xs ${
                isDone
                  ? 'bg-slate-100 border-slate-200 text-slate-300 scale-95 opacity-50 cursor-not-allowed'
                  : isCurrent
                  ? 'bg-gradient-to-tr from-amber-400 to-orange-400 border-amber-600 text-white scale-105 shadow-md ring-2 ring-amber-300'
                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-800'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Completion */}
      {isFinished && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 animate-scale-in">
          <div>
            <h4 className="text-sm font-black text-emerald-900">سرعة بديهة فائقة!</h4>
            <p className="text-xs text-emerald-700">
              أكملت المتاهة في {(timer / 10).toFixed(1)} ثانية! وحصلت على 3 نجوم ذهبية ⭐
            </p>
          </div>
          <button
            onClick={initGame}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition btn-bouncy"
          >
            حطم رقمك القياسي ⚡
          </button>
        </div>
      )}
    </div>
  );
};
