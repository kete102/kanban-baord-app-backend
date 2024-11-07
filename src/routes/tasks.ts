import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import {Router} from 'express'
import {Task} from '../models/Task'
import {ITask} from '../types'
import {Board} from '../models/Board'

export const tasksRoutes = Router()

tasksRoutes.use(
	'/*',
	ClerkExpressRequireAuth({
		onError: (error) => {
			console.log(error)
		},
	}),
	async (req, res, next) => {
		const {sessionId} = req.auth
		if (!sessionId) {
			res.status(401).json({
				error: 'Not authenticated',
			})
		}
		next()
	}
)

//TODO: Get all tasks
tasksRoutes.get('/:id', async (req, res) => {
	const boardId = req.params.id // Asegúrate de acceder correctamente al boardId
	const {userId} = req.auth

	// Buscar las tareas para un usuario y un board específico
	const tasks: ITask[] = await Task.find({userId: userId, boardId: boardId})

	console.log('Get tasks: ', {tasks})
	return res.status(200).json({tasks})
})
//TODO: Create a task
tasksRoutes.post('/:id', (req, res) => {
	const boardId = req.params.id
	const {taskTitle, taskDescription, status, priority, endDate, createdAt} =
		req.body
	const {userId} = req.auth
	console.log({
		taskTitle,
		taskDescription,
		status,
		priority,
		createdAt,
		endDate,
	})
	try {
		//1. Find board and check if exists
		Board.findOne({_id: boardId}).then((board) => {
			if (board) {
				//Create new task based on the body data
				const newTask = new Task({
					userId: userId,
					boardId: boardId,
					status,
					taskTitle,
					taskDescription,
					priority,
					createdAt,
					endDate,
				})

				//Save the task in the tasks collection
				newTask.save()

				//Return the created task if correctly saved
				return res.status(200).json({newTask})
			} else {
				//If board not exists return 400 and error message
				return res.status(400).json({message: 'Board not found'})
			}
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: 'Error creating task',
		})
	}
})

//TODO: Update a task
tasksRoutes.patch('/', () => {})
//TODO: Delete a task
tasksRoutes.delete('/', (req, res) => {
	const {boardId, taskId} = req.body
	console.log({boardId, taskId})
	Board.findById(boardId).then((board) => {
		if (!board) {
			res.status(300).json({
				msg: 'No existe la board',
			})
		}
		Task.findByIdAndDelete(taskId)
			.then(() => {
				console.log('Tarea eliminada')
			})
			.catch(() => {
				console.log('Error al eliminar la tarea: ', taskId)
			})
	})
	if (boardId && taskId) {
		res.status(200).json({
			msg: 'Tarea Eliminada',
			deletedTaskId: taskId,
		})
	}
})
