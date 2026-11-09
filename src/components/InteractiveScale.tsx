import React, { useState } from 'react';
import { Scale, RotateCcw, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ToolItem {
  id: string;
  name: string;
  emoji: string;
  weight: number;
}

const AVAILABLE_TOOLS: ToolItem[] = [
  { id: 'hammer', name: 'مطرقة (1)', emoji: '🔨', weight: 1 },
  { id: 'file', name: 'مبرد (3)', emoji: '🪚', weight: 3 },
  { id: 'axe', name: 'فأس (5)', emoji: '🪓', weight: 5 },
];

interface InteractiveScaleProps {
  onSolved?: () => void;
}

export const InteractiveScale: React.FC<InteractiveScaleProps> = ({ onSolved }) => {
  const [leftItems, setLeftItems] = useState<ToolItem[]>([
    AVAILABLE_TOOLS[2], // Axe (5)
    AVAILABLE_TOOLS[2], // Axe (5) -> Total 10
  ]);
  const [rightItems, setRightItems] = useState<ToolItem[]>([
    AVAILABLE_TOOLS[1], // File (3)
    AVAILABLE_TOOLS[1], // File (3)
    AVAILABLE_TOOLS[1], // File (3) -> Total 9
  ]);

  const leftWeight = leftItems.reduce((acc, curr) => acc + curr.weight, 0);
  const rightWeight = rightItems.reduce((acc, curr) => acc + curr.weight, 0);
  const diff = leftWeight - rightWeight;

  // Rotation angle for seesaw (-12 to +12 deg)
  const angle = Math.max(-14, Math.min(14, diff * -2.5));
  const isBalanced = diff === 0;

  const addItemToRight = (tool: ToolItem) => {
    sounds.playPop();
    const nextRight = [...rightItems, tool];
    setRightItems(nextRight);
    const nextRightWeight = nextRight.reduce((acc, curr) => acc + curr.weight, 0);
    if (leftWeight === nextRightWeight) {
      sounds.playSuccess();
      if (onSolved) onSolved();
    }
  };

  const resetScale = () => {
    sounds.playPop();
    setLeftItems([AVAILABLE_TOOLS[2], AVAILABLE_TOOLS[2]]);
    setRightItems([AVAILABLE_TOOLS[1], AVAILABLE_TOOLS[1], AVAILABLE_TOOLS[1]]);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-amber-50/70 rounded-3xl border-2 border-amber-200 text-slate-800" dir="rtl">
      <div className="flex items-center justify-between w-full mb-3 text-xs text-slate-600">
        <span className="font-bold flex items-center gap-1.5 text-amber-900">
          <Scale className="h-4 w-4 text-amber-600" />
          مختبر الميزان التفاعلي (وزن الأدوات)
        </span>
        <button
          onClick={resetScale}
          className="hover:text-amber-800 transition flex items-center gap-1 text-[11px] font-bold text-slate-500"
        >
          <RotateCcw className="h-3 w-3" />
          إعادة الضبط
        </button>
      </div>

      {/* Seesaw Bar */}
      <div className="relative w-full max-w-sm h-36 flex flex-col justify-end items-center my-2">
        {/* Tilting beam */}
        <div
          className="absolute top-12 w-64 sm:w-72 h-3 bg-gradient-to-r from-amber-400 via-amber-600 to-indigo-500 rounded-full transition-transform duration-500 ease-out flex justify-between px-2 shadow-sm"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Left Pan */}
          <div className="relative -top-16 flex flex-col items-center">
            <div className="flex flex-wrap gap-0.5 justify-center max-w-[80px] min-h-[32px] p-1.5 bg-white/95 rounded-xl border-2 border-amber-300 shadow-md text-base">
              {leftItems.map((item, idx) => (
                <span key={idx} title={item.name}>{item.emoji}</span>
              ))}
            </div>
            <div className="w-1 h-5 bg-amber-600" />
            <div className="w-12 h-1.5 bg-amber-700 rounded-full" />
            <div className="text-[11px] font-mono font-bold text-amber-800 mt-1">{leftWeight} كجم</div>
          </div>

          {/* Right Pan */}
          <div className="relative -top-16 flex flex-col items-center">
            <div className="flex flex-wrap gap-0.5 justify-center max-w-[80px] min-h-[32px] p-1.5 bg-white/95 rounded-xl border-2 border-indigo-300 shadow-md text-base">
              {rightItems.map((item, idx) => (
                <span key={idx} title={item.name}>{item.emoji}</span>
              ))}
            </div>
            <div className="w-1 h-5 bg-indigo-500" />
            <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
            <div className="text-[11px] font-mono font-bold text-indigo-800 mt-1">{rightWeight} كجم</div>
          </div>
        </div>

        {/* Fulcrum (Base Triangle) */}
        <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-amber-500" />
        <div className="w-24 h-2 bg-amber-600 rounded-full mt-0.5" />
      </div>

      {/* Balance Status */}
      <div className="my-2 text-center text-xs">
        {isBalanced ? (
          <span className="text-emerald-700 font-extrabold flex items-center gap-1 justify-center bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            متزن تماماً! الكفتان متساويتان (10 = 10)
          </span>
        ) : diff > 0 ? (
          <span className="text-amber-700 font-bold bg-amber-100/80 px-2.5 py-0.5 rounded-full">
            الكفة اليسرى أثقل بفارق {diff} وحدة! أضف أداة لليمين لموازنتها.
          </span>
        ) : (
          <span className="text-rose-700 font-bold bg-rose-100/80 px-2.5 py-0.5 rounded-full">
            الكفة اليمنى أثقل بفارق {Math.abs(diff)} وحدة!
          </span>
        )}
      </div>

      {/* Add Tool Buttons */}
      <div className="w-full pt-3 border-t border-amber-200 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-600">أضف للكفة اليمنى:</span>
        <div className="flex items-center gap-1.5">
          {AVAILABLE_TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => addItemToRight(tool)}
              className="px-3 py-1 rounded-xl bg-white hover:bg-amber-100 text-xs font-bold text-slate-800 border-2 border-amber-200 shadow-xs transition flex items-center gap-1 btn-bouncy"
            >
              <span>{tool.emoji}</span>
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
