"use client"
import Image from "next/image";
import React from "react";
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

import { signInSchema, type SignInType } from "@/lib/schemas/authScchema";


type FormData = SignInType;

export default function SignIn() {

    
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(signInSchema),
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

    const SignInGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const res  = await signIn("google", { redirect: false });
    }

    return (
        <>
            <Card className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] h-auto flex flex-col gap-6 sm:gap-8 md:gap-10 mx-4">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <Image className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20" width={80} height={80} src="/v1765285713/icono_nota_medica_nezds1.svg" alt="Logo"  />
                    <CardTitle className="text-xl sm:text-2xl font-bold text-center">Bienvenido de nuevo</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-center">Inicie sesión en su cuenta para continuar.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:gap-4">
                    <Form {...form}>
                        <form id="formSignIn" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email" className="text-sm sm:text-base">Email</FormLabel>
                                        <div className="relative w-full">
                                            <Mail className="absolute scale-75 sm:scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                            <FormControl>
                                                <Input
                                                    className="pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base"
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
                                        <FormLabel htmlFor="password" className="text-sm sm:text-base">Password</FormLabel>
                                        <div className="relative w-full">
                                            <Lock className="absolute scale-75 sm:scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                            <FormControl>
                                                <Input
                                                    className="pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base"
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
                        <CardAction className="text-blue-500 font-semibold text-xs sm:text-sm">¿Olvidó su contraseña?</CardAction>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:gap-4 justify-center items-center">
                    <Button type="submit" form="formSignIn" className="bg-blue-500 w-full text-sm sm:text-base">Iniciar Sesion</Button>
                    <Button variant="outline" className="w-full text-sm sm:text-base" onClick={(e) => SignInGoogle(e)}>Iniciar con Google <Image src="/v1765284756/icons8-google_shmeju.svg" alt="Google logo" className="inline-block w-4 h-4 sm:w-5 sm:h-5 ml-2" width={20} height={20} /></Button>
                    <CardAction className="w-auto mx-auto font-semibold text-xs sm:text-sm">¿No tienes una cuenta? <Link className="text-blue-500" href="/sign-up">Regístrate</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}