import { FileText, X } from "lucide-react";
import { Progress } from "@/components/ui/progress"

function CardListPDF({title, size}: { title: string; size: number }) {
    return (
        <li className="flex items-center justify-between p-4 border-2 border-gray-200 h-30 rounded-lg mb-2 w-full">
            <FileText className="m-2 h-10 w-10 text-blue-500" />
            <div className="flex flex-col items-start w-full">
                <span>{title}</span>
                <span>{size / 1024} KB</span>
                <Progress className="w-full mt-2 [&>div]:bg-blue-500" value={80} />
            </div>
            <X className="m-2 cursor-pointer scale-120" />
        </li>
    );
}


export { CardListPDF };