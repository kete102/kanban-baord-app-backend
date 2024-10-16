import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import {Router} from 'express'
import {User} from '../models/User'
import {Board} from '../models/Board'

export const boardRoutes = Router()

boardRoutes.use(
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

boardRoutes.get('/', (req, res) => {
	const {userId} = req.auth

	User.findOne({clerkId: userId}).then(async (user) => {
		if (user) {
			Board.find({userId: user._id}).then(async (boards) => {
				if (boards) {
					res.status(200).json({boards})
				}
			})
		}
	})
})

boardRoutes.post('/', async (req, res) => {
	const {userId} = req.auth
	const {boardTitle, boardDescription, columns} = req.body

	try {
		// 1. Buscar el usuario por el ID de clerk
		const user = await User.findOne({clerkId: userId})

		if (!user) {
			return res.status(400).json({
				error: 'User not found',
			})
		}

		// 2. Crear una nueva board
		const newBoard = new Board({
			userId: user._id,
			boardTitle,
			boardDescription,
			columns,
		})

		// 3. Guardar la nueva board en la base de datos
		await newBoard.save()

		// 4. Devolver el nuevo board
		return res.status(200).json({newBoard})
	} catch (error) {
		// Manejo de errores
		console.error(error)
		return res.status(500).json({
			error: 'Error creating board',
		})
	}
})

boardRoutes.delete('/:boardId', async (req, res) => {
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
	} catch (error) {
		console.log(error)
	}
})
