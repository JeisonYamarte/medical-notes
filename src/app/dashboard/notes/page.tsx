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
import { Search, PlusCircle, Calendar as CalendarIcon, ArrowUpNarrowWide } from "lucide-react";

export default function NotesPage() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [orderDate, setOrderDate] = useState<"Ascendente" | "Descendente">("Ascendente");
    return (
        <div className="p-4 bg-gray-100 min-h-screen w-full rounded-xl">
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

        </div>
    );
}