import mongoose, { Schema, model, models, Document, Model } from 'mongoose';
import { NoteTypeEnum, UrgencyLevelEnum } from '@/lib/schemas/noteSchema';

export interface INote extends Document {
    title: string,
    content: string,
    patient: string,
    noteType: NoteTypeEnum,
    urgencyLevel: UrgencyLevelEnum,
    userId: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const noteSchema = new Schema<INote>(
    {
        title:{
            type: String,
            require: [true, 'title is required'],
            trim: true
        },
        content:{
            type: String,
            require: [true, 'content is required'],
            trim: true
        },
        patient:{
            type: String,
            require: [true, 'patient is required'],
            trim: true
        },
        noteType:{
            type: String,
            enum: Object.values(NoteTypeEnum),
            require: [true, 'noteType is required'],
        },
        urgencyLevel:{
            type: String,
            enum: Object.values(UrgencyLevelEnum),
            require: [true, 'urgencyLevel is required'],
        },
        userId:{
            type: Schema.Types.ObjectId,
            require: [true, 'userId is required'],
            ref: 'User'
        },

        createdAt:{
            type: Date,
            default: Date.now
        },
        updatedAt:{
            type: Date,
            default: Date.now
        }
    }
)

// Índices para mejorar el rendimiento de las consultas
noteSchema.index({ userId: 1 }); // Buscar notas por usuario
noteSchema.index({ createdAt: -1 }); // Ordenar por fecha (más recientes primero)
noteSchema.index({ noteType: 1 }); // Filtrar por tipo de nota
noteSchema.index({ urgencyLevel: 1 }); // Filtrar por nivel de urgencia
noteSchema.index({ userId: 1, createdAt: -1 }); // Notas de usuario ordenadas por fech

export const Note: Model<INote> = (models.Note as Model<INote>) || model<INote>('Note', noteSchema);

export default Note;