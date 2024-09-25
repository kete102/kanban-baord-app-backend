import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import ClerkClient from '../config'
import {Router} from 'express'

export const authRoutes = Router()

authRoutes.get(
	'/',
	ClerkExpressRequireAuth({
		onError: (error) => {
			console.log(error)
		},
	}),
	async (req, res, next) => {
		const {sessionId} = req.auth
		const {sessions} = ClerkClient
		const {userId} = await sessions.getSession(sessionId)
		//TODO: Aqui va la logica de guardar en el base de datos al usuario
		console.log('Llamad a auth: ', userId)
		res.json(userId)
		if (sessionId) next()
	}
)
