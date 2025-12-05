import { NextRequest, NextResponse } from "next/server";

import { getPdfList } from "@/lib/pdfService";


export async function GET(request: NextRequest) {
    try {
        const pdfListResponse: NextResponse = await getPdfList();
        const pdfList = await pdfListResponse.json();

        return NextResponse.json(
            {
                success: true,
                data: pdfList.data,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in GET /api/pdf:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error processing request',
            },
            { status: 500 }
        );
    }
}