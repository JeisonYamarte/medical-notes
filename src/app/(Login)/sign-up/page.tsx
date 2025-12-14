"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { signUpSchema, SignUpType } from '@/lib/schemas/authScchema';
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
        console.log('Formulario Enviado',data);
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
                console.log('Usuario creado exitosamente:', result.data);
                const res = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                })
                
            } else {
                console.error('Error creando el usuario:', result.error);
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
            <Card className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] h-auto flex flex-col gap-6 sm:gap-8 md:gap-10 py-6 sm:py-8 md:py-10 mx-4">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-center">Crea tu cuenta</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-center">Únete a Medical Notes para gestionar tus registros médicos de forma eficiente.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:gap-4">
                    <Form {...form}>
                        <form id="formSignUp" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name" className="text-sm sm:text-base">Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-sm sm:text-base"
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</FormLabel>
                                        <div className="relative w-full">
                                            <Lock className="absolute scale-75 sm:scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                            <FormControl>
                                                <Input
                                                    className="pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base"
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
                                        <FormLabel htmlFor="birthday" className="text-sm sm:text-base">Fecha de nacimiento</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-sm sm:text-base"
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
                <CardFooter className="flex flex-col gap-3 sm:gap-4 justify-center items-center">
                    <Button type="submit" form="formSignUp" className="bg-blue-500 w-full text-sm sm:text-base">create account</Button>
                    <CardAction className="w-auto mx-auto font-semibold text-xs sm:text-sm">¿Ya tienes una cuenta? <Link className="text-blue-500" href="/sign-in">Iniciar Sesion</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}