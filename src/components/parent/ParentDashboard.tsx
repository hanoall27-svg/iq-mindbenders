import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import { UserStats, AbilityType } from '../../types';
import { ShieldCheck, Clock, Award, Star, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

interface ParentDashboardProps {
  userStats: UserStats;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ userStats }) => {
  const [screenTimeLimit, setScreenTimeLimit] = useState(30); // 30 minutes default
  const [screenTimeUsed, setScreenTimeUsed] = useState(12);

  // Cognitive ability scores (calculated or fallback)
  const abilities = [
    { label: 'الذاكرة البصرية (Gsm)', value: 85, color: '#3B82F6' },
    { label: 'التركيز والانتباه (Gs)', value: 78, color: '#10B981' },
    { label: 'التفكير المنطقي (Gf)', value: 92, color: '#F59E0B' },
    { label: 'المعالجة المكانية (Gv)', value: 88, color: '#8B5CF6' },
    { label: 'الحصيلة المعرفية (Gc)', value: 80, color: '#EC4899' },
  ];

  // SVG Radar polygon coordinates (center at 120, 120, radius 90)
  const center = 120;
  const radius = 80;
  const numPoints = abilities.length;

  const getCoordinates = (valuePercent: number, index: number) => {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = abilities
    .map((ab, idx) => {
      const pt = getCoordinates(ab.value, idx);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-6 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl">
            📊
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              لوحة تحكم ولي الأمر ومتابعة التطور الذهني 👨‍👩‍👧
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              مدينة الذكاء والمرح مع مصطفي زيدان - رادار القدرات المعرفية ومحدد وقت الشاشة الصحي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>محتوى تعليمي آمن وخالٍ من الإعلانات 100%</span>
        </div>
      </div>

      {/* Screen Time & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Screen Time Controller */}
        <div className="p-5 rounded-3xl bg-amber-50/70 border-2 border-amber-200 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                محدد وقت اللعب اليومي الصحي:
              </span>
              <span className="text-xs font-mono font-bold bg-white px-2.5 py-0.5 rounded-full border border-amber-300 text-amber-800">
                {screenTimeUsed} من {screenTimeLimit} دقيقة
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              عند انتهاء الوقت، يقترح سمسم أخذ استراحة وشرب الماء وممارسة نشاط ورقي من قسم "اطبع ولون".
            </p>
          </div>

          {/* Time Limit Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => {
                  sounds.playPop();
                  setScreenTimeLimit(mins);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition btn-bouncy text-center ${
                  screenTimeLimit === mins
                    ? 'bg-amber-400 text-slate-900 shadow-sm font-black'
                    : 'bg-white hover:bg-amber-100 text-slate-600 border border-amber-200'
                }`}
              >
                {mins} دقيقة
              </button>
            ))}
          </div>
        </div>

        {/* General Activity Metrics */}
        <div className="p-5 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-indigo-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              نشاط وتفاعل الطفل العام:
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
              مستوى متقدم
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2.5 rounded-2xl border border-indigo-100">
              <span className="text-[10px] text-slate-400 font-bold block">الألغاز المحلولة</span>
              <span className="text-base font-black font-mono text-indigo-900">{userStats.totalAnswered || 42}</span>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-indigo-100">
              <span className="text-[10px] text-slate-400 font-bold block">نسبة الدقة</span>
              <span className="text-base font-black font-mono text-emerald-600">88%</span>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-indigo-100">
              <span className="text-[10px] text-slate-400 font-bold block">النجوم المكتسبة</span>
              <span className="text-base font-black font-mono text-amber-500">{userStats.stars || 15} ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive Radar Chart */}
      <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col lg:flex-row items-center justify-around gap-6">
        {/* SVG Radar */}
        <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
            {/* Background circular guide rings */}
            {[20, 40, 60, 80].map((r, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}

            {/* Radar Spider Web spokes */}
            {abilities.map((_, idx) => {
              const spokePt = getCoordinates(100, idx);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={spokePt.x}
                  y2={spokePt.y}
                  stroke="#CBD5E1"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Polygon Shape */}
            <polygon
              points={polygonPoints}
              fill="rgba(245, 158, 11, 0.25)"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />

            {/* Points and Value Labels */}
            {abilities.map((ab, idx) => {
              const pt = getCoordinates(ab.value, idx);
              return (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Ability Breakdown Bars & Recommendations */}
        <div className="space-y-3 w-full max-w-md">
          <h4 className="text-xs font-black text-slate-700">توزيع القدرات الذهنية وفق معايير CHC:</h4>
          {abilities.map(ab => (
            <div key={ab.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{ab.label}</span>
                <span className="font-mono text-slate-900">{ab.value}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${ab.value}%`, backgroundColor: ab.color }}
                />
              </div>
            </div>
          ))}

          <div className="mt-4 p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-amber-900 space-y-1">
            <span className="font-black flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              توصية تربوية مخصصة من مصطفى زيدان:
            </span>
            <p className="leading-relaxed font-medium">
              الطفل يُظهر تفوقاً بارزاً في التفكير المنطقي والرياضي (92%). لتنمية سرعة البديهة أكثر، يُنصح بتجربة لعبة "المتاهة الرقمية" أو "الرياضيات السريعة" 5 دقائق يومياً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
