import React from "react";

function CardDashboard({title, titleNote, date}: {title: string, titleNote: string, date: string}) {
    return (
        <div className="bg-white rounded-xl p-4 shadow w-full h-full hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 truncate">{titleNote}</p>
            <p className="text-xs text-gray-400">{date}</p>
        </div>
    );
}

export { CardDashboard }
