import {model, Schema} from 'mongoose'

export interface IBoard {
	boardTitle: string
	boardDescription: string
	userId: string
	createdAt: string
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
		type: String,
		required: true,
	},
	createdAt: {type: String, required: true},
})

export const Board = model<IBoard>('Board', boardSchema)
