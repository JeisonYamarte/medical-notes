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
import { Search, 
    PlusCircle, 
    Calendar as CalendarIcon, 
    ArrowUpNarrowWide,
    RefreshCw
} from "lucide-react";

import { UrgencyLevelEnum } from "@/lib/schemas/noteSchema";
import { INote } from "@/model/note";
import { tr } from "zod/v4/locales";

const initialState = { 
    date: null,
    title: null,
    urgency: null,
    skip: 1
}

function reducer(state: typeof initialState, action: any) {
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
    const [state, dispatch] = useReducer(reducer, initialState);
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
                return "text-red-600  bg-red-100 border-red-300";
            case UrgencyLevelEnum.MEDIUM:
                return "text-yellow-600  bg-yellow-100 border-yellow-300";
            default:
                return "text-green-600  bg-green-100 border-green-300";
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
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-100 min-h-dvh w-full rounded-xl gap-4 sm:gap-5 flex flex-col border-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 sm:mt-4 px-2 sm:px-3 w-full gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">Note List</h2>
                <div className="relative w-full sm:w-auto">
                    <PlusCircle className="absolute scale-75 sm:scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light text-white" />
                    <Button onClick={() => router.push('/dashboard/notes/new')} className="bg-blue-500 pl-9 sm:pl-10 pr-3 py-2 w-full sm:w-auto text-sm sm:text-base">Crear nueva nota</Button>
                </div>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative w-full">
                    <Search className="absolute scale-75 sm:scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                    <Input
                    className="pl-9 sm:pl-10 pr-3 py-2 w-full bg-white text-sm sm:text-base"
                    placeholder="buscar por titulo"
                    onChange={(e) => {
                        DebouncedFetch(e.target.value);
                    }}
                />
                </div>
                <Select onValueChange={(value) => dispatch({ type: 'SET_URGENCY', payload: value })}>
                    <SelectTrigger className="w-full h-9 sm:h-10 bg-white text-sm sm:text-base">
                        <SelectValue placeholder="Filtrar por urgencia" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.LOW}>{UrgencyLevelEnum.LOW}</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.MEDIUM}>{UrgencyLevelEnum.MEDIUM}</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.HIGH}>{UrgencyLevelEnum.HIGH}</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-full sm:w-48 h-9 sm:h-10 gap-2 sm:gap-4 font-semibold items-center justify-start text-sm sm:text-base md:text-lg"
                        >
                        <CalendarIcon className="scale-100 sm:scale-120 flex-shrink-0" />
                            <span className="truncate">{state.date ? state.date.toLocaleDateString() : "Select date"}</span>
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={state.date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                            dispatch({ type: 'SET_DATE', payload: date });
                            setOpenCalendar(false)
                            }}
                        />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={() => {
                        setOrderDate(orderDate === "Ascendente" ? "Descendente" : "Ascendente")
                        setNotesToView(notesToView.reverse());
                    }} variant={'outline'} className="w-full sm:w-auto h-9 sm:h-10 gap-2 sm:gap-4 font-semibold items-center justify-start text-sm sm:text-base md:text-lg"><ArrowUpNarrowWide className="scale-100 sm:scale-120 flex-shrink-0"/><span className="truncate">Ordenar: {orderDate}</span></Button>
                    <Button variant={'outline'} className="w-full sm:w-auto h-9 sm:h-10 gap-2 sm:gap-4 font-semibold items-center justify-start text-sm sm:text-base md:text-lg" onClick={() => {
                        dispatch({ type: 'RESET' });
                    }}><RefreshCw className="scale-100 sm:scale-120 flex-shrink-0"/><span className="truncate hidden sm:inline">Resetear filtros</span><span className="truncate sm:hidden">Reset</span></Button>
                </div>
            </div>
            {/* Mejorar tabla con https://tanstack.com/table/v8 */ }
            {/* Vista de tabla para desktop */}
            <div className="hidden md:block overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="text-xs lg:text-sm">PACIENTE</TableHead>
                        <TableHead className="text-xs lg:text-sm">TITULO DE LA NOTA</TableHead>                            
                        <TableHead className="text-xs lg:text-sm">FECHA DE CREACION</TableHead>
                        <TableHead className="text-xs lg:text-sm">TIPO</TableHead>
                        <TableHead className="text-xs lg:text-sm">URGENCIA</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex justify-center items-center">
                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                    notesToView.length > 0 ? notesToView?.map((note, index) => (
                            <TableRow className="h-10 text-sm lg:text-base cursor-pointer hover:bg-gray-50" key={note._id?.toString() || `note-${index}`} onClick={ () => router.push(`/dashboard/notes/${note._id}`)}>
                                <TableCell className="font-medium">{note.patient}</TableCell>
                                <TableCell className="text-blue-500">{note.title}</TableCell>
                                <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{note.noteType}</TableCell>
                                <TableCell><span className={`${stateStyleHandler(note.urgencyLevel)} font-semibold rounded-full text-center p-1 px-2 lg:px-3 border-2 text-xs lg:text-sm`}>{note.urgencyLevel}</span></TableCell>
                            </TableRow>
                        ))
                        :
                        (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-base lg:text-lg text-gray-500">
                                    No se encontraron notas.
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
            </div>
            
            {/* Vista de cards para móvil */}
            <div className="md:hidden flex flex-col gap-3">
                { loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                ) : (
                    notesToView.length > 0 ? notesToView?.map((note, index) => (
                        <div 
                            key={note._id?.toString() || `note-${index}`}
                            className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/dashboard/notes/${note._id}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-blue-500 text-base flex-1">{note.title}</h3>
                                <span className={`${stateStyleHandler(note.urgencyLevel)} font-semibold rounded-full text-center px-2 py-0.5 border text-xs ml-2 flex-shrink-0`}>
                                    {note.urgencyLevel}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Paciente:</span> {note.patient}</p>
                                <p><span className="font-medium">Tipo:</span> {note.noteType}</p>
                                <p className="truncate"><span className="font-medium">contenido:</span> {note.content}</p>
                                <p><span className="font-medium">Fecha:</span> {new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                    :
                    (
                        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                            No se encontraron notas.
                        </div>
                    )
                )}
            </div>
            <Pagination className="flex justify-center mt-4 h-auto">

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
                                <PaginationLink className="px-2 sm:px-3 text-xs sm:text-sm" >{state.skip - 1}</PaginationLink>
                            </PaginationItem>
                        )
                    }
                    <PaginationItem>
                        <PaginationLink className="px-2 sm:px-3 text-xs sm:text-sm"  isActive>{state.skip}</PaginationLink>
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