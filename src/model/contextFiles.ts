import { chromaDbClient } from "@/lib/chromadb";
import { CohereEmbeddingFunction } from '@chroma-core/cohere';

const embedder = new CohereEmbeddingFunction({
  apiKey: process.env.COHERE_API_KEY, 
  modelName: 'embed-multilingual-light-v3.0', // Optional, defaults to 'embed-english-v3.0' NOTA: embebbing by default not function 
});

export const getCollection = async () => {
  const heartBeat = await chromaDbClient.heartbeat();
  
  if (!heartBeat) {
    throw new Error('ChromaDB is not reachable');
  }
  

  const collection = await chromaDbClient.getOrCreateCollection({
    name: process.env.COLLECTION_NAME || 'collection_name',
    embeddingFunction: embedder,
  });
  
  return collection;
}