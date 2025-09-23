"use client"
import { Inter } from "next/font/google";
import { MoveRight, FileText, ShieldCheck, Cloud, Palette, UsersRound, Laptop, } from 'lucide-react';
import { useRouter } from "next/navigation";

import { CardLandingPage } from "@/components/cardLandingPage";
import { Button } from "@/components/ui/button"


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between mx-auto  ${inter.className}`}>
      <header className={`flex w-full cap-5 items-center justify-between text-center max-h-[700px] bg-[#F0F3FF] py-20`}>
        <div className="w-full flex flex-col gap-7 max-w-[1140px] mx-auto">
          <img className="mx-auto" src="https://cdn-icons-png.flaticon.com/512/11711/11711702.png" alt="Medical Note" width={100} height={100} /> {/* se recomienda usar Image de next.js pero hay que usar el next config y agregar el dominio desde donde vienen las imagenes */}
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold">Medical Note:</h1>
            <h2 className="text-3xl font-bold">Gestión de Notas Médicas Simplificada y Segura</h2>
            <p className="text-sm mt-3">Una plataforma intuitiva y conforme a la normativa diseñada para profesionales de la salud. Mejore su flujo de trabajo y la atención al paciente.</p>
          </div>
          <div className="flex gap-2 mx-auto"> 
            <Button className=" w-35 text-xs bg-blue-500" onClick={() => {router.push('./sign-in')}}>iniciar Sesion <MoveRight className="inline" /></Button>
            <Button variant="outline" className=" w-30 text-xs" onClick={() => {router.push('./sign-up')}}>Registrarse</Button>
          </div>
        </div>
      </header>
      <section className="w-full  mt-10 p-5 h-auto bg-white">
        <div className="text-center mb-10 max-w-[1140px] mx-auto">
          <h2 className="text-3xl font-bold mb-10">Características que marcan la diferencia</h2>
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            <CardLandingPage icon={<FileText />} title="Notas Clínicas Simplificadas" description="Capture, organice y recupere rápidamente las notas de los pacientes con nuestra interfaz intuitiva. Asegure la precisión y coherencia en cada registro."/>
            <CardLandingPage icon={<ShieldCheck />} title="Seguridad de Datos Avanzada" description="Proteja la información confidencial del paciente con cifrado de grado industrial y protocolos de privacidad estrictos. Cumpla con las normativas de salud sin esfuerzo." />
            <CardLandingPage icon={<Cloud />} title="Acceso Seguro en la Nube" description="Acceda a sus notas desde cualquier lugar y en cualquier momento con nuestra plataforma basada en la nube. Realice copias de seguridad automáticas y mantenga sus datos sincronizados de forma segura." />
            <CardLandingPage icon={<Palette />} title="Interfaz de Usuario Adaptable" description="Disfrute de una experiencia fluida y consistente en cualquier dispositivo. Nuestra interfaz está diseñada para profesionales de la salud, optimizada para la eficiencia." />
          </div>
        </div>
      </section>
      <section className="w-full mt-10 p-5 h-auto bg-gray-200">
        <div className="text-center max-w-[1140px] mb-10 mx-auto">
          <h2 className="text-3xl font-bold mb-10">Lo que dicen nuestros usuarios</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={`w-full h-48 border border-gray-300 rounded-lg p-6 flex flex-col items-start justify-between text-center gap-4 hover:shadow-lg transition-shadow duration-300`}>
              <p className='text-lg text-left italic font-light'>"Medical Notes ha transformado la forma en que gestiono las notas de mis pacientes. Es increíblemente eficiente y la seguridad es de primera clase."</p>
              <p className='text-sm font-bold text-blue-500'>Dra. Ana Torres, Cardiología</p>
            </div>
            <div className={`w-full h-48 border border-gray-300 rounded-lg p-6 flex flex-col items-start justify-between text-center gap-4 hover:shadow-lg transition-shadow duration-300`}>
              <p className='text-lg text-left italic font-light'>""La interfaz es muy intuitiva y me ha permitido reducir el tiempo de documentación a la mitad. ¡Una herramienta esencial para cualquier médico!"</p>
              <p className='text-sm font-bold text-blue-500'>Dr. Carlos Ruiz, Medicina General</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full h-auto p-5 bg-gray-200">
        <div className="text-center mb-10 max-w-[1140px] mx-auto">
          <h2 className="text-3xl font-bold mb-10">Impulse su practica medica</h2>
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            <CardLandingPage icon={<UsersRound />} title="Colaboración Eficiente" description="Comparta notas de forma segura con colegas y equipos médicos, mejorando la coordinación de la atención al paciente y minimizando errores."/>
            <CardLandingPage icon={<Laptop />} title="Integración de Sistemas" description="Conecte 'Notas Médicas' con sus sistemas existentes de gestión de pacientes (EMR) para un flujo de trabajo unificado y sin interrupciones." />
            <CardLandingPage icon={<FileText />} title="Plantillas Personalizables" description="Cree y use plantillas personalizadas para diferentes tipos de notas clínicas, ahorrando tiempo y asegurando la exhaustividad en la documentación." />
            <CardLandingPage icon={<ShieldCheck />} title="Auditoría y Conformidad" description="Mantenga un registro completo de todas las modificaciones y accesos a las notas, facilitando la auditoría y demostrando el cumplimiento normativo." />
          </div>
        </div>
      </section>
      <footer className="w-full h-[200px] p-5 bg-[#F0F3FF]">
        <div className="flex flex-col items-center gap-5 max-w-[1140px] mx-auto justify-center h-full">
          <h2 className="text-2xl font-bold">Únase a Cientos de Profesionales de la Salud Hoy Mismo</h2>
          <Button className="bg-blue-500" onClick={() => {router.push('./sign-in')}}>Empiece ahora, es gratis</Button>
        </div>
      </footer>
    </main>
  );
}
