import 'server-only';
import { extractText } from 'unpdf';
import { type PdfUploadType } from '../lib/schemas/pdfSchema';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import Pdf  from '@/model/pdf';
import { connectDB } from "@/lib/mongodb";
import { addToChroma } from './chromaService';
import { deletePDF } from './cloudinaryService';
import { deleteChromaByFileId } from './chromaService';

export interface PdfListItem {
    id: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    fileSize: number;
    createdAt: Date;
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

export async function saveEmbeddingText(FormData: FormData, pdfId: string) {
    const extractResult = await extractTextFromPdf(FormData);

    if(extractResult.status !== 200 || !extractResult.text) {
        throw new Error('Text extraction failed');
    }

    const cleanText = extractResult.text.join(" ")
            .replace(/\+/g, " ")
            .replace(/\\n|\\r|\n|\r/g, " ")
            .replace(/\\?x[0-9A-Fa-f]{2}/g, " ")
            .replace(/\u0083/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    const chunks = splitTextByWords(cleanText);

    await addToChroma(chunks, pdfId);

    await Pdf.findByIdAndUpdate(pdfId, { isProcessed: true });
}


// Retrieves the list of PDFs uploaded by the current authenticated user
export async function getPdfList(userId: string) {
    await connectDB();

    const pdfList = await Pdf.find({ uploadedBy: userId }, { __v: 0, uploadedBy: 0}).sort({ createdAt: -1 });

    const formattedList: PdfListItem[] = pdfList.map(pdf => ({
        id: pdf.id.toString(),
        fileName: pdf.fileName,
        originalName: pdf.originalName,
        fileUrl: pdf.fileUrl,
        fileSize: pdf.fileSize,
        createdAt: pdf.createdAt,
    }));

    return formattedList;
}

export async function deletePdfById(pdfId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { status: 401, message: 'Unauthorized' };
        }

        await connectDB();

        const pdf = await Pdf.findOne({ _id: pdfId, uploadedBy: session.user.id });

        if (!pdf) {
            console.error('PDF not found:', pdfId);
            return { status: 404, message: 'PDF not found' };
        }

        const publicId = pdf.fileUrl.split('my-medical-note/')[1];

        const deleteResult = await deletePDF( publicId );

        if (deleteResult.status !== 200) {
            console.error('Cloudinary deletion error:', deleteResult);
            return { status: 500, message: 'Failed to delete PDF from Cloudinary' };
        }

        await deleteChromaByFileId(pdfId);

        const deletionResult = await Pdf.deleteOne({ _id: pdfId });

        if (deletionResult.deletedCount === 0) {
            console.error('PDF not found during deletion:', pdfId);
            return { status: 404, message: 'PDF not found' };
        }

        return { status: 200, message: 'PDF deleted successfully' };
    } catch (error) {
        return { status: 500, message: 'Error deleting PDF', error };
    }
}


// Extracts text content from a PDF file and logs the results
async function extractTextFromPdf(file: FormData) {
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

