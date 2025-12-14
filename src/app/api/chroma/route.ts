import { NextRequest, NextResponse } from "next/server";
import { saveEmbebingText } from "@/service/pdfService";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { text } = body;

    await saveEmbebingText(text);

    return NextResponse.json(
        {
            success: true,
            message: 'This is a placeholder for ChromaDB route POST endpoint.'
        },
        { status: 200 }
    );
}