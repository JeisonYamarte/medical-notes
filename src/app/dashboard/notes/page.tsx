"use client"
import { useState } from "react";
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

enum NoteStatus {
    Stable = "Estable",
    Critical = "Critico",
    Pending = "Pendiente",
}

const notesExample = [
    {
        id: 1,
        patient: "Juan Perez",
        title: "Nota de seguimiento",
        date: "2023-10-01",
        autor: "Dra. Gomez",
        status: NoteStatus.Stable,
    },
    {
        id: 2,
        patient: "Maria Lopez",
        title: "Nota de emergencia",
        date: "2023-10-02",
        autor: "Dr. Martinez",
        status: NoteStatus.Critical,
    },
    {
        id: 3,
        patient: "Carlos Sanchez",
        title: "Nota de consulta",
        date: "2023-10-03",
        autor: "Dra. Rodriguez",
        status: NoteStatus.Pending,
    },
    { id: 4,
        patient: "Ana Torres",
        title: "Nota de seguimiento",
        date: "2023-10-04",
        autor: "Dr. Fernandez",
        status: NoteStatus.Stable,
    },
    {
        id: 5,
        patient: "Luis Ramirez",
        title: "Nota de emergencia",
        date: "2023-10-05",
        autor: "Dra. Garcia",
        status: NoteStatus.Critical,
    },
    {
        id: 6,
        patient: "Sofia Morales",
        title: "Nota de consulta",
        date: "2023-10-06",
        autor: "Dr. Lopez",
        status: NoteStatus.Pending,
    },
    {
        id: 7,
        patient: "Diego Flores",
        title: "Nota de seguimiento",
        date: "2023-10-07",
        autor: "Dra. Hernandez",
        status: NoteStatus.Stable,
    },
    { 
        id: 8,
        patient: "Elena Ruiz",
        title: "Nota de emergencia",
        date: "2023-10-08",
        autor: "Dr. Martinez",
        status: NoteStatus.Critical,
    },
    { 
        id: 9,
        patient: "Javier Gomez",
        title: "Nota de consulta",
        date: "2023-10-09",
        autor: "Dra. Sanchez",
        status: NoteStatus.Pending,
    },
    {
        id: 10,
        patient: "Isabella Diaz",
        title: "Nota de seguimiento",
        date: "2023-10-10",
        autor: "Dr. Torres",
        status: NoteStatus.Stable,
    }
]

export default function NotesPage() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [orderDate, setOrderDate] = useState<"Ascendente" | "Descendente">("Ascendente");

    const stateStyleHandler = (status: NoteStatus) => {
        switch (status) {
            case NoteStatus.Critical:
                return "text-red-600  bg-red-100 border-red-300";
            case NoteStatus.Pending:
                return "text-yellow-600  bg-yellow-100 border-yellow-300";
            default:
                return "text-green-600  bg-green-100 border-green-300";
        }
    }
    

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
                        <TableHead>AUTOR</TableHead>
                        <TableHead>ESTADO</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notesExample.map((note) => (
                        <TableRow className=" h-10 text-lg" key={note.id}>
                            <TableCell className="font-medium">{note.patient}</TableCell>
                            <TableCell className="text-blue-500">{note.title}</TableCell>
                            <TableCell>{note.date}</TableCell>
                            <TableCell>{note.autor}</TableCell>
                            <TableCell><span className={`${stateStyleHandler(note.status)} font-semibold rounded-full text-center p-1 px-3 border-2`}>{note.status}</span></TableCell>
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