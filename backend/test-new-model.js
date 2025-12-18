import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

console.log('Testing gemini-2.0-flash-exp...\n');

try {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  const result = await model.generateContent('Say "OK" if this works');
  const text = result.response.text();
  console.log(`✅ SUCCESS - Response: ${text}`);
} catch (error) {
  console.log(`❌ FAILED - ${error.message}`);
}
