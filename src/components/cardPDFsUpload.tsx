import { DocumentTextIcon } from "@heroicons/react/24/outline";

function CardPDFsUpload({title, date, size, onClick}: {title?: string, date?: string, size?: number, onClick?: () => void}) {
    return (
        <div onClick={onClick} className='flex min-h-[96px] w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'>
            <div className='flex-shrink-0'>
                <DocumentTextIcon className='h-10 w-10 text-primary' />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
                <p className='line-clamp-2 text-base font-semibold leading-tight text-card-foreground'>{title}</p>
                <div className="flex gap-3 text-sm text-muted-foreground">
                    <p>{date}</p>
                    <p>{size ? (size / 1024).toFixed(2) : 0} KB</p>
                </div>
            </div>
        </div>
    );
}

export { CardPDFsUpload}