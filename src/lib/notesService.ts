import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validateRequest } from "@/lib/validateRequest";
import Note from "@/model/note";
import { noteSchema, NoteType } from '@/lib/schemas/noteSchema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function getNotes({dateParam = null, titleParam = null, urgencyParam = null}: {dateParam?: string | null, titleParam?: string | null, urgencyParam?: string | null}) {
    try {
        let start;
        let end;
        if (dateParam) {
            const date = new Date(dateParam);
            start = new Date(date.setHours(0, 0, 0, 0));
            end = new Date(date.setHours(23, 59, 59, 999));
        }
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        await connectDB();
        const notes  = await Note.find({ 
            userId: session.user.id,
            ...(dateParam ? { createdAt: { $gte: start, $lte: end } } : {}),
            ...(titleParam ? { title: { $regex: titleParam, $options: 'i' } } : {}),
            ...(urgencyParam ? { urgencyLevel: urgencyParam } : {}),
        }).sort({ createdAt: -1 });

        if (!notes) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No notes found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: notes
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in GET /api/notes:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error processing request',
            },
            { status: 500 }
        );
    }
}