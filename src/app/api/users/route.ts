import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";

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

export async function POST(request: NextRequest) {
    try{
        await connectDB();
        const { email, name, password, birthday } = await request.json();
        
        if (!email || !name || !password || !birthday) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Faltan campos requeridos',
                },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'El correo electrónico ya está en uso',
                },
                { status: 400 }
            );
        }

        const newUser = new User({
            email,
            name,
            password,
            birthday,
        });
        await newUser.save();

        return NextResponse.json(
            {
                success: true,
                data: newUser,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error en POST /api/users:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al crear usuario',
            },
            { status: 500 }
        );
    }
}