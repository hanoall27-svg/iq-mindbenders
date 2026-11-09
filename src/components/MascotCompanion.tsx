import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Smile, Trophy, Crown } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { MascotWardrobeItem } from '../types';

interface MascotCompanionProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'cheering' | 'encouraging';
  speechBubbleText?: string;
  onReadQuestion?: () => void;
  isSpeaking?: boolean;
  equippedItem?: MascotWardrobeItem | null;
  starsCount?: number;
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  mood = 'idle',
  speechBubbleText = 'مرحباً يا بطل! أنا سمسم صديقك الذكي، هيا نلعب ونتعلم معاً! 🌟',
  onReadQuestion,
  isSpeaking = false,
  equippedItem = null,
  starsCount = 0
}) => {
  const [isWaving, setIsWaving] = useState(false);

  const handleMascotClick = () => {
    setIsWaving(true);
    sounds.playPop();
    setTimeout(() => setIsWaving(false), 800);
  };

  // Determine mascot expression and colors
  const getMascotFace = () => {
    switch (mood) {
      case 'cheering':
      case 'happy':
        return {
          eyes: '^^',
          mouth: '‿',
          cheeks: 'bg-rose-300',
          badgeText: 'أنت رائع! 🎉',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'encouraging':
        return {
          eyes: '◕‿◕',
          mouth: 'o',
          cheeks: 'bg-pink-300',
          badgeText: 'حاول مجدداً يا بطل! 💪',
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
        };
      case 'thinking':
        return {
          eyes: '•.•',
          mouth: '—',
          cheeks: 'bg-slate-300',
          badgeText: 'أفكر معك... 💭',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      default:
        return {
          eyes: '●‿●',
          mouth: '⌣',
          cheeks: 'bg-rose-200',
          badgeText: 'مستعد للتحدي! 🚀',
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-300'
        };
    }
  };

  const face = getMascotFace();

  return (
    <div className="flex flex-col items-center select-none" dir="rtl">
      {/* Speech Bubble */}
      <div className="relative mb-3 max-w-xs sm:max-w-md w-full">
        <div className="bg-white rounded-2xl p-3.5 shadow-md border-2 border-amber-200 text-slate-800 text-sm font-medium flex items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">🐰</span>
            <p className="leading-relaxed text-xs sm:text-sm font-semibold text-slate-700">
              {speechBubbleText}
            </p>
          </div>
          {onReadQuestion && (
            <button
              onClick={onReadQuestion}
              title="اقرأ السؤال بالصوت"
              className={`p-2.5 rounded-xl border-2 transition-all flex items-center gap-1 shrink-0 ${
                isSpeaking
                  ? 'bg-rose-500 text-white border-rose-600 scale-105 shadow-md'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 shadow-sm active:scale-95'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 animate-pulse" />
                  <span className="text-[11px] font-bold hidden sm:inline">إيقاف</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[11px] font-bold hidden sm:inline">استمع</span>
                </>
              )}
            </button>
          )}
        </div>
        {/* Little triangle pointing to mascot */}
        <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-amber-200 rotate-45 absolute -bottom-1.5 right-10 shadow-xs" />
      </div>

      {/* Interactive Mascot Body */}
      <div
        onClick={handleMascotClick}
        className={`cursor-pointer relative flex flex-col items-center transition-transform ${
          isWaving ? 'animate-wiggle scale-110' : 'hover:scale-105 animate-float'
        }`}
      >
        {/* Equipped Accessory Item (e.g. Crown, Hat, Glasses) */}
        {equippedItem && (
          <div className="absolute -top-6 z-20 text-3xl filter drop-shadow animate-bounce">
            {equippedItem.icon}
          </div>
        )}

        {/* Mascot Ears */}
        <div className="flex gap-4 -mb-3 z-0">
          <div className="w-5 h-12 bg-amber-100 rounded-t-full border-2 border-amber-300 rotate-[-12deg] flex items-center justify-center">
            <div className="w-2.5 h-8 bg-rose-200 rounded-t-full" />
          </div>
          <div className="w-5 h-12 bg-amber-100 rounded-t-full border-2 border-amber-300 rotate-[12deg] flex items-center justify-center">
            <div className="w-2.5 h-8 bg-rose-200 rounded-t-full" />
          </div>
        </div>

        {/* Mascot Head / Face */}
        <div className="w-20 h-18 sm:w-24 sm:h-20 bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl border-3 border-amber-300 shadow-lg relative flex flex-col items-center justify-center z-10">
          {/* Forehead antenna light */}
          <div className="absolute -top-2 w-3 h-3 rounded-full bg-emerald-400 border border-white shadow animate-pulse" />

          {/* Eyes */}
          <div className="flex items-center gap-4 text-slate-800 font-extrabold text-base sm:text-lg mb-0.5">
            <span className="tracking-widest">{face.eyes.slice(0, 1)}</span>
            <span className="tracking-widest">{face.eyes.slice(1, 2) || face.eyes.slice(0, 1)}</span>
          </div>

          {/* Cute Nose & Cheeks */}
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-1.5 rounded-full ${face.cheeks}`} />
            <div className="w-2 h-1.5 bg-rose-400 rounded-full" />
            <div className={`w-2.5 h-1.5 rounded-full ${face.cheeks}`} />
          </div>

          {/* Mouth */}
          <div className="text-xs font-bold text-slate-700 mt-0.5">{face.mouth}</div>
        </div>

        {/* Status Bubble Badge */}
        <div
          className={`mt-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold shadow-xs flex items-center gap-1 ${face.badgeColor}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{face.badgeText}</span>
        </div>
      </div>
    </div>
  );
};
