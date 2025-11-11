"use server"
import { extractText } from 'unpdf';
import { cloudinary } from './cloudinaryConfig';
import { type PdfUploadType } from './schemas/pdfSchema';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import Pdf  from '@/model/pdf';
import { connectDB } from "@/lib/mongodb";
import { getCollection } from '@/model/contextFiles';

// Uploads a PDF file to Cloudinary and returns the secure URL
export async function uploadPDF(file: FormData) {
    const pdfFile = file.get('file') as File; 

    if (!pdfFile) {
        return { status: 400, message: 'No file uploaded' };
    }

    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'my-medical-note/pdfs',
                public_id: `pdf-${Date.now()}.pdf`,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result as { secure_url: string });
            }
        )
        uploadStream.end(buffer);
    })

    if (!uploadResult) {
        return { status: 500, message: 'Upload failed' };
    }

    const url = uploadResult.secure_url;
    
    return { status: 200, message: 'Upload successful', url };

}

// Saves PDF metadata to the database associated with the current user
export async function savePdfMetadata(data: PdfUploadType) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }

    await connectDB();

    const newPdf = new Pdf({
        ...data,
        uploadedBy: session.user.id
    });

    await newPdf.save();

    const pdfId = newPdf.id.toString();

    return { status: 200, message: 'Metadata saved successfully', pdfId };
}

export async function saveEmbebingText(text: string[]) {

    const cleanText = text.join(" ")         // une todo el array en un solo string
            .replace(/\+/g, " ")            // reemplaza los + por espacios
            .replace(/\\n|\\r|\n|\r/g, " ") // elimina saltos de línea visibles o reales
            .replace(/\\?x[0-9A-Fa-f]{2}/g, " ") // quita secuencias tipo x86, x20, etc.
            .replace(/\u0083/g, " ")      // elimina caracteres Unicode no deseados
            .replace(/\s+/g, " ")           // reduce múltiples espacios a uno solo
            .trim();                        // elimina espacios del inicio y final

            
        const chunks = splitTextByWords(cleanText);

        const session = await getServerSession(authOptions);

        if (!session) {
            throw new Error('Unauthorized');
        }

        const userId = session.user.id;

        //const ids = chunks.map((chunk, index) => `${userId}_pdfId_${pdfId}_(${index})_${Date.now()}`);

        try {
            const collection = await getCollection();

            await collection.add({
                ids: ['id1'],
                documents: ['la casa de papel blaco'],
                /*metadatas: chunks.map(() => ({
                    user_id: userId,
                    file_id: pdfId,
                }))*/
            })

            const count = await collection.count();
            console.log(`✅ Cantidad de documentos en la colección: ${count}`);

        } catch (error) {
            console.error('Error saving embeddings:', error);
        } finally {
            console.log('Embeddings process completed.');
        }

        
}


// Retrieves the list of PDFs uploaded by the current authenticated user
export async function getPdfList() {

    
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }

    await connectDB();

    const pdfList = await Pdf.find({ uploadedBy: session.user.id }, { __v: 0, uploadedBy: 0}).sort({ createdAt: -1 });

    const formattedList = pdfList.map(pdf => ({
        id: pdf.id.toString(),
        fileName: pdf.fileName,
        originalName: pdf.originalName,
        fileUrl: pdf.fileUrl,
        fileSize: pdf.fileSize,
        createdAt: pdf.createdAt,
    }));

    return formattedList;
}

// Extracts text content from a PDF file and logs the results
export async function extractTextFromPdf(file: FormData) {
    const pdfFile = file.get('file') as File; 

    if (!pdfFile) {
        return { status: 400, message: 'No file uploaded' };
    }

    const bytes = await pdfFile.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const { text } = await extractText(buffer);
    
    return { status: 200, message: 'Text extracted successfully', text };
}

function splitTextByWords(text: string, maxLength = 100) {
    const words = text.split(" ");
    const chunks: string[] = [];
    let currentChunk = "";

    for (const word of words) {
        if ((currentChunk + word).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = word + " ";
        } else {
        currentChunk += word + " ";
        }
    }

    if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());

    return chunks;
}

