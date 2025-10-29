import { chromaDbClient } from "@/lib/chromadb";
import { CohereEmbeddingFunction } from '@chroma-core/cohere';

const embedder = new CohereEmbeddingFunction({
  apiKey: '59ATHNM9m8qUkrgj7kiBfUaYh5ifjl2a4aU6qK07', // Or set COHERE_API_KEY env var
  modelName: 'embed-multilingual-light-v3.0', // Optional, defaults to 'embed-english-v3.0'
});

export const getCollection = async ( collectionName: string) => {
    const collection = await chromaDbClient.getOrCreateCollection({
        name: collectionName,
        embeddingFunction: embedder,
    });
    return collection;
}