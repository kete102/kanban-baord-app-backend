import mongoose, {model, Schema, Types} from 'mongoose'

interface IBoard {
	boardTitle: string
	boardDescription: string
	userId: Types.ObjectId
}

const boardSchema = new Schema<IBoard>({
	boardTitle: {
		type: String,
		required: true,
	},
	boardDescription: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
})

export const Board = model<IBoard>('Board', boardSchema)
