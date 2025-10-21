import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { validateRequest } from "@/lib/validateRequest";
import Note from "@/model/note";
import { noteSchema, NoteType } from '@/lib/schemas/noteSchema';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { data, error } = await validateRequest<NoteType>(request, noteSchema);

        if (error || !data) {
            return error;
        }

        const newNote = new Note({

        return NextResponse.json(
            {
                success: true,
                data: {/* your response data here */}
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