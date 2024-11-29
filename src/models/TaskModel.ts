import {model, Schema} from 'mongoose'
import {ITask} from '../types'

export const taskSchema = new Schema<ITask>({
	userId: {type: String, required: true},
	boardId: {type: String, required: true},
	taskTitle: {type: String, required: true},
	taskDescription: {type: String, required: true},
	status: {
		type: String,
		enum: ['todo', 'inprogress', 'done'],
		required: true,
	},
	priority: {
		type: String,
		enum: ['high', 'medium', 'low'],
		required: true,
	},
	createdAt: {type: String, required: true},
	lastUpdate: {type: Number, required: true},
	endDate: {type: String, required: true},
})
export const Task = model<ITask>('Task', taskSchema)
