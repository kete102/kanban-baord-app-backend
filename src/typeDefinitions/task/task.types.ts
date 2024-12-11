import {
	createTaskZodSchema,
	deleteTaskZodSchema,
} from 'src/helpers/validateTaskRequestBody'
import {ITask} from 'src/models/TaskModel'

export interface TasksService {
	success: boolean
	message?: string
	error?: string
	tasks?: ITask[] | ITask | null
}

export interface GetAllTasks {
	clerkId: string
	boardId: string
}

export interface CreateTask {
	clerkId: string
	taskData: Zod.infer<typeof createTaskZodSchema>
}

export interface UpdateStatus {
	userId: string
	taskId: string
	newStatus: string
}

export interface DeleteTask {
	clerkId: string
	taskData: Zod.infer<typeof deleteTaskZodSchema>
}
