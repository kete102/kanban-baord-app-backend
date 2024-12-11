import {TaskZodSchema} from 'src/models/TaskModel'
import {z} from 'zod'

export const createTaskZodSchema = z.object({
	boardId: z.string({required_error: 'Missing required field: boardId'}),
	taskTitle: z.string({required_error: 'Missing required field: taskTitle'}),
	taskDescription: z.string({
		required_error: 'Missing required field: taskDescription',
	}),
	taskPriority: z.enum(['low', 'medium', 'high'], {
		required_error: 'Missing required field: status',
	}),
	taskStatus: z.enum(['todo', 'done', 'in-progress'], {
		required_error: 'Missing required field: priority',
	}),
	taskEndDate: z.string({required_error: 'Missing required field: endDate'}),
	createdAt: z.string({required_error: 'Missing required field: createdAt'}),
	lastUpdate: z.number({required_error: 'Missing required field: lastUpdate'}),
})

export const updateTaskZodSchema = z.object({
	taskId: z.string({required_error: 'Missing required  field: taskId'}),
	newStatus: TaskZodSchema.shape.status,
})
export const deleteTaskZodSchema = z.object({
	taskId: z.string({required_error: 'Missing required field: userId'}),
	boardId: TaskZodSchema.shape.boardId,
})
