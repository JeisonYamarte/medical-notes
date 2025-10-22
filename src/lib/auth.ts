import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/model/user";
import client from "./mongoClient";
import { MongoDBAdapter } from "@auth/mongodb-adapter"

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(client),
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
        GoogleProvider({
            name: "Google",
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
            token.id = user.id;
            }

            if (account?.provider === "google" && !token.id) {
            await connectDB();
            const dbUser = await User.findOne({ email: token.email });
            if (dbUser) token.id = dbUser._id.toString();
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
            session.user.id = token.id as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
