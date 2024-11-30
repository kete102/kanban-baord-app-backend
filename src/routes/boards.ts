import {Router} from 'express'
import {
	createBoard,
	deleteBoard,
	getUserBoards,
} from 'src/controllers/boardController'

export const boardRoutes = Router()

boardRoutes.get('/', getUserBoards)
boardRoutes.post('/', createBoard)
boardRoutes.delete('/:boardId', deleteBoard)
