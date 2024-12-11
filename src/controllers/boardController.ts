import {Request, Response} from 'express'
import {handleErrorResponse} from 'src/helpers/handleErrorResponse'
import {
	getAllBoards,
	createBoard,
	deleteBoard,
} from 'src/services/boards/boardsServices'
import {ZodError} from 'zod'

export class BoardController {
	static getAll = async (req: Request, res: Response) => {
		try {
			const {userId} = req.auth

			if (!userId) {
				console.log('No userId provided')
				return handleErrorResponse({
					res,
					statusCode: 404,
					errorMessage: 'No userId provided',
				})
			}

			const result = await getAllBoards(userId)

			if (!result.success) {
				return handleErrorResponse({
					res,
					statusCode: 404,
					errorMessage: result.error || 'Boards not found',
				})
			}

			return res.status(200).json({
				boards: result.board,
			})
		} catch (error) {
			console.error('Error in getAll boards: ', error)
			return handleErrorResponse({
				res,
				statusCode: 500,
				errorMessage: 'An error ocurred while retriving all boards',
			})
		}
	}

	static create = async (req: Request, res: Response) => {
		try {
			const {userId} = req.auth

			if (!userId) {
				console.log('No userId provided')
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No userId provided',
				})
			}

			const {newBoard: boardData} = req.body

			const result = await createBoard({
				clerkId: userId,
				boardData,
			})

			if (!result.success) {
				return handleErrorResponse({
					res,
					statusCode: 404,
					errorMessage: result.message || 'Error creating board',
				})
			}

			return res.status(200).json({
				boards: result.board,
			})
		} catch (error) {
			console.error('Error in create board controller: ', error)
			if (error instanceof ZodError) {
				const validationErrors = error.errors.map((err) => ({
					field: err.path.join('.'),
					message: err.message,
				}))

				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: validationErrors,
				})
			}

			return handleErrorResponse({
				res,
				statusCode: 500,
				errorMessage: 'An error ocurred while creating new board',
			})
		}
	}

	static delete = async (req: Request, res: Response) => {
		console.log('delete board')
		try {
			const {boardId} = req.params
			const {userId} = req.auth

			if (!userId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No userId provided',
				})
			}

			if (!boardId) {
				return handleErrorResponse({
					res,
					statusCode: 400,
					errorMessage: 'No boardId provided',
				})
			}

			const result = await deleteBoard({clerkId: userId, boardId})

			if (!result.success) {
				return res.status(400).json({board: result.board})
			}

			return res.status(200).json({board: result.board})
		} catch (error) {
			console.error('Error in deleteBoard: ', error)
			return handleErrorResponse({
				res,
				statusCode: 500,
				errorMessage: 'An error ocurred while deleting the board',
			})
		}
	}
}
