import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import { validateRequest } from "@/utils/validateRequest";
import { userSchema, type UserType } from "@/lib/schemas/userSchema";

export async function POST(request: NextRequest ) {
    try{

        const { data, error } = await validateRequest<UserType>(request, userSchema);

        if (error || !data) {
            return error;
        }

        await connectDB();

        const existingUser = await User.findOne({ email: data.email });
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
    } catch (error: unknown) {
        console.error('Error en POST /api/users:', error);
        const message = error instanceof Error ? error.message : 'Error al crear usuario';
        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}
