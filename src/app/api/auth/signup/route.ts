import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import { validateRequest } from "@/utils/validateRequest";
import { userSchema, type UserType } from "@/lib/schemas/userSchema";

export async function POST(request: NextRequest ) {
    try{

        const { data, error } = await validateRequest<UserType>(request, userSchema);
        await connectDB();

        if (error || !data) {
            return error;
        }

        const existingUser = await User.findOne({ email: data.email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 409,
                },
                { status: 409 }
            );
        }

        const newUser = new User({
            ...data
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
