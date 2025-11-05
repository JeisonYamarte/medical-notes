"use server"
import { extractText } from 'unpdf';
import { cloudinary } from './cloudinaryConfig';
import { type PdfUploadType } from './schemas/pdfSchema';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import Pdf  from '@/model/pdf';
import { connectDB } from "@/lib/mongodb";


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

    return newPdf;
}
