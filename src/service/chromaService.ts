import type { QueryResult } from "chromadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection } from "@/model/contextFiles";


// Searches the ChromaDB collection for relevant documents based on the input text
export async function searchChroma(text:string): Promise<QueryResult> {
    let query: string;
    if (text.length >= 100){
        query = text.slice(-100)
    } else {
        query = text
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }
    const userId = session?.user?.id;

    if(!userId) {
        throw new Error('Unauthorized');
    }

    const collection =  await getCollection();

    const results: QueryResult = await collection.query({
        queryTexts: [query],
        nResults: 2,
        where:{
            'user_id': userId
        }
    })

    //console.log('ChromaDB search results:', results.distances); implement logic future
    
    return results;
}

export async function addToChroma(chunks: string[], fileId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }
    const userId = session.user.id;

    const ids = chunks.map((chunk, index) => `${userId}_pdfId_${fileId}_(${index})_${Date.now()}`);

    try {
        const collection = await getCollection();

        await collection.add({
            ids: ids,
            documents: chunks,
            metadatas: chunks.map(() => ({
                user_id: userId,
                file_id: fileId,
            }))
        })

    } catch (error) {
        console.error('Error saving embeddings:', error);
        throw error;
    }
}

export async function deleteChromaByFileId(fileId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }
    const userId = session.user.id;

    try {
        const collection = await getCollection();

        await collection.delete({
            where: {
                $and: [
                    { 'user_id': userId },
                    { 'file_id': fileId }
                ]
            }
        });
    } catch (error) {
        console.error('Error deleting embeddings from ChromaDB:', error);
        throw error;
    }
}