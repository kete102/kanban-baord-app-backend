import {Router} from 'express'
import {TaskController} from 'src/controllers/taskController'

export const tasksRoutes = Router()

tasksRoutes.get('/:id', TaskController.getAll)
tasksRoutes.post('/:id', TaskController.create)
tasksRoutes.patch('/', TaskController.updateStatus)
tasksRoutes.delete('/', TaskController.delete)

//TODO: update entire task
// tasksRoutes.put('/update-task', (req, res) => {})
