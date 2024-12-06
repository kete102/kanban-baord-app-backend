import {Request, Response} from 'express'
import {MongooseError} from 'mongoose'
import {handleErrorResponse} from 'src/helpers/handleErrorResponse'
import {
	createTask,
	deleteTask,
	getAllTasks,
	updateTaskStatus,
} from 'src/services/tasks/tasksServices'

export class TaskController {
	static getAll = async (req: Request, res: Response) => {
		try {
			const boardId = req.params.id
			const {userId} = req.auth

			if (!boardId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No boardId provided',
				})
			}

			if (!userId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No userId provided',
				})
			}

			const result = await getAllTasks({clerkId: userId, boardId})

			if (!result.tasks) {
				return res.status(204).json({
					tasks: [],
				})
			}

			return res.status(200).json({
				tasks: result.tasks,
			})
		} catch (error) {
			console.error('Error in getAll tasks:', error)
			return res.status(500).json({
				ok: false,
				error: `Error fetching user's tasks`,
			})
		}
	}

	static create = async (req: Request, res: Response) => {
		try {
			const boardId = req.params.id
			const {userId} = req.auth

			if (!boardId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No boardId provided',
				})
			}

			if (!userId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No userId provided',
				})
			}

			const taskData = req.body

			const result = await createTask({clerkId: userId, boardId, taskData})
			if (!result.success && result.error) {
				handleErrorResponse({res, statusCode: 400, errorMessage: result.error})
			}

			return res.status(200).json({
				tasks: result.tasks,
			})
		} catch (error) {
			console.error(error)
			return res.status(500).json({
				error: 'Error creating task',
			})
		}
	}

	static updateStatus = async (req: Request, res: Response) => {
		try {
			const {userId} = req.auth

			if (!userId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No userId provided',
				})
			}
			const {taskId, newStatus} = req.body

			const result = await updateTaskStatus({userId, taskId, newStatus})

			if (!result.success && result.error) {
				handleErrorResponse({res, statusCode: 400, errorMessage: result.error})
			}

			return res.status(200).json({
				task: result.tasks,
			})
		} catch (error) {
			if (error instanceof MongooseError) {
				console.error('Error al actualizar la task: ', error.message)
			}
			console.log(error)
			return res.status(500).json({error: 'Error interno del servidor'})
		}
	}

	static delete = async (req: Request, res: Response) => {
		const {userId} = req.auth
		const taskData = req.body

		const result = await deleteTask({clerkId: userId, taskData})

		if (result.success && result.error) {
			return handleErrorResponse({
				res,
				statusCode: 400,
				errorMessage: result.error,
			})
		}

		return {
			ok: true,
			message: result.message,
			task: result.tasks,
		}
	}
}
