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
	const {boardTitle, boardDescription} = req.body

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
		})

		// 3. Guardar la nueva board en la base de datos
		await newBoard.save()

		// 4. Devolver el array actualizado de boards
		return res.status(200).json({newBoard})
	} catch (error) {
		// Manejo de errores
		console.error(error)
		return res.status(500).json({
			error: 'Error creating board',
		})
	}
})

// boardRoutes.post('/', async (req, res) => {
// 	const {userId} = req.auth
// 	const {boardTitle, boardDescription} = req.body
//
// 	User.findOne({clerkId: userId}).then(async (user) => {
// 		if (!user) {
// 			res.status(400).json({
// 				error: 'User not found',
// 			})
// 		} else {
// 			const newBoard = new Board({
// 				userId: user._id,
// 				boardTitle,
// 				boardDescription,
// 			})
//
// 			const saved = newBoard.save()
// 			if (!saved) res.status(400).json({error: 'Board not saved'})
// 			Board.find({userId: user._id}).then(async (boards) => {
// 				if (boards) {
// 					res.status(200).json({boards})
// 				}
// 			})
// 		}
// 	})
// })
