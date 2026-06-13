import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validateRequest } from "@/utils/validateRequest";
import Note from "@/model/note";
import { noteSchema, NoteType } from '@/lib/schemas/noteSchema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotes } from "@/service/notesService";

function parsePositiveInteger(value: string | null, fallback: number) {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    return parsed;
}


export async function POST(request: NextRequest) {
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

        const { data, error } = await validateRequest<NoteType>(request, noteSchema);

        if (error || !data) {
            return error;
        }

        await connectDB();

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
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error in POST /api/notes:', error);
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

export async function GET(request: NextRequest) {
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

    const searchRequest = request.nextUrl.searchParams;

    const dateParam = searchRequest.get('date') || null;
    const titleParam = searchRequest.get('title') || null;
    const urgencyParam = searchRequest.get('urgency') || null;
    const limitParam = parsePositiveInteger(searchRequest.get('limit'), 5);
    const skipParam = parsePositiveInteger(searchRequest.get('skip'), 1);
    
    try {
        const { data, total } = await getNotes({
            userId: session.user.id,
            dateParam,
            titleParam,
            urgencyParam,
            limit: limitParam,
            skip: skipParam,
        });

        return NextResponse.json(
            {
                success: true,
                data,
                total,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Error in GET /api/notes:', error);
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