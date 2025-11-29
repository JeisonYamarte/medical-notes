
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileEdit, Link as LinkIcon, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getNotes } from "@/lib/notesService";

import { CardDashboard } from "@/components/cardDashboard";
import { CardPdfResume } from "@/components/cardPdfResume";
import { NextResponse } from "next/server";
import { INote } from "@/model/note";



export default async function DashboardPage() {
    const session = await getServerSession(authOptions); 
    const notesResponse: NextResponse = await getNotes({});
    const notesRecent = await notesResponse.json();


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
                                    <p>No recent notes available.</p>
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
                                <CardPdfResume title="Informe de laboratorio - 2024" description="Análisis de sangre completo y resultados de orina." />
                                <CardPdfResume title="Receta médica - Dr. Smith" description="Medicamentos prescritos para la hipertensión." />
                                <CardPdfResume title="Informe de radiología - 2024" description="Resultados de la radiografía de tórax." />
                                <CardPdfResume title="Historial de vacunación" description="Registro completo de vacunas administradas." />
                                <CardPdfResume title="Informe de alergias" description="Resultados de pruebas de alergia y recomendaciones." />
                                <CardPdfResume title="Resumen de consulta - Dr. Lee" description="Notas de la consulta sobre alergias estacionales." />
                                <CardPdfResume title="Informe de visión" description="Resultados del examen de la vista y receta de lentes." />
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}