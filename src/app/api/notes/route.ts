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