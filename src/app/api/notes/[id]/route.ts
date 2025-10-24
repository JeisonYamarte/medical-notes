import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/model/note";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const noteId = params.id;

        const note = await Note.findById(noteId);
        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }
        return NextResponse.json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}