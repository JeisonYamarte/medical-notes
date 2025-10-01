import { FileText } from "lucide-react";

function CardPDFsUpload({title, date, size}: {title?: string, date?: string, size?: number}) {
    return (
        <div className='flex h-[100px] items-center w-full border-2 p-1 border-gray-300  rounded-lg bg-gray-50 cursor-pointer'>
            <FileText className='text-blue-500 m-1 w-10 h-10' />
            <div className="flex justify-between text-sm">
                <h3 className=' font-bold '>{title}</h3>
                <div className="flex flex-col text-right justify-between">
                    <p className='text-gray-500'>{date}</p>
                    <p className='text-gray-500'>{size} KB</p>
                </div>
            </div>
        </div>
    );
}

export { CardPDFsUpload}