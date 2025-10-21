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

export const Note: Model<INote> = (models.Note as Model<INote>) || model<INote>('Note', noteSchema);

export default Note;