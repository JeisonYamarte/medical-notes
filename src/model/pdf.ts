import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

export interface IPdf extends Document {
    fileName: string,
    originalName: string,
    fileUrl: string,
    fileSize: number,
    uploadedBy: mongoose.Types.ObjectId,
    isProcessed: boolean,
    createdAt: Date,
    updatedAt: Date
}

const pdfSchema = new Schema<IPdf>(
    {
        fileName: {
            type: String,
            required: [true, 'fileName is required'],
            trim: true
        },
        originalName: {
            type: String,
            required: [true, 'originalName is required'],
            trim: true
        },
        fileUrl: {
            type: String,
            required: [true, 'fileUrl is required'],
            trim: true
        },
        fileSize: {
            type: Number,
            required: [true, 'fileSize is required']
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            required: [true, 'uploadedBy is required'],
            ref: 'User'
        },
        isProcessed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

// Índices para mejorar el rendimiento de las consultas
pdfSchema.index({ uploadedBy: 1 });
pdfSchema.index({ createdAt: -1 });


export const Pdf: Model<IPdf> = (models.Pdf as Model<IPdf>) || model<IPdf>('Pdf', pdfSchema);

export default Pdf;