"use client"
import React, { useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { CloudUpload } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { CardListPDF } from '@/components/cardListPDF'
import { CardPDFsUpload } from '@/components/cardPDFsUpload' 
import App from 'next/app'


export default function UploadPage() {
    const [files, setFiles] = React.useState<File[]>([{} as File])
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles])
        console.log(acceptedFiles)
    }, [])
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({onDrop})

    return (
        <div className='min-h-screen flex gap-10'>
            <main className='w-2/3'>
                <h2 className="text-xl font-bold mb-4">Cargar documentos PDF</h2>
                <div className='flex flex-col items-start w-full min-h-max border-2 border-gray-300  rounded-lg bg-gray-50 cursor-pointer p-10 gap-5'>
                    <div className='flex flex-col justify-center border-3 border-dashed border-gray-300 rounded-lg text-center items-center w-full h-[300px] ' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CloudUpload className='mx-auto my-4' size={48} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
                    <div className='w-full '>
                        {acceptedFiles.length > 0 && <h2>Archivos seleccionados</h2>}
                        <ul className='h-100 overflow-y-auto mt-10 '>
                            {acceptedFiles.map((file) => (
                                <CardListPDF key={file.name} title={file.name} size={file.size} />
                            ))}
                        </ul>
                    </div>
                    <div className='w-full flex justify-end'>
                        <Button className='bg-blue-500' disabled={acceptedFiles.length === 0}>Subir archivos</Button>
                    </div>
                </div>
            </main>
            <aside className='w-1/3 max-w-sm'>
                <h2 className="text-xl font-bold mb-4">PDFs subidos</h2>
                <div className='flex flex-col items-start w-full border-2 border-gray-300  rounded-lg bg-gray-50 cursor-pointer p-3 gap-5 h-[500px] overflow-y-auto'>
                    {acceptedFiles.length > 0 ? (
                        acceptedFiles.map((file) => (
                            <CardPDFsUpload key={file.name} title={file.name} date={file.lastModified ? new Date(file.lastModified).toLocaleDateString() : ''} size={file.size} />
                        ))
                    ) : (
                        <p className='text-gray-500'>No hay archivos subidos aún.</p>
                    )}
                </div>
            </aside>
        </div>
    ); 
}