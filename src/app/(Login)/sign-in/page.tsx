"use client"
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof SignInSchema>;

export default function SignIn() {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: FormData) => {
        console.log('Formulario Enviado',data);
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        })

        if (res?.error) {
            if (res.status === 401) {
                form.setError("email", { type: "manual", message: "Credenciales inválidas" });
                form.setError("password", { type: "manual", message: "Credenciales inválidas" });
            }
        } else {
            router.push("/dashboard");
        }

    };

    return (
        <>
            <Card className="w-[360px] h-auto flex flex-col gap-10">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <img className="w-20 h-20" src="https://cdn-icons-png.flaticon.com/512/11711/11711702.png" alt="Logo"  />
                    <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
                    <CardDescription >Inicie sesión en su cuenta para continuar.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Form {...form}>
                        <form id="formSignIn" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <div className="relative w-full">
                                            <Mail className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                            <FormControl>
                                                <Input
                                                    className="pl-10 pr-3 py-2"
                                                    id="email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <div className="relative w-full">
                                            <Lock className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                            <FormControl>
                                                <Input
                                                    className="pl-10 pr-3 py-2"
                                                    id="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className="flex items-end justify-end">
                        <CardAction className=" text-blue-500 font-semibold ">¿Olvidó su contraseña?</CardAction>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center items-center">
                    <Button type="submit" form="formSignIn" className="bg-blue-500 w-full">Iniciar Sesion</Button>
                    <CardAction className="w-auto mx-auto font-semibold">¿No tienes una cuenta? <Link className="text-blue-500" href="/sign-up">Regístrate</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}