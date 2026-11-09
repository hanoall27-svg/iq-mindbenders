import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Camera, CameraOff, Sparkles, Trophy, Zap, RotateCcw } from 'lucide-react';

interface TargetBubble {
  id: number;
  x: number; // percentage 10 - 90
  y: number; // percentage 15 - 85
  emoji: string;
  points: number;
  popped: boolean;
}

interface MotionCameraGameProps {
  onEarnStars: (stars: number) => void;
}

export const MotionCameraGame: React.FC<MotionCameraGameProps> = ({ onEarnStars }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<TargetBubble[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const TARGET_EMOJIS = ['⭐', '🎈', '🍎', '💎', '🌸', '🥕'];

  const spawnTarget = () => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 75) + 12;
    const y = Math.floor(Math.random() * 70) + 15;
    const emoji = TARGET_EMOJIS[Math.floor(Math.random() * TARGET_EMOJIS.length)];

    setTargets(curr => [...curr.slice(-6), { id, x, y, emoji, points: 10, popped: false }]);
  };

  const startCamera = async () => {
    sounds.playPop();
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      }
    } catch (err) {
      // Camera permission denied or not supported, continue with interactive simulation mode
      setCameraActive(false);
    }
    startGame();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setTargets([]);
  };

  useEffect(() => {
    if (!isPlaying) return;

    // Timer
    const tInterval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          sounds.playFanfare();
          confetti({ particleCount: 60, spread: 70 });
          onEarnStars(3);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Target spawner
    const sInterval = setInterval(spawnTarget, 900);

    return () => {
      clearInterval(tInterval);
      clearInterval(sInterval);
    };
  }, [isPlaying]);

  const handlePopTarget = (id: number) => {
    sounds.playSuccess();
    setScore(s => s + 10);
    setTargets(curr => curr.map(t => (t.id === id ? { ...t, popped: true } : t)));
    setTimeout(() => {
      setTargets(curr => curr.filter(t => t.id !== id));
    }, 250);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-5 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl">
            🤸‍♂️
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              لعبة الحركة واللمس التفاعلية (Touch the Target)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              المس الأهداف الطائرة بيدك أمام الكاميرا أو على الشاشة لتحريك جسدك وجمع النقاط!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 btn-bouncy"
            >
              <Camera className="w-4 h-4" />
              <span>تشغيل الكاميرا</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <CameraOff className="w-4 h-4" />
              <span>إيقاف الكاميرا</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-2xl border-2 border-amber-200 text-xs font-bold text-slate-700">
        <span>الوقت: <strong className="font-mono text-sm text-slate-900">{timeLeft} ثانية</strong></span>
        <span>النقاط: <strong className="font-mono text-sm text-amber-700">{score} 🌟</strong></span>
        <button
          onClick={startGame}
          className="p-1 rounded-xl bg-white hover:bg-amber-100 text-slate-700 border border-amber-300 transition"
          title="إعادة بدء اللعبة"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Motion Screen / Video Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-slate-900 overflow-hidden flex items-center justify-center border-4 border-amber-300 shadow-inner">
        {/* Video feed (mirrored for intuitive interaction) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${
            cameraActive ? 'opacity-90' : 'hidden'
          }`}
        />

        {/* Fallback fun backdrop if camera is off */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 text-center text-white">
            <span className="text-5xl animate-bounce mb-2">🎈</span>
            <h4 className="text-base font-black">وضع اللمس السريع (بدون كاميرا)</h4>
            <p className="text-xs text-white/80 max-w-xs mt-1">
              المس النجوم والبالونات الطائرة بأصابعك لتفجيرها وجمع النقاط! أو اضغط "تشغيل الكاميرا" لتراها حولك.
            </p>
          </div>
        )}

        {/* Floating Target Bubbles */}
        {isPlaying &&
          targets.map(target => (
            <button
              key={target.id}
              onClick={() => handlePopTarget(target.id)}
              className={`absolute p-3 rounded-full bg-white/80 backdrop-blur-xs border-2 border-amber-400 shadow-lg flex items-center justify-center transition-transform cursor-pointer ${
                target.popped ? 'scale-150 opacity-0 duration-200' : 'scale-100 hover:scale-125 duration-300 animate-float'
              }`}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-3xl sm:text-4xl filter drop-shadow-sm">{target.emoji}</span>
            </button>
          ))}

        {!isPlaying && (
          <div className="relative z-10 text-center space-y-3 bg-white/95 p-6 rounded-3xl border-3 border-amber-300 shadow-xl max-w-sm">
            <h4 className="text-base font-black text-slate-800">
              {timeLeft === 0 ? 'انتهت الجولة! أحسنت الحركة!' : 'جاهز للتحرك واللعب؟'}
            </h4>
            <p className="text-xs text-slate-600">
              {timeLeft === 0
                ? `لقد جمعت ${score} نقطة رائعة وحصلت على 3 نجوم ذهبية!`
                : 'ستظهر أهداف طائرة على الشاشة، المسها بسرعة لتفجيرها!'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black text-xs shadow-md transition btn-bouncy"
            >
              ابدأ الجولة الآن (30 ثانية) 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
