"use client"
import { useState, useEffect } from "react";
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


export default function NotesPage() {
    const [notesToView, setNotesToView] = useState<Array<INote>>([]);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [orderDate, setOrderDate] = useState<"Ascendente" | "Descendente">("Ascendente");

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
        fetch('/api/notes')
            .then(res => res.json())
            .then(data => {
                setNotesToView(data.data);
            })
            .catch(err => {
                console.error('Error fetching notes:', err);
            });
    }, [])

    return (
        <div className="p-4 bg-gray-100 min-h-screen w-full rounded-xl gap-5 flex flex-col border-2 border-gray-200">
            <div className="flex items-center justify-between mt-4 px-3 w-full">
                <h2 className="text-xl font-bold mb-4">Note List</h2>
                <div className="relative">
                    <PlusCircle className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light text-white" />
                    <Button className="bg-blue-500 pl-10 pr-3 py-2">Crear nueva nota</Button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="relative w-50">
                    <Search className="absolute scale-90 left-2 top-1/2 transform -translate-y-1/2 font-light" />
                    <Input
                    className="pl-10 pr-3 py-2 w-full bg-white"
                    placeholder="buscar por titulo"
                />
                </div>
                <Select>
                    <SelectTrigger className="w-full h-10 bg-white">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="stable">Estable</SelectItem>
                        <SelectItem value="critical">Critico</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex gap-4">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-48 h-10 gap-4 font-semibold items-center justify-start text-lg"
                        >
                        <CalendarIcon className="scale-120" />
                            {date ? date.toLocaleDateString() : "Select date"}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                            }}
                        />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={() => {
                        setOrderDate(orderDate === "Ascendente" ? "Descendente" : "Ascendente")
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
                    {notesToView.map((note) => (
                        <TableRow className=" h-10 text-lg" key={note.id}>
                            <TableCell className="font-medium">{note.patient}</TableCell>
                            <TableCell className="text-blue-500">{note.title}</TableCell>
                            <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{note.noteType}</TableCell>
                            <TableCell><span className={`${stateStyleHandler(note.urgencyLevel)} font-semibold rounded-full text-center p-1 px-3 border-2`}>{note.urgencyLevel}</span></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination className="flex justify-center mt-4 h-10">
                <PaginationPrevious >
                    <Button variant="outline" className="px-3">Anterior</Button>
                </PaginationPrevious>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink className="px-3" href="#" aria-label="Go to page 1">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink className="px-3" href="#" aria-label="Go to page 2" isActive>2</PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis />
                    <PaginationItem>
                        <PaginationLink className="px-3" href="#" aria-label="Go to page 5">5</PaginationLink>
                    </PaginationItem>
                </PaginationContent>
                <PaginationNext >
                    <Button variant="outline" className="px-3">Siguiente</Button>
                </PaginationNext>
            </Pagination>
        </div>
    );
}