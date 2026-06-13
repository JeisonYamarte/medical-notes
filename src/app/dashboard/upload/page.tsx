"use client"
import React, { useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import { 
    ArrowDownTrayIcon,
    CloudArrowUpIcon,
    TrashIcon,
    } from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Spinner } from "@/components/ui/spinner"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import type { PdfUploadType } from '@/lib/schemas/pdfSchema'
import { CardListPDF } from '@/components/cardListPDF'
import { CardPDFsUpload } from '@/components/cardPDFsUpload' 
import {
    savePdfMetadata, 
    saveEmbeddingText,
    deletePdfById
} from '@/service/pdfService'
import { uploadPDF } from '@/service/cloudinaryService'




export default function UploadPage() {
    const [files, setFiles] = useState<{ id: string; fileName: string; originalName: string; fileUrl: string; fileSize: number; createdAt: Date; }[]>([])
    const [isDeleting, setIsDeleting] = useState(false) 
    const [isUploading, setIsUploading] = useState(false)
    const [isListLoading, setIsListLoading] = useState(true)
    const [progressBar, setProgressBar] = useState(0);
    const [handlerPdf, setHandlerPdf] = useState<File[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState<{ id: string; fileName: string; originalName: string; fileUrl: string; fileSize: number; createdAt: Date; } | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setHandlerPdf(acceptedFiles);
        setProgressBar(0)
    }, [])

    useEffect(() => {
        (async ()=>{
            fetch('/api/pdf')
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setFiles(data.data);
                    setIsListLoading(false);
                }
            })
            .catch(err => {
                console.error('Error fetching PDF list:', err);
            })
        })()
    }, [isListLoading]);

    const handlePdf = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setIsUploading(true);
        setProgressBar(10);

        const formData = new FormData();
        formData.append('file', handlerPdf[0]); 
        
        uploadPDF(formData)
            .then((result) => {
                setProgressBar(70);
                if (result.status === 200 && result.url) {
                    const pdfData: PdfUploadType = {
                        fileName: handlerPdf[0].name,
                        originalName: handlerPdf[0].name,
                        fileUrl: result.url, // Usa la URL retornada
                        fileSize: handlerPdf[0].size,
                    }
                    
                    return savePdfMetadata(pdfData);
                }
            })
            .then((result) => {
                setProgressBar(90);
                if(result && result.status === 200 && result.pdfId) {
                    return saveEmbeddingText(formData, result.pdfId);
                }
            })
            .then(() => {
                setProgressBar(100);
                setIsUploading(false);
                setIsListLoading(true);
                setHandlerPdf([]);
            })
            .catch((error) => {
                console.error('Error uploading PDF:', error);
            })
    }

    const handleDelete = () => {
        if (!selectedPdf) return;

        setIsDeleting(true);

        deletePdfById(selectedPdf.id)
            .then((result) => {
                if (result.status === 200) {
                    setOpenDialog(false);
                    setIsDeleting(false);
                    setSelectedPdf(null);
                    setIsListLoading(true);
                } else {
                    console.error('Error deleting PDF:', result.message);
                }
            })
            .catch((error) => {
                console.error('Error deleting PDF:', error);
            });
    };

    const downloadPDF = () => {
        if (!selectedPdf) return;

        const downloadUrl = selectedPdf.fileUrl.replace('/upload/', '/upload/fl_attachment/');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = selectedPdf.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    const {
        getRootProps, 
        getInputProps, 
        isDragActive, 
        fileRejections,
    } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
        },
        onDrop
    })

    return (
        <div className='min-h-dvh grid grid-cols-1 gap-4 p-3 md:grid-cols-3 md:gap-6 md:p-5'>
            <main className='md:col-span-2'>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">Cargar documentos PDF</h2>
                <div className='flex min-h-max w-full flex-col items-start gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8'>
                    <div className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-secondary/20 text-center' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CloudArrowUpIcon className='mx-auto my-4 h-10 w-10 text-primary' />
                        { 
                            isDragActive ?
                            <p className="text-sm sm:text-base">Suelta el archivo aqui...</p> :
                            <p className="px-4 text-sm text-muted-foreground md:text-base">Arrastra tu PDF o haz clic para seleccionarlo.</p>
                        }
                        {
                            fileRejections.length > 0 && (
                                <div className="mt-2 px-4 text-xs text-destructive sm:text-sm">
                                    {fileRejections.map(({ file }) => (
                                        <div key={file.name}>
                                            <p>{`El archivo "${file.name}" fue rechazado: solo se permiten PDFs.`}</p>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    <div className='w-full'>
                        {handlerPdf.length > 0 && <h2 className="text-sm font-semibold">Archivos seleccionados</h2>}
                        <ul className='mt-4 h-auto overflow-y-auto'>
                            {handlerPdf.map((file) => (
                                <CardListPDF key={file.name} title={file.name} size={file.size} progressBar={progressBar}/>
                            ))}
                        </ul>
                    </div>
                    { handlerPdf.length > 0 && 
                        <div className='flex w-full flex-col justify-between gap-3 sm:flex-row sm:gap-4'>
                            <Button 
                                variant='destructive'
                                className="h-11 w-full text-sm sm:w-auto"
                                onClick={() => {
                                    setHandlerPdf([]);
                                }}
                            >Eliminar</Button>
                            <Button 
                                onClick={(e) => handlePdf(e)} 
                                className='h-11 w-full text-sm sm:w-auto' 
                                disabled={handlerPdf.length === 0 || isUploading}
                            >
                                {isUploading ? 'Subiendo...' : 'Subir archivo'}
                            </Button>
                        </div>
                    }
                </div>
            </main>
            <aside className='w-full md:col-span-1'>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">PDFs subidos</h2>
                <div className='flex h-[520px] w-full cursor-pointer flex-col items-start gap-3 overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-sm'>
                    {isListLoading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="relative h-12 w-12">
                                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                        </div>
                    ) : (
                        files.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>No hay PDFs subidos.</p>
                        ) :
                        files.map((file) => (
                            <CardPDFsUpload 
                                key={file.id} 
                                title={file.fileName} 
                                date={file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ''} 
                                size={file.fileSize}

                                onClick={() => {
                                    setOpenDialog(true);
                                    setSelectedPdf(file);
                                }} 
                            />
                        ))
                    )}
                </div>
            </aside>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-[90vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Detalles del PDF</DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                            Información del PDF seleccionado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 sm:mt-4 space-y-2 text-sm sm:text-base">
                        <p><strong>Nombre del archivo:</strong> <span className="break-all">{selectedPdf?.fileName}</span></p>
                        <p><strong>Nombre original:</strong> <span className="break-all">{selectedPdf?.originalName}</span></p>
                        <p><strong>Tamaño del archivo:</strong> {selectedPdf ? (selectedPdf.fileSize / 1024).toFixed(2) + ' KB' : ''}</p>
                        <p><strong>Fecha de creación:</strong> {selectedPdf?.createdAt ? new Date(selectedPdf.createdAt).toLocaleString() : ''}</p>
                    </div>
                    <div className='flex flex-col justify-between gap-3 px-0 sm:flex-row sm:px-10'>
                        <Button className='h-10 w-full text-sm sm:w-auto' onClick={downloadPDF}>Descargar<ArrowDownTrayIcon className="ml-2 h-4 w-4" /></Button>
                        <Button variant={'destructive'} className="h-10 w-full text-sm sm:w-auto" onClick={handleDelete}>Eliminar {isDeleting ? <Spinner className="ml-2" /> : <TrashIcon className="ml-2 h-4 w-4" />}</Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isDeleting} variant="outline" className="h-10 w-full text-sm sm:w-auto">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    ); 
}