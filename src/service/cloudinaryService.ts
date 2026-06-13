import 'server-only';
import { cloudinary } from "@/lib/cloudinaryConfig";

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

export async function deletePDF(publicId: string ) {
    try{
        const resetId = 'my-medical-note/' + publicId;
        const result = await cloudinary.uploader.destroy(resetId, {
            resource_type: 'raw'
        });
        return { status: 200, message: 'Deletion successful', result };
    } catch (error) {
        return { status: 500, message: 'Deletion failed', error };
    }
}