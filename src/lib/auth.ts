import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password)
            throw new Error("Faltan las credenciales");

            await connectDB();
            const user = await User.findOne({ email: credentials.email });

            if (!user) throw new Error("Usuario no encontrado");

            const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
            );

            if (!passwordMatch) throw new Error("Contraseña incorrecta");

            return {
            id: String(user._id),
            name: user.name,
            email: user.email,
            };
        },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/sign-in",
        newUser: "/sign-up",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
