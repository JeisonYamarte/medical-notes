"use client"
import React, { useCallback, useEffect} from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useDropzone} from 'react-dropzone'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
import { Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"

import { 
    noteSchema, 
    NoteTypeEnum, 
    UrgencyLevelEnum, 
    NoteType
} from '@/lib/schemas/noteSchema';
import { 
    getContextualPrediction
} from '@/lib/predictIA';




type Params = Promise<{ id: string }>

export default function NewNotePage(props: { params: Params }) {
    const { id: idParams } = React.use(props.params);
    const router = useRouter();
    const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);
    const editorRef = React.useRef<HTMLTextAreaElement | null>(null);

    const [userInput, setUserInput] = React.useState<string>('');
    const [prediction, setPrediction] = React.useState<string>('');
    const [idParamsForUpdate, setIdParamsForUpdate] = React.useState<string | null>(idParams);

    const titlePage = idParams === 'new' ? 'Crear nueva nota' : 'Editar nota';

    
    const form = useForm<NoteType>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: 'nueva nota',
            content: '',
            patient: '',
            noteType: NoteTypeEnum.FOLLOWUP,
            urgencyLevel: UrgencyLevelEnum.MEDIUM,
            //tags: [],
        },
    });

    useEffect(() => {
        if (idParams !== 'new') {
        fetch(`/api/notes/${idParams}`)
            .then(async (response) => {
                if (response.ok) {
                    const resData = await response.json();
                    console.log('Note fetched successfully:', resData);
                    toast.success('Note fetched successfully');
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

    

    
    

    const onSubmit = () => {
        const data: NoteType = form.getValues();
        if ( idParams === 'new') {
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
                    setIdParamsForUpdate(resData.data._id);
                    toast.success('Note created successfully');

                } else {
                    const errorData = await response.json();
                    toast.error('Error creating note');
                }
            }).catch((error) => {
                toast.error('Error creating note');
            });
        } else {
            console.log('method PUT form:',data);
            fetch(`/api/notes/${idParamsForUpdate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(async (response) => {
                if (response.ok) {
                    const resData = await response.json();
                    toast.success('Note updated successfully');
                } else {
                    const errorData = await response.json();
                    toast.error('Error updating note');
                }
            }).catch((error) => {
                toast.error('Error updating note');
            });
        }
    };

    const handleDelete = () => {
        if (idParams === 'new') {
            toast.error('Cannot delete a note that has not been created yet.');
            return;
        }
        fetch(`/api/notes/${idParams}`, {
            method: 'DELETE',
        }).then(async (response) => {
            if (response.ok) {
                const resData = await response.json();
                console.log('Note deleted successfully:', resData);
                toast.success('Note deleted successfully');
                router.push('/dashboard/notes');
                form.reset();
            } else {
                const errorData = await response.json();
                console.error('Error deleting note:', errorData);
                toast.error('Error deleting note');
            }
        }).catch((error) => {
            console.error('Error deleting note:', error);
            toast.error('Error deleting note');
        });
    }


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])
    const {
        getRootProps,
        getInputProps,
        fileRejections,
        isDragActive
    } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
        },
        onDrop
    })

    const handlerPredict = async (text: string) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            console.log('Debounced input:', text);
            const predict = getContextualPrediction(text);
            predict.then((res) => {
                setPrediction(res);
            });
        }, 2000);
    }

    const handlerKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => { 
        if(e.key === 'Tab' && prediction) {
            e.preventDefault();
            form.setValue("content", form.getValues("content") + prediction);
            setPrediction('');
        }
    }


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
                                <div className='relative'>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <textarea 
                                                    className={`${prediction ? '' : ''} resize-none w-full h-[400px] z-0 p-2 border border-gray-300 rounded-md ring-1 ring-gray-500 bg-white text-black/70 text-xl font-medium`} 
                                                    {...field} 
                                                    onChange={(e) => {
                                                            field.onChange(e);
                                                            setUserInput(form.getValues("content"));
                                                            handlerPredict(form.getValues("content"));   
                                                        }
                                                    }
                                                    ref={editorRef}
                                                    style={{
                                                        caretColor:"gray",
                                                    }}
                                                    onKeyDown={handlerKeyDown}
                                                    />
                                                    
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        prediction && 
                                        <div className="absolute pointer-events-none z-10 top-0 inset-0  w-full h-[400px] p-2 border border-gray-300 rounded-md ring-1 ring-gray-500  text-black/70 text-xl font-medium">
                                            <span className='opacity-0'>{userInput}</span>
                                            <span className="text-black/30">{prediction}</span>
                                        </div>
                                    }
                                </div>
                                
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
                            <div className=' flex justify-between'>
                                <Button type="submit">Guardar nota</Button>                                
                                <Button type="button" disabled={idParams === 'new'} variant={'destructive'} onClick={handleDelete}>Eliminar nota</Button>
                            </div>
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
                        {fileRejections.length > 0 && (
                            <div className="text-red-500 mt-2">
                                {fileRejections.map(({ file }) => (
                                    <div key={file.name}>
                                        <p>File "{file.name}" was rejected: only PDF files are allowed.</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}