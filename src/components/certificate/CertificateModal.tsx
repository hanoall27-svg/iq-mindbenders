import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Printer, X, Award, Star, Sparkles, Check, Crown } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedStars: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  earnedStars
}) => {
  const [studentName, setStudentName] = useState('البطل العبقري');
  const [stageTitle, setStageTitle] = useState('مرحلة براعم واستكشاف الذكاء');
  const [dateStr] = useState(() =>
    new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  );

  // Body overflow management
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
      <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-300 shadow-2xl p-6 relative flex flex-col gap-5 my-4">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-base font-black text-slate-800">شهادة الإنجاز والتفوق الرسمية 📜</h3>
              <p className="text-xs text-slate-500">اكتب اسمك واطبع شهادتك لتفتخر بها أمام عائلتك وأصدقائك!</p>
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

        {/* Input Name & Stage Controls (Hidden in Print) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 print:hidden">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم البطل / المتفوق:</label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="اكتب اسمك هنا..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">المرحلة المنجزة:</label>
            <select
              value={stageTitle}
              onChange={e => setStageTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              <option value="مرحلة براعم واستكشاف الذكاء (4 - 7 سنوات)">مرحلة براعم واستكشاف الذكاء (4 - 7 سنوات)</option>
              <option value="مرحلة استكشاف المنطق والألغاز (8 - 12 سنة)">مرحلة استكشاف المنطق والألغاز (8 - 12 سنة)</option>
              <option value="مرحلة التحدي والسرعة الذهنية (13 - 17 سنة)">مرحلة التحدي والسرعة الذهنية (13 - 17 سنة)</option>
              <option value="مرحلة النمو والاستنتاج المتقدم (18+ سنة)">مرحلة النمو والاستنتاج المتقدم (18+ سنة)</option>
              <option value="بطولة ملعب العقل ووضع القصة الفضائية">بطولة ملعب العقل ووضع القصة الفضائية</option>
            </select>
          </div>
        </div>

        {/* Print Button (Hidden in Print) */}
        <div className="flex justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-white font-black text-xs flex items-center gap-2 shadow-md transition btn-bouncy"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة (Print Certificate) 🖨️</span>
          </button>
        </div>

        {/* ===================== THE CERTIFICATE (PRINTABLE) ===================== */}
        <div
          id="printable-certificate"
          className="border-8 border-double border-amber-400 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-white to-[#FFFDF8] text-center relative overflow-hidden shadow-lg select-text"
        >
          {/* Corner Ornaments */}
          <div className="absolute top-3 left-3 text-2xl text-amber-500 opacity-60">⚜️</div>
          <div className="absolute top-3 right-3 text-2xl text-amber-500 opacity-60">⚜️</div>
          <div className="absolute bottom-3 left-3 text-2xl text-amber-500 opacity-60">⚜️</div>
          <div className="absolute bottom-3 right-3 text-2xl text-amber-500 opacity-60">⚜️</div>

          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">🌟</span>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-amber-900 tracking-wide">
                شهادة تفوق وإنجاز معرفي
              </h2>
              <span className="text-3xl">🌟</span>
            </div>

            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              مدينة الذكاء والمرح مع مصطفي زيدان
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />

            {/* Recipient Statement */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              تشهد <strong>مدينة الذكاء والمرح مع مصطفي زيدان</strong> بأن البطل المبدع:
            </p>

            {/* Recipient Name */}
            <div className="py-2">
              <span className="text-2xl sm:text-3xl font-black font-serif text-indigo-900 border-b-2 border-indigo-400 px-6 pb-1 inline-block">
                {studentName || 'البطل العبقري'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
              قد أتم بنجاح واقتدار كافة التحديات والأنشطة التفاعلية في{' '}
              <strong className="text-amber-800">{stageTitle}</strong>، وأظهر كفاءة استثنائية في الذاكرة البصرية، سرعة البديهة، والتفكير المنطقي.
            </p>

            {/* Badges Earned */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 text-xs font-bold text-amber-800">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>وسام العبقرية</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 text-xs font-bold text-emerald-800">
                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                <span>{earnedStars} نجوم ذهبية</span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 mt-4 border-t border-amber-200 flex items-center justify-between text-xs text-slate-600 px-4">
              <div className="text-right">
                <span className="block text-[10px] text-slate-400">تاريخ الإنجاز:</span>
                <span className="font-bold text-slate-700">{dateStr}</span>
              </div>

              {/* Golden Stamp Seal */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-500 flex flex-col items-center justify-center text-amber-950 font-black shadow-md rotate-[-8deg]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-tighter">معتمد</span>
              </div>

              <div className="text-left">
                <span className="block text-[10px] text-slate-400">إشراف وتوقيع:</span>
                <span className="font-black text-indigo-700">مصطفي زيدان & سمسم 🐰</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
