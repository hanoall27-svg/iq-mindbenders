import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// تحميل المتغيرات السرية من ملف .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// تهيئة الذكاء الاصطناعي
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. مسار توليد اللغز
app.post('/api/generate-puzzle', async (req, res) => {
  try {
    const { ageGroup = 'explore', category = 'math' } = req.body;

    const prompt = `أنت مصمم ألغاز تعليمية ذكي للأطفال واليافعين في منصة "مدينة الذكاء والمرح مع مصطفي زيدان".
قم بتوليد لغز جديد ومبتكر وممتع للفئة العمرية: ${ageGroup} (نوع اللغز: ${category}).
يجب أن يكون اللغز باللغة العربية الفصحى المبسطة ومصحوباً بإيموجي مرحة.

أرجع الإجابة فقط بصيغة JSON صالحة بالشكل التالي بدون أي علامات markdown:
{
  "title": "عنوان اللغز الممتع",
  "text": "نص اللغز وسؤال التحدي",
  "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
  "answer": "الخيار الصحيح المطابق تماماً لأحد الخيارات",
  "hint": "تلميح ذكي قصير",
  "explanation": "شرح مبسط وممتع للحل خطوة بخطوة"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash', // الموديل الخاص بك
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let responseText = response.text || '{}';
    // تنظيف النص من أي علامات ماركداون قد يضيفها الذكاء الاصطناعي
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(responseText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating puzzle:', error.message);
    // لغز احتياطي في حال حدوث خطأ
    res.json({
      title: 'لغز الأرانب والجزر الذهبي 🐰🥕',
      text: 'في حديقة مصطفى زيدان، يمتلك الأرنب سمسم 3 سلال جزر. في كل سلة 4 جزرات ذهبية. كم جزرة ذهبية يمتلك سمسم في المجموع؟',
      options: ['10 جزرات', '12 جزرة', '14 جزرة', '7 جزرات'],
      answer: '12 جزرة',
      hint: 'اضرب عدد السلال (3) في عدد الجزرات داخل كل سلة (4)!',
      explanation: '3 سلال × 4 جزرات = 12 جزرة ذهبية لذيذة! 🥕'
    });
  }
});

// 2. مسار الدردشة مع المساعد
app.post('/api/ask-sesame', async (req, res) => {
  try {
    const { question = '' } = req.body;

    const prompt = `أنت "سمسم"، الأرنب الروبوتي المرح والمساعد الذكي في منصة "مدينة الذكاء والمرح مع مصطفي زيدان".
تحدث مع الطفل باللغة العربية بأسلوب ودود جداً، مشجع، مليء بالإيموجي، وبسيط وسهل الفهم (في حدود 2 إلى 3 جمل قصيرة).
سؤال الطفل هو: "${question}"
أجب بطريقة علمية مبسطة ومرحة تشجع الطفل على التفكير والإبداع:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ reply: response.text || 'أهلاً بك يا بطل! أنا سعيد بسؤالك الذكي، هيا نتعلم ونلعب معاً! 🌟' });
  } catch (error: any) {
    console.error('Error in ask-sesame:', error.message);
    res.json({
      reply: 'يا له من سؤال رائع وذكي يا بطل! أنا سمسم صديقك، وأشجعك دائماً على البحث والتفكير الإبداعي! 🐰🌟'
    });
  }
});

// إعداد الخادم للعمل في وضع التطوير أو الإنتاج
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔧 Running in DEVELOPMENT mode (Vite Middleware)');
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('🚀 Running in PRODUCTION mode (Serving static files)');
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // تعديل هام: استخدام app.use بدلاً من app.get('*') ليتوافق مع Express
    app.use((_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
}

startServer();