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
import { Spinner } from '@/components/ui/spinner';

import { 
    noteSchema, 
    NoteTypeEnum, 
    UrgencyLevelEnum, 
    NoteType
} from '@/lib/schemas/noteSchema';
import { 
    getContextualPrediction
} from '@/service/IAservice';




type Params = Promise<{ id: string }>

export default function NewNotePage(props: { params: Params }) {
    const { id: idParams } = React.use(props.params);
    const router = useRouter();
    const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);
    const editorRef = React.useRef<HTMLTextAreaElement | null>(null);

    const [userInput, setUserInput] = React.useState<string>('');
    const [prediction, setPrediction] = React.useState<string | null>(null);
    const [idParamsForUpdate, setIdParamsForUpdate] = React.useState<string>(idParams);
    const [isPredicting, setIsPredicting] = React.useState<boolean>(false);

    const titlePage = idParams === 'new' ? 'Crear nueva nota' : 'Editar nota';

    
    const form = useForm<NoteType>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: 'nueva nota',
            content: '',
            patient: 'nuevo paciente',
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
        if ( idParamsForUpdate === 'new') {
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
                    toast.error('Error creating note', errorData.message);
                }
            }).catch((error) => {
                toast.error('Error creating note');
            });
        } else {
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
        if (idParamsForUpdate === 'new') {
            toast.error('Cannot delete a note that has not been created yet.');
            return;
        }
        fetch(`/api/notes/${idParamsForUpdate}`, {
            method: 'DELETE',
        }).then(async (response) => {
            if (response.ok) {
                const resData = await response.json();
                toast.message('Note deleted successfully');
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
        
        setIsPredicting(true);

        debounceTimer.current = setTimeout(() => {
            const sizeWindows = window.innerWidth;
            console.log('sizeWindows', sizeWindows);
            onSubmit();
            const predict = getContextualPrediction(text) //useCompletions (libreria) podriia mejorar esto, incluso con el stop()
            .then((res) => {
                setPrediction(res);
                setIsPredicting(false);
                
                console.log('sizeWindows', sizeWindows);
                if (sizeWindows < 780) {
                    toast.message(' Press the text to add.');
                } else {
                    toast.message(' Press TAB to accept the prediction.');
                    console.log('sizeWindows', sizeWindows);
                }
            });
        }, 2000);
    }

    const handleTouch = () =>{
        if (!prediction) return;

        form.setValue("content", form.getValues("content") + prediction);  
        setPrediction(null);
        editorRef.current?.focus();
    }

    const handlerKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => { 
        if(e.key === 'Tab' && prediction) {
            e.preventDefault();
            form.setValue("content", form.getValues("content") + prediction);
            setPrediction(null);
        }
    }


    return (
        <div className="px-2 sm:px-4 md:px-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">{titlePage}</h2>
            <div className="flex flex-col xl:flex-row gap-4 sm:gap-5">
                <div className="w-full xl:w-2/3">
                    <Form {...form}>
                        <form id="new-note-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                            <div className="flex flex-col gap-4 sm:gap-5">
                                <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="text-sm sm:text-base" placeholder="Título de la nota" {...field} />
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
                                                    className={`${prediction ? '' : ''} resize-none w-full h-[300px] sm:h-[350px] md:h-[400px] z-0 p-2 sm:p-3 border border-gray-300 rounded-md ring-1 ring-gray-500 bg-white text-black/70 text-base sm:text-lg md:text-xl font-medium`} 
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
                                        <div className="absolute pointer-events-none z-10 top-0 inset-0 w-full h-[300px] sm:h-[350px] md:h-[400px] p-2 sm:p-3 border border-gray-300 rounded-md ring-1 ring-gray-500 text-black/70 text-base sm:text-lg md:text-xl font-medium">
                                            <span className='opacity-0'>{userInput}</span>
                                            {isPredicting ?
                                                <span>
                                                    <Spinner className='inline' />
                                                </span>
                                            :
                                                <span onClick={handleTouch} className='text-gray-500 pointer-events-auto'>{prediction}</span>
                                            }
                                        </div>
                                    }
                                </div>
                                
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Información</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <FormField
                                    control={form.control}
                                    name="patient"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm sm:text-base">Paciente</FormLabel>
                                            <FormControl>
                                                <Input className="text-sm sm:text-base" placeholder="Nombre del paciente" {...field} />
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
                                            <FormLabel className="text-sm sm:text-base">Tipo de nota</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={form.getValues("noteType")} value={field.value}>
                                                            <SelectTrigger className="w-full h-9 sm:h-10 bg-white text-sm sm:text-base">
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
                                            <FormLabel className="text-sm sm:text-base">Nivel de urgencia</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                            <SelectTrigger className="w-full h-9 sm:h-10 bg-white text-sm sm:text-base">
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
                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                                <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">Guardar nota</Button>                                
                                <Button type="button" disabled={idParamsForUpdate === 'new'} variant={'destructive'} className="w-full sm:w-auto text-sm sm:text-base" onClick={handleDelete}>Eliminar nota</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                {/* Sidebar de contextos - Solo visible en pantallas xl y superiores */}
                <div className="hidden xl:flex w-1/3 gap-3 flex-col border border-gray-300 p-3 sm:p-4 rounded-lg max-w-[400px] justify-center items-center">
                    <h2 className="text-base sm:text-lg font-semibold">Contextos o referencias</h2>
                    <div className='h-full w-full border-2 border-dashed border-gray-300 max-w-full rounded-lg text-center flex items-center justify-center p-4' {...getRootProps()}>
                        <div>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                <p className="text-sm sm:text-base">Drop the files here ...</p> :
                                <p className="text-xs sm:text-sm">Drag 'n' drop some files here, or click to select files</p>
                            }
                            {fileRejections.length > 0 && (
                                <div className="text-red-500 mt-2 text-xs sm:text-sm">
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
        </div>
    );
}