import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/model/note";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }
        return NextResponse.json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT (request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const updatedNote = await Note.findByIdAndUpdate(id, body, { new: true });
        if (!updatedNote) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }
        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}