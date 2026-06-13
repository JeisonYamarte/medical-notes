import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { deletePdfById } from '@/service/pdfService';

type Params = Promise<{ id: string }>;

export async function DELETE(_: Request, props: { params: Params }) {
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
    const { id } = await props.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'PDF id is required',
        },
        { status: 400 }
      );
    }

    const result = await deletePdfById(id);

    return NextResponse.json(
      {
        success: result.status === 200,
        message: result.message,
      },
      { status: result.status }
    );
  } catch (error: unknown) {
    console.error('Error in DELETE /api/pdf/[id]:', error);
    const message = error instanceof Error ? error.message : 'Error deleting PDF';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
