import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress"

function CardListPDF({title, size, progressBar}: { title: string; size: number; progressBar: number }) {
    return (
        <li className="mb-2 flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
            <DocumentTextIcon className="m-2 h-9 w-9 text-primary" />
            <div className="flex flex-col items-start w-full">
                <span className="line-clamp-1 font-medium text-card-foreground">{title}</span>
                <span className="text-sm text-muted-foreground">{(size / 1024).toFixed(2)} KB</span>
                <Progress className="mt-2 w-full [&>div]:bg-primary" value={progressBar} />
            </div>
        </li>
    );
}


export { CardListPDF };