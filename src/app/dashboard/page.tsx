import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileEdit, Link, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection } from "@/model/contextPdf";

import { CardDashboard } from "@/components/cardDashboard";
import { CardPdfResume } from "@/components/cardPdfResume";



export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

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
                        <Button className="m-2 bg-blue-500"><FileEdit className="mr-1" />Nueva Nota</Button>
                        <Button variant={'outline'} className="m-2"><Link className="mr-1" />Subir PDF</Button>
                        <Button variant={'outline'} className="m-2"><Search className="mr-1" />Buscar nota</Button>
                    </div>
                </div>
                <div className="col-span-2 row-span-4 row-start-2 bg-white rounded-xl">
                    <div className="max-w-[600px] mx-auto gap-2 h-full p-5 flex flex-col">
                        <h2 className="font-semibold">Notas Recientes</h2>
                        <ScrollArea className="flex flex-col gap-2 max-h-[480px]">
                            <div className="grid grid-cols-1 gap-2 h-full p-5">
                                <CardDashboard title="Consulta con el Dr. Smith" titleNote="Revisión anual y chequeo de presión arterial." date="2024-10-01" />
                                <CardDashboard title="Resultados de laboratorio" titleNote="Análisis de sangre y orina." date="2024-09-25" />
                                <CardDashboard title="Vacunación contra la gripe" titleNote="Primera dosis administrada." date="2024-09-15" />
                                <CardDashboard title="Consulta con el Dr. Lee" titleNote="Seguimiento de la alergia estacional." date="2024-09-10" />
                                <CardDashboard title="Examen de visión" titleNote="Actualización de la receta de lentes." date="2024-08-30" />
                                <CardDashboard title="Consulta con el Dr. Patel" titleNote="Dolor de espalda y recomendaciones de fisioterapia." date="2024-08-20" />
                                <CardDashboard title="Chequeo dental" titleNote="Limpieza y revisión de caries." date="2024-08-15" />
                                <CardDashboard title="Consulta con el Dr. Gomez" titleNote="Control de diabetes y ajuste de medicación." date="2024-08-05" />
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