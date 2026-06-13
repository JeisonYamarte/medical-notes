
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CloudArrowUpIcon,
    DocumentMagnifyingGlassIcon,
    DocumentPlusIcon,
    DocumentTextIcon,
    FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

import { CardDashboard } from "@/components/cardDashboard";
import { CardPdfResume } from "@/components/cardPdfResume";
import { INote } from "@/model/note";
import { getNotes } from "@/service/notesService";
import { getPdfList } from "@/service/pdfService";
import type { PdfListItem } from "@/service/pdfService";



export default async function DashboardPage() {
    const session = await getServerSession(authOptions); 
    const userId = session?.user?.id;
    
    const notesRecent = userId
        ? await getNotes({ userId, limit: 5, skip: 1 })
        : { data: [] as INote[], total: 0 };

    const pdfList = userId
        ? await getPdfList(userId)
        : [] as PdfListItem[];


    return (
        <div className="min-h-dvh w-full rounded-2xl border border-border/70 bg-background/80 p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="mt-2 text-sm text-muted-foreground">Bienvenido a tu panel de control, {session?.user?.name}.</p>
            </div>
            <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <h2 className="mb-3 text-base font-semibold">Acciones rapidas</h2>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link
                            href="/dashboard/notes/new"
                            className="inline-flex h-10 min-w-[160px] items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <DocumentPlusIcon className="h-4 w-4" />
                            Nueva Nota
                        </Link>
                        <Link 
                            href="/dashboard/upload" 
                            className="inline-flex h-10 min-w-[160px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <CloudArrowUpIcon className="h-4 w-4" />
                            Subir PDF
                        </Link>
                        <Link 
                            href="/dashboard/notes" 
                            className="inline-flex h-10 min-w-[160px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                            Buscar nota
                        </Link>
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="mx-auto flex h-full max-w-full flex-col gap-2 p-4 md:p-5">
                        <h2 className="text-base font-semibold">Notas recientes</h2>
                        <ScrollArea className="h-[430px]">
                            <div className="grid h-full grid-cols-1 gap-2 p-2 md:p-3">
                                {notesRecent.data.length > 0 ? (
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
                                    <div className="flex w-full flex-col items-center py-10">
                                        <DocumentTextIcon className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="mt-2 text-sm text-muted-foreground">No hay notas recientes.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="mx-auto flex h-full max-w-full flex-col gap-2 p-4 md:p-5">
                        <h2 className="font-semibold text-sm sm:text-base">PDF Upload</h2>
                        <ScrollArea className="h-[430px]">
                            <div className="grid h-full grid-cols-1 gap-2 p-2 md:p-3">
                                {pdfList.length > 0 ? (
                                    pdfList.map((pdf: PdfListItem) => (
                                        <CardPdfResume
                                            key={pdf.id}
                                            title={pdf.originalName}
                                            size={(pdf.fileSize / 1024).toFixed(2) + ' KB'}
                                            createdAt={pdf.createdAt.toISOString()}
                                        />
                                    ))
                                ) : (
                                    <div className="flex w-full flex-col items-center py-10">
                                        <FolderOpenIcon className="h-12 w-12 text-muted-foreground/40" />
                                        <p className="mt-2 text-sm text-muted-foreground">No hay PDFs recientes.</p>
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