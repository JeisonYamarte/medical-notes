"use client"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Eye, EyeOff, Lock} from "lucide-react";
import Link from "next/link";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SignUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof SignUpSchema>;

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(SignUpSchema),
    })

    const onSubmit = (data: FormData) => {
        console.log('Formulario Enviado',data);
    }


    return (
        <>
            <Card className="w-[360px] h-auto flex flex-col gap-10 py-10">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <CardTitle className="text-2xl font-bold">Crea tu cuenta</CardTitle>
                    <CardDescription className="text-center">Únete a Medical Notes para gestionar tus registros médicos de forma eficiente.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form id="formSignUp" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative w-full">
                                <Mail className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                <Input
                                className="pl-10 pr-3 py-2"
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                {...register("email")} 
                            />
                            </div>
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative w-full">
                                <Lock className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                <Input
                                className="pl-10 pr-3 py-2"
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                {...register("password")} 
                            /> {/* falta el showPassword */}
                            </div>
                            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative w-full">
                                <Lock className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                <Input
                                className="pl-10 pr-3 py-2"
                                id="confirmPassword"
                                type="password"
                                placeholder="confirm password"
                                required
                                {...register("confirmPassword")} 
                            /> {/* falta el showPassword */}
                            </div>
                            {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center items-center">
                    <Button type="submit" form="formSignUp" className="bg-blue-500 w-full">Iniciar Sesion</Button>
                    <CardAction className="w-auto mx-auto font-semibold">¿Ya tienes una cuenta? <Link className="text-blue-500" href="/sign-in">Iniciar Sesión</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}