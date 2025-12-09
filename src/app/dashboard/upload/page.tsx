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
        <div className='min-h-screen flex gap-10'>
            <main className='w-2/3'>
                <h2 className="text-xl font-bold mb-4">Cargar documentos PDF</h2>
                <div className='flex flex-col items-start w-full min-h-max border-2 border-gray-300  rounded-lg bg-gray-50 p-10 gap-5'>
                    <div className='flex flex-col justify-center border-3 border-dashed border-gray-300 rounded-lg text-center items-center w-full h-[300px] cursor-pointer' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CloudUpload className='mx-auto my-4' size={48} />
                        { 
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                        {
                            fileRejections.length > 0 && (
                                <div className="text-red-500 mt-2">
                                    {fileRejections.map(({ file }) => (
                                        <div key={file.name}>
                                            <p>File "{file.name}" was rejected: only PDF files are allowed.</p>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    <div className='w-full '>
                        {handlerPdf.length > 0 && <h2>Archivos seleccionados</h2>}
                        <ul className='h-auto overflow-y-auto mt-10 '>
                            {handlerPdf.map((file) => (
                                <CardListPDF key={file.name} title={file.name} size={file.size} progressBar={progressBar}/>
                            ))}
                        </ul>
                    </div>
                    { handlerPdf.length > 0 && 
                        <div className='w-full flex justify-between'>
                            <Button 
                                variant='destructive'
                                onClick={() => {
                                    setHandlerPdf([]);
                                }}
                            >Elminar</Button>
                            <Button 
                                onClick={(e) => handlePdf(e)} 
                                className='bg-blue-500' 
                                disabled={handlerPdf.length === 0 || isUploading}
                            >
                                {isUploading ? 'Subiendo...' : 'Subir archivo'}
                            </Button>
                        </div>
                    }
                </div>
            </main>
            <aside className='w-1/3 max-w-sm'>
                <h2 className="text-xl font-bold mb-4">PDFs subidos</h2>
                <div className='flex flex-col items-start w-full border-2 border-gray-300  rounded-lg bg-gray-50 cursor-pointer p-3 gap-5 h-[500px] overflow-y-auto'>
                    {isListLoading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        files.length === 0 ? (
                            <p className='text-gray-500'>No hay PDFs subidos.</p>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles del PDF</DialogTitle>
                        <DialogDescription>
                            Información del PDF seleccionado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <p><strong>Nombre del archivo:</strong> {selectedPdf?.fileName}</p>
                        <p><strong>Nombre original:</strong> {selectedPdf?.originalName}</p>
                        <p><strong>Tamaño del archivo:</strong> {selectedPdf ? (selectedPdf.fileSize / 1024).toFixed(2) + ' KB' : ''}</p>
                        <p><strong>Fecha de creación:</strong> {selectedPdf?.createdAt ? new Date(selectedPdf.createdAt).toLocaleString() : ''}</p>
                    </div>
                    <div className='flex justify-between px-10'>
                        <Button className='bg-blue-500' onClick={downloadPDF}>Descargar<Download /></Button>
                        <Button variant={'destructive'} onClick={handleDelete}>Eliminar {isDeleting ? <Spinner /> : <Trash2 />}</Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isDeleting} >Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    ); 
}