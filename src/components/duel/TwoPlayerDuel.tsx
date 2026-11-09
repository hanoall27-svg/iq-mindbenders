import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Zap, RotateCcw, Swords, Flame, Crown } from 'lucide-react';

interface DuelRound {
  question: string;
  options: string[];
  correct: string;
  emoji: string;
}

const DUEL_QUESTIONS: DuelRound[] = [
  { question: 'ما هو حاصل جمع: 7 + 8؟', options: ['14', '15', '16', '13'], correct: '15', emoji: '🧮' },
  { question: 'ما هو الحيوان الأسرع؟', options: ['الفهد 🐆', 'السلحفاة 🐢', 'الحلزون 🐌', 'الباندا 🐼'], correct: 'الفهد 🐆', emoji: '⚡' },
  { question: 'ما هو حاصل ضرب: 6 × 4؟', options: ['24', '20', '28', '22'], correct: '24', emoji: '✖️' },
  { question: 'أي من هؤلاء فاكهة حمراء؟', options: ['الموز 🍌', 'الفراولة 🍓', 'الليمون 🍋', 'الخيار 🥒'], correct: 'الفراولة 🍓', emoji: '🍓' },
  { question: 'كم عدد أضلاع المثلث؟', options: ['3 أضلاع', '4 أضلاع', '5 أضلاع', '6 أضلاع'], correct: '3 أضلاع', emoji: '📐' },
  { question: 'ما هو حاصل طرح: 20 - 7؟', options: ['12', '13', '14', '11'], correct: '13', emoji: '➖' },
  { question: 'أي كائن يعيش في الماء؟', options: ['الدلفين 🐬', 'العصفور 🐦', 'الأرنب 🐰', 'الأسد 🦁'], correct: 'الدلفين 🐬', emoji: '🌊' },
  { question: 'ما هو حاصل ضرب: 9 × 3؟', options: ['27', '24', '26', '28'], correct: '27', emoji: '⭐' },
];

export const TwoPlayerDuel: React.FC = () => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [roundIdx, setRoundIdx] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [winner, setWinner] = useState<'p1' | 'p2' | 'draw' | null>(null);
  const [lockedRound, setLockedRound] = useState(false);

  const currentQ = DUEL_QUESTIONS[roundIdx % DUEL_QUESTIONS.length];

  const startDuel = () => {
    sounds.playPop();
    setP1Score(0);
    setP2Score(0);
    setRoundIdx(0);
    setWinner(null);
    setLockedRound(false);
    setGameState('playing');
  };

  const handlePlayerAnswer = (player: 'p1' | 'p2', option: string) => {
    if (lockedRound || gameState !== 'playing') return;

    if (option === currentQ.correct) {
      sounds.playSuccess();
      setLockedRound(true);

      if (player === 'p1') {
        const nextScore = p1Score + 1;
        setP1Score(nextScore);
        if (nextScore >= 5) {
          endGame('p1');
          return;
        }
      } else {
        const nextScore = p2Score + 1;
        setP2Score(nextScore);
        if (nextScore >= 5) {
          endGame('p2');
          return;
        }
      }

      setTimeout(() => {
        setRoundIdx(r => r + 1);
        setLockedRound(false);
      }, 700);
    } else {
      sounds.playEncourage();
    }
  };

  const endGame = (win: 'p1' | 'p2') => {
    setWinner(win);
    setGameState('gameover');
    sounds.playFanfare();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-indigo-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-2xl">
            ⚔️
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              تحدي العمالقة لشخصين (2-Player Versus Duel)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              العب مع صديقك أو مع والدك على نفس الشاشة! أول من يضغط على الإجابة الصحيحة يربح النقطة (أول من يصل لـ 5 نقاط يفوز 🏆)
            </p>
          </div>
        </div>
      </div>

      {gameState === 'lobby' && (
        <div className="text-center py-8 space-y-5 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-6">
            <div className="p-4 rounded-3xl bg-blue-50 border-3 border-blue-300 text-center">
              <span className="text-4xl block mb-1">🔵</span>
              <span className="text-xs font-black text-blue-900">اللاعب الأول</span>
            </div>
            <Swords className="w-8 h-8 text-indigo-500 animate-pulse" />
            <div className="p-4 rounded-3xl bg-orange-50 border-3 border-orange-300 text-center">
              <span className="text-4xl block mb-1">🟠</span>
              <span className="text-xs font-black text-orange-900">اللاعب الثاني</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            ضع الجهاز بينكما، ركز في السؤال المعروض في المنتصف، واضغط على الإجابة الصحيحة بأسرع ما يمكن في منطقتك!
          </p>

          <button
            onClick={startDuel}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-orange-500 text-white font-black text-base shadow-md transition btn-bouncy"
          >
            ابدأ النزال العائلي الآن ⚔️🚀
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col gap-4">
          {/* Shared Question in Center */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white text-center shadow-lg relative border-2 border-indigo-400">
            <span className="text-3xl block mb-1">{currentQ.emoji}</span>
            <h4 className="text-base sm:text-lg font-black">{currentQ.question}</h4>
            <div className="flex items-center justify-between text-xs font-mono font-bold mt-2 pt-2 border-t border-slate-700 text-slate-300">
              <span>🔵 نقاط اللاعب الأول: {p1Score}</span>
              <span className="text-amber-400">أول من يصل إلى 5 نقاط</span>
              <span>🟠 نقاط اللاعب الثاني: {p2Score}</span>
            </div>
          </div>

          {/* Split Screen 2 Players Arena */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Side (Blue) */}
            <div className="p-4 rounded-3xl bg-blue-50/80 border-3 border-blue-300 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                  <span>🔵</span> منطقة اللاعب الأول
                </span>
                <span className="text-base font-black font-mono text-blue-800 bg-white px-3 py-0.5 rounded-full border border-blue-200">
                  {p1Score} نقاط
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlayerAnswer('p1', opt)}
                    className="p-3.5 rounded-2xl bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-950 font-bold text-sm shadow-xs transition btn-bouncy active:scale-90"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Player 2 Side (Orange) */}
            <div className="p-4 rounded-3xl bg-orange-50/80 border-3 border-orange-300 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                <span className="text-xs font-black text-orange-900 flex items-center gap-1.5">
                  <span>🟠</span> منطقة اللاعب الثاني
                </span>
                <span className="text-base font-black font-mono text-orange-800 bg-white px-3 py-0.5 rounded-full border border-orange-200">
                  {p2Score} نقاط
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlayerAnswer('p2', opt)}
                    className="p-3.5 rounded-2xl bg-white hover:bg-orange-100 border-2 border-orange-200 text-orange-950 font-bold text-sm shadow-xs transition btn-bouncy active:scale-90"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center py-8 space-y-4 max-w-md mx-auto animate-scale-in">
          <div className="text-6xl animate-bounce">
            {winner === 'p1' ? '🔵👑' : '🟠👑'}
          </div>
          <h4 className="text-2xl font-black text-slate-800">
            {winner === 'p1' ? 'مبروك! اللاعب الأول هو البطل! 🎉' : 'مبروك! اللاعب الثاني هو البطل! 🎉'}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            النتيجة النهائية: {p1Score} - {p2Score} في نزال سرعة بديهة رائع!
          </p>

          <button
            onClick={startDuel}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition btn-bouncy shadow-md"
          >
            جولة جديدة 🔄
          </button>
        </div>
      )}
    </div>
  );
};
