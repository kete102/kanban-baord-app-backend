import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import ClerkClient from '../config'
import {Router} from 'express'

export const boardRoutes = Router()

boardRoutes.use(
	'/*',
	ClerkExpressRequireAuth({
		onError: (error) => {
			console.log(error)
		},
	}),
	async (req, _res, next) => {
		const {sessionId} = req.auth
		const {sessions} = ClerkClient
		const {userId} = await sessions.getSession(sessionId)
		//TODO: Aqui va la logica de guardar en el base de datos al usuario
		console.log('Llamad a auth: ', userId)
		if (sessionId) next()
	}
)

boardRoutes.get('/', (_req, res) => {
	res.json({boards: 'Tus boards'})
})
