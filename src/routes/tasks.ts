import {Router} from 'express'
import {Task} from '../models/TaskModel'
import {ITask} from '../types'
import {Board} from '../models/BoardModel'
import {MongooseError} from 'mongoose'

export const tasksRoutes = Router()

//NOTE: Get all tasks
tasksRoutes.get('/:id', async (req, res) => {
	const boardId = req.params.id // Asegúrate de acceder correctamente al boardId
	const {userId} = req.auth

	// Buscar las tareas para un usuario y un board específico
	const tasks: ITask[] = await Task.find({userId: userId, boardId: boardId})

	return res.status(200).json({tasks})
})
//NOTE: Create a task
tasksRoutes.post('/:id', (req, res) => {
	const boardId = req.params.id
	const {
		taskTitle,
		taskDescription,
		status,
		priority,
		endDate,
		createdAt,
		lastUpdate,
	} = req.body
	const {userId} = req.auth
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
					lastUpdate,
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

//NOTE: Update 'status' in task
tasksRoutes.patch('/update-status', async (req, res) => {
	const {taskId, newStatus} = req.body
	const {userId} = req.auth
	try {
		const taskToUpdate = await Task.findOne({
			userId: userId,
			_id: taskId,
		})

		if (!taskToUpdate) {
			return res.status(404).json({
				msg: 'No existe la task',
			})
		}

		taskToUpdate.status = newStatus
		await taskToUpdate.save()

		return res.status(200).json({
			updatedTask: taskToUpdate,
		})
	} catch (error) {
		if (error instanceof MongooseError) {
			console.error('Error al actualizar la task: ', error.message)
		}
		console.log(error)
		return res.status(500).json({error: 'Error interno del servidor'})
	}
})

//TODO: update entire task
// tasksRoutes.put('/update-task', (req, res) => {})

//NOTE: Delete a task
tasksRoutes.delete('/', (req, res) => {
	const {boardId, taskId} = req.body
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
