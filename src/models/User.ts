import {model, Schema} from 'mongoose'

interface IUser {
	clerkId: string
	email: string
}

const userSchema = new Schema<IUser>({
	clerkId: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
})

export const User = model<IUser>('User', userSchema)
