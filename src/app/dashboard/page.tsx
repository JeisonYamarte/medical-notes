
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileEdit, Link as LinkIcon, Search, FileEditIcon, FileSpreadsheetIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { NextResponse } from "next/server";

import { CardDashboard } from "@/components/cardDashboard";
import { CardPdfResume } from "@/components/cardPdfResume";
import { INote } from "@/model/note";
import { getNotes } from "@/service/notesService";
import { getPdfList } from "@/service/pdfService";



export default async function DashboardPage() {
    const session = await getServerSession(authOptions); 
    
    const notesResponse: NextResponse = await getNotes({limit: 5, skip: 1});
    const notesRecent = await notesResponse.json();

    const pdfResponse: NextResponse = await getPdfList();
    const pdfList = await pdfResponse.json();


    return (
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-100 min-h-dvh w-full rounded-xl">
            <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Dashboard</h2>             
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Bienvenido a tu panel de control, {session?.user?.name}!</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 w-full h-full">
                <div className="flex flex-col justify-center p-3 sm:p-4 lg:col-span-4 bg-white rounded-xl min-h-[100px]">
                    <h2 className="font-semibold text-sm sm:text-base mb-3">Acciones rapidas</h2>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/dashboard/notes/new"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-3 sm:px-4 border hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 bg-blue-600 text-white flex-1 sm:flex-initial min-w-[140px]"
                        >
                            <FileEdit className="w-4 h-4" />
                            Nueva Nota
                        </Link>
                        <Link 
                            href="/dashboard/upload" 
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-3 sm:px-4 border hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 bg-background flex-1 sm:flex-initial min-w-[140px]"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Subir PDF
                        </Link>
                        <Link 
                            href="/dashboard/notes" 
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-3 sm:px-4 border hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 bg-background flex-1 sm:flex-initial min-w-[140px]"
                        >
                            <Search className="w-4 h-4" />
                            Buscar nota
                        </Link>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl">
                    <div className="max-w-full lg:max-w-[600px] mx-auto gap-2 h-full p-3 sm:p-4 md:p-5 flex flex-col">
                        <h2 className="font-semibold text-sm sm:text-base">Notas Recientes</h2>
                        <ScrollArea className="flex flex-col gap-2 max-h-[400px] sm:max-h-[450px] md:max-h-[480px]">
                            <div className="grid grid-cols-1 gap-2 h-full p-2 sm:p-3 md:p-5">
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
                                    <div className="w-full h-100 flex flex-col items-center py-8">
                                        <FileEditIcon className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300" />
                                        <p className="text-xs sm:text-sm text-gray-500 mt-2">No recent notes available.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl">
                    <div className="max-w-full lg:max-w-[600px] mx-auto gap-2 h-full p-3 sm:p-4 md:p-5 flex flex-col">
                        <h2 className="font-semibold text-sm sm:text-base">PDF Upload</h2>
                        <ScrollArea className="flex flex-col gap-2 max-h-[400px] sm:max-h-[450px] md:max-h-[480px]">
                            <div className="grid grid-cols-1 gap-2 h-full p-2 sm:p-3 md:p-5">
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
                                    <div className="w-full h-100 flex flex-col items-center py-8">
                                        <FileSpreadsheetIcon className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300" />
                                        <p className="text-xs sm:text-sm text-gray-500 mt-2">No recent pdfs available.</p>
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