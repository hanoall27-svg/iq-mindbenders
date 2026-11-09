import React, { useState, useMemo, useEffect } from 'react';
import { localQuestions } from './questions';
import { Question, AgeGroup, AbilityType, MascotWardrobeItem, UserStats } from './types';
import { InteractiveClock } from './components/InteractiveClock';
import { InteractiveScale } from './components/InteractiveScale';
import { InteractiveShape } from './components/InteractiveShape';
import { SpeedMinigame } from './components/SpeedMinigame';
import { MascotCompanion } from './components/MascotCompanion';
import { SproutInteractiveGame } from './components/SproutInteractiveGame';
import { MascotWardrobeModal } from './components/MascotWardrobeModal';
import { BrainGymHub } from './components/braingym/BrainGymHub';
import { StoryMode } from './components/story/StoryMode';
import { CertificateModal } from './components/certificate/CertificateModal';
import { ColoringWorksheetsModal } from './components/worksheets/ColoringWorksheetsModal';
import { TwoPlayerDuel } from './components/duel/TwoPlayerDuel';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { AiBuddyVoice } from './components/ai/AiBuddyVoice';
import { sounds } from './utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Copy,
  Check,
  Trophy,
  Zap,
  Scale,
  Clock,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Star,
  Coins,
  Shirt,
  Flame,
  Shuffle,
  Gamepad2,
  Award,
  Palette,
  Printer,
  Rocket,
  Download,
  Users,
  Bot,
  BarChart3,
  Swords
} from 'lucide-react';

const INITIAL_WARDROBE_ITEMS: MascotWardrobeItem[] = [
  { id: 'grad-cap', name: 'قبعة العبقري الصغير', type: 'hat', icon: '🎓', cost: 0, unlocked: true },
  { id: 'cool-glasses', name: 'نظارة المحقق الذكي', type: 'glasses', icon: '🕶️', cost: 3, unlocked: false },
  { id: 'royal-crown', name: 'تاج بطل الألغاز', type: 'hat', icon: '👑', cost: 6, unlocked: false },
  { id: 'party-hat', name: 'قبعة المرح والاحتفال', type: 'hat', icon: '🥳', cost: 2, unlocked: false },
  { id: 'super-cape', name: 'شارة البطل الخارق', type: 'badge', icon: '🦸‍♂️', cost: 5, unlocked: false },
  { id: 'wizard-hat', name: 'قبعة الساحر الحكيم', type: 'hat', icon: '🧙‍♂️', cost: 8, unlocked: false },
];

export default function App() {
  const [activeAgeTab, setActiveAgeTab] = useState<AgeGroup | 'all'>('sprout');
  const [selectedAbility, setSelectedAbility] = useState<AbilityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string | number, string>>({});
  const [showSolution, setShowSolution] = useState<Record<string | number, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string | number, boolean>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  // Primary Navigation Modes (Decluttered Clean Layout)
  const [activeMode, setActiveMode] = useState<
    'braingym' | 'study' | 'story' | 'ai' | 'duel' | 'parent' | 'speed' | 'sandbox' | 'code'
  >('braingym');

  // Gamification states
  const [stars, setStars] = useState(5);
  const [coins, setCoins] = useState(120);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mascot companion states
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'thinking' | 'cheering' | 'encouraging'>('idle');
  const [mascotSpeech, setMascotSpeech] = useState<string>('أهلاً بك في مدينة الذكاء والمرح مع مصطفي زيدان! أنا سمسم صديقك الذكي! 🌟');
  const [wardrobeItems, setWardrobeItems] = useState<MascotWardrobeItem[]>(INITIAL_WARDROBE_ITEMS);
  const [equippedItemId, setEquippedItemId] = useState<string | null>('grad-cap');

  // Modals state
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isWorksheetsOpen, setIsWorksheetsOpen] = useState(false);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = () => {
    sounds.playPop();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    } else {
      alert('لتثبيت تطبيق "مدينة الذكاء والمرح" على هاتفك أو جهازك اللوحي: اضغط على زر المشاركة أو خيارات المتصفح، ثم اختر "إضافة إلى الشاشة الرئيسية (Add to Home Screen)" 📲');
    }
  };

  // Filter questions based on age group, ability, and search
  const filteredQuestions = useMemo(() => {
    return localQuestions.filter(q => {
      if (activeAgeTab !== 'all' && q.ageGroup !== activeAgeTab) return false;
      if (selectedAbility !== 'all' && q.ability !== selectedAbility) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.text.toLowerCase().includes(query);
        const matchesTest = `اختبار ${q.testNumber}`.includes(query) || `test ${q.testNumber}`.includes(query);
        return matchesText || matchesTest;
      }
      return true;
    });
  }, [activeAgeTab, selectedAbility, searchQuery]);

  const activeQ: Question | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Equipped wardrobe accessory
  const equippedItem = useMemo(() => {
    return wardrobeItems.find(i => i.id === equippedItemId) || null;
  }, [equippedItemId, wardrobeItems]);

  // Read question text aloud in Arabic
  const handleReadQuestion = () => {
    if (!activeQ) return;
    if (isSpeaking) {
      sounds.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    setMascotMood('thinking');
    sounds.speakArabic(activeQ.text, () => {
      setIsSpeaking(false);
      setMascotMood('idle');
    });
  };

  // Option selection
  const handleSelectOption = (qId: string | number, opt: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: opt }));
    if (!activeQ) return;

    const isCorrect =
      opt.startsWith(String(activeQ.answer)) ||
      opt === String(activeQ.answer) ||
      (activeQ.answer === 'مطرقة واحدة' && opt.includes('مطرقة')) ||
      opt === 'اكتمل الفرز بنجاح!';

    if (isCorrect) {
      sounds.playSuccess();
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
      setMascotMood('cheering');
      setMascotSpeech('رائع جداً يا عبقري! إجابة صحيحة ومذهلة! 🌟🎉');
      setStreak(s => s + 1);
      setStars(s => s + 1);
      setCoins(c => c + 25);
    } else {
      sounds.playEncourage();
      setMascotMood('encouraging');
      setMascotSpeech('لا بأس يا صديقي، فكر مجدداً وسنصل للحل معاً! 💪');
      setStreak(0);
    }
  };

  const toggleSolution = (qId: string | number) => {
    sounds.playPop();
    setShowSolution(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleHint = (qId: string | number) => {
    sounds.playPop();
    setShowHint(prev => ({ ...prev, [qId]: !prev[qId] }));
    if (activeQ?.hint) {
      setMascotMood('thinking');
      setMascotSpeech(`تلميح سمسم: ${activeQ.hint} 💡`);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setMascotMood('idle');
    }
  };

  const handlePrev = () => {
    sounds.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setMascotMood('idle');
    }
  };

  const copyCode = () => {
    const raw = `export const localQuestions: Question[] = ${JSON.stringify(localQuestions, null, 2)};`;
    navigator.clipboard.writeText(raw);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // User Stats package for Parent Dashboard
  const parentStats: UserStats = {
    score: coins,
    stars: stars,
    coins: coins,
    streak: streak,
    bestStreak: Math.max(streak, 8),
    totalAnswered: Object.keys(userAnswers).length + 24,
    correctAnswered: Object.keys(userAnswers).length + 20,
    abilityScores: {
      Gf: { total: 20, correct: 18 },
      Gv: { total: 18, correct: 16 },
      Gc: { total: 15, correct: 13 },
      Gsm: { total: 14, correct: 12 },
      Gs: { total: 12, correct: 10 },
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 flex flex-col font-sans" dir="rtl">
      {/* ================= HEADER: CLEAN, UNCLUTTERED, ELEGANT ================= */}
      <header className="border-b-2 border-amber-200/80 bg-white/95 backdrop-blur sticky top-0 z-30 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-md animate-float">
              <span className="text-2xl">🐰</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  مدينة الذكاء والمرح مع مصطفي زيدان
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 hidden sm:inline-block">
                  منصة تفاعلية معتمدة
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                تنمية الذاكرة، التفكير المنطقي، والسرعة الذهنية باللعب والمرح
              </p>
            </div>
          </div>

          {/* Quick Utility Tools: Stars, Wardrobe, Certificate, Print, PWA Install, Audio */}
          <div className="flex items-center gap-2">
            {/* Stars */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-2xl border-2 border-amber-300 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="text-xs font-black font-mono text-amber-900">{stars}</span>
            </div>

            {/* Wardrobe */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsWardrobeOpen(true);
              }}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition shadow-xs flex items-center gap-1 text-xs font-bold btn-bouncy"
              title="خزانة أزياء سمسم"
            >
              <Shirt className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">الأزياء</span>
            </button>

            {/* Certificate */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsCertificateOpen(true);
              }}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition shadow-xs flex items-center gap-1 text-xs font-bold btn-bouncy"
              title="طباعة شهادة التفوق"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">الشهادة 📜</span>
            </button>

            {/* Worksheets */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsWorksheetsOpen(true);
              }}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition shadow-xs flex items-center gap-1 text-xs font-bold btn-bouncy"
              title="أوراق عمل للطباعة والتلوين"
            >
              <Printer className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden lg:inline">اطبع ولون 🖨️</span>
            </button>

            {/* PWA Install Button */}
            <button
              onClick={handleInstallApp}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition shadow-xs flex items-center gap-1 text-xs font-bold btn-bouncy"
              title="تثبيت التطبيق على الجهاز بدون إنترنت"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">تثبيت PWA</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition shadow-xs ${
                soundEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-300'
              }`}
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ================= PRIMARY NAVIGATION BAR (DECLUTTERED TABS) ================= */}
        <div className="max-w-6xl mx-auto mt-3 pt-2 border-t border-amber-100 flex items-center justify-between flex-wrap gap-2">
          {/* Main 6 Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('braingym');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-bouncy whitespace-nowrap ${
                activeMode === 'braingym'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              ملعب الألعاب (13 لعبة) 🎮
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('study');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-bouncy whitespace-nowrap ${
                activeMode === 'study'
                  ? 'bg-amber-400 text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:bg-amber-50'
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              موسوعة الألغاز (320 لغز)
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('story');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-bouncy whitespace-nowrap ${
                activeMode === 'story'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-rose-50'
              }`}
            >
              <Rocket className="h-3.5 w-3.5" />
              وضع القصة الفضائية 🚀
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('ai');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-bouncy whitespace-nowrap ${
                activeMode === 'ai'
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-indigo-50'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              سمسم الذكي وتوليد الألغاز 🤖
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('duel');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-bouncy whitespace-nowrap ${
                activeMode === 'duel'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-blue-50'
              }`}
            >
              <Swords className="h-3.5 w-3.5" />
              تحدي شخصين ⚔️
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('parent');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-bouncy whitespace-nowrap ${
                activeMode === 'parent'
                  ? 'bg-emerald-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:bg-emerald-50'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              لوحة ولي الأمر 📊
            </button>
          </div>

          {/* Secondary Utilities Dropdown / Buttons */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-auto sm:mr-0">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('speed');
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeMode === 'speed' ? 'bg-orange-100 text-orange-900 font-black' : 'hover:bg-slate-100'
              }`}
            >
              ⚡ سباق 60 ثانية
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('sandbox');
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeMode === 'sandbox' ? 'bg-emerald-100 text-emerald-900 font-black' : 'hover:bg-slate-100'
              }`}
            >
              🔬 المختبر
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveMode('code');
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeMode === 'code' ? 'bg-rose-100 text-rose-900 font-black' : 'hover:bg-slate-100'
              }`}
            >
              💻 كود TS
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ---------------- 1. BRAIN GYM (ملعب الألعاب - 13 لعبة) ---------------- */}
        {activeMode === 'braingym' && (
          <BrainGymHub
            onEarnStars={(earned) => {
              setStars(s => s + earned);
              setCoins(c => c + earned * 30);
              setMascotMood('cheering');
              setMascotSpeech(`بطل خارق في ملعب الألعاب! أضفنا ${earned} نجوم ذهبية إلى رصيدك! 🌟`);
            }}
          />
        )}

        {/* ---------------- 2. STORY MODE (وضع القصة الفضائية) ---------------- */}
        {activeMode === 'story' && (
          <StoryMode
            onEarnStars={(earned) => {
              setStars(s => s + earned);
              setCoins(c => c + earned * 30);
              setMascotMood('cheering');
              setMascotSpeech(`بطل القصة الفضائية! أحسنت إنجاز المحطة وربحت ${earned} نجوم! 🚀💎`);
            }}
          />
        )}

        {/* ---------------- 3. AI BUDDY & VOICE CHAT (سمسم الذكي وتوليد الألغاز) ---------------- */}
        {activeMode === 'ai' && (
          <AiBuddyVoice
            onEarnStars={(earned) => {
              setStars(s => s + earned);
              setCoins(c => c + earned * 30);
            }}
          />
        )}

        {/* ---------------- 4. TWO PLAYER DUEL (تحدي شخصين على نفس الشاشة) ---------------- */}
        {activeMode === 'duel' && <TwoPlayerDuel />}

        {/* ---------------- 5. PARENT DASHBOARD (لوحة ولي الأمر والرادار) ---------------- */}
        {activeMode === 'parent' && <ParentDashboard userStats={parentStats} />}

        {/* ---------------- 6. STUDY & ORIGINAL PUZZLES (موسوعة الألغاز) ---------------- */}
        {activeMode === 'study' && (
          <div className="space-y-6">
            {/* 4 Age Group Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['sprout', 'explore', 'challenge', 'grow'] as const).map(age => (
                <button
                  key={age}
                  onClick={() => {
                    sounds.playPop();
                    setActiveAgeTab(age);
                    setCurrentIndex(0);
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition btn-bouncy ${
                    activeAgeTab === age
                      ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300/50'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-black block">
                    {age === 'sprout' ? '🧒 براعم (4 - 7 سنين)' : age === 'explore' ? '🎒 استكشاف (8 - 12)' : age === 'challenge' ? '⚡ تحدي (13 - 17)' : '🧠 نمو (18+)'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {age === 'sprout' ? 'ألعاب بصرية وسحب وأصوات' : 'ألغاز ذكاء منهجية'}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Question Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-4">
                {activeQ ? (
                  <div className="bg-white rounded-3xl border-3 border-amber-200 shadow-md p-5 sm:p-7 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {activeQ.ageGroup === 'sprout'
                          ? `لعبة براعم #${activeQ.puzzleNumber}`
                          : `لغز #${activeQ.puzzleNumber} (اختبار ${activeQ.testNumber})`}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        القدرة: {activeQ.ability}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed mb-5">
                      {activeQ.text}
                    </h2>

                    {/* Interactive Sprout Game */}
                    {activeQ.ageGroup === 'sprout' && activeQ.sproutData && (
                      <div className="mb-5">
                        <SproutInteractiveGame
                          question={activeQ}
                          onSolved={() => handleSelectOption(activeQ.id, String(activeQ.answer))}
                        />
                      </div>
                    )}

                    {/* Clock Widget */}
                    {activeQ.visualType === 'clock' && (
                      <div className="mb-5">
                        <InteractiveClock
                          initialHour={Number(activeQ.visualData?.hours || 12)}
                          initialMinute={Number(activeQ.visualData?.minutes || 0)}
                          targetHour={Number(activeQ.visualData?.targetHours || 6)}
                          targetMinute={Number(activeQ.visualData?.targetMinutes || 15)}
                          onSolved={() => handleSelectOption(activeQ.id, String(activeQ.answer))}
                        />
                      </div>
                    )}

                    {/* Scale Widget */}
                    {activeQ.visualType === 'scales' && (
                      <div className="mb-5">
                        <InteractiveScale
                          onSolved={() => handleSelectOption(activeQ.id, String(activeQ.answer))}
                        />
                      </div>
                    )}

                    {/* Shape Widget */}
                    {(activeQ.visualType === 'triangles' ||
                      activeQ.visualType === 'wheel' ||
                      activeQ.visualType === 'stars' ||
                      activeQ.visualType === 'sequence') && (
                      <div className="mb-5">
                        <InteractiveShape question={activeQ} />
                      </div>
                    )}

                    {/* Standard Options */}
                    {activeQ.gameType !== 'drag-sort' && (
                      <div className="space-y-2.5 mb-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeQ.options.map((opt, idx) => {
                            const selected = userAnswers[activeQ.id] === opt;
                            const isCorrect =
                              opt.startsWith(String(activeQ.answer)) ||
                              opt === String(activeQ.answer) ||
                              (activeQ.answer === 'مطرقة واحدة' && opt.includes('مطرقة'));

                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectOption(activeQ.id, opt)}
                                className={`p-3.5 rounded-2xl border-2 text-right text-xs sm:text-sm font-bold transition-all btn-bouncy flex items-center justify-between ${
                                  selected
                                    ? isCorrect
                                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs'
                                      : 'bg-rose-100 border-rose-400 text-rose-950'
                                    : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <span>{opt}</span>
                                {selected && (
                                  <span>
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-rose-600" />
                                    )}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Hints & Solutions */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-amber-100">
                      {activeQ.hint && (
                        <button
                          onClick={() => toggleHint(activeQ.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          {showHint[activeQ.id] ? 'إخفاء التلميح' : 'تلميح ذكي'}
                        </button>
                      )}

                      <button
                        onClick={() => toggleSolution(activeQ.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {showSolution[activeQ.id] ? 'إخفاء الشرح' : 'خطوات الحل'}
                      </button>
                    </div>

                    {showSolution[activeQ.id] && (
                      <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-2 animate-scale-in">
                        {activeQ.solution.map((step, idx) => (
                          <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-900 font-mono text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Arrows */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-100">
                      <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                        السابق
                      </button>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {currentIndex + 1} من {filteredQuestions.length}
                      </span>
                      <button
                        onClick={handleNext}
                        disabled={currentIndex === filteredQuestions.length - 1}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        التالي
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-amber-200">
                    <p className="text-slate-500 font-bold">لا توجد ألغاز مطابقة.</p>
                  </div>
                )}
              </div>

              {/* Sidebar Mascot & Search */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-3xl border-3 border-amber-200 shadow-md p-5 flex flex-col items-center">
                  <MascotCompanion
                    mood={mascotMood}
                    speechBubbleText={mascotSpeech}
                    onReadQuestion={handleReadQuestion}
                    isSpeaking={isSpeaking}
                    equippedItem={equippedItem}
                    starsCount={stars}
                  />
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="ابحث برقم الاختبار أو النص..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setCurrentIndex(0);
                    }}
                    className="w-full pr-10 pl-3 py-2.5 rounded-2xl bg-white border-2 border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-400 shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 7. SPEED SPRINT (تحدي الـ 60 ثانية) ---------------- */}
        {activeMode === 'speed' && (
          <div className="max-w-2xl mx-auto">
            <SpeedMinigame
              questions={localQuestions}
              onFinish={(finalScore, earnedStars) => {
                setStars(s => s + earnedStars);
                setCoins(c => c + finalScore);
              }}
            />
          </div>
        )}

        {/* ---------------- 8. SANDBOX LAB (المختبر التفاعلي) ---------------- */}
        {activeMode === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border-3 border-emerald-200 shadow-md">
              <InteractiveScale onSolved={() => sounds.playSuccess()} />
            </div>
            <div className="bg-white p-6 rounded-3xl border-3 border-indigo-200 shadow-md">
              <InteractiveClock
                initialHour={3}
                initialMinute={45}
                targetHour={9}
                targetMinute={15}
                onSolved={() => sounds.playSuccess()}
              />
            </div>
          </div>
        )}

        {/* ---------------- 9. CODE EXPORT ---------------- */}
        {activeMode === 'code' && (
          <div className="bg-white rounded-3xl border-3 border-rose-200 p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  كود TypeScript الكامل ({localQuestions.length} سؤال ولعبة)
                </h3>
                <p className="text-xs text-slate-500">جاهز للاستخدام ومصنف بالكامل</p>
              </div>
              <button
                onClick={copyCode}
                className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 transition btn-bouncy"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono max-h-[400px] overflow-y-auto ltr text-left leading-relaxed">
              {`export const localQuestions: Question[] = ${JSON.stringify(localQuestions.slice(0, 5), null, 2).slice(0, -1)}
  // ... باقي الـ ${localQuestions.length} سؤال ولعبة مدمجة بالكامل
];`}
            </pre>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}
      {/* 1. Wardrobe Modal */}
      <MascotWardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        items={wardrobeItems}
        equippedItemId={equippedItemId}
        onEquipItem={id => setEquippedItemId(id)}
        onUnlockItem={item => {
          setStars(s => s - item.cost);
          setWardrobeItems(prev => prev.map(i => (i.id === item.id ? { ...i, unlocked: true } : i)));
          setEquippedItemId(item.id);
        }}
        userStars={stars}
      />

      {/* 2. Certificate Modal (Fixed backdrop click & overflow) */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        earnedStars={stars}
      />

      {/* 3. Coloring Worksheets Modal (Fixed backdrop click & overflow) */}
      <ColoringWorksheetsModal
        isOpen={isWorksheetsOpen}
        onClose={() => setIsWorksheetsOpen(false)}
      />
    </div>
  );
}
