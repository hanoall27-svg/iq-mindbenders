import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RotateCcw } from 'lucide-react';

interface MathQuestion {
  num1: number;
  num2: number;
  op: '+' | '-' | '×';
  correct: number;
  options: number[];
}

interface SpeedMathGameProps {
  onEarnStars: (stars: number) => void;
}

export const SpeedMathGame: React.FC<SpeedMathGameProps> = ({ onEarnStars }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQ, setCurrentQ] = useState<MathQuestion | null>(null);

  const generateQuestion = (): MathQuestion => {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = 0;
    let num2 = 0;
    let correct = 0;

    if (op === '+') {
      num1 = Math.floor(Math.random() * 30) + 5;
      num2 = Math.floor(Math.random() * 30) + 5;
      correct = num1 + num2;
    } else if (op === '-') {
      num1 = Math.floor(Math.random() * 40) + 15;
      num2 = Math.floor(Math.random() * (num1 - 5)) + 3;
      correct = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      correct = num1 * num2;
    }

    const wrong1 = correct + (Math.random() < 0.5 ? 2 : -2);
    const wrong2 = correct + (Math.random() < 0.5 ? 10 : -5);
    const wrong3 = correct + (Math.random() < 0.5 ? 1 : -1);

    const rawOptions = Array.from(new Set([correct, wrong1, wrong2, wrong3]));
    while (rawOptions.length < 4) {
      rawOptions.push(correct + rawOptions.length * 3);
    }
    const options = rawOptions.sort(() => Math.random() - 0.5);

    return { num1, num2, op, correct, options };
  };

  const startGame = () => {
    sounds.playPop();
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setCurrentQ(generateQuestion());
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameover');
      sounds.playFanfare();
      confetti({ particleCount: 60, spread: 70 });
      const starsEarned = Math.max(1, Math.floor(score / 40));
      onEarnStars(starsEarned);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSelectAnswer = (ans: number) => {
    if (gameState !== 'playing' || !currentQ) return;

    if (ans === currentQ.correct) {
      sounds.playSuccess();
      setScore(s => s + 10 + streak * 2);
      setStreak(s => s + 1);
    } else {
      sounds.playEncourage();
      setStreak(0);
    }

    setCurrentQ(generateQuestion());
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-orange-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              الرياضيات السريعة (Speed Math Sprint)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              أجب عن أكبر قدر من العمليات الحسابية الذهنية في 45 ثانية!
            </p>
          </div>
        </div>
      </div>

      {gameState === 'lobby' && (
        <div className="text-center py-8 space-y-4 max-w-md mx-auto">
          <p className="text-xs text-slate-600 leading-relaxed">
            تنشيط فوري لسرعة المعالجة الذهنية (Gs) والتفكير السائل (Gf). اجمع النقاط ومضاعفات السلسلة الصحيحة!
          </p>
          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-base shadow-md transition btn-bouncy"
          >
            ابدأ سباق الرياضيات (45 ثانية) 🚀
          </button>
        </div>
      )}

      {gameState === 'playing' && currentQ && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between bg-orange-50/80 px-4 py-2.5 rounded-2xl border-2 border-orange-200 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`} />
              <span>الوقت: <strong className="font-mono text-sm text-slate-900">{timeLeft}s</strong></span>
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

          <div className="h-40 bg-slate-50 rounded-3xl border-3 border-slate-200 flex items-center justify-center shadow-inner">
            <div className="text-5xl sm:text-6xl font-black font-mono text-slate-800 tracking-wider">
              {currentQ.num1} {currentQ.op} {currentQ.num2} = ؟
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectAnswer(opt)}
                className="py-4 rounded-2xl border-2 border-slate-200 hover:border-orange-400 bg-white hover:bg-orange-50 text-slate-900 font-mono font-black text-2xl transition shadow-xs btn-bouncy"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center py-6 space-y-5 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-100 border-2 border-orange-300 text-orange-600 flex items-center justify-center text-3xl animate-bounce">
            🏆
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-800">انتهى الوقت! أداء حسابي خارق</h4>
            <p className="text-xs text-slate-500 mt-1">حققت {score} نقطة في 45 ثانية!</p>
          </div>
          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm transition btn-bouncy"
          >
            إعادة المحاولة 🔄
          </button>
        </div>
      )}
    </div>
  );
};
