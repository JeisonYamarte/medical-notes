import { DocumentTextIcon } from "@heroicons/react/24/outline";

function CardPdfResume({ title, size, createdAt }: { title: string; size: string; createdAt: string }) {
    return (
        <div className="flex w-full flex-row rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <div className="mr-4 flex h-full w-10 items-center justify-center rounded-lg bg-secondary/60 text-primary">
                <DocumentTextIcon className="h-5 w-5" />
            </div>
            <div className="w-full max-w-full">
                <h3 className="truncate font-semibold text-card-foreground">{title}</h3>
                <p className="truncate text-sm text-muted-foreground">{size} - {new Date(createdAt).toLocaleDateString("es-ES")}</p>
            </div>
        </div>
    );
}

export { CardPdfResume }