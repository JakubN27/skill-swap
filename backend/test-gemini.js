import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

console.log('Testing Gemini API models...\n');

// Test different model names
const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'models/gemini-pro',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
];

for (const modelName of modelsToTest) {
  try {
    console.log(`Testing: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say "OK" if this works');
    const text = result.response.text();
    console.log(`✅ ${modelName} - WORKS - Response: ${text}\n`);
  } catch (error) {
    console.log(`❌ ${modelName} - FAILED - ${error.message}\n`);
  }
}
