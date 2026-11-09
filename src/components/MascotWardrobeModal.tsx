import React from 'react';
import { MascotWardrobeItem } from '../types';
import { sounds } from '../utils/soundEffects';
import { X, Sparkles, Check, Lock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MascotWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MascotWardrobeItem[];
  equippedItemId: string | null;
  onEquipItem: (id: string | null) => void;
  onUnlockItem: (item: MascotWardrobeItem) => void;
  userStars: number;
}

export const MascotWardrobeModal: React.FC<MascotWardrobeModalProps> = ({
  isOpen,
  onClose,
  items,
  equippedItemId,
  onEquipItem,
  onUnlockItem,
  userStars,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-300 shadow-2xl p-6 relative flex flex-col gap-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎩</span>
            <div>
              <h2 className="text-lg font-black text-slate-800">خزانة أزياء صديقنا سمسم 🐰</h2>
              <p className="text-xs text-slate-500">اختر قبعة أو زينة مميزة ليرتديها سمسم أثناء حل الألغاز!</p>
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

        {/* Stars Balance */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-3 rounded-2xl border-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-spin" />
            <span className="text-sm font-bold text-amber-900">رصيدك من النجوم:</span>
          </div>
          <span className="text-lg font-black font-mono text-amber-800">{userStars} ⭐</span>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-1">
          {/* Default No Item */}
          <button
            onClick={() => {
              sounds.playPop();
              onEquipItem(null);
            }}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition btn-bouncy ${
              equippedItemId === null
                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-3xl">🐰</span>
            <span className="text-xs font-bold text-slate-700">المظهر الطبيعي</span>
            {equippedItemId === null && (
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> يرتديه الآن
              </span>
            )}
          </button>

          {items.map(item => {
            const isEquipped = equippedItemId === item.id;
            const canAfford = userStars >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between gap-2 transition ${
                  isEquipped
                    ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-3xl animate-bounce">{item.icon}</span>
                <span className="text-xs font-bold text-slate-800 text-center">{item.name}</span>

                {item.unlocked ? (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onEquipItem(item.id);
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                      isEquipped
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> يرتديه الآن
                      </>
                    ) : (
                      'ارتداء'
                    )}
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        sounds.playFanfare();
                        confetti({ particleCount: 50, spread: 60 });
                        onUnlockItem(item);
                      } else {
                        sounds.playEncourage();
                      }
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                      canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>{item.cost} ⭐</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
