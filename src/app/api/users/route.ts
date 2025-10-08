import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import { success } from "zod";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const users = await User.find().select('-password').lean();
        const total = await User.countDocuments();

        return NextResponse.json({
            success: true,
            data: users,   
        })
    } catch (error: any) {
        console.error('Error en GET /api/users:', error);
        return NextResponse.json(
        {
            success: false,
            error: error.message || 'Error al obtener usuarios',
        },
        { status: 500 }
        );
    }
}
