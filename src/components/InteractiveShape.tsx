import React from 'react';
import { Question } from '../types';

interface InteractiveShapeProps {
  question: Question;
}

export const InteractiveShape: React.FC<InteractiveShapeProps> = ({ question }) => {
  const { visualType, testNumber } = question;

  if (visualType === 'triangles') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 py-3 bg-amber-50/50 rounded-2xl border-2 border-amber-200">
        {/* Triangle 1 */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-indigo-500 fill-indigo-100/70 stroke-2">
            <polygon points="50,10 90,90 10,90" />
          </svg>
          <span className="absolute top-1 text-xs font-bold text-amber-700">2</span>
          <span className="absolute bottom-1 left-2 text-xs font-bold text-slate-700">7</span>
          <span className="absolute bottom-1 right-2 text-xs font-bold text-slate-700">9</span>
          <div className="absolute w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow">
            12
          </div>
        </div>

        {/* Triangle 2 */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-emerald-500 fill-emerald-100/70 stroke-2">
            <polygon points="50,10 90,90 10,90" />
          </svg>
          <span className="absolute top-1 text-xs font-bold text-amber-700">1</span>
          <span className="absolute bottom-1 left-2 text-xs font-bold text-slate-700">1</span>
          <span className="absolute bottom-1 right-2 text-xs font-bold text-slate-700">4</span>
          <div className="absolute w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow">
            4
          </div>
        </div>

        {/* Triangle 3 (Target) */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-rose-500 fill-rose-100/70 stroke-2">
            <polygon points="50,10 90,90 10,90" />
          </svg>
          <span className="absolute top-1 text-xs font-bold text-amber-700">2</span>
          <span className="absolute bottom-1 left-2 text-xs font-bold text-slate-700">6</span>
          <span className="absolute bottom-1 right-2 text-xs font-bold text-slate-700">5</span>
          <div className="absolute w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow animate-bounce">
            ؟
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'wheel') {
    return (
      <div className="flex items-center justify-center py-2 bg-indigo-50/50 rounded-2xl border-2 border-indigo-200">
        <div className="relative w-36 h-36 rounded-full border-3 border-indigo-300 bg-white flex items-center justify-center shadow-md">
          {/* Slices divider lines */}
          <div className="absolute w-full h-[1.5px] bg-indigo-200" />
          <div className="absolute h-full w-[1.5px] bg-indigo-200 rotate-60" />
          <div className="absolute h-full w-[1.5px] bg-indigo-200 -rotate-60" />

          {/* Center Hub */}
          <div className="relative z-10 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow">
            {testNumber}
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'stars') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 py-2 bg-amber-50/50 rounded-2xl border-2 border-amber-200">
        <div className="relative w-28 h-28 flex items-center justify-center text-xs">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-500 fill-amber-100/70 stroke-2">
            <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
          </svg>
          <div className="absolute w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow animate-pulse">
            ؟
          </div>
        </div>
      </div>
    );
  }

  return null;
};
