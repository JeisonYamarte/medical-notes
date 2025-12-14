"use client"
import { Inter } from "next/font/google";
import { MoveRight, FileText, ShieldCheck, Cloud, Palette, UsersRound, Laptop, } from 'lucide-react';
import { useRouter } from "next/navigation"

import { CardLandingPage } from "@/components/cardLandingPage";
import { Button } from "@/components/ui/button"
import Image from "next/image";



const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between mx-auto ${inter.className}`}>
      <header className={`flex w-full items-center justify-between text-center bg-[#F0F3FF] py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8`}>
        <div className="w-full flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 max-w-[1140px] mx-auto">
          <Image 
            src="/v1765285713/icono_nota_medica_nezds1.svg" 
            alt="Medical Note" 
            width={60} 
            height={60}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
          />
          <div className="flex flex-col px-2 sm:px-4 md:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Medical Note:</h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2">Gestión de Notas Médicas Simplificada y Segura</h2>
            <p className="text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-w-3xl mx-auto">Una plataforma intuitiva y conforme a la normativa diseñada para profesionales de la salud. Mejore su flujo de trabajo y la atención al paciente.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mx-auto w-full sm:w-auto px-4 sm:px-0"> 
            <Button className="w-full sm:w-auto px-4 sm:px-6 text-xs sm:text-sm bg-blue-500" onClick={() => {router.push('./sign-in')}}>
              iniciar Sesion <MoveRight className="inline ml-1" />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto px-4 sm:px-6 text-xs sm:text-sm" onClick={() => {router.push('./sign-up')}}>
              Registrarse
            </Button>
          </div>
        </div>
      </header>
      <section className="w-full mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 lg:p-8 h-auto bg-white">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 max-w-[1140px] mx-auto">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 px-2">Características que marcan la diferencia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            <CardLandingPage icon={<FileText />} title="Notas Clínicas Simplificadas" description="Capture, organice y recupere rápidamente las notas de los pacientes con nuestra interfaz intuitiva. Asegure la precisión y coherencia en cada registro."/>
            <CardLandingPage icon={<ShieldCheck />} title="Seguridad de Datos Avanzada" description="Proteja la información confidencial del paciente con cifrado de grado industrial y protocolos de privacidad estrictos. Cumpla con las normativas de salud sin esfuerzo." />
            <CardLandingPage icon={<Cloud />} title="Acceso Seguro en la Nube" description="Acceda a sus notas desde cualquier lugar y en cualquier momento con nuestra plataforma basada en la nube. Realice copias de seguridad automáticas y mantenga sus datos sincronizados de forma segura." />
            <CardLandingPage icon={<Palette />} title="Interfaz de Usuario Adaptable" description="Disfrute de una experiencia fluida y consistente en cualquier dispositivo. Nuestra interfaz está diseñada para profesionales de la salud, optimizada para la eficiencia." />
          </div>
        </div>
      </section>
      <section className="w-full mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 lg:p-8 h-auto bg-gray-200">
        <div className="text-center max-w-[1140px] mb-6 sm:mb-8 md:mb-10 mx-auto">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 px-2">Lo que dicen nuestros usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            <div className={`w-full min-h-[12rem] sm:min-h-[14rem] md:h-48 border border-gray-300 rounded-lg p-4 sm:p-5 md:p-6 flex flex-col items-start justify-between text-center gap-3 sm:gap-4 hover:shadow-lg transition-shadow duration-300 bg-white`}>
              <p className='text-sm sm:text-base md:text-lg text-left italic font-light'>"Medical Notes ha transformado la forma en que gestiono las notas de mis pacientes. Es increíblemente eficiente y la seguridad es de primera clase."</p>
              <p className='text-xs sm:text-sm font-bold text-blue-500'>Dra. Ana Torres, Cardiología</p>
            </div>
            <div className={`w-full min-h-[12rem] sm:min-h-[14rem] md:h-48 border border-gray-300 rounded-lg p-4 sm:p-5 md:p-6 flex flex-col items-start justify-between text-center gap-3 sm:gap-4 hover:shadow-lg transition-shadow duration-300 bg-white`}>
              <p className='text-sm sm:text-base md:text-lg text-left italic font-light'>""La interfaz es muy intuitiva y me ha permitido reducir el tiempo de documentación a la mitad. ¡Una herramienta esencial para cualquier médico!"</p>
              <p className='text-xs sm:text-sm font-bold text-blue-500'>Dr. Carlos Ruiz, Medicina General</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full h-auto p-4 sm:p-5 md:p-6 lg:p-8 bg-gray-200">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 max-w-[1140px] mx-auto">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 px-2">Impulse su practica medica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            <CardLandingPage icon={<UsersRound />} title="Colaboración Eficiente" description="Comparta notas de forma segura con colegas y equipos médicos, mejorando la coordinación de la atención al paciente y minimizando errores."/>
            <CardLandingPage icon={<Laptop />} title="Integración de Sistemas" description="Conecte 'Notas Médicas' con sus sistemas existentes de gestión de pacientes (EMR) para un flujo de trabajo unificado y sin interrupciones." />
            <CardLandingPage icon={<FileText />} title="Plantillas Personalizables" description="Cree y use plantillas personalizadas para diferentes tipos de notas clínicas, ahorrando tiempo y asegurando la exhaustividad en la documentación." />
            <CardLandingPage icon={<ShieldCheck />} title="Auditoría y Conformidad" description="Mantenga un registro completo de todas las modificaciones y accesos a las notas, facilitando la auditoría y demostrando el cumplimiento normativo." />
          </div>
        </div>
      </section>
      <footer className="w-full min-h-[160px] sm:min-h-[180px] md:h-[200px] p-4 sm:p-5 md:p-6 bg-[#F0F3FF]">
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 max-w-[1140px] mx-auto justify-center h-full px-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center">Únase a Cientos de Profesionales de la Salud Hoy Mismo</h2>
          <Button className="bg-blue-500 w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base" onClick={() => {router.push('./sign-in')}}>
            Empiece ahora, es gratis
          </Button>
        </div>
      </footer>
    </main>
  );
}
