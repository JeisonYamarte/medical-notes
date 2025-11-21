"use server";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getCollection } from '@/model/contextFiles';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import type { QueryResult } from 'chromadb';


const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

async function generatePrediction(userInput: string, documents: (string | null)[][] = [] ) {
    
    const { text } = await generateText({
        model: google('gemini-2.5-pro'), // o el modelo que uses
        messages: [
            {
                role: 'system',
                content: `<task>
                            Eres medicalNotes, autocompletador.
                            Usa SOLO <context>.
                            Lee <input>.
                            Reglas:
                            - Compleción clínica orientada a notas médicas.
                            - Máx 10 palabras.
                            - Máx 100 caracteres.
                            - Solo predicción, entre # #.
                            -si no hay contexto responde basado en tu conocimiento.
                            </task>
                            `
            },
            {
                role: 'user',
                content: `<context>
                            ${documents.join('\n\n')}
                        </context>
                        <input>
                            ${userInput}
                        </input>
                        `
            }
        ]
    });
    
    return text;
}

export async function getContextualPrediction(userInput: string) {
    const textForPrediction = userInput.slice(-100);

    const searchResults: QueryResult = await searchChroma(userInput);
    
    const documents: (string | null)[][] = searchResults.documents 

    const response = await generatePrediction(textForPrediction);

    const cleanResponde = response.slice(response.indexOf('#') + 1, response.lastIndexOf('#')).trim();
    

    return cleanResponde;
}

// Searches the ChromaDB collection for relevant documents based on the input text
async function searchChroma(text:string): Promise<QueryResult> {
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

    const results: QueryResult = await collection.query({
        queryTexts: [query],
        nResults: 3,
        where:{
            'user_id': userId
        }
    })
    
    return results;
}