import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validateRequest } from "@/utils/validateRequest";
import Note from "@/model/note";
import { noteSchema, NoteType } from '@/lib/schemas/noteSchema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotes } from "@/service/notesService";


export async function POST(request: NextRequest) {
    try {
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
        const { data, error } = await validateRequest<NoteType>(request, noteSchema);

        if (error || !data) {
            return error;
        }

        const newNote = new Note({
            ...data,
            userId: session.user.id,
        });

        await newNote.save();

        return NextResponse.json(
            {
                success: true,
                data: newNote
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in POST /api/notes:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error processing request',
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const searchRequest = request.nextUrl.searchParams;

    const dateParam = searchRequest.get('date') || null;
    const titleParam = searchRequest.get('title') || null;
    const urgencyParam = searchRequest.get('urgency') || null;
    const limitParam = searchRequest.get('limit') || null;
    const skipParam = searchRequest.get('skip') || null;
    
    return getNotes({ dateParam, titleParam, urgencyParam, limit:Number(limitParam), skip: Number(skipParam) });
}