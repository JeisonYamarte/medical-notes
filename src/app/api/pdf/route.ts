import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getPdfList } from "@/service/pdfService";


export async function GET() {
    try {
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

        const pdfList = await getPdfList(session.user.id);

        return NextResponse.json(
            {
                success: true,
                data: pdfList,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Error in GET /api/pdf:', error);
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