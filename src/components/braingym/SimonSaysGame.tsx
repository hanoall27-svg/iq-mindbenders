import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Zap, Play } from 'lucide-react';

interface SimonColor {
  id: number;
  name: string;
  bgActive: string;
  bgNormal: string;
  borderColor: string;
}

const SIMON_PADS: SimonColor[] = [
  { id: 0, name: 'أخضر', bgActive: 'bg-emerald-400', bgNormal: 'bg-emerald-500', borderColor: 'border-emerald-600' },
  { id: 1, name: 'أحمر', bgActive: 'bg-rose-400', bgNormal: 'bg-rose-500', borderColor: 'border-rose-600' },
  { id: 2, name: 'أصفر', bgActive: 'bg-amber-300', bgNormal: 'bg-amber-400', borderColor: 'border-amber-500' },
  { id: 3, name: 'أزرق', bgActive: 'bg-blue-400', bgNormal: 'bg-blue-500', borderColor: 'border-blue-600' },
];

interface SimonSaysGameProps {
  onEarnStars: (stars: number) => void;
}

export const SimonSaysGame: React.FC<SimonSaysGameProps> = ({ onEarnStars }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [highScore, setHighScore] = useState(0);

  const startNewGame = () => {
    sounds.playPop();
    const firstColor = Math.floor(Math.random() * 4);
    const newSeq = [firstColor];
    setSequence(newSeq);
    setUserStep(0);
    setGameState('playing');
    playSequence(newSeq);
  };

  const playSequence = (seq: number[]) => {
    setIsPlayingSeq(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= seq.length) {
        clearInterval(interval);
        setActivePad(null);
        setIsPlayingSeq(false);
        setUserStep(0);
        return;
      }
      const padId = seq[step];
      setActivePad(padId);
      sounds.playPop();
      setTimeout(() => setActivePad(null), 350);
      step++;
    }, 650);
  };

  const handlePadClick = (padId: number) => {
    if (isPlayingSeq || gameState !== 'playing') return;

    sounds.playPop();
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    if (padId === sequence[userStep]) {
      // Correct step
      const nextStep = userStep + 1;
      if (nextStep === sequence.length) {
        // Completed the whole sequence!
        sounds.playSuccess();
        const nextScore = sequence.length;
        if (nextScore > highScore) setHighScore(nextScore);

        if (nextScore % 3 === 0) {
          sounds.playFanfare();
          confetti({ particleCount: 40, spread: 60 });
          onEarnStars(2);
        }

        // Add one more color to sequence
        const nextColor = Math.floor(Math.random() * 4);
        const nextSeq = [...sequence, nextColor];
        setSequence(nextSeq);
        setTimeout(() => {
          playSequence(nextSeq);
        }, 900);
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Failed sequence
      sounds.playEncourage();
      setGameState('gameover');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-indigo-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-2xl">
            🔮
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              تسلسل الألوان والأصوات (Simon Says)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              راقب تسلسل ومضات الألوان وكرر نفس النمط بالترتيب بدقة!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-200">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>أعلى مستوى: <strong className="font-mono text-indigo-900">{highScore}</strong></span>
        </div>
      </div>

      {/* Main Console */}
      <div className="flex flex-col items-center justify-center py-4">
        {/* Simon 4-pad Wheel */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-3 bg-slate-900 border-4 border-slate-700 shadow-xl grid grid-cols-2 gap-3 items-center justify-center">
          {SIMON_PADS.map(pad => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSeq || gameState !== 'playing'}
                className={`w-full h-full rounded-2xl border-3 transition-all duration-150 transform ${
                  isActive
                    ? `${pad.bgActive} scale-95 brightness-125 shadow-lg ring-4 ring-white`
                    : `${pad.bgNormal} ${pad.borderColor} hover:brightness-110 active:scale-95`
                }`}
              />
            );
          })}

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white border-4 border-slate-800 flex flex-col items-center justify-center shadow-md">
            {gameState === 'playing' ? (
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block">المستوى</span>
                <span className="text-xl font-black font-mono text-indigo-700">{sequence.length}</span>
              </div>
            ) : (
              <button
                onClick={startNewGame}
                className="w-full h-full rounded-full flex flex-col items-center justify-center gap-1 hover:bg-indigo-50 transition text-indigo-700 font-black text-xs"
              >
                <Play className="w-6 h-6 fill-indigo-600 text-indigo-600 ml-0.5" />
                <span>ابدأ</span>
              </button>
            )}
          </div>
        </div>

        {/* State Notice */}
        <div className="mt-4 text-center text-xs font-bold">
          {isPlayingSeq && (
            <span className="text-indigo-600 animate-pulse">
              👀 راقب تسلسل الألوان الآن...
            </span>
          )}
          {!isPlayingSeq && gameState === 'playing' && (
            <span className="text-emerald-600">
              👉 دورك الآن! اضغط على الألوان بنفس الترتيب ({userStep} / {sequence.length})
            </span>
          )}
          {gameState === 'gameover' && (
            <div className="space-y-2">
              <span className="text-rose-600 block">
                ❌ خطأ في التسلسل! وصلت إلى المستوى {sequence.length}.
              </span>
              <button
                onClick={startNewGame}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition btn-bouncy"
              >
                حاول مرة ثانية 🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
