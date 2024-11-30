import {Router} from 'express'
import {BoardController} from 'src/controllers/boardController'

export const boardRoutes = Router()

boardRoutes.get('/', BoardController.getAll)
boardRoutes.post('/', BoardController.create)
boardRoutes.delete('/:boardId', BoardController.delete)
