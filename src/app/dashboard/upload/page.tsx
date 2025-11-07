"use client"
import React, { useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import { CloudUpload } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { PdfUploadType } from '@/lib/schemas/pdfSchema'
import { CardListPDF } from '@/components/cardListPDF'
import { CardPDFsUpload } from '@/components/cardPDFsUpload' 
import { uploadPDF, savePdfMetadata, getPdfList, saveEmbebingText} from '@/lib/pdfService'




export default function UploadPage() {
    const [files, setFiles] = useState<{ id: string; fileName: string; originalName: string; fileUrl: string; fileSize: number; createdAt: Date; }[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isListLoading, setIsListLoading] = useState(true)
    const [progressBar, setProgressBar] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setProgressBar(0)
    }, [])

    useEffect(() => {
        (async ()=>{
            const pdflist = await getPdfList();
            setFiles(pdflist);
            setIsListLoading(false);
        })()
    }, [isListLoading]);

    const handlePdf = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setIsUploading(true);
        setIsListLoading(true);
        setProgressBar(10);

        const formData = new FormData();
        formData.append('file', acceptedFiles[0]); 
        
        uploadPDF(formData)
            .then((result) => {
                setProgressBar(70);
                if (result.status === 200 && result.url) {
                    const pdfData: PdfUploadType = {
                        fileName: acceptedFiles[0].name,
                        originalName: acceptedFiles[0].name,
                        fileUrl: result.url, // Usa la URL retornada
                        fileSize: acceptedFiles[0].size,
                    }
                    
                    return savePdfMetadata(pdfData);
                }
            })
            .then((result) => {
                setProgressBar(90);
                if(result && result.status === 200 && result.pdfId) {
                    saveEmbebingText(formData, result.pdfId.toString()); //usa la id retornada de la DB
                }
                setFiles([]); // Limpia los archivos
            })
            .catch((error) => {
                console.error('Error uploading PDF:', error);
            })
            .finally(() => {
                setProgressBar(100);
                setIsUploading(false);
            });
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
                        {acceptedFiles.length > 0 && <h2>Archivos seleccionados</h2>}
                        <ul className='h-100 overflow-y-auto mt-10 '>
                            {acceptedFiles.map((file) => (
                                <CardListPDF key={file.name} title={file.name} size={file.size} progressBar={progressBar}/>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full flex justify-end'>
                        <Button 
                            onClick={(e) => handlePdf(e)} 
                            className='bg-blue-500' 
                            disabled={acceptedFiles.length === 0 || isUploading}
                        >
                            {isUploading ? 'Subiendo...' : 'Subir archivos'}
                        </Button>
                    </div>
                </div>
            </main>
            <aside className='w-1/3 max-w-sm'>
                <h2 className="text-xl font-bold mb-4">PDFs subidos</h2>
                <div className='flex flex-col items-start w-full border-2 border-gray-300  rounded-lg bg-gray-50 cursor-pointer p-3 gap-5 h-[500px] overflow-y-auto'>
                    {isListLoading ? (
                        <p className='text-gray-500'>Cargando lista de PDFs...</p>
                    ) : (
                        files.length === 0 ? (
                            <p className='text-gray-500'>No hay PDFs subidos.</p>
                        ) :
                        files.map((file) => (
                            <CardPDFsUpload key={file.id} title={file.fileName} date={file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ''} size={file.fileSize} />
                        ))
                    )}
                </div>
            </aside>
        </div>
    ); 
}