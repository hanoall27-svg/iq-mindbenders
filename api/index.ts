import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- ضع هنا جميع مسارات الـ API الخاصة بك ---
app.post('/api/generate-puzzle', async (req, res) => {
  // ... (نفس الكود الموجود في server.ts)
});

app.post('/api/ask-sesame', async (req, res) => {
  // ... (نفس الكود الموجود في server.ts)
});

// تصدير التطبيق ليعمل كدالة سحابية على Vercel
export default app;