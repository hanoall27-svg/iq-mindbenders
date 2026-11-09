import React, { useState } from 'react';
import { MemoryMatchGame } from './MemoryMatchGame';
import { StroopTestGame } from './StroopTestGame';
import { OddOneOutGame } from './OddOneOutGame';
import { SimonSaysGame } from './SimonSaysGame';
import { GridMemoryGame } from './GridMemoryGame';
import { NumberMazeGame } from './NumberMazeGame';
import { ShadowMatchGame } from './ShadowMatchGame';
import { SpeedMathGame } from './SpeedMathGame';
import { SpotDifferenceGame } from './SpotDifferenceGame';
import { ArabicWordBuilderGame } from './ArabicWordBuilderGame';
import { WhackAMoleGame } from './WhackAMoleGame';
import { WhatsMissingGame } from './WhatsMissingGame';
import { MotionCameraGame } from '../motion/MotionCameraGame';
import { sounds } from '../../utils/soundEffects';
import { Trophy, Star, Sparkles, ArrowRight, Brain, Zap, Play } from 'lucide-react';

export type BrainGymGameId =
  | 'memory-match'
  | 'stroop-test'
  | 'odd-one-out'
  | 'simon-says'
  | 'grid-memory'
  | 'number-maze'
  | 'shadow-match'
  | 'speed-math'
  | 'spot-diff'
  | 'arabic-words'
  | 'whack-mole'
  | 'whats-missing'
  | 'motion-camera';

interface GameCardMeta {
  id: BrainGymGameId;
  title: string;
  subtitle: string;
  emoji: string;
  targetAge: 'explore' | 'challenge' | 'grow' | 'all';
  ageLabel: string;
  ability: string;
  bgColor: string;
  borderColor: string;
  tagColor: string;
}

const GAMES_CATALOG: GameCardMeta[] = [
  // 1. Explore & Sprouts (4 - 12)
  {
    id: 'arabic-words',
    title: 'وصّل الحروف العربية (Word Builder)',
    subtitle: 'تكوين الكلمات بالترتيب الصحيح وسماع النطق العربي',
    emoji: '✍️',
    targetAge: 'explore',
    ageLabel: '4 - 7 سنوات',
    ability: 'اللغة العربية والتهجئة',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/70',
    borderColor: 'border-emerald-300',
    tagColor: 'bg-emerald-200 text-emerald-900',
  },
  {
    id: 'whack-mole',
    title: 'امسك الأرنب السريع (Whack-a-Rabbit)',
    subtitle: 'نقر الأرنب الخاطف بمجرد ظهوره لتنمية سرعة البديهة',
    emoji: '🔨',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'سرعة رد الفعل والتنسيق الحركي',
    bgColor: 'bg-amber-50 hover:bg-amber-100/70',
    borderColor: 'border-amber-300',
    tagColor: 'bg-amber-200 text-amber-900',
  },
  {
    id: 'whats-missing',
    title: 'إيه اللي اختفى؟ (What\'s Missing?)',
    subtitle: 'حفظ العناصر وتحديد العنصر الذي يختفي من المشهد',
    emoji: '🧐',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'الذاكرة البصرية قصيرة المدى',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100/70',
    borderColor: 'border-indigo-300',
    tagColor: 'bg-indigo-200 text-indigo-900',
  },
  {
    id: 'motion-camera',
    title: 'لعبة الحركة واللمس (Touch the Target)',
    subtitle: 'التفاعل الحركي مع الأهداف الطائرة أمام الكاميرا أو الشاشة',
    emoji: '🤸‍♂️',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'النشاط الجسدي والتركيز الحركي',
    bgColor: 'bg-purple-50 hover:bg-purple-100/70',
    borderColor: 'border-purple-300',
    tagColor: 'bg-purple-200 text-purple-900',
  },
  {
    id: 'memory-match',
    title: 'اقلب الكروت (Memory Match)',
    subtitle: 'مطابقة أزواج الحيوانات والفواكه بتدرج الصعوبة',
    emoji: '🃏',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'الذاكرة البصرية والتركيز',
    bgColor: 'bg-amber-50 hover:bg-amber-100/70',
    borderColor: 'border-amber-300',
    tagColor: 'bg-amber-200 text-amber-900',
  },
  {
    id: 'odd-one-out',
    title: 'العنصر المختلف (Odd One Out)',
    subtitle: 'اكتشاف الرمز الشاذ والفريد وسط المتشابهات بسرعة',
    emoji: '👀',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'الملاحظة والتمييز البصري',
    bgColor: 'bg-orange-50 hover:bg-orange-100/70',
    borderColor: 'border-orange-300',
    tagColor: 'bg-orange-200 text-orange-900',
  },
  {
    id: 'shadow-match',
    title: 'الظل الصحيح (Shadow Match)',
    subtitle: 'مطابقة الكائنات الملونة بظلالها الدقيقة',
    emoji: '👤',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'الإدراك المكاني والأشكال',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/70',
    borderColor: 'border-emerald-300',
    tagColor: 'bg-emerald-200 text-emerald-900',
  },
  {
    id: 'spot-diff',
    title: 'دور على الفرق (Spot the Difference)',
    subtitle: 'المقارنة بين مشهدين واستخراج الفروقات المخفية',
    emoji: '🔎',
    targetAge: 'explore',
    ageLabel: '4 - 12 سنة',
    ability: 'دقة الملاحظة والانتباه',
    bgColor: 'bg-sky-50 hover:bg-sky-100/70',
    borderColor: 'border-sky-300',
    tagColor: 'bg-sky-200 text-sky-900',
  },

  // 2. Challenge (13 - 17)
  {
    id: 'simon-says',
    title: 'تسلسل الألوان (Simon Says)',
    subtitle: 'تذكر تتابع ومضات الألوان والأصوات النغمية بدقة',
    emoji: '🔮',
    targetAge: 'challenge',
    ageLabel: '13 - 17 سنة',
    ability: 'الذاكرة العاملة اللحظية',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100/70',
    borderColor: 'border-indigo-300',
    tagColor: 'bg-indigo-200 text-indigo-900',
  },
  {
    id: 'number-maze',
    title: 'المتاهة الرقمية (Number Maze)',
    subtitle: 'الربط السريع للأرقام تصاعدياً من 1 لـ 20 بأقل وقت',
    emoji: '🔢',
    targetAge: 'challenge',
    ageLabel: '13 - 17 سنة',
    ability: 'سرعة المسح البصري ورد الفعل',
    bgColor: 'bg-cyan-50 hover:bg-cyan-100/70',
    borderColor: 'border-cyan-300',
    tagColor: 'bg-cyan-200 text-cyan-900',
  },
  {
    id: 'speed-math',
    title: 'الرياضيات السريعة (Speed Math)',
    subtitle: 'عمليات حسابية ذهنية خاطفة لتنشيط خلايا الدماغ',
    emoji: '⚡',
    targetAge: 'challenge',
    ageLabel: '13 - 17 سنة',
    ability: 'التفكير السائل والحساب الذهني',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100/70',
    borderColor: 'border-yellow-300',
    tagColor: 'bg-yellow-200 text-yellow-900',
  },

  // 3. Grow (18+)
  {
    id: 'stroop-test',
    title: 'اختبار ستروب (Stroop Test)',
    subtitle: 'قراءة لون الحبر وتجاهل معنى الكلمة لقياس قوة التركيز',
    emoji: '🧠',
    targetAge: 'grow',
    ageLabel: '18+ سنة',
    ability: 'كبح التشتت وسرعة البديهة',
    bgColor: 'bg-rose-50 hover:bg-rose-100/70',
    borderColor: 'border-rose-300',
    tagColor: 'bg-rose-200 text-rose-900',
  },
  {
    id: 'grid-memory',
    title: 'الذاكرة المكانية (Grid Matrix)',
    subtitle: 'تذكر أماكن المربعات المضيئة قبل اختفائها',
    emoji: '🧩',
    targetAge: 'grow',
    ageLabel: '18+ سنة',
    ability: 'الذاكرة المكانية والتركيز العالي',
    bgColor: 'bg-teal-50 hover:bg-teal-100/70',
    borderColor: 'border-teal-300',
    tagColor: 'bg-teal-200 text-teal-900',
  },
];

interface BrainGymHubProps {
  onEarnStars: (stars: number) => void;
}

export const BrainGymHub: React.FC<BrainGymHubProps> = ({ onEarnStars }) => {
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<'all' | 'explore' | 'challenge' | 'grow'>('all');
  const [activeGame, setActiveGame] = useState<BrainGymGameId | null>(null);

  const filteredCatalog = GAMES_CATALOG.filter(game => {
    if (selectedAgeFilter === 'all') return true;
    return game.targetAge === selectedAgeFilter;
  });

  const handleLaunchGame = (id: BrainGymGameId) => {
    sounds.playPop();
    setActiveGame(id);
  };

  const handleBackToLobby = () => {
    sounds.playPop();
    setActiveGame(null);
  };

  return (
    <div className="w-full space-y-6 select-none" dir="rtl">
      {/* If a game is actively playing */}
      {activeGame ? (
        <div className="space-y-4">
          <button
            onClick={handleBackToLobby}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-200 text-xs font-bold transition flex items-center gap-2 shadow-xs btn-bouncy"
          >
            <ArrowRight className="w-4 h-4 text-amber-600" />
            <span>العودة لملعب العقل (كل الألعاب)</span>
          </button>

          {activeGame === 'memory-match' && <MemoryMatchGame onEarnStars={onEarnStars} />}
          {activeGame === 'stroop-test' && <StroopTestGame onEarnStars={onEarnStars} />}
          {activeGame === 'odd-one-out' && <OddOneOutGame onEarnStars={onEarnStars} />}
          {activeGame === 'simon-says' && <SimonSaysGame onEarnStars={onEarnStars} />}
          {activeGame === 'grid-memory' && <GridMemoryGame onEarnStars={onEarnStars} />}
          {activeGame === 'number-maze' && <NumberMazeGame onEarnStars={onEarnStars} />}
          {activeGame === 'shadow-match' && <ShadowMatchGame onEarnStars={onEarnStars} />}
          {activeGame === 'speed-math' && <SpeedMathGame onEarnStars={onEarnStars} />}
          {activeGame === 'spot-diff' && <SpotDifferenceGame onEarnStars={onEarnStars} />}
          {activeGame === 'arabic-words' && <ArabicWordBuilderGame onEarnStars={onEarnStars} />}
          {activeGame === 'whack-mole' && <WhackAMoleGame onEarnStars={onEarnStars} />}
          {activeGame === 'whats-missing' && <WhatsMissingGame onEarnStars={onEarnStars} />}
          {activeGame === 'motion-camera' && <MotionCameraGame onEarnStars={onEarnStars} />}
        </div>
      ) : (
        /* Brain Gym Lobby */
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🎮</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                  ملعب العقل (Brain Gym)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
                ألعاب وتحديات معرفية مصممة خصيصاً لتنمية الذاكرة، سرعة البديهة، والتركيز الحسي لكل مرحلة عمرية. اجمع النجوم وافتح بها ملابس سمسم ومراحل جديدة! ⭐
              </p>
            </div>

            {/* Age Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-2xl border-2 border-amber-300 shadow-xs shrink-0 flex-wrap justify-center">
              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAgeFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
                  selectedAgeFilter === 'all'
                    ? 'bg-amber-400 text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكل ({GAMES_CATALOG.length} لعبة)
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAgeFilter('explore');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
                  selectedAgeFilter === 'explore'
                    ? 'bg-emerald-400 text-emerald-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧒 4 - 12 سنة
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAgeFilter('challenge');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
                  selectedAgeFilter === 'challenge'
                    ? 'bg-indigo-400 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ 13 - 17 سنة
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedAgeFilter('grow');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
                  selectedAgeFilter === 'grow'
                    ? 'bg-rose-400 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧠 18+ سنة
              </button>
            </div>
          </div>

          {/* Games Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map(game => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.id)}
                className={`p-5 rounded-3xl border-3 ${game.borderColor} ${game.bgColor} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 btn-bouncy`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl filter drop-shadow animate-float">{game.emoji}</span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${game.tagColor}`}>
                      {game.ageLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-800 mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {game.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs">
                  <span className="text-slate-500 font-bold">{game.ability}</span>
                  <div className="flex items-center gap-1 font-black text-indigo-700">
                    <span>العب الآن</span>
                    <Play className="w-3.5 h-3.5 fill-indigo-700 text-indigo-700 ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
