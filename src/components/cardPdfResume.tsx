import { Link } from "lucide-react";

function CardPdfResume({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-row bg-white rounded-xl p-4 shadow w-full h-full hover:bg-gray-50 cursor-pointer">
            <div className="w-10 h-full flex items-center justify-center mr-4">
                <Link className="" />
            </div>
            <div className="w-full max-w-full">
                <h3 className="font-semibold truncate">{title}</h3>
                <p className="text-sm text-gray-600 truncate">{description}</p>
            </div>
        </div>
    );
}

export { CardPdfResume }