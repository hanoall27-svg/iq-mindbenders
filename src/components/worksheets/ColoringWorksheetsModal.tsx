import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Printer, X, Palette } from 'lucide-react';

interface ColoringWorksheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColoringWorksheetsModal: React.FC<ColoringWorksheetsModalProps> = ({ isOpen, onClose }) => {
  const [activeSheet, setActiveSheet] = useState<'bunny' | 'maze' | 'shapes'>('bunny');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      sounds.playPop();
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-300 shadow-2xl p-6 relative flex flex-col gap-4 my-4">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-base font-black text-slate-800">أوراق عمل قابلة للطباعة والتلوين (اطبع ولون) 🖨️</h3>
              <p className="text-xs text-slate-500">مدينة الذكاء والمرح مع مصطفي زيدان - اربط بين شاشة اللعب والورقة والقلم!</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worksheet Selector Tabs (Hidden in Print) */}
        <div className="flex items-center gap-2 print:hidden flex-wrap">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveSheet('bunny');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
              activeSheet === 'bunny'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🐰 تلوين الأرنب سمسم
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveSheet('maze');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
              activeSheet === 'maze'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌀 ورقة المتاهة الورقية
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveSheet('shapes');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition btn-bouncy ${
              activeSheet === 'shapes'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📐 توصيل وتلوين الأشكال
          </button>

          <button
            onClick={handlePrint}
            className="mr-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition btn-bouncy shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الورقة</span>
          </button>
        </div>

        {/* ===================== PRINTABLE WORKSHEET CANVAS ===================== */}
        <div className="border-2 border-slate-300 p-6 rounded-2xl bg-white text-center flex flex-col items-center gap-4 select-text">
          <div className="w-full flex items-center justify-between border-b pb-2 text-xs text-slate-500 font-bold">
            <span>مدينة الذكاء والمرح مع مصطفي زيدان</span>
            <span>الاسم: .......................................</span>
            <span>التاريخ: .....................</span>
          </div>

          {/* Worksheet 1: Bunny Coloring Page */}
          {activeSheet === 'bunny' && (
            <div className="space-y-4 w-full">
              <h4 className="text-base font-black text-slate-800">
                لوّن صديقنا الروبوت سمسم والجزرة الذهبية! 🥕🐰
              </h4>
              <p className="text-xs text-slate-500">استخدم ألوانك المفضلة لتلوين الأرنب والأشكال المحيطة به.</p>

              <div className="py-4 flex justify-center">
                <svg viewBox="0 0 300 260" className="w-64 h-64 sm:w-80 sm:h-80 stroke-slate-800 fill-white stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
                  <ellipse cx="115" cy="50" rx="16" ry="42" transform="rotate(-15 115 50)" />
                  <ellipse cx="115" cy="50" rx="8" ry="28" transform="rotate(-15 115 50)" className="stroke-[1.5]" />
                  <ellipse cx="185" cy="50" rx="16" ry="42" transform="rotate(15 185 50)" />
                  <ellipse cx="185" cy="50" rx="8" ry="28" transform="rotate(15 185 50)" className="stroke-[1.5]" />
                  <rect x="90" y="80" width="120" height="95" rx="36" />
                  <line x1="150" y1="80" x2="150" y2="60" />
                  <circle cx="150" cy="56" r="6" />
                  <circle cx="125" cy="118" r="14" />
                  <circle cx="128" cy="115" r="4" className="fill-slate-800" />
                  <circle cx="175" cy="118" r="14" />
                  <circle cx="178" cy="115" r="4" className="fill-slate-800" />
                  <polygon points="150,132 144,124 156,124" className="fill-slate-800" />
                  <path d="M 142 140 Q 150 148 158 140" />
                  <line x1="80" y1="126" x2="105" y2="128" />
                  <line x1="80" y1="138" x2="105" y2="134" />
                  <line x1="195" y1="128" x2="220" y2="126" />
                  <line x1="195" y1="134" x2="220" y2="138" />
                  <polygon points="230,170 270,170 250,240" />
                  <path d="M 245 170 Q 235 150 250 145" />
                  <path d="M 255 170 Q 265 150 250 145" />
                  <rect x="105" y="175" width="90" height="65" rx="20" />
                  <circle cx="150" cy="205" r="15" className="stroke-dashed stroke-[1.5]" />
                </svg>
              </div>
            </div>
          )}

          {/* Worksheet 2: Printable Maze */}
          {activeSheet === 'maze' && (
            <div className="space-y-4 w-full">
              <h4 className="text-base font-black text-slate-800">
                متاهة الأرنب: ساعد سمسم في إيجاد الطريق إلى الجزرة! 🌀🥕
              </h4>
              <p className="text-xs text-slate-500">امسك قلمك وتتبع المسار الصحيح بدون الاصطدام بالحواجز.</p>

              <div className="py-2 flex justify-center">
                <svg viewBox="0 0 240 240" className="w-64 h-64 sm:w-72 sm:h-72 stroke-slate-800 fill-none stroke-[3]">
                  <rect x="20" y="20" width="200" height="200" rx="8" />
                  <line x1="20" y1="35" x2="20" y2="65" className="stroke-white stroke-[5]" />
                  <text x="2" y="55" className="text-xs font-bold fill-slate-800 stroke-none">دخول 🐰</text>
                  <line x1="220" y1="175" x2="220" y2="205" className="stroke-white stroke-[5]" />
                  <text x="180" y="235" className="text-xs font-bold fill-slate-800 stroke-none">خروج 🥕</text>
                  <path d="M 60 20 L 60 140 L 100 140" />
                  <path d="M 100 60 L 180 60 L 180 100" />
                  <path d="M 140 100 L 140 180 L 100 180" />
                  <path d="M 100 180 L 100 220" />
                  <path d="M 180 140 L 220 140" />
                  <path d="M 60 180 L 20 180" />
                </svg>
              </div>
            </div>
          )}

          {/* Worksheet 3: Connect Shapes */}
          {activeSheet === 'shapes' && (
            <div className="space-y-4 w-full">
              <h4 className="text-base font-black text-slate-800">
                وصّل كل شكل بما يماثله، ثم لوّن الدوائر بالأصفر والمربعات بالأزرق! 📐
              </h4>
              <div className="py-4 grid grid-cols-2 gap-10 max-w-sm mx-auto">
                <div className="space-y-6">
                  <div className="w-16 h-16 border-2 border-slate-800 rounded-full mx-auto" />
                  <div className="w-16 h-16 border-2 border-slate-800 mx-auto" />
                  <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[50px] border-b-slate-800 mx-auto" />
                </div>
                <div className="space-y-6">
                  <div className="w-16 h-16 border-2 border-slate-800 mx-auto" />
                  <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[50px] border-b-slate-800 mx-auto" />
                  <div className="w-16 h-16 border-2 border-slate-800 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
