import { z } from "zod";

// Enum para tipos MIME permitidos
export enum PdfMimeTypeEnum {
    PDF = "application/pdf",
    DOC = "application/msword",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

// Schema para crear/subir un PDF
export const pdfUploadSchema = z.object({
    fileName: z.string()
        .min(1, { message: "Nombre del archivo es requerido" })
        .max(255, { message: "Nombre del archivo debe tener máximo 255 caracteres" }),
    
    originalName: z.string()
        .min(1, { message: "Nombre original del archivo es requerido" })
        .max(255, { message: "Nombre original debe tener máximo 255 caracteres" }),
    
    fileUrl: z.string()
        .url({ message: "URL del archivo debe ser válida" })
        .min(1, { message: "URL del archivo es requerida" }),
    
    fileSize: z.number()
        .positive({ message: "Tamaño del archivo debe ser positivo" })
        .max(50 * 1024 * 1024, { message: "Archivo no puede exceder 50MB" }), // 50MB máximo
});

// Schema para actualizar un PDF
export const pdfUpdateSchema = z.object({
    fileName: z.string()
        .min(1, { message: "Nombre del archivo es requerido" })
        .max(255, { message: "Nombre del archivo debe tener máximo 255 caracteres" })
        .optional(),
    
    isProcessed: z.boolean().optional(),
});

// Schema para consultas/filtros de PDF
export const pdfQuerySchema = z.object({
    uploadedBy: z.string().optional(),
    mimeType: z.nativeEnum(PdfMimeTypeEnum).optional(),
    isProcessed: z.boolean().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
});

// Tipos TypeScript inferidos de los schemas
export type PdfUploadType = z.infer<typeof pdfUploadSchema>;
export type PdfUpdateType = z.infer<typeof pdfUpdateSchema>;
export type PdfQueryType = z.infer<typeof pdfQuerySchema>;