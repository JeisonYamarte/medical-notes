"use client"
import { useState, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    ArrowsUpDownIcon,
    CalendarDaysIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { UrgencyLevelEnum } from "@/lib/schemas/noteSchema";
import { INote } from "@/model/note";

type NotesState = {
    date: Date | null;
    title: string | null;
    urgency: string | null;
    skip: number;
};

const initialState: NotesState = {
    date: null,
    title: null,
    urgency: null,
    skip: 1
}

type NotesAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_URGENCY'; payload: string }
    | { type: 'SET_SKIP'; payload: number }
    | { type: 'SET_DATE'; payload: Date | null }
    | { type: 'RESET' };

function reducer(state: NotesState, action: NotesAction): NotesState {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, title: action.payload };
        case 'SET_URGENCY':
            return { ...state, urgency: action.payload };
        case 'SET_SKIP':
            return { ...state, skip: action.payload };
        case 'SET_DATE':
            return { ...state, date: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export default function NotesPage() {
    //state for find in DB
    const [state, dispatch] = useReducer<NotesState, [NotesAction]>(reducer, initialState);
    const [loading, setLoading] = useState<boolean>(true);

    const [notesToView, setNotesToView] = useState<Array<INote>>([]);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [orderDate, setOrderDate] = useState<"Ascendente" | "Descendente">("Descendente");
    const [totalPage, setTotalPage] = useState<number>(0);

    const limit = 5;

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const router = useRouter();

    const DebouncedFetch = (search: string) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            dispatch({ type: 'SET_TITLE', payload: search})
        }, 1000);
    }

    const stateStyleHandler = (status: UrgencyLevelEnum) => {
        switch (status) {
            case UrgencyLevelEnum.HIGH:
                return "text-red-700 bg-red-100/90 border-red-200";
            case UrgencyLevelEnum.MEDIUM:
                return "text-amber-700 bg-amber-100/90 border-amber-200";
            default:
                return "text-emerald-700 bg-emerald-100/90 border-emerald-200";
        }
    }
    
    useEffect(() => {
        setLoading(true);
        let query = `/api/notes?limit=${limit}&skip=${state.skip}&`;

        if (state.title) {
            query += `title=${encodeURIComponent(state.title)}&`;
        }
        if (state.urgency && state.urgency !== 'all') {
            query += `urgency=${encodeURIComponent(state.urgency)}&`;
        }
        if (state.date) {
            query += `date=${encodeURIComponent(state.date.toISOString())}&`;
        }

        fetch(query)
            .then(res => res.json())
            .then(data => {
                setNotesToView(data.data);
                const paginationTotal = Math.ceil(data.total / limit);
                if(paginationTotal !== 0){
                    setTotalPage(paginationTotal);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching notes:', err);
                setLoading(false);
            });
    }, [state]);

    return (
        <div className="flex min-h-dvh w-full flex-col gap-5 rounded-2xl border border-border/70 bg-background/80 p-4 md:p-6">
            <div className="mt-2 flex w-full flex-col items-start justify-between gap-3 px-1 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold tracking-tight">Lista de notas</h2>
                <div className="relative w-full sm:w-auto">
                    <PlusCircleIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground" />
                    <Button onClick={() => router.push('/dashboard/notes/new')} className="h-10 w-full pl-9 pr-4 text-sm sm:w-auto">Crear nueva nota</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_auto_auto_auto]">
                <div className="relative w-full md:min-w-65">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                    className="h-10 w-full border-border/80 bg-card pl-10 pr-3 text-sm"
                    placeholder="Buscar por titulo"
                    onChange={(e) => {
                        DebouncedFetch(e.target.value);
                    }}
                />
                </div>
                <Select value={state.urgency ?? "all"} onValueChange={(value) => dispatch({ type: 'SET_URGENCY', payload: value })}>
                    <SelectTrigger className="h-10 w-full border-border/80 bg-card text-sm md:w-45">
                        <SelectValue placeholder="Filtrar por urgencia" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.LOW}>{UrgencyLevelEnum.LOW}</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.MEDIUM}>{UrgencyLevelEnum.MEDIUM}</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.HIGH}>{UrgencyLevelEnum.HIGH}</SelectItem>
                    </SelectContent>
                </Select>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="h-10 w-full justify-start gap-2 border-border/80 bg-card text-sm md:w-42.5"
                    >
                    <CalendarDaysIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{state.date ? state.date.toLocaleDateString() : "Fecha"}</span>
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={state.date ?? undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                        dispatch({ type: 'SET_DATE', payload: date ?? null });
                        setOpenCalendar(false)
                        }}
                    />
                    </PopoverContent>
                </Popover>
                <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
                    <Button onClick={() => {
                        setOrderDate(orderDate === "Ascendente" ? "Descendente" : "Ascendente")
                        setNotesToView([...notesToView].reverse());
                    }} variant={'outline'} className="h-10 gap-2 border-border/80 bg-card px-3 text-sm"><ArrowsUpDownIcon className="h-4 w-4"/><span className="truncate">{orderDate}</span></Button>
                    <Button variant={'outline'} className="h-10 gap-2 border-border/80 bg-card px-3 text-sm" onClick={() => {
                        dispatch({ type: 'RESET' });
                    }}><ArrowPathIcon className="h-4 w-4"/><span className="truncate">Reset</span></Button>
                </div>
            </div>
            {/* Mejorar tabla con https://tanstack.com/table/v8 */ }
            {/* Vista de tabla para desktop */}
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="text-sm">PACIENTE</TableHead>
                        <TableHead className="text-sm">TITULO DE LA NOTA</TableHead>
                        <TableHead className="text-sm">FECHA DE CREACION</TableHead>
                        <TableHead className="text-sm">TIPO</TableHead>
                        <TableHead className="text-sm">URGENCIA</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex justify-center items-center">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                    notesToView.length > 0 ? notesToView?.map((note, index) => (
                            <TableRow className="h-12 cursor-pointer text-sm hover:bg-secondary/25" key={note._id?.toString() || `note-${index}`} onClick={ () => router.push(`/dashboard/notes/${note._id}`)}>
                                <TableCell className="font-medium">{note.patient}</TableCell>
                                <TableCell className="text-primary">{note.title}</TableCell>
                                <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{note.noteType}</TableCell>
                                <TableCell><span className={`${stateStyleHandler(note.urgencyLevel)} rounded-full border px-3 py-1 text-xs font-semibold`}>{note.urgencyLevel}</span></TableCell>
                            </TableRow>
                        ))
                        :
                        (
                            <TableRow>
                                <TableCell colSpan={5} className="py-6 text-center text-base text-muted-foreground">
                                    No se encontraron notas.
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
            </div>
            
            {/* Vista de cards para móvil */}
            <div className="flex flex-col gap-3 md:hidden">
                { loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="relative h-12 w-12">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    </div>
                ) : (
                    notesToView.length > 0 ? notesToView?.map((note, index) => (
                        <div 
                            key={note._id?.toString() || `note-${index}`}
                            className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            onClick={() => router.push(`/dashboard/notes/${note._id}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="flex-1 text-base font-semibold text-primary">{note.title}</h3>
                                <span className={`${stateStyleHandler(note.urgencyLevel)} ml-2 shrink-0 rounded-full border px-2 py-0.5 text-center text-xs font-semibold`}>
                                    {note.urgencyLevel}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p><span className="font-medium">Paciente:</span> {note.patient}</p>
                                <p><span className="font-medium">Tipo:</span> {note.noteType}</p>
                                <p className="line-clamp-2"><span className="font-medium">Contenido:</span> {note.content}</p>
                                <p><span className="font-medium">Fecha:</span> {new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                    :
                    (
                        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                            No se encontraron notas.
                        </div>
                    )
                )}
            </div>
            <Pagination className="mt-2 flex h-auto justify-center">

                {
                    state.skip === 1 ? null : (
                        <PaginationPrevious className={`${state.skip === 1 ? 'disabled' : ''} cursor-pointer text-xs sm:text-sm`} onClick={() => {
                        dispatch({ type: 'SET_SKIP', payload: state.skip - 1})
                        }}/>
                    )
                }
                
                
                
                <PaginationContent>
                    {
                        state.skip > 1 && (
                            <PaginationItem>
                                <PaginationLink className="px-2 text-xs sm:px-3 sm:text-sm" >{state.skip - 1}</PaginationLink>
                            </PaginationItem>
                        )
                    }
                    <PaginationItem>
                        <PaginationLink className="px-2 text-xs sm:px-3 sm:text-sm"  isActive>{state.skip}</PaginationLink>
                    </PaginationItem>
                    { state.skip + 1 >= totalPage ? null :  (
                        <PaginationEllipsis className="hidden sm:block" />
                    )}

                    { state.skip === totalPage ? null :  (
                        <PaginationItem className="hidden sm:block">
                            <PaginationLink className="px-2 sm:px-3 text-xs sm:text-sm" >{totalPage}</PaginationLink>
                        </PaginationItem>
                    )}
                </PaginationContent>
                
                {
                    state.skip === totalPage || totalPage === 0 ? null : (
                        <PaginationNext className="cursor-pointer text-xs sm:text-sm" onClick={() => {
                            dispatch({ type: 'SET_SKIP', payload: state.skip + 1})
                        }}/>
                    )
                }
                
            </Pagination>
        </div>
    );
}