import { FileText } from "lucide-react";

function CardPDFsUpload({title, date, size, onClick}: {title?: string, date?: string, size?: number, onClick?: () => void}) {
    return (
        <div onClick={onClick} className='flex h-[100px] items-center w-full border-2 p-3 border-gray-300 rounded-lg bg-gray-50 cursor-pointer gap-3'>
            <div className='flex-shrink-0'>
                <FileText className='text-blue-500 w-12 h-12' />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
                <p className='font-bold text-base leading-tight line-clamp-2'>{title}</p>
                <div className="flex gap-3 text-sm text-gray-500">
                    <p>{date}</p>
                    <p>{size} KB</p>
                </div>
            </div>
        </div>
    );
}

export { CardPDFsUpload}