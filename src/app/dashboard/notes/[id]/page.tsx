"use client"
import React, { useCallback, useEffect} from 'react'
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

import { noteSchema, NoteTypeEnum, UrgencyLevelEnum, NoteType} from '@/lib/schemas/noteSchema';




type Params = Promise<{ id: string }>

export default function NewNotePage(props: { params: Params }) {
    const { id } = React.use(props.params);

    const titlePage = id === 'new' ? 'Crear nueva nota' : 'Editar nota';

    
    const form = useForm<NoteType>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: '',
            content: '',
            patient: '',
            noteType: NoteTypeEnum.FOLLOWUP,
            urgencyLevel: UrgencyLevelEnum.MEDIUM,
            //tags: [],
        },
    });

    useEffect(() => {
        if (id !== 'new') {
        fetch(`/api/notes/${id}`)
            .then(async (response) => {
                if (response.ok) {
                    const resData = await response.json();
                    console.log('Note fetched successfully:', resData);
                    form.reset(resData);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching note:', errorData);
                }
            }).catch((error) => {
                console.error('Error fetching note:', error);
            });
        }
    }, []);

    
    

    const onSubmit = (data: NoteType) => {
        console.log('form:',data);
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async (response) => {
            if (response.ok) {
                const resData = await response.json();
                console.log('Note created successfully:', resData);
                // Optionally reset the form or redirect the user
                form.reset();
            } else {
                const errorData = await response.json();
                console.error('Error creating note:', errorData);
            }
        }).catch((error) => {
            console.error('Error creating note:', error);
        });
    };


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{titlePage}</h2>
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
                                                    <Select onValueChange={field.onChange} defaultValue={form.getValues("noteType")} value={field.value}>
                                                            <SelectTrigger className="w-full h-10 bg-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={NoteTypeEnum.FOLLOWUP}>{NoteTypeEnum.FOLLOWUP}</SelectItem>
                                                                <SelectItem value={NoteTypeEnum.CONSULTATION}>{NoteTypeEnum.CONSULTATION}</SelectItem>
                                                                <SelectItem value={NoteTypeEnum.EMERGENCY}>{NoteTypeEnum.EMERGENCY}</SelectItem>
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                            <SelectTrigger className="w-full h-10 bg-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={UrgencyLevelEnum.LOW}>{UrgencyLevelEnum.LOW}</SelectItem>
                                                                <SelectItem value={UrgencyLevelEnum.MEDIUM}>{UrgencyLevelEnum.MEDIUM}</SelectItem>
                                                                <SelectItem value={UrgencyLevelEnum.HIGH}>{UrgencyLevelEnum.HIGH}</SelectItem>
                                                            </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    {/*<FormField
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
                                    />*/}
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