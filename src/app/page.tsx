import { CardLandingPage } from "@/components/cardLandingPage";
import { Button } from "@/components/ui/button"
import { MoveRight, FileText } from 'lucide-react';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-between mx-auto ">
      <header className={`flex w-full cap-5 items-center justify-between text-center  max-w-[1140px]max-h-[700px] bg-indigo-400 py-20 ${inter.className}`}>
        <div className="w-full flex flex-col gap-7">
          <img className="mx-auto" src="https://cdn-icons-png.flaticon.com/512/11711/11711702.png" alt="Medical Note" width={100} height={100} /> {/* se recomienda usar Image de next.js pero hay que usar el next config y agregar el dominio desde donde vienen las imagenes */}
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold">Medical Note:</h1>
            <h2 className="text-3xl font-bold">Gestión de Notas Médicas Simplificada y Segura</h2>
            <p className="text-sm mt-3">Una plataforma intuitiva y conforme a la normativa diseñada para profesionales de la salud. Mejore su flujo de trabajo y la atención al paciente.</p>
          </div>
          <div className="flex gap-2 mx-auto"> 
            <Button className=" w-35 text-xs bg-blue-500">iniciar Sesion <MoveRight className="inline" /></Button>
            <Button variant="outline" className=" w-30 text-xs">Registrarse</Button>
          </div>
        </div>
      </header>
      <section className="w-full max-w-[1140px] h-96 mt-10">
        <div className="text-center mb-10">
          <h2>Características que marcan la diferencia</h2>
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            <CardLandingPage icon={<FileText />} title="Notas Clínicas Simplificadas" description="Capture, organice y recupere rápidamente las notas de los pacientes con nuestra interfaz intuitiva. Asegure la precisión y coherencia en cada registro."/>
          </div>
        </div>
      </section>
    </main>
  );
}
