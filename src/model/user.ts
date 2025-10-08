import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    birthday: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'the name is required'],
        trim: true,
        minlength: [2, 'the name must have at least 2 characters'],
        maxlength: [50, 'the name must have at most 50 characters'],
    },
    email: {
        type: String,
        rrequired: [true, 'the emaail is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'the password is required'],
        minlength: [6, 'the password must have at least 6 characters'],
    },
    birthday: {
        type: Date,
        required: [true, 'the birthday is required'],
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

export const User = models.User || model<IUser>('User', UserSchema);

export default User;
