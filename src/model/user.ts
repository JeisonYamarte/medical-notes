import mongoose, { Schema, model, models, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    birthday: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
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

userSchema.pre<IUser>('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash as string;
        next();
    });
});

export const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>('User', userSchema);

export default User;
