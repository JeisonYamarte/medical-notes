"use server";
import { generateText } from 'ai';
import { google } from '../lib/gemini';
import { searchChroma } from './chromaService';
import type { QueryResult } from 'chromadb';


async function generatePrediction(userInput: string, documents: (string | null)[][] = []) {
    try {
        const { text } = await generateText({
            model: google('gemini-2.0-flash-lite'),
            temperature: 0.2,
            topP: 0.9,
            topK: 30,
            maxOutputTokens: 30,
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
                                - No agregues signos de puntuación innecesarios, ni punto final.
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
    } catch (error) {
        console.error('generatePrediction error', error);
        throw error;
    }
}

export async function getContextualPrediction(userInput: string) {
    const textForPrediction = userInput.slice(-100);

    let searchResults: QueryResult | undefined;

    try {
        if (userInput.length > 50) {
            searchResults = await searchChroma(userInput);
        }
    } catch (error) {
        console.error('searchChroma error', error);
    }

    const documents: (string | null)[][] = searchResults?.documents || [];

    try {
        const response = await generatePrediction(textForPrediction, documents);
        const cleanResponse = response.slice(response.indexOf('#') + 1, response.lastIndexOf('#')).trim();
        return cleanResponse;
    } catch (error) {
        console.error('getContextualPrediction error', error);
        return '';
    }
}

