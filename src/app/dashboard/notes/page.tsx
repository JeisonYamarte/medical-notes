"use client"
import { useState, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Search, PlusCircle, Calendar as CalendarIcon, ArrowUpNarrowWide } from "lucide-react";

import { UrgencyLevelEnum } from "@/lib/schemas/noteSchema";
import { INote } from "@/model/note";

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
                console.log('Fetched notes on mount:', data);
            })
            .catch(err => {
                console.error('Error fetching notes:', err);
            });
    }, [state]);

    return (
        <div className="p-4 bg-gray-100 min-h-screen w-full rounded-xl gap-5 flex flex-col border-2 border-gray-200">
            <div className="flex items-center justify-between mt-4 px-3 w-full">
                <h2 className="text-xl font-bold mb-4">Note List</h2>
                <div className="relative">
                    <PlusCircle className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light text-white" />
                    <Button onClick={() => router.push('/dashboard/notes/new')} className="bg-blue-500 pl-10 pr-3 py-2">Crear nueva nota</Button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="relative w-50">
                    <Search className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                    <Input
                    className="pl-10 pr-3 py-2 w-full bg-white"
                    placeholder="buscar por titulo"
                    onChange={(e) => {
                        DebouncedFetch(e.target.value);
                    }}
                />
                </div>
                <Select onValueChange={(value) => dispatch({ type: 'SET_URGENCY', payload: value })}>
                    <SelectTrigger className="w-full h-10 bg-white">
                        <SelectValue placeholder="Filtrar por urgencia" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.LOW}>{UrgencyLevelEnum.LOW}</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.MEDIUM}>{UrgencyLevelEnum.MEDIUM}</SelectItem>
                        <SelectItem value={UrgencyLevelEnum.HIGH}>{UrgencyLevelEnum.HIGH}</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex gap-4">
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-48 h-10 gap-4 font-semibold items-center justify-start text-lg"
                        >
                        <CalendarIcon className="scale-120" />
                            {state.date ? state.date.toLocaleDateString() : "Select date"}
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
                    }} variant={'outline'} className="w-80 h-10 gap-4 font-semibold items-center justify-start text-lg"><ArrowUpNarrowWide className="scale-120"/>Ordenar por fecha: {orderDate}</Button>
                </div>
            </div>
            {/* Mejorar tabla con https://tanstack.com/table/v8 */ }
            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead>PACIENTE</TableHead>
                        <TableHead>TITULO DE LA NOTA</TableHead>                            
                        <TableHead>FECHA DE CREACION</TableHead>
                        <TableHead>TIPO</TableHead>
                        <TableHead>URGENCIA</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { 
                    notesToView.length > 0 ? notesToView?.map((note, index) => (
                            <TableRow className=" h-10 text-lg cursor-pointer " key={note._id?.toString() || `note-${index}`} onClick={ () => router.push(`/dashboard/notes/${note._id}`)}>
                                <TableCell className="font-medium">{note.patient}</TableCell>
                                <TableCell className="text-blue-500">{note.title}</TableCell>
                                <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{note.noteType}</TableCell>
                                <TableCell><span className={`${stateStyleHandler(note.urgencyLevel)} font-semibold rounded-full text-center p-1 px-3 border-2`}>{note.urgencyLevel}</span></TableCell>
                            </TableRow>
                        ))
                        :
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-lg text-gray-500">
                                No se encontraron notas.
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
            <Pagination className="flex justify-center mt-4 h-10">

                {
                    state.skip === 1 ? null : (
                        <PaginationPrevious className={`${state.skip === 1 ? 'disabled' : ''} cursor-pointer`} onClick={() => {
                        dispatch({ type: 'SET_SKIP', payload: state.skip - 1})
                        }}/>
                    )
                }
                
                
                
                <PaginationContent>
                    {
                        state.skip > 1 && (
                            <PaginationItem>
                                <PaginationLink className="px-3" >{state.skip - 1}</PaginationLink>
                            </PaginationItem>
                        )
                    }
                    <PaginationItem>
                        <PaginationLink className="px-3"  isActive>{state.skip}</PaginationLink>
                    </PaginationItem>
                    { state.skip + 1 >= totalPage ? null :  (
                        <PaginationEllipsis />
                    )}

                    { state.skip === totalPage ? null :  (
                        <PaginationItem>
                            <PaginationLink className="px-3" >{totalPage}</PaginationLink>
                        </PaginationItem>
                    )}
                </PaginationContent>
                
                {
                    state.skip === totalPage || totalPage === 0 ? null : (
                        <PaginationNext className="cursor-pointer" onClick={() => {
                            dispatch({ type: 'SET_SKIP', payload: state.skip + 1})
                        }}/>
                    )
                }
                
            </Pagination>
        </div>
    );
}