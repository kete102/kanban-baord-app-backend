import mongoose, {model, Schema} from 'mongoose'
import {taskSchema} from './Task'
import {IBoard, IColumn} from '../types'

const columnSchema = new Schema<IColumn>({
	columnId: {
		type: String,
		enum: ['todo', 'inprogess', 'done'],
		required: true,
	},
	tasks: [taskSchema],
})

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
	columns: {
		type: Map,
		of: columnSchema,
		required: true,
	},
})

export const Board = model<IBoard>('Board', boardSchema)
