
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileEdit, Link as LinkIcon, Search, FileEditIcon, FileSpreadsheetIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { NextResponse } from "next/server";

import { CardDashboard } from "@/components/cardDashboard";
import { CardPdfResume } from "@/components/cardPdfResume";
import { INote } from "@/model/note";
import { getNotes } from "@/lib/notesService";
import { getPdfList } from "@/lib/pdfService";



export default async function DashboardPage() {
    const session = await getServerSession(authOptions); 
    
    const notesResponse: NextResponse = await getNotes({});
    const notesRecent = await notesResponse.json();

    const pdfResponse: NextResponse = await getPdfList();
    const pdfList = await pdfResponse.json();


    return (
        <div className="p-4 bg-gray-100 min-h-screen w-full rounded-xl">
            <div>
                <h2 className="text-xl font-bold mb-4">Dashboard</h2>             
                <p className="text-gray-600 mb-6">Bienvenido a tu panel de control, {session?.user?.name}!</p>
            </div>
            <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full h-full">
                <div className="flex flex-col justify-center p-4 col-span-4 bg-white rounded-xl h-[110px]">
                    <h2 className="font-semibold">Acciones rapidas</h2>
                    <div className="flex">
                        <Link
                            href="/dashboard/notes/new"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-4 m-2 border hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 bg-blue-600 text-white"
                        >
                            <FileEdit />
                            Nueva Nota
                        </Link>
                        <Link href="/dashboard/upload" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-4 m-2 border hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 bg-background"><LinkIcon className="mr-1" />Subir PDF</Link>
                        <Link href="/dashboard/notes" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-4 m-2 border hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 bg-background"><Search className="mr-1" />Buscar nota</Link>
                    </div>
                </div>
                <div className="col-span-2 row-span-4 row-start-2 bg-white rounded-xl">
                    <div className="max-w-[600px] mx-auto gap-2 h-full p-5 flex flex-col">
                        <h2 className="font-semibold">Notas Recientes</h2>
                        <ScrollArea className="flex flex-col gap-2 max-h-[480px]">
                            <div className="grid grid-cols-1 gap-2 h-full p-5">
                                {notesRecent.success && notesRecent.data.length > 0 ? (
                                    notesRecent.data.map((note: INote) => (
                                        <CardDashboard
                                            key={note._id?.toString()}
                                            id={note._id?.toString() || ''}
                                            title={note.title}
                                            content={note.content}
                                            date={new Date(note.createdAt).toLocaleDateString("es-ES")}
                                        />
                                    ))
                                ) : (
                                    <div className="w-full h-100 flex flex-col items-center">
                                        <FileEditIcon className="h-20 w-10" />
                                        <p>No recent notes available.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="col-span-2 row-span-4 col-start-3 row-start-2 bg-white rounded-xl">
                    <div className="max-w-[600px] mx-auto gap-2 h-full p-5 flex flex-col">
                        <h2 className="font-semibold">PDF Upload</h2>
                        <ScrollArea className="flex flex-col gap-2 max-h-[480px]">
                            <div className="grid grid-cols-1 gap-2 h-full p-5">
                                {pdfList.success && pdfList.data.length > 0 ? (
                                    pdfList.data.map((pdf: any) => (
                                        <CardPdfResume
                                            key={pdf.id}
                                            title={pdf.originalName}
                                            size={(pdf.fileSize / 1024).toFixed(2) + ' KB'}
                                            createdAt={pdf.createdAt}
                                        />
                                    ))
                                ) : (
                                    <div className="w-full h-100 flex flex-col items-center">
                                        <FileSpreadsheetIcon className="h-20 w-10" />
                                        <p>No recent pdfs available.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}