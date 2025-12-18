import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

console.log('Listing available Gemini models...\n');

try {
  const models = await genAI.listModels();
  console.log('Available models:');
  for await (const model of models) {
    console.log(`- ${model.name}`);
    console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
    console.log('');
  }
} catch (error) {
  console.error('Error listing models:', error.message);
}
