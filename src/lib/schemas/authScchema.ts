import { z } from "zod";
import { userSchema } from "./userSchema";

export const signUpSchema = userSchema.extend({
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type SignUpType = z.infer<typeof signUpSchema>;

export const signInSchema = userSchema.pick({
    email: true,
    password: true,
})

export type SignInType = z.infer<typeof signInSchema>;