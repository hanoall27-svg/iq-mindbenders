import React, { useState } from 'react';
import { RotateCw, Check, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InteractiveClockProps {
  initialHour?: number;
  initialHours?: number;
  initialMinute?: number;
  initialMinutes?: number;
  targetHour?: number;
  targetHours?: number;
  targetMinute?: number;
  targetMinutes?: number;
  onCorrect?: () => void;
  onSolved?: () => void;
}

export const InteractiveClock: React.FC<InteractiveClockProps> = ({
  initialHour = 12,
  initialHours,
  initialMinute = 0,
  initialMinutes,
  targetHour,
  targetHours,
  targetMinute,
  targetMinutes,
  onCorrect,
  onSolved
}) => {
  const hInit = initialHours !== undefined ? initialHours : initialHour;
  const mInit = initialMinutes !== undefined ? initialMinutes : initialMinute;
  const tHour = targetHours !== undefined ? targetHours : targetHour;
  const tMinute = targetMinutes !== undefined ? targetMinutes : targetMinute;

  const [hour, setHour] = useState(hInit);
  const [minute, setMinute] = useState(mInit);
  const [checked, setChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  const handleHourStep = () => {
    sounds.playPop();
    setHour(h => (h % 12) + 1);
    setChecked(false);
  };

  const handleMinuteStep = (step: number) => {
    sounds.playPop();
    setMinute(m => {
      const next = (m + step) % 60;
      return next < 0 ? 60 + next : next;
    });
    setChecked(false);
  };

  const handleVerify = () => {
    setChecked(true);
    if (tHour !== undefined && tMinute !== undefined) {
      const matches = (hour % 12 === tHour % 12) && Math.abs(minute - tMinute) <= 2;
      setIsSuccess(matches);
      if (matches) {
        sounds.playSuccess();
        if (onCorrect) onCorrect();
        if (onSolved) onSolved();
      } else {
        sounds.playEncourage();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-indigo-50/60 rounded-3xl border-2 border-indigo-200 text-slate-800" dir="rtl">
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-indigo-300 bg-white flex items-center justify-center shadow-md">
        {/* Clock hour marks */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 38 * Math.sin(rad);
          const y = 50 - 38 * Math.cos(rad);
          return (
            <span
              key={i}
              className="absolute text-xs font-mono font-black text-indigo-900 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {i + 1}
            </span>
          );
        })}

        {/* Center dot */}
        <div className="absolute w-4 h-4 rounded-full bg-amber-500 z-10 shadow border-2 border-white" />

        {/* Hour Hand */}
        <div
          className="absolute w-2 h-11 bg-amber-500 rounded-full origin-bottom transition-transform duration-200 shadow-sm"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            top: '50%',
            left: '50%',
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-1.5 h-16 bg-indigo-600 rounded-full origin-bottom transition-transform duration-200 shadow-sm"
          style={{
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            top: '50%',
            left: '50%',
          }}
        />
      </div>

      <div className="mt-3 text-center">
        <div className="text-sm font-mono font-black bg-white px-3 py-1 rounded-full border border-indigo-200 text-indigo-900 shadow-xs">
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <button
          onClick={handleHourStep}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-200 font-bold transition btn-bouncy"
        >
          +1 ساعة
        </button>
        <button
          onClick={() => handleMinuteStep(5)}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 border-2 border-indigo-200 font-bold transition btn-bouncy"
        >
          +5 دقائق
        </button>
        <button
          onClick={() => handleMinuteStep(-5)}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 border-2 border-indigo-200 font-bold transition btn-bouncy"
        >
          -5 دقائق
        </button>
        {tHour !== undefined && (
          <button
            onClick={handleVerify}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black transition btn-bouncy shadow-sm flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            تحقق من التوقيت
          </button>
        )}
      </div>

      {checked && (
        <div className={`mt-2.5 text-xs font-bold px-3 py-1 rounded-full ${
          isSuccess ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
        }`}>
          {isSuccess ? '🎉 أحسنت! هذا هو التوقيت الصحيح تماماً' : '⏳ حاول مرة أخرى، اضبط العقارب بدقة'}
        </div>
      )}
    </div>
  );
};
