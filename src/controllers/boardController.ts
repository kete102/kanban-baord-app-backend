import {Request, Response} from 'express'
import {handleErrorResponse} from 'src/helpers/handleErrorResponse'
import {boardSchema} from 'src/helpers/validateBoardRequestBody'
import {Board} from 'src/models/BoardModel'
import {Task} from 'src/models/TaskModel'
import {User} from 'src/models/UserModel'
import {getAllBoards, createBoard} from 'src/services/boards/boardsServices'
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
					errorMessage: result.message || 'Boards not found',
				})
			}

			return res.status(200).json({
				userBoards: result.boards,
			})
		} catch (error) {
			console.error('Error in getAll controller: ', error)
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

			const validatedBody = boardSchema.parse(req.body)
			const {boardTitle, boardDescription, createdAt} = validatedBody

			const result = await createBoard({
				clerkId: userId,
				boardTitle,
				boardDescription,
				createdAt,
			})

			if (!result.success) {
				return handleErrorResponse({
					res,
					statusCode: 404,
					errorMessage: result.message || 'Error creating board',
				})
			}

			return res.status(200).json({
				newBoard: result.board,
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
		//TODO: add transactions to delete data relative to specific board
		const {boardId} = req.params
		const {userId} = req.auth
		try {
			const user = await User.findOne({clerkId: userId})

			if (!user) {
				return res.status(400).json({
					error: 'User not found',
				})
			}
			Board.findByIdAndDelete(boardId).then((deletedBoard) => {
				if (!deletedBoard) {
					return res.status(400).json({message: 'Board not  found'})
				} else {
					return res.status(200).json({message: 'Board deleted', deletedBoard})
				}
			})

			Task.deleteMany({boardId: boardId})
				.then(() => {
					console.log('Data deleted')
				})
				.catch(() => {
					console.log('Error')
				})
		} catch (error) {
			console.log(error)
		}
	}
}
