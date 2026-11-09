import { Question } from '../types';

export const sproutQuestions: Question[] = [
  // 1. فرز الألوان بالسحب والإفلات (Drag and drop)
  {
    id: 'sprout-1',
    testNumber: 0,
    puzzleNumber: 1,
    text: 'اسحب كل فاكهة لذيذة وضعها في السلة التي تطابق لونها! 🧺🍎🍌',
    options: ['اكتمل الفرز بنجاح!'],
    answer: 'اكتمل الفرز بنجاح!',
    solution: [
      'التفاحة الحمراء 🍎 والفراولة 🍓 تنتميان للسلة الحمراء.',
      'الموزة 🍌 والليمونة 🍋 تنتميان للسلة الصفراء.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'انظر إلى لون السلة وضع الفواكه ذات اللون المماثل بداخلها.',
    gameType: 'drag-sort',
    sproutData: {
      dragItems: [
        { id: 'item-apple', label: 'تفاحة حمراء', emoji: '🍎', targetCategory: 'red-basket' },
        { id: 'item-banana', label: 'موزة صفراء', emoji: '🍌', targetCategory: 'yellow-basket' },
        { id: 'item-straw', label: 'فراولة حمراء', emoji: '🍓', targetCategory: 'red-basket' },
        { id: 'item-lemon', label: 'ليمونة صفراء', emoji: '🍋', targetCategory: 'yellow-basket' },
      ],
      dropCategories: [
        { id: 'red-basket', title: 'السلة الحمراء', emoji: '🧺', color: 'bg-rose-100 border-rose-400 text-rose-700' },
        { id: 'yellow-basket', title: 'السلة الصفراء', emoji: '🧺', color: 'bg-amber-100 border-amber-400 text-amber-700' },
      ],
    }
  },

  // 2. من يصدر هذا الصوت؟ (أصوات حيوانات تفاعلية)
  {
    id: 'sprout-2',
    testNumber: 0,
    puzzleNumber: 2,
    text: 'استمع جيداً! من الحيوان اللطيف الذي يقول "مياو.. مياو"؟ 🐾',
    options: ['القطة 🐱', 'الكلب 🐶', 'البطة 🦆', 'الحصان 🐴'],
    answer: 'القطة 🐱',
    solution: [
      'القطة هي التي تموء وتقول مياو 🐱.',
      'الكلب ينبح، والبطة تقول كواك، والحصان يصهل.'
    ],
    ageGroup: 'sprout',
    ability: 'Gc',
    hint: 'حيوان أليف صغير يحب الحليب ولديه شوارب لطيفة!',
    gameType: 'animal-sound',
    sproutData: {
      animalSound: 'مياو.. مياو! 🐱',
      soundCue: 'cat',
    }
  },

  // 3. عد التفاحات التفاعلي باللمس
  {
    id: 'sprout-3',
    testNumber: 0,
    puzzleNumber: 3,
    text: 'اضغط على كل تفاحة على الشجرة لتعدها بصوتك مع الأرنب! كم تفاحة حمراء توجد؟ 🌳🍎',
    options: ['3 تفاحات', '4 تفاحات', '5 تفاحات', '6 تفاحات'],
    answer: '5 تفاحات',
    solution: [
      'عند الضغط على التفاحات واحدة تلو الأخرى نجد 5 تفاحات حمراء شهية: 1, 2, 3, 4, 5.'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'المس كل تفاحة لتضيء وتسمع صوت العد!',
    gameType: 'count-tap',
    sproutData: {
      countTarget: 5,
      countEmoji: '🍎',
      countItems: [
        { id: 'c1', emoji: '🍎' },
        { id: 'c2', emoji: '🍎' },
        { id: 'c3', emoji: '🍎' },
        { id: 'c4', emoji: '🍎' },
        { id: 'c5', emoji: '🍎' },
      ]
    }
  },

  // 4. المتضادات البصرية (كبير وصغير)
  {
    id: 'sprout-4',
    testNumber: 0,
    puzzleNumber: 4,
    text: 'أين هو الحيوان "الضخم الكبير جداً" مقارنة بالنملة الصغيرة؟ 🐘🐜',
    options: ['الفيل 🐘', 'النملة 🐜', 'الفراشة 🦋', 'النحلة 🐝'],
    answer: 'الفيل 🐘',
    solution: [
      'الفيل 🐘 حيوان ضخم جداً وله خرطوم طويل وأذنان كبيرتان.',
      'النملة 🐜 حشرة صغيرة جداً.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'ابحث عن الحيوان الأكبر حجماً بين كل الخيارات.',
    gameType: 'opposites-match',
    sproutData: {
      opposites: [
        {
          id: 'op-1',
          left: { label: 'كبير جداً وضخم', emoji: '🐘', desc: 'الفيل' },
          right: { label: 'صغير جداً ودقيق', emoji: '🐜', desc: 'النملة' }
        }
      ]
    }
  },

  // 5. التسلسل المنطقي للطبيعة
  {
    id: 'sprout-5',
    testNumber: 0,
    puzzleNumber: 5,
    text: 'كانت هناك غيمة ممطرة 🌧️ روت الأرض، فماذا تتوقع أن ينمو ويزهر بعد المطر؟ 🌱',
    options: ['وردة جميلة متفتحة 🌸', 'رجل ثلج ⛄', 'شمس حارقة ☀️', 'كرة قدم ⚽'],
    answer: 'وردة جميلة متفتحة 🌸',
    solution: [
      'المطر يروي البذور في التراب.',
      'بعد المطر والشمس تنمو الأزهار الجميلة والنباتات 🌸.'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'النباتات تحتاج إلى قطرات الماء لتتفتح أوراقها الملونة.',
    gameType: 'sequence-step',
    sproutData: {
      sequenceItems: [
        { id: 's1', step: 1, emoji: '☁️', label: 'غيوم في السماء' },
        { id: 's2', step: 2, emoji: '🌧️', label: 'مطر يسقي الأرض' },
        { id: 's3', step: 3, emoji: '🌱', label: 'برعم أخضر صغير' },
        { id: 's4', step: 4, emoji: '🌸', label: 'زهرة فواحة ملونة' },
      ]
    }
  },

  // 6. سحب وفرز الأشكال الهندسية
  {
    id: 'sprout-6',
    testNumber: 0,
    puzzleNumber: 6,
    text: 'اسحب كل شكل إلى منزله المناسب: المربعات 🟦 مع المربعات، والدوائر 🟡 مع الدوائر!',
    options: ['اكتمل الفرز بنجاح!'],
    answer: 'اكتمل الفرز بنجاح!',
    solution: [
      'الأشكال ذات الزوايا الأربع هي مربعات 🟦.',
      'الأشكال المستديرة تماماً هي دوائر 🟡.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'ضع الدائرة في صندوق الدوائر، والمربع في صندوق المربعات.',
    gameType: 'drag-sort',
    sproutData: {
      dragItems: [
        { id: 'sq-1', label: 'مربع أزرق', emoji: '🟦', targetCategory: 'squares-box' },
        { id: 'cir-1', label: 'دائرة صفراء', emoji: '🟡', targetCategory: 'circles-box' },
        { id: 'sq-2', label: 'مربع برتقالي', emoji: '🟧', targetCategory: 'squares-box' },
        { id: 'cir-2', label: 'دائرة خضراء', emoji: '🟢', targetCategory: 'circles-box' },
      ],
      dropCategories: [
        { id: 'squares-box', title: 'صندوق المربعات ⏹️', emoji: '📦', color: 'bg-blue-100 border-blue-400 text-blue-700' },
        { id: 'circles-box', title: 'صندوق الدوائر ⏺️', emoji: '📦', color: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
      ]
    }
  },

  // 7. صوت البطة اللطيفة
  {
    id: 'sprout-7',
    testNumber: 0,
    puzzleNumber: 7,
    text: 'تسبح في بركة الماء وتقول "كواك.. كواك"! من هي؟ 🌊',
    options: ['البطة اللطيفة 🦆', 'العصفور 🐦', 'الخروف 🐑', 'الضفدع 🐸'],
    answer: 'البطة اللطيفة 🦆',
    solution: [
      'البطة تقول كواك كواك وتسبح بمرح في الماء بريشها الأصفر اللامع 🦆.'
    ],
    ageGroup: 'sprout',
    ability: 'Gc',
    hint: 'طائر يسبح بأقدامه المجد Removeية في البحيرة!',
    gameType: 'animal-sound',
    sproutData: {
      animalSound: 'كواك.. كواك! 🦆',
      soundCue: 'duck',
    }
  },

  // 8. عد النجوم الذهبية
  {
    id: 'sprout-8',
    testNumber: 0,
    puzzleNumber: 8,
    text: 'المس النجوم اللامعة في سماء الليل لتعدها! كم نجمة ذهبية تتلألأ؟ ✨⭐',
    options: ['3 نجوم', '4 نجوم', '6 نجوم', '7 نجوم'],
    answer: '4 نجوم',
    solution: [
      'عند لمس النجوم في السماء نعد: نجمة 1, نجمة 2, نجمة 3, نجمة 4 ⭐.'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'اضغط على كل نجمة لتسمع رنينها وتجمعها.',
    gameType: 'count-tap',
    sproutData: {
      countTarget: 4,
      countEmoji: '⭐',
      countItems: [
        { id: 'st1', emoji: '⭐' },
        { id: 'st2', emoji: '⭐' },
        { id: 'st3', emoji: '⭐' },
        { id: 'st4', emoji: '⭐' },
      ]
    }
  },

  // 9. المتضادات (طويل وقصير)
  {
    id: 'sprout-9',
    testNumber: 0,
    puzzleNumber: 9,
    text: 'أي من الأصدقاء رقبتها طويلة جداً لتصل إلى أوراق الشجر العالية؟ 🦒🐢',
    options: ['الزرافة الطويلة 🦒', 'السلحفاة القصيرة 🐢', 'الأرنب 🐰', 'القنفذ 🦔'],
    answer: 'الزرافة الطويلة 🦒',
    solution: [
      'الزرافة 🦒 أطول حيوان بري ولها رقبة طويلة جداً.',
      'السلحفاة 🐢 قريبة من الأرض ورقبتها قصيرة.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'الحيوان ذو البقع البنية والرقبة الشاهقة!',
    gameType: 'opposites-match',
    sproutData: {
      opposites: [
        {
          id: 'op-2',
          left: { label: 'طويلة جداً وعالية', emoji: '🦒', desc: 'الزرافة' },
          right: { label: 'قصيرة وبطيئة', emoji: '🐢', desc: 'السلحفاة' }
        }
      ]
    }
  },

  // 10. دورة حياة الفراشة البديعة
  {
    id: 'sprout-10',
    testNumber: 0,
    puzzleNumber: 10,
    text: 'كانت بيضة صغيرة على ورقة، ثم خرجت يرقة خضراء، ثم دخلت شرنقتها... فماذا تطير في النهاية بجناحين ملونين؟ 🐛',
    options: ['فراشة ملونة رائعة 🦋', 'سمكة 🐟', 'سلحفاة 🐢', 'طائرة ورقية 🪁'],
    answer: 'فراشة ملونة رائعة 🦋',
    solution: [
      'تتحول اليرقة بعد خروجها من الشرنقة إلى فراشة زاهية الألوان تطير بين الزهور 🦋.'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'كائن يطير بجناحين ملونين ويحب رحيق الأزهار.',
    gameType: 'sequence-step',
    sproutData: {
      sequenceItems: [
        { id: 'bf1', step: 1, emoji: '🍃', label: 'ورقة شجر عليها بيضة' },
        { id: 'bf2', step: 2, emoji: '🐛', label: 'يرقة صغيرة تأكل الورق' },
        { id: 'bf3', step: 3, emoji: '🪵', label: 'شرنقة دافئة تنام فيها' },
        { id: 'bf4', step: 4, emoji: '🦋', label: 'فراشة بديعة الألوان' },
      ]
    }
  },

  // 11. فرز طعام الحيوانات (سحب وإفلات)
  {
    id: 'sprout-11',
    testNumber: 0,
    puzzleNumber: 11,
    text: 'ساعد الحيوانات الجائعة! اسحب الجزر 🥕 إلى الأرنب اللطيف 🐰، والموز 🍌 إلى القرد المرح 🐵!',
    options: ['اكتمل الفرز بنجاح!'],
    answer: 'اكتمل الفرز بنجاح!',
    solution: [
      'الأرنب 🐰 يحب أكل الجزر البرتقالي المقرمش 🥕.',
      'القرد 🐵 يحب أكل الموز الأصفر اللذيذ 🍌.'
    ],
    ageGroup: 'sprout',
    ability: 'Gc',
    hint: 'الأرنب يأكل الجزر، والقرد يتسلق الشجر ليقطف الموز.',
    gameType: 'drag-sort',
    sproutData: {
      dragItems: [
        { id: 'f-carrot1', label: 'جزرة', emoji: '🥕', targetCategory: 'rabbit-zone' },
        { id: 'f-banana1', label: 'موزة', emoji: '🍌', targetCategory: 'monkey-zone' },
        { id: 'f-carrot2', label: 'جزرة طازجة', emoji: '🥕', targetCategory: 'rabbit-zone' },
        { id: 'f-banana2', label: 'موزة ناضجة', emoji: '🍌', targetCategory: 'monkey-zone' },
      ],
      dropCategories: [
        { id: 'rabbit-zone', title: 'بيت الأرنب 🐰', emoji: '🏡', color: 'bg-orange-100 border-orange-400 text-orange-700' },
        { id: 'monkey-zone', title: 'شجرة القرد 🐵', emoji: '🌴', color: 'bg-amber-100 border-amber-400 text-amber-700' },
      ]
    }
  },

  // 12. صوت الضفدع القافز
  {
    id: 'sprout-12',
    testNumber: 0,
    puzzleNumber: 12,
    text: 'يقفز فوق أوراق زنابق الماء ويقول "نقيق.. ربت ربت"! من هو هذا الصديق الأخضر؟ 🐸',
    options: ['الضفدع الأخضر 🐸', 'التمساح 🐊', 'الحلزون 🐌', 'السمكة 🐠'],
    answer: 'الضفدع الأخضر 🐸',
    solution: [
      'الضفدع 🐸 يقفز بخفة ويصدر صوت النقيق اللطيف.'
    ],
    ageGroup: 'sprout',
    ability: 'Gc',
    hint: 'صغير، أخضر، يحب القفز في المستنقعات والبرك.',
    gameType: 'animal-sound',
    sproutData: {
      animalSound: 'نقيق.. ربت ربت! 🐸',
      soundCue: 'frog',
    }
  },

  // 13. عد الفراشات الملونة
  {
    id: 'sprout-13',
    testNumber: 0,
    puzzleNumber: 13,
    text: 'اضغط على الفراشات في الحديقة لتعدها! كم فراشة تطير هنا وهناك؟ 🦋🌸',
    options: ['3 فراشات', '6 فراشات', '2 فراشات', '5 فراشات'],
    answer: '3 فراشات',
    solution: [
      'نعد الفراشات باللمس: 1.. 2.. 3 فراشات ملونة 🦋.'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'المس الفراشات واحدة تلو الأخرى.',
    gameType: 'count-tap',
    sproutData: {
      countTarget: 3,
      countEmoji: '🦋',
      countItems: [
        { id: 'bf-1', emoji: '🦋' },
        { id: 'bf-2', emoji: '🦋' },
        { id: 'bf-3', emoji: '🦋' },
      ]
    }
  },

  // 14. المتضادات (حار وبارد)
  {
    id: 'sprout-14',
    testNumber: 0,
    puzzleNumber: 14,
    text: 'ما هو الشيء البارد والمثلج جداً الذي يذوب إذا جاءت الشمس الدافئة؟ ☀️❄️',
    options: ['الآيس كريم أو رجل الثلج 🍦⛄', 'كوب الشاي الساخن ☕', 'النار المشتعلة 🔥', 'المصباح 💡'],
    answer: 'الآيس كريم أو رجل الثلج 🍦⛄',
    solution: [
      'الثلج والآيس كريم باردان ومنعشان 🍦، بينما الشمس والنار ساخنان جداً 🔥.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'شيء نأكله في الصيف ليشعرنا بالانتعاش والبرودة!',
    gameType: 'opposites-match',
    sproutData: {
      opposites: [
        {
          id: 'op-3',
          left: { label: 'حار وساخن جداً', emoji: '☀️', desc: 'الشمس المشرقة' },
          right: { label: 'بارد ومثلج', emoji: '⛄', desc: 'رجل الثلج' }
        }
      ]
    }
  },

  // 15. دورة نمو الفرخ الصغير
  {
    id: 'sprout-15',
    testNumber: 0,
    puzzleNumber: 15,
    text: 'رقدت الدجاجة على البيضة 🥚، ثم تصدعت القشرة.. فمن خرج منها يصوصو بلطف؟ 🐣',
    options: ['الكتكوت الأصفر الصغير 🐥', 'القط 🐱', 'الجرو 🐶', 'الحمل 🐑'],
    answer: 'الكتكوت الأصفر الصغير 🐥',
    solution: [
      'تفقس البيضة ليخرج منها كتكوت دجاجة أصفر بريء يصوصو: صوصو! 🐥'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'فرخ صغير أصفر اللون يتبع أمه الدجاجة.',
    gameType: 'sequence-step',
    sproutData: {
      sequenceItems: [
        { id: 'ck-1', step: 1, emoji: '🥚', label: 'بيضة دافئة في العش' },
        { id: 'ck-2', step: 2, emoji: '🐣', label: 'تفقس البيضة ويظهر منقار صغير' },
        { id: 'ck-3', step: 3, emoji: '🐥', label: 'كتكوت أصفر لطيف يصوصو' },
        { id: 'ck-4', step: 4, emoji: '🐔', label: 'دجاجة نشيطة ترعى صغارها' },
      ]
    }
  },

  // 16. فرز ملابس الصيف والشتاء بالسحب
  {
    id: 'sprout-16',
    testNumber: 0,
    puzzleNumber: 16,
    text: 'اسحب القبعة الدافئة 🧣 إلى خزانة الشتاء ❄️، والنظارة الشمسية 🕶️ إلى حقيبة الصيف ☀️!',
    options: ['اكتمل الفرز بنجاح!'],
    answer: 'اكتمل الفرز بنجاح!',
    solution: [
      'الملابس الصوفية والوشاح للشتاء البارد ❄️.',
      'النظارة وقبعة الشاطئ لأيام الصيف المشمسة ☀️.'
    ],
    ageGroup: 'sprout',
    ability: 'Gc',
    hint: 'الأشياء الدافئة للشتاء، وأشياء الشاطئ للصيف.',
    gameType: 'drag-sort',
    sproutData: {
      dragItems: [
        { id: 'cl-scarf', label: 'وشاح صوفي', emoji: '🧣', targetCategory: 'winter-closet' },
        { id: 'cl-glasses', label: 'نظارة شمسية', emoji: '🕶️', targetCategory: 'summer-bag' },
        { id: 'cl-beanie', label: 'قبعة شتوية', emoji: '🧤', targetCategory: 'winter-closet' },
        { id: 'cl-shirt', label: 'تيشيرت صيفي', emoji: '👕', targetCategory: 'summer-bag' },
      ],
      dropCategories: [
        { id: 'winter-closet', title: 'خزانة الشتاء ❄️', emoji: '🧥', color: 'bg-cyan-100 border-cyan-400 text-cyan-700' },
        { id: 'summer-bag', title: 'حقيبة الصيف ☀️', emoji: '🏖️', color: 'bg-amber-100 border-amber-400 text-amber-700' },
      ]
    }
  },

  // 17. صوت الخروف الوديع
  {
    id: 'sprout-17',
    testNumber: 0,
    puzzleNumber: 17,
    text: 'حيوان يغطي جسمه الصوف الأبيض الجميل ويقول "مااااء.. مااااء"! من هو؟ 🐑',
    options: ['الخروف الوديع 🐑', 'البقرة 🐄', 'الحمار الوحشي 🦓', 'الذئب 🐺'],
    answer: 'الخروف الوديع 🐑',
    solution: [
      'الخروف يعطينا الصوف الناعم ويقول مااااء 🐑.'
    ],
    ageGroup: 'sprout',
    ability: 'Gc',
    hint: 'له صوف أبيض كالسحاب ويعيش في المزرعة الخضراء.',
    gameType: 'animal-sound',
    sproutData: {
      animalSound: 'مااااء.. مااااء! 🐑',
      soundCue: 'sheep',
    }
  },

  // 18. عد البالونات الملونة
  {
    id: 'sprout-18',
    testNumber: 0,
    puzzleNumber: 18,
    text: 'المس بالونات الحفلة لتطير وتعدها! كم بالونة مرحة موجودة؟ 🎈🎈',
    options: ['4 بالونات', '5 بالونات', '6 بالونات', '7 بالونات'],
    answer: '6 بالونات',
    solution: [
      'نعد البالونات الملونة: 1, 2, 3, 4, 5, 6 بالونات زاهية 🎈.'
    ],
    ageGroup: 'sprout',
    ability: 'Gf',
    hint: 'المس كل بالونة لتفرقع بمرح وتُحسب في العداد.',
    gameType: 'count-tap',
    sproutData: {
      countTarget: 6,
      countEmoji: '🎈',
      countItems: [
        { id: 'bl1', emoji: '🎈' },
        { id: 'bl2', emoji: '🎈' },
        { id: 'bl3', emoji: '🎈' },
        { id: 'bl4', emoji: '🎈' },
        { id: 'bl5', emoji: '🎈' },
        { id: 'bl6', emoji: '🎈' },
      ]
    }
  },

  // 19. المتضادات (سريع وبطيء)
  {
    id: 'sprout-19',
    testNumber: 0,
    puzzleNumber: 19,
    text: 'من الحيوان السريع جداً الذي يقفز برشاقة مقارنة بالحلزون الهادئ البطيء؟ 🐰🐌',
    options: ['الأرنب السريع 🐰', 'الحلزون البطيء 🐌', 'الدب النائم 🐻', 'الكسلان 🦥'],
    answer: 'الأرنب السريع 🐰',
    solution: [
      'الأرنب يقفز بسرعة فائقة 🐰.',
      'الحلزون يتحرك ببطء شديد ويحمل بيته فوق ظهره 🐌.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'صاحب الأذنين الطويلتين الذي يحب الجري والسباق!',
    gameType: 'opposites-match',
    sproutData: {
      opposites: [
        {
          id: 'op-4',
          left: { label: 'سريع جداً ورشيق', emoji: '🐰', desc: 'الأرنب' },
          right: { label: 'بطيء وهادئ', emoji: '🐌', desc: 'الحلزون' }
        }
      ]
    }
  },

  // 20. إكمال المربع والشكل البصري
  {
    id: 'sprout-20',
    testNumber: 0,
    puzzleNumber: 20,
    text: 'إذا وضعنا مثلثين متطابقين 📐🔺 جنباً إلى جنب، فما هو الشكل الكبير الذي يكتمل؟',
    options: ['مربع أو مستطيل رائع ⏹️', 'دائرة كاملة ⏺️', 'نجمة سداسية ⭐', 'سحابة ☁️'],
    answer: 'مربع أو مستطيل رائع ⏹️',
    solution: [
      'ضم المثلثين المتقابلين يشكل مربعاً متناسق الزوايا ⏹️.'
    ],
    ageGroup: 'sprout',
    ability: 'Gv',
    hint: 'شكل له أربعة أضلاع مستقيمة وأربع زوايا قائمة.',
    gameType: 'standard',
  }
];
