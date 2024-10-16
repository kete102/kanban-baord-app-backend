import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import {Router} from 'express'
import {User} from '../models/User'
import {Task} from '../models/Task'
import {Board} from '../models/Board'
import {ColumnType, IColumn, ITask} from '../types'

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
	const boardId = req.params // Asegúrate de acceder correctamente al boardId
	const {userId} = req.auth

	// Buscar las tareas para un usuario y un board específico
	const tasks: ITask[] = await Task.find({userId: userId, boardId: boardId})

	// Definir los tipos de columnas según tu interfaz
	const columnTypes: ColumnType[] = ['todo', 'inprogess', 'done']

	// Inicializar el Map con todas las columnas
	const columns = columnTypes.reduce((acc, columnType) => {
		acc.set(columnType, {
			columnId: columnType,
			tasks: [],
		})
		return acc
	}, new Map<ColumnType, IColumn>())

	// Rellenar el Map con las tareas correspondientes
	tasks.forEach((task) => {
		columns.get(task.status)!.tasks.push({
			taskId: task.taskId,
			userId: task.userId,
			taskTitle: task.tasksTitle,
			taskDescription: task.taskDescription,
			status: task.status,
			priority: task.priority,
			createdAt: task.createdAt,
		})
	})

	// Convertir el Map a un objeto plano para que sea compatible con JSON
	const objectColumns = Object.fromEntries(columns)

	// Devolver las columnas como respuesta JSON
	return res.status(200).json({objectColumns})
})
//TODO: Create a task
tasksRoutes.post('/:id', (req, res) => {
	const boardId = req.params
	const body = req.body
	const {userId} = req.auth
	console.log({boardId, userId, body})
	res.status(200).json({
		message: 'Create new task',
	})
})
//TODO: Update a task
tasksRoutes.patch('/', () => {})
//TODO: Delete a task
tasksRoutes.delete('/', () => {})
