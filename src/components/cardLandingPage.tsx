import React from 'react';

//esta card es para el landind page en la seccion de caracteristicas y impulsores
function CardLandingPage({ icon: Icon, title, description }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; description: string }) {
    return (
        <div className="group h-full rounded-2xl border border-border/80 bg-card/90 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
            <div className="mb-4 inline-flex rounded-xl bg-secondary/70 p-3 text-primary">
                <Icon className="h-7 w-7" />
            </div>
            <h2 className='text-lg font-semibold text-card-foreground'>{title}</h2>
            <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{description}</p>
        </div>
    )
}

export { CardLandingPage };