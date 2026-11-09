export type AgeGroup = 'sprout' | 'explore' | 'challenge' | 'grow';
export type AbilityType = 'Gf' | 'Gv' | 'Gc' | 'Gsm' | 'Gs';

export type GameType = 
  | 'drag-sort'         // سحب وإفلات العناصر في السلال/المطابقة
  | 'animal-sound'      // التعرف على أصوات وحركات الحيوانات
  | 'count-tap'         // عد العناصر باللمس مع الصوت التفاعلي
  | 'opposites-match'   // مطابقة المتضادات البصرية (كبير/صغير)
  | 'sequence-step'     // ترتيب وتسلسل الصور المنطقية
  | 'standard';         // النمط الكلاسيكي المحسن

export interface DraggableItem {
  id: string;
  label: string;
  emoji: string;
  targetCategory: string;
}

export interface DropCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  expectedIds?: string[];
}

export interface CountItem {
  id: string;
  emoji: string;
  counted?: boolean;
}

export interface OppositePair {
  id: string;
  left: { label: string; emoji: string; desc: string };
  right: { label: string; emoji: string; desc: string };
}

export interface SproutGameData {
  dragItems?: DraggableItem[];
  dropCategories?: DropCategory[];
  countTarget?: number;
  countItems?: CountItem[];
  countEmoji?: string;
  animalSound?: string; // e.g. "مياو مياو", "صهيل", "زئير"
  soundCue?: 'cat' | 'dog' | 'lion' | 'duck' | 'sheep' | 'horse' | 'bird' | 'frog';
  opposites?: OppositePair[];
  sequenceItems?: { id: string; step: number; emoji: string; label: string }[];
}

export interface Question {
  id: string | number;
  testNumber: number;
  puzzleNumber: number;
  text: string;
  options: string[];
  answer: string | number;
  solution: string[];
  ageGroup: AgeGroup;
  ability: AbilityType;
  hint?: string;
  visualType?: 'grid' | 'clock' | 'triangles' | 'wheel' | 'sequence' | 'stars' | 'scales' | 'domino' | 'matrix' | 'pyramid';
  visualData?: Record<string, any>;
  gameType?: GameType;
  sproutData?: SproutGameData;
}

export interface UserStats {
  score: number;
  stars: number;
  coins: number;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  correctAnswered: number;
  abilityScores: Record<AbilityType, { total: number; correct: number }>;
}

export interface MascotWardrobeItem {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'badge' | 'cape';
  icon: string;
  cost: number;
  unlocked: boolean;
}
