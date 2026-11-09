import React, { useState, useEffect } from 'react';
import { Question, DraggableItem } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Check, RefreshCw, Volume2, ArrowRight } from 'lucide-react';

interface SproutInteractiveGameProps {
  question: Question;
  onSolved: () => void;
}

export const SproutInteractiveGame: React.FC<SproutInteractiveGameProps> = ({
  question,
  onSolved
}) => {
  const data = question.sproutData;

  // 1. Drag & Sort state
  const [draggedItems, setDraggedItems] = useState<DraggableItem[]>([]);
  const [assignedCategories, setAssignedCategories] = useState<Record<string, string>>({}); // itemId -> categoryId
  const [selectedItemToMove, setSelectedItemToMove] = useState<DraggableItem | null>(null);

  // 2. Animal sound game state
  const [isPlayingAnimalSound, setIsPlayingAnimalSound] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  // 3. Count game state
  const [countedSet, setCountedSet] = useState<Set<string>>(new Set());

  // 4. Opposites state
  const [selectedOpposite, setSelectedOpposite] = useState<string | null>(null);

  // Initialize or reset when question changes
  useEffect(() => {
    if (data?.dragItems) {
      setDraggedItems([...data.dragItems]);
      setAssignedCategories({});
      setSelectedItemToMove(null);
    }
    setSelectedAnimal(null);
    setCountedSet(new Set());
    setSelectedOpposite(null);
  }, [question.id]);

  // Check drag-sort completion
  useEffect(() => {
    if (question.gameType === 'drag-sort' && data?.dragItems && data.dragItems.length > 0) {
      const allAssigned = data.dragItems.every(
        item => assignedCategories[item.id] === item.targetCategory
      );
      if (allAssigned) {
        sounds.playSuccess();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        onSolved();
      }
    }
  }, [assignedCategories, question.gameType]);

  // Handle assigning item to a category (works via drag-and-drop or click-and-place)
  const assignItemToCategory = (itemId: string, categoryId: string) => {
    const item = data?.dragItems?.find(i => i.id === itemId);
    if (!item) return;

    if (item.targetCategory === categoryId) {
      sounds.playPop();
      setAssignedCategories(prev => ({ ...prev, [itemId]: categoryId }));
      setSelectedItemToMove(null);
    } else {
      sounds.playEncourage();
    }
  };

  // Play animal sound
  const handlePlayAnimalSound = () => {
    setIsPlayingAnimalSound(true);
    if (data?.soundCue) {
      sounds.playAnimalSound(data.soundCue);
    } else {
      sounds.playPop();
    }
    setTimeout(() => setIsPlayingAnimalSound(false), 800);
  };

  // Handle counting tap
  const handleTapCountItem = (itemId: string) => {
    if (countedSet.has(itemId)) return;

    sounds.playPop();
    const nextSet = new Set(countedSet);
    nextSet.add(itemId);
    setCountedSet(nextSet);

    // If all items counted, celebrate and solve
    if (data?.countTarget && nextSet.size === data.countTarget) {
      sounds.playSuccess();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onSolved();
    }
  };

  return (
    <div className="w-full bg-white/95 rounded-3xl p-5 border-3 border-amber-200 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* ---------------- 1. Drag & Sort Game ---------------- */}
      {question.gameType === 'drag-sort' && data?.dropCategories && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-amber-100 pb-2">
            <span className="font-bold text-amber-700">🎮 لعبة الفرز بالسحب والإفلات:</span>
            <span>اسحب العنصر أو اضغط عليه ثم اضغط على السلة المناسبة</span>
          </div>

          {/* Unsorted Items Pool */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-dashed border-amber-300 min-h-[90px] flex flex-wrap items-center justify-center gap-3">
            {data.dragItems?.filter(item => !assignedCategories[item.id]).map(item => {
              const isSelected = selectedItemToMove?.id === item.id;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', item.id);
                  }}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedItemToMove(isSelected ? null : item);
                  }}
                  className={`px-4 py-2.5 rounded-2xl border-2 text-sm font-bold flex items-center gap-2 cursor-grab active:cursor-grabbing transition-all shadow-sm ${
                    isSelected
                      ? 'bg-amber-400 text-slate-900 border-amber-600 scale-110 shadow-lg ring-4 ring-amber-300/50'
                      : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-200 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
            {data.dragItems?.every(item => assignedCategories[item.id]) && (
              <div className="text-emerald-600 font-extrabold flex items-center gap-2 text-sm">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>أحسنت صنعاً يا بطل! تم فرز كل العناصر بشكل مثالي! 🌟</span>
              </div>
            )}
          </div>

          {/* Drop Zones (Categories) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.dropCategories.map(cat => {
              const placedItems = data.dragItems?.filter(
                i => assignedCategories[i.id] === cat.id
              ) || [];

              return (
                <div
                  key={cat.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const itemId = e.dataTransfer.getData('text/plain');
                    if (itemId) assignItemToCategory(itemId, cat.id);
                  }}
                  onClick={() => {
                    if (selectedItemToMove) {
                      assignItemToCategory(selectedItemToMove.id, cat.id);
                    }
                  }}
                  className={`p-4 rounded-3xl border-3 transition-all flex flex-col min-h-[140px] justify-between cursor-pointer ${
                    cat.color
                  } ${
                    selectedItemToMove?.targetCategory === cat.id
                      ? 'ring-4 ring-amber-400/60 scale-[1.02]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-black/10 pb-2">
                    <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                      <span className="text-2xl">{cat.emoji}</span>
                      <span>{cat.title}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 shadow-xs">
                      {placedItems.length} عناصر
                    </span>
                  </div>

                  {/* Items placed in this category */}
                  <div className="flex flex-wrap gap-2 my-3 min-h-[50px] items-center">
                    {placedItems.map(item => (
                      <div
                        key={item.id}
                        className="px-3 py-1.5 rounded-xl bg-white/90 border border-black/10 text-xs font-bold flex items-center gap-1.5 shadow-sm animate-bounce"
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                    {placedItems.length === 0 && (
                      <span className="text-xs text-black/40 italic">
                        اسحب أو اضغط لوضع العناصر هنا...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- 2. Animal Sound Game ---------------- */}
      {question.gameType === 'animal-sound' && data?.animalSound && (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="text-center">
            <span className="text-xs font-bold text-amber-600 block mb-1">اضغط على زر الصوت للاستماع:</span>
            <button
              onClick={handlePlayAnimalSound}
              className={`px-6 py-3.5 rounded-2xl border-3 font-black text-base flex items-center gap-3 transition-all shadow-md btn-bouncy ${
                isPlayingAnimalSound
                  ? 'bg-amber-400 text-slate-900 border-amber-600 scale-105'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-500 hover:brightness-105'
              }`}
            >
              <Volume2 className={`w-6 h-6 ${isPlayingAnimalSound ? 'animate-bounce' : ''}`} />
              <span>استمع إلى الصوت: "{data.animalSound}"</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-2">
            {question.options.map((opt, i) => {
              const isSelected = selectedAnimal === opt;
              const isCorrect = opt === question.answer;

              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedAnimal(opt);
                    if (isCorrect) {
                      sounds.playSuccess();
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                      onSolved();
                    } else {
                      sounds.playEncourage();
                    }
                  }}
                  className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-2 transition-all btn-bouncy ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 scale-105 shadow-md'
                        : 'bg-rose-100 border-rose-400 text-rose-800'
                      : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-800'
                  }`}
                >
                  <span className="text-4xl">{opt.split(' ')[1] || '🐾'}</span>
                  <span className="text-sm font-black">{opt.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- 3. Tap to Count Game ---------------- */}
      {question.gameType === 'count-tap' && data?.countItems && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full border-b border-amber-100 pb-2">
            <span className="text-xs font-bold text-amber-700">اضغط على كل {data.countEmoji} لعدها:</span>
            <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full text-amber-900 font-extrabold text-sm border border-amber-300">
              <span>العدد المحسوب:</span>
              <span className="text-base text-rose-600 font-mono">{countedSet.size}</span>
              <span>/</span>
              <span className="font-mono">{data.countTarget}</span>
            </div>
          </div>

          {/* Counting Canvas (Tree / Sky Playground) */}
          <div className="w-full h-44 sm:h-52 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 rounded-3xl border-3 border-emerald-300 relative overflow-hidden flex items-center justify-around p-4 shadow-inner">
            {/* Background elements */}
            <div className="absolute top-3 left-6 text-2xl opacity-60">☁️</div>
            <div className="absolute top-2 right-8 text-2xl opacity-60">☀️</div>
            <div className="absolute bottom-0 inset-x-0 h-10 bg-emerald-300/40 border-t border-emerald-400/50" />

            {/* Clickable counting items */}
            {data.countItems.map((item, idx) => {
              const isCounted = countedSet.has(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleTapCountItem(item.id)}
                  className={`relative p-2 rounded-2xl transition-all flex flex-col items-center btn-bouncy ${
                    isCounted
                      ? 'scale-110 opacity-90'
                      : 'hover:scale-125 animate-float cursor-pointer'
                  }`}
                  style={{ animationDelay: `${idx * 0.3}s` }}
                >
                  <span className="text-4xl sm:text-5xl filter drop-shadow">{item.emoji}</span>
                  {isCounted ? (
                    <span className="mt-1 w-6 h-6 rounded-full bg-rose-500 text-white font-mono font-extrabold text-xs flex items-center justify-center shadow-md animate-ping-once">
                      {Array.from(countedSet).indexOf(item.id) + 1}
                    </span>
                  ) : (
                    <span className="mt-1 text-[11px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
                      المسني
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (opt === question.answer) {
                    sounds.playSuccess();
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    onSolved();
                  } else {
                    sounds.playEncourage();
                  }
                }}
                className={`py-3 px-4 rounded-2xl border-2 font-black text-sm text-center transition-all btn-bouncy ${
                  opt === question.answer && countedSet.size === data.countTarget
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105 ring-4 ring-emerald-300/50'
                    : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 4. Opposites Game ---------------- */}
      {question.gameType === 'opposites-match' && data?.opposites && (
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            {data.opposites.map(pair => (
              <React.Fragment key={pair.id}>
                <div className="p-4 rounded-3xl bg-amber-50 border-3 border-amber-300 flex flex-col items-center justify-center gap-2 shadow-sm text-center">
                  <span className="text-5xl animate-bounce">{pair.left.emoji}</span>
                  <span className="text-sm font-black text-slate-800">{pair.left.desc}</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                    {pair.left.label}
                  </span>
                </div>
                <div className="p-4 rounded-3xl bg-sky-50 border-3 border-sky-300 flex flex-col items-center justify-center gap-2 shadow-sm text-center">
                  <span className="text-5xl">{pair.right.emoji}</span>
                  <span className="text-sm font-black text-slate-800">{pair.right.desc}</span>
                  <span className="text-xs font-bold text-sky-700 bg-sky-200/70 px-2.5 py-0.5 rounded-full">
                    {pair.right.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedOpposite(opt);
                  if (opt === question.answer) {
                    sounds.playSuccess();
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    onSolved();
                  } else {
                    sounds.playEncourage();
                  }
                }}
                className={`py-3 px-4 rounded-2xl border-2 font-black text-sm text-center transition-all btn-bouncy ${
                  selectedOpposite === opt
                    ? opt === question.answer
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 5. Sequence Steps Story ---------------- */}
      {question.gameType === 'sequence-step' && data?.sequenceItems && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap w-full py-2">
            {data.sequenceItems.map((seq, i) => (
              <React.Fragment key={seq.id}>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs min-w-[70px]">
                  <span className="text-3xl mb-1">{seq.emoji}</span>
                  <span className="text-[11px] font-bold text-slate-700 text-center">{seq.label}</span>
                </div>
                {i < (data.sequenceItems?.length || 0) - 1 && (
                  <ArrowRight className="w-4 h-4 text-amber-500 rotate-180 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (opt === question.answer) {
                    sounds.playSuccess();
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    onSolved();
                  } else {
                    sounds.playEncourage();
                  }
                }}
                className="py-3 px-4 rounded-2xl border-2 font-black text-sm text-center bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-400 text-slate-800 transition-all btn-bouncy"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
