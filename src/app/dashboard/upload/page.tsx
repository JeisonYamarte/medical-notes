"use client"
import React, { useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import { 
    CloudUpload,
    Trash2,
    Download
    } from 'lucide-react'

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
    saveEmbebingText,
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
                    return saveEmbebingText(formData, result.pdfId);
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
        acceptedFiles,
        fileRejections,
    } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
        },
        onDrop
    })

    return (
        <div className='min-h-dvh flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-3 sm:p-4 md:p-5'>
            <main className='w-full lg:w-2/3'>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Cargar documentos PDF</h2>
                <div className='flex flex-col items-start w-full min-h-max border-2 border-gray-300 rounded-lg bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10 gap-4 sm:gap-5'>
                    <div className='flex flex-col justify-center border-2 sm:border-3 border-dashed border-gray-300 rounded-lg text-center items-center w-full h-[200px] sm:h-[250px] md:h-[300px] cursor-pointer' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CloudUpload className='mx-auto my-3 sm:my-4' size={36} />
                        { 
                            isDragActive ?
                            <p className="text-sm sm:text-base">Drop the files here ...</p> :
                            <p className="text-xs sm:text-sm md:text-base px-4">Drag 'n' drop some files here, or click to select files</p>
                        }
                        {
                            fileRejections.length > 0 && (
                                <div className="text-red-500 mt-2 text-xs sm:text-sm px-4">
                                    {fileRejections.map(({ file }) => (
                                        <div key={file.name}>
                                            <p>File "{file.name}" was rejected: only PDF files are allowed.</p>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    <div className='w-full'>
                        {handlerPdf.length > 0 && <h2 className="text-sm sm:text-base font-semibold">Archivos seleccionados</h2>}
                        <ul className='h-auto overflow-y-auto mt-4 sm:mt-10'>
                            {handlerPdf.map((file) => (
                                <CardListPDF key={file.name} title={file.name} size={file.size} progressBar={progressBar}/>
                            ))}
                        </ul>
                    </div>
                    { handlerPdf.length > 0 && 
                        <div className='w-full flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
                            <Button 
                                variant='destructive'
                                className="w-full sm:w-auto text-sm sm:text-base"
                                onClick={() => {
                                    setHandlerPdf([]);
                                }}
                            >Elminar</Button>
                            <Button 
                                onClick={(e) => handlePdf(e)} 
                                className='bg-blue-500 w-full sm:w-auto text-sm sm:text-base' 
                                disabled={handlerPdf.length === 0 || isUploading}
                            >
                                {isUploading ? 'Subiendo...' : 'Subir archivo'}
                            </Button>
                        </div>
                    }
                </div>
            </main>
            <aside className='w-full lg:w-1/3 lg:max-w-sm'>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">PDFs subidos</h2>
                <div className='flex flex-col items-start w-full border-2 border-gray-300 rounded-lg bg-gray-50 cursor-pointer p-3 sm:p-4 gap-3 sm:gap-4 md:gap-5 h-[300px] sm:h-[400px] md:h-[500px] overflow-y-auto'>
                    {isListLoading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
                                <div className="absolute inset-0 border-3 sm:border-4 border-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 border-3 sm:border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        files.length === 0 ? (
                            <p className='text-gray-500 text-sm sm:text-base'>No hay PDFs subidos.</p>
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
                    <div className='flex flex-col sm:flex-row justify-between gap-3 px-0 sm:px-10'>
                        <Button className='bg-blue-500 w-full sm:w-auto text-sm sm:text-base' onClick={downloadPDF}>Descargar<Download className="ml-2" /></Button>
                        <Button variant={'destructive'} className="w-full sm:w-auto text-sm sm:text-base" onClick={handleDelete}>Eliminar {isDeleting ? <Spinner className="ml-2" /> : <Trash2 className="ml-2" />}</Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isDeleting} className="w-full sm:w-auto text-sm sm:text-base">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    ); 
}