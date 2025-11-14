"use server";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getCollection } from '@/model/contextFiles';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

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

export async function getContextualPrediction(userInput: string = 'como puedo mejorar mi productividad en') {
    
    const searchResults = await searchChroma(userInput);

    console.log('Search Results:', searchResults);
}

// Searches the ChromaDB collection for relevant documents based on the input text
async function searchChroma(text:string) {
    let query: string;
    if (text.length >= 100){
        query = text.slice(-100)
    } else {
        query = text
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if(!userId) {
        throw new Error('Unauthorized');
    }

    const collection =  await getCollection();

    const results = await collection.query({
        queryTexts: [query],
        nResults: 3,
        
    })
    
    return results;
}