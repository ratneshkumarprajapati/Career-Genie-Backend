import mongoose, { Date, Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs"

interface IUser extends Document {
    _id: Types.ObjectId;
    userName: string;
    email: string;
    password: string;
    createdAt?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>

}

interface IUserResponse {
    id: string;
    userName: string;
    email: string;
    createdAt?: Date;
}
interface AuthenticatedRequest extends Request {
    user?: IUser;
}
interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    user?: IUserResponse;
}

const UserSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true

    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
   

}, { timestamps: true })

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error)

    }
})

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User=mongoose.model<IUser>("User",UserSchema)
export default User