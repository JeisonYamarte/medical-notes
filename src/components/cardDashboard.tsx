import React from "react";
import Link from "next/link";

function CardDashboard({id, title, content, date}: {id: string, title: string, content: string, date: string}) {
    return (
        <Link href={`dashboard/notes/${id}`} className="group w-full rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <h3 className="line-clamp-1 font-semibold text-card-foreground">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{content}</p>
            <p className="mt-2 text-xs text-muted-foreground/80">{date}</p>
        </Link>
    );
}

export { CardDashboard }
