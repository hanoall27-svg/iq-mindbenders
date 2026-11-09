import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { MemoryMatchGame } from '../braingym/MemoryMatchGame';
import { OddOneOutGame } from '../braingym/OddOneOutGame';
import { NumberMazeGame } from '../braingym/NumberMazeGame';
import { InteractiveScale } from '../InteractiveScale';
import { Rocket, Sparkles, Check, ArrowRight, Trophy, Star, ShieldCheck, MapPin } from 'lucide-react';

interface StoryStage {
  id: number;
  name: string;
  location: string;
  description: string;
  mascotDialogue: string;
  emoji: string;
  crystalColor: string;
  component: 'memory' | 'odd' | 'maze' | 'scale' | 'launch';
}

const STORY_STAGES: StoryStage[] = [
  {
    id: 1,
    name: 'المحطة الأولى: غابة الذاكرة',
    location: 'جزيرة الذكريات الخضراء 🌲',
    description: 'ابحث عن بطاقات الطاقة المزدوجة لتنشيط رادار المركبة الفضائية!',
    mascotDialogue: 'أهلاً يا صديقي! طاقتي منخفضة، لنبدأ بالبحث عن بلورات الذاكرة في الغابة! 🐰✨',
    emoji: '🌲',
    crystalColor: 'from-emerald-400 to-green-500',
    component: 'memory'
  },
  {
    id: 2,
    name: 'المحطة الثانية: وادي التركيز الخاطف',
    location: 'وادي الصخور الدقيقة 🔎',
    description: 'اكتشف العنصر المختلف لفك شفرة بوصلة الاتجاهات الكونية!',
    mascotDialogue: 'أحسنت! الآن نحتاج تركيزاً خارقاً لتمييز الإشارات الصحيحة من المشوشة! 🧭',
    emoji: '🏜️',
    crystalColor: 'from-amber-400 to-orange-500',
    component: 'odd'
  },
  {
    id: 3,
    name: 'المحطة الثالثة: كهف الأرقام المتسلسلة',
    location: 'كهف البلورات الحسابية 🔢',
    description: 'اربط تسلسل الأرقام السريع لإعادة شحن بطارية المحرك النفاث!',
    mascotDialogue: 'سرعة البديهة هي مفتاح تشغيل المحرك! هيا نربط الأرقام بأسرع وقت! ⚡',
    emoji: '⚡',
    crystalColor: 'from-cyan-400 to-blue-500',
    component: 'maze'
  },
  {
    id: 4,
    name: 'المحطة الرابعة: قلعة توازن الكتل',
    location: 'برج الحكمة والتوازن ⚖️',
    description: 'وازن كفتي الميزان الميكانيكي لضبط استقرار الجاذبية للمركبة!',
    mascotDialogue: 'خطوة واحدة تفصلنا عن الإطلاق! فلنوازن الأدوات حتى يستقر الصاروخ! ⚖️',
    emoji: '🏰',
    crystalColor: 'from-purple-400 to-indigo-500',
    component: 'scale'
  },
  {
    id: 5,
    name: 'المحطة الخامسة: منصة الإطلاق العظيم',
    location: 'قاعدة الفضاء الكونية 🚀',
    description: 'اكتملت جميع بلورات الطاقة! استعد للانطلاق إلى كوكب الذكاء!',
    mascotDialogue: 'يا بطل! لقد جمعت البلورات الخمس بالكامل! الصاروخ جاهز للانطلاق نحو كوكب الذكاء! 🚀🪐',
    emoji: '🚀',
    crystalColor: 'from-rose-400 to-amber-500',
    component: 'launch'
  }
];

interface StoryModeProps {
  onEarnStars: (stars: number) => void;
  onAwardBadge?: (badgeId: string) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({ onEarnStars, onAwardBadge }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [activePlay, setActivePlay] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  const stage = STORY_STAGES[currentStageIdx];

  const handleStageSuccess = () => {
    sounds.playFanfare();
    confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });
    onEarnStars(5);

    if (!completedStages.includes(stage.id)) {
      setCompletedStages(prev => [...prev, stage.id]);
    }

    if (stage.id === 5) {
      if (onAwardBadge) onAwardBadge('story-hero');
    }

    setActivePlay(false);
  };

  const handleLaunchRocket = () => {
    sounds.playFanfare();
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    setIsLaunched(true);
    if (onAwardBadge) onAwardBadge('story-hero');
    onEarnStars(10);
  };

  return (
    <div className="w-full space-y-6 select-none" dir="rtl">
      {/* Story Mode Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-3 border-indigo-300 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚀</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                وضع القصة: رحلة العودة إلى كوكب الذكاء
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
              ساعد الروبوت سمسم في اجتياز المحطات المعرفية الخمس لجمع بلورات الطاقة وإعادة تشغيل صاروخه الفضائي!
            </p>
          </div>

          {/* Crystals Battery Indicator */}
          <div className="bg-white/90 p-3 rounded-2xl border-2 border-indigo-200 shadow-xs flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">بلورات الطاقة:</span>
            <div className="flex gap-1.5">
              {STORY_STAGES.map(s => {
                const isCleared = completedStages.includes(s.id);
                return (
                  <span
                    key={s.id}
                    title={s.name}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform ${
                      isCleared
                        ? 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-white shadow-xs scale-110'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCleared ? '💎' : '⚪'}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map Nodes Progression */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-amber-200 shadow-md">
        <h3 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>خريطة الرحلة الفضائية (5 محطات):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {STORY_STAGES.map((s, idx) => {
            const isCompleted = completedStages.includes(s.id);
            const isCurrent = idx === currentStageIdx;
            const isLocked = idx > 0 && !completedStages.includes(STORY_STAGES[idx - 1].id);

            return (
              <button
                key={s.id}
                disabled={isLocked}
                onClick={() => {
                  sounds.playPop();
                  setCurrentStageIdx(idx);
                  setActivePlay(false);
                }}
                className={`p-4 rounded-3xl border-3 transition-all flex flex-col justify-between text-right gap-3 btn-bouncy ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-400 shadow-md ring-3 ring-amber-300'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-slate-800'
                    : isLocked
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.emoji}</span>
                  {isCompleted ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{s.id}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-800 mb-0.5">{s.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{s.location}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Interactive View */}
      <div className="space-y-4">
        {/* Dialogue Bubble */}
        <div className="bg-white p-5 rounded-3xl border-3 border-amber-300 shadow-md flex items-center gap-4">
          <div className="text-4xl animate-bounce shrink-0">🐰</div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              حديث سمسم:
            </span>
            <p className="text-sm font-bold text-slate-800 leading-relaxed">
              "{stage.mascotDialogue}"
            </p>
          </div>
        </div>

        {/* Action Panel */}
        {!activePlay ? (
          <div className="bg-white p-6 rounded-3xl border-3 border-indigo-200 shadow-md text-center space-y-4">
            <h3 className="text-lg font-black text-slate-800">{stage.name} - {stage.location}</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">{stage.description}</p>

            {stage.id === 5 ? (
              isLaunched ? (
                <div className="p-6 bg-rose-50 rounded-3xl border-2 border-rose-300 space-y-3 animate-scale-in">
                  <div className="text-6xl animate-bounce">🪐🚀✨</div>
                  <h4 className="text-xl font-black text-rose-900">
                    وصل سمسم إلى كوكب الذكاء بسلام بفضل عبقريتك!
                  </h4>
                  <p className="text-xs text-rose-700">
                    لقد حصلت على شارة "بطل القصة" 👑 وشهادة تفوق ذهبية!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleLaunchRocket}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:brightness-105 text-white font-black text-base shadow-lg transition btn-bouncy"
                >
                  🚀 إطلاق الصاروخ الكوني الآن! 🌟
                </button>
              )
            ) : (
              <button
                onClick={() => {
                  sounds.playPop();
                  setActivePlay(true);
                }}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition btn-bouncy"
              >
                ابدأ تحدي المحطة واكسب بلورة الطاقة 💎
              </button>
            )}
          </div>
        ) : (
          /* Active Interactive Mini-Game for this Stage */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
              <span>تحدي: {stage.name}</span>
              <button
                onClick={handleStageSuccess}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition btn-bouncy"
              >
                تخطي وتفعيل بلورة الطاقة 💎
              </button>
            </div>

            {stage.component === 'memory' && (
              <MemoryMatchGame onEarnStars={handleStageSuccess} />
            )}
            {stage.component === 'odd' && (
              <OddOneOutGame onEarnStars={handleStageSuccess} />
            )}
            {stage.component === 'maze' && (
              <NumberMazeGame onEarnStars={handleStageSuccess} />
            )}
            {stage.component === 'scale' && (
              <InteractiveScale onSolved={handleStageSuccess} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
