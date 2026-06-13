"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { signUpSchema, SignUpType } from '@/lib/schemas/authSchema';
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

export default function SignUp() {
    const router = useRouter();

    const form = useForm<SignUpType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            birthday: "",
        },
    })

    const onSubmit = (data: SignUpType) => {
        const newUser = {
            name: data.name,
            email: data.email,
            password: data.password,
            birthday: data.birthday,
        }
        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        .then(response => response.json())
        .then(async result => {
            if (result.success) {
                const res = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                })
                if (res && !res.error) {
                    router.push('/dashboard');
                }
                
            } else {
                if (result.error === 409) {
                    form.setError("email", { type: "manual", message: "El correo electrónico ya está en uso." });
                }
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            form.setError("email", { type: "manual", message: "Error en la solicitud." });
        });
    }


    return (
        <>
            <Card className="z-10 mx-4 flex h-auto w-full max-w-md flex-col gap-8 border-border/80 bg-card/95 py-8 shadow-xl">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <CardTitle className="text-center text-2xl font-bold tracking-tight">Crea tu cuenta</CardTitle>
                    <CardDescription className="text-center text-sm text-muted-foreground">Unete a Medical Notes para gestionar tus registros medicos de forma eficiente.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Form {...form}>
                        <form id="formSignUp" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name" className="text-sm">Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11 border-border/80 bg-background text-sm"
                                                id="name"
                                                type="text"
                                                placeholder="Tu nombre completo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="confirmPassword" className="text-sm">Confirm Password</FormLabel>
                                        <div className="relative w-full">
                                            <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    className="h-11 border-border/80 bg-background pl-10 pr-3 text-sm"
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm password"
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
                                name="birthday"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="birthday" className="text-sm">Fecha de nacimiento</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11 border-border/80 bg-background text-sm"
                                                id="birthday"
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center gap-4">
                    <Button type="submit" form="formSignUp" className="h-11 w-full text-sm">Crear cuenta</Button>
                    <CardAction className="mx-auto w-auto text-xs font-semibold">Ya tienes una cuenta? <Link className="text-primary" href="/sign-in">Iniciar sesion</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}