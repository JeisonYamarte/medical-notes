import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import { validateRequest } from "@/lib/validateRequest";
import { userSchema, type UserType } from "@/lib/schemas/userSchema";
import { signInSchema, type SignInType } from "@/lib/schemas/authScchema";
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest ) {
    try {
        const { data, error } = await validateRequest<SignInType>(request, signInSchema);
        await connectDB();

        if (error || !data) {
            return error;
        }

        const existingUser = await User.findOne({ email: data.email.toLowerCase() });
        if (!existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 401,
                },
                { status: 401 }
            );
        }

        const isPasswordValid = await new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(data.password, existingUser.password, (err, res) => {
                if (err) return reject(err);
                resolve(res as boolean);
            });
        });

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 401,
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: existingUser._id,
                    email: existingUser.email,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error en POST /api/auth/signin:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al iniciar sesión',
            },
            { status: 500 }
        );
    }
}