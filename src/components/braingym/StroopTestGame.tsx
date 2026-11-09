import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RotateCcw, Brain, CheckCircle, XCircle } from 'lucide-react';

interface ColorItem {
  id: string;
  name: string;      // Word text in Arabic
  hex: string;       // Actual CSS color
  textColorClass: string;
  bgColorClass: string;
  borderColorClass: string;
}

const COLORS: ColorItem[] = [
  { id: 'red', name: 'أحمر', hex: '#EF4444', textColorClass: 'text-red-500', bgColorClass: 'bg-red-500', borderColorClass: 'border-red-500' },
  { id: 'blue', name: 'أزرق', hex: '#3B82F6', textColorClass: 'text-blue-500', bgColorClass: 'bg-blue-500', borderColorClass: 'border-blue-500' },
  { id: 'green', name: 'أخضر', hex: '#10B981', textColorClass: 'text-emerald-500', bgColorClass: 'bg-emerald-500', borderColorClass: 'border-emerald-500' },
  { id: 'yellow', name: 'أصفر', hex: '#F59E0B', textColorClass: 'text-amber-500', bgColorClass: 'bg-amber-500', borderColorClass: 'border-amber-500' },
  { id: 'purple', name: 'بنفسجي', hex: '#8B5CF6', textColorClass: 'text-purple-500', bgColorClass: 'bg-purple-500', borderColorClass: 'border-purple-500' },
  { id: 'orange', name: 'برتقالي', hex: '#F97316', textColorClass: 'text-orange-500', bgColorClass: 'bg-orange-500', borderColorClass: 'border-orange-500' },
];

interface StroopTestGameProps {
  onEarnStars: (stars: number) => void;
}

export const StroopTestGame: React.FC<StroopTestGameProps> = ({ onEarnStars }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentWord, setCurrentWord] = useState<ColorItem>(COLORS[0]);
  const [currentInk, setCurrentInk] = useState<ColorItem>(COLORS[1]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Generate next question (ensure ink is different or tricky)
  const nextRound = () => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let inkIdx = Math.floor(Math.random() * COLORS.length);
    // 80% of the time, make ink color different from the word to test Stroop interference
    if (Math.random() < 0.8) {
      while (inkIdx === wordIdx) {
        inkIdx = Math.floor(Math.random() * COLORS.length);
      }
    }
    setCurrentWord(COLORS[wordIdx]);
    setCurrentInk(COLORS[inkIdx]);
  };

  const startGame = () => {
    sounds.playPop();
    setTimeLeft(60);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    nextRound();
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameover');
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      const starsEarned = Math.max(1, Math.floor(score / 10));
      onEarnStars(starsEarned);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSelectColor = (selectedItem: ColorItem) => {
    if (gameState !== 'playing') return;

    setTotalAttempts(t => t + 1);
    const isCorrect = selectedItem.id === currentInk.id;

    if (isCorrect) {
      sounds.playSuccess();
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      sounds.playEncourage();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      nextRound();
    }, 250);
  };

  const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-rose-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-2xl">
            🧠
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              تحدي ستروب للتركيز وسرعة البديهة (Stroop Effect)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              اضغط على <span className="font-bold text-rose-600">لون الحبر المكتوب به</span> وليس معنى الكلمة!
            </p>
          </div>
        </div>
      </div>

      {/* LOBBY */}
      {gameState === 'lobby' && (
        <div className="text-center py-6 space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-xs text-slate-700 leading-relaxed text-right space-y-2">
            <p className="font-black text-amber-900 text-sm">💡 كيف تلعب؟</p>
            <p>
              ستظهر لك كلمة مثل <strong className="text-blue-500 text-base">"أحمر"</strong> ولكنها مكتوبة باللون <strong>الأزرق</strong>.
            </p>
            <p>
              مهمتك هي الضغط على زر <strong className="text-blue-600">الأزرق</strong> (لون الحبر الظاهر)، وتجاهل ما تعنيه الكلمة!
            </p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-105 text-white font-black text-base shadow-md transition btn-bouncy"
          >
            ابدأ اختبار التركيز (60 ثانية) ⚡
          </button>
        </div>
      )}

      {/* PLAYING */}
      {gameState === 'playing' && (
        <div className="flex flex-col gap-5">
          {/* Top HUD */}
          <div className="flex items-center justify-between bg-rose-50/80 px-4 py-2.5 rounded-2xl border-2 border-rose-200 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`} />
              <span>الوقت: <strong className="font-mono text-sm text-slate-900">{timeLeft} ثانية</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>الصحيحة: <strong className="font-mono text-sm text-amber-700">{score}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>سلسلة متتالية: <strong className="font-mono text-sm text-emerald-700">{streak}x 🔥</strong></span>
            </div>
          </div>

          {/* Main Stimulus Word */}
          <div className="h-44 sm:h-52 bg-slate-50 rounded-3xl border-3 border-slate-200 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {feedback === 'correct' && (
              <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center z-10 animate-scale-in">
                <CheckCircle className="w-16 h-16 text-emerald-600 animate-bounce" />
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-xs flex items-center justify-center z-10 animate-scale-in">
                <XCircle className="w-16 h-16 text-rose-600 animate-bounce" />
              </div>
            )}

            <span className="text-xs font-bold text-slate-400 mb-2">ما هو لون الحبر؟</span>
            <div
              className="text-5xl sm:text-6xl font-black tracking-wider transition-all"
              style={{ color: currentInk.hex }}
            >
              {currentWord.name}
            </div>
          </div>

          {/* Clickable Color Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COLORS.map(color => (
              <button
                key={color.id}
                onClick={() => handleSelectColor(color)}
                className="py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm flex items-center justify-center gap-2 transition shadow-xs btn-bouncy"
              >
                <span
                  className="w-4 h-4 rounded-full shadow-xs"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAMEOVER */}
      {gameState === 'gameover' && (
        <div className="text-center py-6 space-y-5 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 border-2 border-rose-300 text-rose-600 flex items-center justify-center text-3xl animate-bounce">
            🎯
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-800">انتهى الاختبار! نتيجة تركيزك مدهشة</h4>
            <p className="text-xs text-slate-500 mt-1">تقرير سرعة الاستجابة وتثبيط التشتت الذهني</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 bg-rose-50 p-4 rounded-2xl border-2 border-rose-200">
            <div>
              <div className="text-[11px] font-bold text-slate-500">النقاط</div>
              <div className="text-lg font-mono font-black text-rose-600">{score}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500">الدقة</div>
              <div className="text-lg font-mono font-black text-emerald-600">{accuracy}%</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500">التقييم</div>
              <div className="text-xs font-black text-indigo-700 mt-1">
                {accuracy >= 85 ? 'تركيز خارق 🌟' : accuracy >= 70 ? 'تركيز ممتاز 👏' : 'جيد جداً 👍'}
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm transition shadow-sm btn-bouncy flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة الاختبار
          </button>
        </div>
      )}
    </div>
  );
};
