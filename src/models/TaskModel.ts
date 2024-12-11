import {z} from 'zod'
import {model, Schema} from 'mongoose'

export type ColumnType = 'todo' | 'inprogress' | 'done'

export interface ITask {
	userId: string
	boardId: string
	taskTitle: string
	taskDescription: string
	taskStatus: ColumnType
	taskPriority: 'high' | 'low' | 'medium'
	createdAt: string
	lastUpdate: number
	taskEndDate: string
}

export const taskSchema = new Schema<ITask>({
	userId: {type: String, required: true},
	boardId: {type: String, required: true},
	taskTitle: {type: String, required: true},
	taskDescription: {type: String, required: true},
	taskStatus: {
		type: String,
		enum: ['todo', 'inprogress', 'done'],
		required: true,
	},
	taskPriority: {
		type: String,
		enum: ['high', 'medium', 'low'],
		required: true,
	},
	createdAt: {type: String, required: true},
	lastUpdate: {type: Number, required: true},
	taskEndDate: {type: String, required: true},
})

export const Task = model<ITask>('Task', taskSchema)

//NOTE: Zod Schema

const ColumnTypeEnum = z.enum(['todo', 'done', 'inprogress'], {
	description: 'Task status: todo, done, inprogress',
})

const PriorityEnum = z.enum(['high', 'medium', 'low'], {
	description: 'Task priority: high, medium, low',
})

export const TaskZodSchema = z.object({
	userId: z.string({required_error: 'Missing required field: userId '}),
	boardId: z.string({required_error: 'Missing required field:  boardId '}),
	taskTitle: z.string({required_error: 'Missing required field: taskTitle '}),
	taskDescription: z.string({
		required_error: 'Missing required field: taskDescription',
	}),
	status: ColumnTypeEnum,
	priority: PriorityEnum,
	createdAt: z.string({required_error: 'Missing required field: createdAt'}),
	lastUpdate: z.number({required_error: 'Missing required field: lastUpdate'}),
	endDate: z.string({required_error: 'Missing required field: endDate '}),
})
