import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

        await connectDB();

        const users = await User.find().select('-password').lean();

        return NextResponse.json({
            success: true,
            data: users,   
        })
    } catch (error: unknown) {
        console.error('Error en GET /api/users:', error);
        const message = error instanceof Error ? error.message : 'Error al obtener usuarios';
        return NextResponse.json(
        {
            success: false,
            error: message,
        },
        { status: 500 }
        );
    }
}
