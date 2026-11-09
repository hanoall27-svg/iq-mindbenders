import React, { useState } from 'react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Mic, MicOff, Send, Bot, Lightbulb, CheckCircle2, RotateCcw, Volume2, HelpCircle } from 'lucide-react';

interface GeneratedPuzzle {
  title: string;
  text: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
}

interface AiBuddyVoiceProps {
  onEarnStars: (stars: number) => void;
}

export const AiBuddyVoice: React.FC<AiBuddyVoiceProps> = ({ onEarnStars }) => {
  const [selectedAge, setSelectedAge] = useState<'sprout' | 'explore' | 'challenge' | 'grow'>('explore');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Voice Chat States
  const [userQuery, setUserQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sesameReply, setSesameReply] = useState<string | null>(
    'أهلاً بك يا بطل! أنا سمسم صديقك الذكي، اضغط على المايك واسألني أي سؤال في الكون، أو اطلب مني تأليف لغز جديد لك! 🐰🌟'
  );

  // 1. Generate new AI Puzzle
  const handleGeneratePuzzle = async () => {
    sounds.playPop();
    setIsGenerating(true);
    setCurrentPuzzle(null);
    setSelectedOption(null);
    setShowHint(false);
    setShowExplanation(false);

    try {
      const res = await fetch('/api/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageGroup: selectedAge }),
      });
      const data = await res.json();
      setCurrentPuzzle(data);
      sounds.playSuccess();
    } catch {
      // Fallback puzzle
      setCurrentPuzzle({
        title: 'لغز النجوم الفضائية 🌟',
        text: 'في سماء مدينة الذكاء، ظهرت 4 نجوم زرقاء، ثم انضمت إليها 5 نجوم ذهبية لامعة. كم نجماً يضيء السماء الآن؟',
        options: ['8 نجوم', '9 نجوم', '10 نجوم', '7 نجوم'],
        answer: '9 نجوم',
        hint: 'اجمع النجوم الزرقاء (4) مع النجوم الذهبية (5).',
        explanation: '4 + 5 = 9 نجوم جميلة تضيء السماء! 🌟'
      });
      sounds.playSuccess();
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Voice Input using Web Speech Recognition
  const handleToggleVoice = () => {
    sounds.playPop();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('المتصفح لا يدعم ميزة التسجيل الصوتي المباشر، يمكنك كتابة السؤال في المربع أدناه وسأجيبك فوراً! ✍️');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserQuery(transcript);
        setIsListening(false);
        handleSendQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // 3. Ask Sesame via Gemini
  const handleSendQuery = async (queryText?: string) => {
    const q = queryText || userQuery;
    if (!q.trim()) return;

    sounds.playPop();
    setIsChatLoading(true);
    setSesameReply(null);

    try {
      const res = await fetch('/api/ask-sesame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const reply = data.reply || 'أنت بطل ذكي جداً يا صديقي!';
      setSesameReply(reply);
      sounds.playSuccess();
      sounds.speakArabic(reply);
    } catch {
      const fallbackReply = 'أهلاً بك يا بطل! سؤالك رائع وممتع جداً، فكر دائماً واستمر في التعلم والاستكشاف مع سمسم ومصطفى زيدان! 🌟';
      setSesameReply(fallbackReply);
      sounds.speakArabic(fallbackReply);
    } finally {
      setIsChatLoading(false);
      setUserQuery('');
    }
  };

  const handleSelectOption = (opt: string) => {
    if (!currentPuzzle) return;
    setSelectedOption(opt);

    if (opt === currentPuzzle.answer) {
      sounds.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onEarnStars(3);
      setShowExplanation(true);
    } else {
      sounds.playEncourage();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md flex flex-col gap-6 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl animate-float">
            🤖
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              المساعد الذكي وتوليد الألغاز التكيفية (Adaptive AI)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              توليد ألغاز ذكاء لانهائية وتحدث بالصوت مباشرة مع الروبوت سمسم!
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Voice Chat with Sesame & AI Puzzle Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Card: Voice & Text Chat with Sesame */}
        <div className="p-5 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 flex flex-col justify-between gap-4 h-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                تحدث مع سمسم بالصوت (Voice Chat):
              </span>
              <span className="text-xs font-mono font-bold bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 text-indigo-700">
                مدعوم بـ Gemini AI
              </span>
            </div>

            {/* Mascot Reply Bubble */}
            <div className="bg-white p-4 rounded-2xl border-2 border-indigo-200 shadow-xs relative min-h-[90px] flex items-center gap-3">
              <div className="text-3xl shrink-0 animate-bounce">🐰</div>
              <div className="flex-1">
                {isChatLoading ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>سمسم يفكر في إجابة ذكية وممتعة لك...</span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    {sesameReply}
                  </p>
                )}
              </div>
              {sesameReply && (
                <button
                  onClick={() => sounds.speakArabic(sesameReply)}
                  className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
                  title="استمع للإجابة مرة ثانية"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Voice & Text Input Form */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleVoice}
                className={`p-3.5 rounded-2xl border-2 transition-all btn-bouncy flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse scale-105 shadow-md'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                }`}
                title={isListening ? 'جارٍ الاستماع... اضغط للإيقاف' : 'اضغط للتحدث بالصوت'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
                placeholder={isListening ? 'سمسم يستمع لصوتك الآن...' : 'أو اكتب سؤالك لسمسم هنا...'}
                className="flex-1 px-4 py-3 rounded-2xl bg-white border-2 border-indigo-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 shadow-xs"
              />

              <button
                onClick={() => handleSendQuery()}
                disabled={!userQuery.trim() || isChatLoading}
                className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition btn-bouncy"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block text-right pr-1">
              💡 مثال: "ليه السماء لونها أزرق؟" أو "كم عدد الكواكب في الفضاء؟"
            </span>
          </div>
        </div>

        {/* Right Card: Generate New AI Puzzle */}
        <div className="p-5 rounded-3xl bg-amber-50/70 border-2 border-amber-200 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-amber-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                توليد لغز جديد تكيفي:
              </span>
              <div className="flex gap-1">
                {(['sprout', 'explore', 'challenge', 'grow'] as const).map(age => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                      selectedAge === age
                        ? 'bg-amber-400 text-slate-900 font-black shadow-xs'
                        : 'bg-white text-slate-600 border border-amber-200'
                    }`}
                  >
                    {age === 'sprout' ? '4-7' : age === 'explore' ? '8-12' : age === 'challenge' ? '13-17' : '18+'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePuzzle}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:brightness-105 disabled:opacity-50 text-white font-black text-sm shadow-md transition btn-bouncy flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'سمسم يؤلف لغزاً جديداً بذكاء...' : 'اصنع لي لغزاً جديداً الآن 🎲'}</span>
            </button>

            {/* Display Generated Puzzle */}
            {currentPuzzle && (
              <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-3 animate-scale-in">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="text-xs font-black text-amber-800">{currentPuzzle.title}</span>
                  <button
                    onClick={() => sounds.speakArabic(currentPuzzle.text)}
                    className="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700"
                    title="استمع للغز"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                  {currentPuzzle.text}
                </p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentPuzzle.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === currentPuzzle.answer;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(opt)}
                        className={`p-2.5 rounded-xl border-2 text-xs font-bold transition btn-bouncy ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
                              : 'bg-rose-100 border-rose-400 text-rose-900'
                            : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Hint & Explanation */}
                <div className="flex items-center gap-2 pt-2 border-t border-amber-100 text-[11px]">
                  <button
                    onClick={() => setShowHint(h => !h)}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    {showHint ? 'إخفاء التلميح' : 'عرض التلميح 💡'}
                  </button>
                  {showHint && <span className="text-slate-600 font-medium">{currentPuzzle.hint}</span>}
                </div>

                {showExplanation && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold animate-scale-in">
                    {currentPuzzle.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
