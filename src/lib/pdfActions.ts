"use server"
import { extractText } from 'unpdf';
import { cloudinary } from './cloudinaryConfig';


export async function uploadPDF(file: FormData) {
    const pdfFile = file.get('file') as File; 

    if (!pdfFile) {
        return { status: 400, message: 'No file uploaded' };
    }

    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uplodResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
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

    console.log('Upload Result:', uplodResult);
}
