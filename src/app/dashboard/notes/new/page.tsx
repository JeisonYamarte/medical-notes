"use client"
import React, { useCallback} from 'react'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useDropzone} from 'react-dropzone'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



enum NoteType {
    FOLLOWUP = "Seguimiento",
    EMERGENCY = "Emergencia",
    CONSULTATION = "Consulta",
}

enum UrgencyLevel {
    LOW = "Baja",
    MEDIUM = "Media",
    HIGH = "Alta",
}

const schema = z.object({
    title: z.string().min(2, { message: "Título debe tener al menos 2 caracteres" }).max(100, { message: "Título debe tener máximo 100 caracteres" }),
    content: z.string().min(10, { message: "Contenido debe tener al menos 10 caracteres" }).max(1000, { message: "Contenido debe tener máximo 1000 caracteres" }),
    patient: z.string().min(2, { message: "Paciente es requerido" }).max(100, { message: "Paciente debe tener máximo 100 caracteres" }),
    noteType: z.enum(NoteType, { error: (issue) => `valor invalido: ${issue.received}` }),
    urgencyLevel: z.enum(UrgencyLevel, { error: (issue) => `valor invalido: ${issue.received}` }),
    tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewNotePage() {
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            patient: "",
            noteType: NoteType.FOLLOWUP,
            urgencyLevel: UrgencyLevel.MEDIUM,
            tags: [],
        },
    });

    const onSubmit = (data: FormData) => {
        console.log('form:',data);
    };


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Crear nueva nota</h2>
            <div className="flex gap-5">
                <div className="w-2/3">
                    <Form {...form}>
                        <form id="new-note-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className=" flex flex-col gap-5">
                                <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Título de la nota" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea className="resize-none w-full h-[400px]" placeholder="Contenido de la nota" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div>
                                <h2>Información</h2>
                                <div className="grid grid-cols-2 grid-row-2 gap-4">
                                    <FormField
                                    control={form.control}
                                    name="patient"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paciente</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre del paciente" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="noteType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de nota</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="w-full h-10 bg-white">
                                                                <SelectValue placeholder="selecciona el tipo de nota" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={NoteType.FOLLOWUP}>{NoteType.FOLLOWUP}</SelectItem>
                                                                <SelectItem value={NoteType.CONSULTATION}>{NoteType.CONSULTATION}</SelectItem>
                                                                <SelectItem value={NoteType.EMERGENCY}>{NoteType.EMERGENCY}</SelectItem>
                                                            </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="urgencyLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nivel de urgencia</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="w-full h-10 bg-white">
                                                                <SelectValue placeholder="selecciona el nivel de urgencia" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={UrgencyLevel.LOW}>{UrgencyLevel.LOW}</SelectItem>
                                                                <SelectItem value={UrgencyLevel.MEDIUM}>{UrgencyLevel.MEDIUM}</SelectItem>
                                                                <SelectItem value={UrgencyLevel.HIGH}>{UrgencyLevel.HIGH}</SelectItem>
                                                            </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Etiquetas</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Escribe las etiquetas de la nota" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                            </div>
                            <Button type="submit">Guardar nota</Button>                                
                        </form>
                    </Form>
                </div>
                <div className="w-1/3 flex gap-3 flex-col border-1 border-gray-300 p-3 rounded-lg max-w-[400px] justify-center items-center">
                    <h2 className="text-lg font-semibold">Contextos o referencias</h2>
                    <div className='h-full w-full border-3 border-dashed border-gray-300 max-w-[300px] rounded-lg text-center items-center' {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}