"use client"
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
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

import { signInSchema, type SignInType } from "@/lib/schemas/authSchema";


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
        await signIn("google", { callbackUrl: "/dashboard" });
    }

    return (
        <>
            <Card className="z-10 mx-4 flex h-auto w-full max-w-md flex-col gap-8 border-border/80 bg-card/95 py-2 shadow-xl">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <Image className="h-20 w-20" width={80} height={80} src="/v1765285713/icono_nota_medica_nezds1.svg" alt="Logo"  />
                    <CardTitle className="text-center text-2xl font-bold tracking-tight">Bienvenido de nuevo</CardTitle>
                    <CardDescription className="text-center text-sm text-muted-foreground">Inicia sesion en tu cuenta para continuar con tus notas medicas.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Form {...form}>
                        <form id="formSignIn" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email" className="text-sm">Email</FormLabel>
                                        <div className="relative w-full">
                                            <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    className="h-11 border-border/80 bg-background pl-10 pr-3 text-sm"
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
                                        <FormLabel htmlFor="password" className="text-sm">Password</FormLabel>
                                        <div className="relative w-full">
                                            <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    className="h-11 border-border/80 bg-background pl-10 pr-3 text-sm"
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
                        <CardAction className="text-xs font-semibold text-primary">Olvidaste tu contrasena?</CardAction>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center gap-4">
                    <Button type="submit" form="formSignIn" className="h-11 w-full text-sm">Iniciar sesion</Button>
                    <Button variant="outline" className="h-11 w-full text-sm" onClick={(e) => SignInGoogle(e)}>Continuar con Google <Image src="/v1765284756/icons8-google_shmeju.svg" alt="Google logo" className="ml-2 inline-block h-5 w-5" width={20} height={20} /></Button>
                    <CardAction className="mx-auto w-auto text-xs font-semibold">No tienes una cuenta? <Link className="text-primary" href="/sign-up">Registrate</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}