import { z } from "zod";

export enum NoteTypeEnum {
    FOLLOWUP = "Seguimiento",
    EMERGENCY = "Emergencia",
    CONSULTATION = "Consulta",
}

export enum UrgencyLevelEnum {
    LOW = "Baja",
    MEDIUM = "Media",
    HIGH = "Alta",
}

export const noteSchema = z.object({
    title: z.string().min(2, { message: "Título debe tener al menos 2 caracteres" }).max(100, { message: "Título debe tener máximo 100 caracteres" }),
    content: z.string().min(10, { message: "Contenido debe tener al menos 10 caracteres" }).max(1000, { message: "Contenido debe tener máximo 1000 caracteres" }),
    patient: z.string().min(2, { message: "Paciente es requerido" }).max(100, { message: "Paciente debe tener máximo 100 caracteres" }),
    noteType: z.enum(NoteTypeEnum, { error: (issue) => `valor invalido: ${issue.received}` }),
    urgencyLevel: z.enum(UrgencyLevelEnum, { error: (issue) => `valor invalido: ${issue.received}` }),
    //tags: z.array(z.string()).optional(),
});

export type NoteType = z.infer<typeof noteSchema>;