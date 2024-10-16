import {model, Schema} from 'mongoose'
import {ITask} from '../types'

export const taskSchema = new Schema<ITask>({
	taskId: {type: String, required: true},
	userId: {type: String, required: true},
	tasksTitle: {type: String, required: true},
	taskDescription: {type: String, required: true},
	status: {
		type: String,
		enum: ['todo', 'inprogess', 'done'],
		required: true,
	},
	priority: {
		type: String,
		enum: ['high', 'medium', 'low'],
		required: true,
	},
	createdAt: {type: String, required: true},
})
export const Task = model<ITask>('Task', taskSchema)
