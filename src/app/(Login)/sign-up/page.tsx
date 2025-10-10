"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";

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
        const [emailExists, setEmailExists] = React.useState(false);

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
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('Usuario creado exitosamente:', result.data);
                // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
            } else {
                console.error('Error creando el usuario:', result.error);
                if (result.error === 409) {
                    setEmailExists(true);
                }
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            // Aquí puedes manejar errores de red u otros errores inesperados
        });
    }


    return (
        <>
            <Card className="w-[360px] h-auto flex flex-col gap-10 py-10">
                <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <CardTitle className="text-2xl font-bold">Crea tu cuenta</CardTitle>
                    <CardDescription className="text-center">Únete a Medical Notes para gestionar tus registros médicos de forma eficiente.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Form {...form}>
                        <form id="formSignUp" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Nombre</FormLabel>
                                        <FormControl>
                                            <Input
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
                                        {emailExists && (
                                            <FormMessage>
                                                El correo electrónico ya está en uso.
                                            </FormMessage>
                                        )}
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                        <div className="relative w-full">
                                            <Lock className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                                            <FormControl>
                                                <Input
                                                    className="pl-10 pr-3 py-2"
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
                                        <FormLabel htmlFor="birthday">Fecha de nacimiento</FormLabel>
                                        <FormControl>
                                            <Input
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
                <CardFooter className="flex flex-col gap-4 justify-center items-center">
                    <Button type="submit" form="formSignUp" className="bg-blue-500 w-full">create account</Button>
                    <CardAction className="w-auto mx-auto font-semibold">¿Ya tienes una cuenta? <Link className="text-blue-500" href="/sign-in">Iniciar Sesion</Link></CardAction>
                </CardFooter>
            </Card>
        </>
    );
}