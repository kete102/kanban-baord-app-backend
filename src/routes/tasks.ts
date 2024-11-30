import {Router} from 'express'
import {TaskController} from 'src/controllers/taskController'

export const tasksRoutes = Router()

tasksRoutes.get('/:id', TaskController.getUserTasks)
tasksRoutes.post('/:id', TaskController.createTask)
tasksRoutes.patch('/update-status', TaskController.updateTaskStatus)
tasksRoutes.delete('/', TaskController.deleteTask)

//TODO: update entire task
// tasksRoutes.put('/update-task', (req, res) => {})
