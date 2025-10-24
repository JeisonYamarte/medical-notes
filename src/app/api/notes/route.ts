import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validateRequest } from "@/lib/validateRequest";
import Note from "@/model/note";
import { noteSchema, NoteType } from '@/lib/schemas/noteSchema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


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
    try {
        const searchRequest = request.nextUrl.searchParams;

        const dateParam = searchRequest.get('date') || null;
        const titleParam = searchRequest.get('title') || null;
        const urgencyParam = searchRequest.get('urgency') || null;

        console.log('dateParam: ', dateParam);
        let start;
        let end;
        if (dateParam) {
            const date = new Date(dateParam);
            start = new Date(date.setHours(0, 0, 0, 0));
            end = new Date(date.setHours(23, 59, 59, 999));
            console.log('start: ', start);
            console.log('end: ', end);
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