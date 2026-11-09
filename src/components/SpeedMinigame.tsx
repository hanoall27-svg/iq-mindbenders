import React, { useState, useEffect } from 'react';
import { Question, AgeGroup } from '../types';
import { Timer, Zap, Trophy, RotateCcw, CheckCircle, XCircle, Star, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SpeedMinigameProps {
  questions: Question[];
  onFinish?: (finalScore: number, earnedStars: number) => void;
}

export const SpeedMinigame: React.FC<SpeedMinigameProps> = ({ questions, onFinish }) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('explore');
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Filter questions for the chosen age
  const pool = questions.filter(q => q.ageGroup === selectedAge);
  const activeQ = pool[currentIdx % (pool.length || 1)];

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameover');
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      const starsEarned = Math.max(1, Math.floor(score / 200));
      if (onFinish) onFinish(score, starsEarned);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    sounds.playPop();
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
    setCorrectCount(0);
    setCurrentIdx(Math.floor(Math.random() * (pool.length || 1)));
    setGameState('playing');
  };

  const handleSelectAnswer = (option: string) => {
    if (gameState !== 'playing' || !activeQ) return;

    setAnsweredCount(c => c + 1);
    const isCorrect =
      option.startsWith(String(activeQ.answer)) ||
      option === String(activeQ.answer) ||
      (activeQ.answer === 'مطرقة واحدة' && option.includes('مطرقة'));

    if (isCorrect) {
      sounds.playSuccess();
      setFeedback('correct');
      const points = 100 + streak * 30;
      setScore(s => s + points);
      setStreak(s => s + 1);
      setCorrectCount(c => c + 1);
    } else {
      sounds.playEncourage();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentIdx(i => i + 1);
    }, 350);
  };

  return (
    <div className="bg-white/95 border-3 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-slate-800" dir="rtl">
      {/* Background playful accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* LOBBY STATE */}
      {gameState === 'lobby' && (
        <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-lg animate-float">
            <Zap className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              سباق الذكاء السريع (60 ثانية) ⚡
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              تحدَّ سرعتك الذهنية وحل أكبر عدد من الألغاز في دقيقة واحدة! اجمع النجوم 🌟 ومضاعفات النقاط الذهبية.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              اختر الفئة العمرية للسباق:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('sprout');
                }}
                className={`p-3 rounded-2xl border-2 text-xs font-bold transition flex flex-col items-center gap-1 btn-bouncy ${
                  selectedAge === 'sprout'
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-900 shadow-md ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">🧒</span>
                <span>4 - 7 سنين</span>
                <span className="text-[10px] text-slate-400">براعم</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('explore');
                }}
                className={`p-3 rounded-2xl border-2 text-xs font-bold transition flex flex-col items-center gap-1 btn-bouncy ${
                  selectedAge === 'explore'
                    ? 'border-amber-500 bg-amber-100 text-amber-900 shadow-md ring-2 ring-amber-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">🎒</span>
                <span>8 - 12 سنة</span>
                <span className="text-[10px] text-slate-400">استكشاف</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('challenge');
                }}
                className={`p-3 rounded-2xl border-2 text-xs font-bold transition flex flex-col items-center gap-1 btn-bouncy ${
                  selectedAge === 'challenge'
                    ? 'border-indigo-500 bg-indigo-100 text-indigo-900 shadow-md ring-2 ring-indigo-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">⚡</span>
                <span>13 - 17 سنة</span>
                <span className="text-[10px] text-slate-400">تحدي</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge('grow');
                }}
                className={`p-3 rounded-2xl border-2 text-xs font-bold transition flex flex-col items-center gap-1 btn-bouncy ${
                  selectedAge === 'grow'
                    ? 'border-rose-500 bg-rose-100 text-rose-900 shadow-md ring-2 ring-rose-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">🧠</span>
                <span>18+ سنة</span>
                <span className="text-[10px] text-slate-400">نمو ذهني</span>
              </button>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:brightness-105 text-white font-black text-base shadow-lg transition btn-bouncy"
          >
            انطلق الآن في التحدي! 🚀
          </button>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && activeQ && (
        <div className="space-y-5">
          {/* Top HUD */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50/80 rounded-2xl border-2 border-amber-200">
            <div className="flex items-center gap-2">
              <Timer className={`h-6 w-6 ${timeLeft <= 10 ? 'text-rose-500 animate-bounce' : 'text-amber-600'}`} />
              <span className={`text-base font-mono font-black ${timeLeft <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                {timeLeft} ثانية
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1">
                النقاط: <strong className="text-amber-600 font-mono text-base">{score}</strong>
              </span>
              <span className="text-slate-600 flex items-center gap-1">
                سلسلة متتالية:{' '}
                <strong className="text-emerald-600 font-mono text-base">
                  {streak}x 🔥
                </strong>
              </span>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-200 relative min-h-[120px] flex flex-col justify-center">
            {feedback === 'correct' && (
              <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xs z-10 transition">
                <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="absolute inset-0 bg-rose-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xs z-10 transition">
                <XCircle className="h-16 w-16 text-rose-500 animate-bounce" />
              </div>
            )}

            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line text-center">
              {activeQ.text}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt)}
                className="p-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 text-slate-800 text-sm font-bold text-center transition shadow-xs btn-bouncy"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME OVER STATE */}
      {gameState === 'gameover' && (
        <div className="text-center py-6 space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center border-3 border-amber-300 animate-bounce">
            <Trophy className="h-12 w-12" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-800">انتهى الوقت! إنجاز رائع 🏆</h3>
            <p className="text-sm text-slate-600 mt-1">لقد أثبتّ قدرة ذهنية استثنائية وسرعة مدهشة!</p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center">
            <div>
              <div className="text-xs text-slate-500 font-bold">النقاط الكلية</div>
              <div className="text-xl font-mono font-black text-amber-600">{score}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">الصحيحة</div>
              <div className="text-xl font-mono font-black text-emerald-600">
                {correctCount} / {answeredCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">نسبة الدقة</div>
              <div className="text-xl font-mono font-black text-indigo-600">
                {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-105 text-white font-black text-sm flex items-center justify-center gap-2 transition btn-bouncy shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              إعادة السباق
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setGameState('lobby');
              }}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
            >
              تغيير الفئة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
