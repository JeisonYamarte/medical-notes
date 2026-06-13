import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/model/note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isValidObjectId } from "mongoose";

function isValidNoteId(id: string) {
    return isValidObjectId(id);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!isValidNoteId(id)) {
            return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
        }

        await connectDB();

        const note = await Note.findOne({ _id: id, userId: session.user.id });
        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }
        return NextResponse.json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!isValidNoteId(id)) {
            return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
        }

        const body = await request.json();

        await connectDB();

        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            body,
            { new: true }
        );
        if (!updatedNote) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }
        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!isValidNoteId(id)) {
            return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
        }

        await connectDB();

        const deletedNote = await Note.findOneAndDelete({ _id: id, userId: session.user.id });
        if (!deletedNote) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}