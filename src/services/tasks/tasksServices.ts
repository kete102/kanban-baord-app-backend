import {MongooseError} from 'mongoose'
import {Task} from 'src/models/TaskModel'
import {
	createTaskZodSchema,
	deleteTaskZodSchema,
	updateTaskZodSchema,
} from 'src/helpers/validateTaskRequestBody'
import {Board} from 'src/models/BoardModel'
import {
	CreateTask,
	DeleteTask,
	GetAllTasks,
	TasksService,
	UpdateStatus,
} from 'src/typeDefinitions/task/task.types'

export async function getAllTasks({
	clerkId,
	boardId,
}: GetAllTasks): Promise<TasksService> {
	try {
		const tasks = await Task.find({userId: clerkId, boardId: boardId})

		if (!tasks.length) {
			return {
				success: true,
				tasks: [],
				error: `No tasks found for user ${clerkId}`,
			}
		}
		console.log(tasks)

		return {
			success: true,
			message: `User ${clerkId} tasks`,
			tasks: tasks,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error getting user's tasks: ${error.message}`)
		} else {
			throw error
		}
	}
}

export async function createTask({
	clerkId,
	taskData,
}: CreateTask): Promise<TasksService> {
	const validation = createTaskZodSchema.safeParse(taskData)
	if (!validation.success) {
		return {
			success: false,
			error: `Validation error: ${validation.error.errors.map((e) => e.message).join(', ')}`,
		}
	}

	try {
		const board = await Board.findOne({
			_id: validation.data.boardId,
			userId: clerkId,
		})

		if (!board) {
			return {
				success: true,
				error: `No board found with boardId ${validation.data.boardId} for user ${clerkId}`,
			}
		}

		const newTask = new Task({
			userId: clerkId,
			...validation.data,
		})

		const savedTask = await newTask.save()

		return {
			success: true,
			message: 'New task created',
			tasks: savedTask,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error on creating new task: ${error.message}`)
		}

		return {
			success: false,
			error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}

export async function updateTaskStatus({
	userId,
	taskId,
	newStatus,
}: UpdateStatus): Promise<TasksService> {
	const validation = updateTaskZodSchema.safeParse({
		taskId,
		newStatus,
	})

	if (!validation.success) {
		return {
			success: false,
			error: `Validation error: ${validation.error.errors.map((e) => e.message).join(', ')}`,
		}
	}

	try {
		const updatedTask = await Task.findOneAndUpdate(
			{userId, _id: taskId},
			{
				taskStatus: newStatus,
			},
			{new: true}
		)

		if (!updatedTask) {
			return {
				success: false,
				error: `No task found for taskId: ${taskId}`,
			}
		}

		return {
			success: true,
			message: `Task with taskId ${taskId} updated succesfully`,
			tasks: updatedTask,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error on updating task: ${error.message}`)
		}

		return {
			success: false,
			error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}

export async function deleteTask({
	clerkId,
	taskData,
}: DeleteTask): Promise<TasksService> {
	try {
		const validation = deleteTaskZodSchema.safeParse(taskData)

		if (!validation.success) {
			return {
				success: false,
				error: `Validation error: ${validation.error.errors.map((e) => e.message).join(', ')}`,
			}
		}

		const targetBoard = await Board.findOne({
			_id: validation.data.boardId,
			userId: clerkId,
		})

		if (!targetBoard) {
			return {
				success: false,
				error: `No board found with boardId ${validation.data.boardId}`,
			}
		}

		const taskToDelte = await Task.findOneAndDelete({
			_id: validation.data.taskId,
			userId: clerkId,
		})

		return {
			success: true,
			message: `Task with taskId ${validation.data.taskId} deleted succesfully`,
			tasks: taskToDelte,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error on updating task: ${error.message}`)
		}

		return {
			success: false,
			error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
