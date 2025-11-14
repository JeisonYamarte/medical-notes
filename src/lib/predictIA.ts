"use server";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export async function generatePrediction(prompt: string) {
    console.log('API Key exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    
    const { text } = await generateText({
        model: google('gemini-2.5-pro'), // o el modelo que uses
        prompt,
    });
    
    return text;
}
