"use client"
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  CloudIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  SwatchIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation"

import { CardLandingPage } from "@/components/cardLandingPage";
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen flex-col items-center">
      <header className="relative flex w-full items-center justify-between overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-background px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 top-4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="z-10 mx-auto flex w-full max-w-6xl flex-col gap-7">
          <Image 
            src="/v1765285713/icono_nota_medica_nezds1.svg" 
            alt="Medical Note" 
            width={60} 
            height={60}
            className="mx-auto h-20 w-20 sm:h-24 sm:w-24"
          />
          <div className="flex flex-col px-2 sm:px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Medical Note</h1>
            <h2 className="mt-2 text-xl font-semibold text-primary md:text-3xl">Gestion de notas medicas simplificada y segura</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">Una plataforma intuitiva y conforme a normativa para profesionales de la salud. Organiza, busca y protege informacion clinica con una experiencia clara y rapida.</p>
          </div>
          <div className="mx-auto flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0"> 
            <Button className="w-full px-6 text-sm sm:w-auto" onClick={() => {router.push('./sign-in')}}>
              Iniciar sesion <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full px-6 text-sm sm:w-auto" onClick={() => {router.push('./sign-up')}}>
              Registrarse
            </Button>
          </div>
        </div>
      </header>
      <section className="w-full px-4 py-10 sm:px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-6xl text-center">
          <h2 className="px-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Caracteristicas que marcan la diferencia</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <CardLandingPage icon={DocumentTextIcon} title="Notas clinicas simplificadas" description="Captura, organiza y recupera notas rapidamente con una interfaz enfocada en flujo medico real."/>
            <CardLandingPage icon={CheckBadgeIcon} title="Seguridad de datos avanzada" description="Protege informacion sensible con controles modernos y buenas practicas de privacidad." />
            <CardLandingPage icon={CloudIcon} title="Acceso seguro en la nube" description="Accede desde cualquier lugar con sincronizacion estable y respaldo continuo." />
            <CardLandingPage icon={SwatchIcon} title="Interfaz adaptable" description="Experiencia clara y consistente en mobile y desktop para trabajar sin friccion." />
          </div>
        </div>
      </section>
      <section className="w-full bg-secondary/25 px-4 py-10 sm:px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-6xl text-center">
          <h2 className="px-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Lo que dicen nuestros usuarios</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            <div className="flex min-h-[12rem] w-full flex-col items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 text-left shadow-sm">
              <p className='text-base italic font-light leading-relaxed text-muted-foreground'>&quot;Medical Notes transformo la forma en que gestiono las notas de pacientes. Es eficiente y la seguridad transmite mucha confianza.&quot;</p>
              <p className='text-sm font-semibold text-primary'>Dra. Ana Torres, Cardiologia</p>
            </div>
            <div className="flex min-h-[12rem] w-full flex-col items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 text-left shadow-sm">
              <p className='text-base italic font-light leading-relaxed text-muted-foreground'>&quot;La interfaz es intuitiva y reduje el tiempo de documentacion a la mitad. Es una herramienta esencial para consulta diaria.&quot;</p>
              <p className='text-sm font-semibold text-primary'>Dr. Carlos Ruiz, Medicina General</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full px-4 py-10 sm:px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-6xl text-center">
          <h2 className="px-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Impulsa tu practica medica</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <CardLandingPage icon={UserGroupIcon} title="Colaboracion eficiente" description="Comparte notas de forma segura con colegas y mejora la continuidad del cuidado."/>
            <CardLandingPage icon={ComputerDesktopIcon} title="Integracion de sistemas" description="Conecta Medical Notes a tu flujo de trabajo para reducir pasos manuales." />
            <CardLandingPage icon={DocumentTextIcon} title="Plantillas personalizables" description="Estandariza documentacion y ahorra tiempo en consulta y seguimiento." />
            <CardLandingPage icon={CheckBadgeIcon} title="Auditoria y conformidad" description="Registra cambios y accesos para trazabilidad clinica y normativa." />
          </div>
        </div>
      </section>
      <footer className="w-full bg-gradient-to-r from-secondary/40 via-background to-accent/20 px-4 py-10 sm:px-6 md:px-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-5 rounded-2xl border border-border/70 bg-card/80 px-4 py-8 shadow-sm">
          <h2 className="text-center text-2xl font-bold tracking-tight text-card-foreground">Unete a cientos de profesionales de la salud hoy</h2>
          <Button className="w-full px-8 text-base sm:w-auto" onClick={() => {router.push('./sign-in')}}>
            Empieza ahora, es gratis
          </Button>
        </div>
      </footer>
    </main>
  );
}
