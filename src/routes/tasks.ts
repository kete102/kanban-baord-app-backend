import {Router} from 'express'
import {
	createTask,
	deleteTask,
	getUserTasks,
	updateTaskStatus,
} from 'src/controllers/taskController'

export const tasksRoutes = Router()

tasksRoutes.get('/:id', getUserTasks)
tasksRoutes.post('/:id', createTask)
tasksRoutes.patch('/update-status', updateTaskStatus)
tasksRoutes.delete('/', deleteTask)

//TODO: update entire task
// tasksRoutes.put('/update-task', (req, res) => {})
