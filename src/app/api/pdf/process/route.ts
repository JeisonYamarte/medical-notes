import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { uploadPDF } from '@/service/cloudinaryService';
import { saveEmbeddingText, savePdfMetadata } from '@/service/pdfService';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: 'PDF file is required',
        },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only PDF files are allowed',
        },
        { status: 400 }
      );
    }

    const uploadResult = await uploadPDF(formData);

    if (uploadResult.status !== 200 || !uploadResult.url) {
      return NextResponse.json(
        {
          success: false,
          error: uploadResult.message || 'Upload failed',
        },
        { status: 500 }
      );
    }

    const metadataResult = await savePdfMetadata({
      fileName: file.name,
      originalName: file.name,
      fileUrl: uploadResult.url,
      fileSize: file.size,
    });

    if (metadataResult.status !== 200 || !metadataResult.pdfId) {
      return NextResponse.json(
        {
          success: false,
          error: metadataResult.message || 'Failed to save PDF metadata',
        },
        { status: 500 }
      );
    }

    await saveEmbeddingText(formData, metadataResult.pdfId);

    return NextResponse.json(
      {
        success: true,
        message: 'PDF processed successfully',
        data: {
          pdfId: metadataResult.pdfId,
          fileUrl: uploadResult.url,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error in POST /api/pdf/process:', error);
    const message = error instanceof Error ? error.message : 'Error processing PDF';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
