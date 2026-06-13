import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getContextualPrediction } from '@/service/IAservice';

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
    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text : '';

    if (!text.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Text is required',
        },
        { status: 400 }
      );
    }

    const prediction = await getContextualPrediction(text);

    return NextResponse.json(
      {
        success: true,
        prediction,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error in POST /api/ai/prediction:', error);

    const message = error instanceof Error ? error.message : 'Error processing request';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
