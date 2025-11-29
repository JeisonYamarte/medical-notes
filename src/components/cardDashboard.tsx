import React from "react";
import Link from "next/link";

function CardDashboard({id, title, content, date}: {id: string, title: string, content: string, date: string}) {
    return (
        <Link href={`dashboard/notes/${id}`} className="bg-white rounded-xl p-4 shadow w-full h-full hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 truncate">{content}</p>
            <p className="text-xs text-gray-400">{date}</p>
        </Link>
    );
}

export { CardDashboard }
