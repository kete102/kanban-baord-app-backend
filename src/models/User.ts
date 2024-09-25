import mongoose, {model, Schema, Types} from 'mongoose'

interface IUser {
	clerkId: string
	boards: Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
	clerkId: {
		type: String,
		required: true,
	},
	boards: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Board',
	},
})

export const User = model<IUser>('User', userSchema)
