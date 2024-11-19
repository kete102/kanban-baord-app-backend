import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import ClerkClient from '../config'
import {Router} from 'express'
import {User} from '../models/User'
import {checkIfUserInDb} from '../helpers/checkIfUserInDb'

export const authRoutes = Router()

authRoutes.get(
	'/',
	ClerkExpressRequireAuth({
		onError: (error) => {
			console.log('Auth error: ', error)
		},
	}),
	async (req, res, next) => {
		const {sessionId} = req.auth
		if (!sessionId) {
			res.status(401).json({
				error: 'User  not authenticated',
			})
		}
		const {sessions} = ClerkClient
		const {userId} = await sessions.getSession(sessionId)
		//TODO: Aqui va la logica de guardar en el base de datos al usuario
		// Comprobar si ya esta en la base de datos. Si no lo esta guardarlo
		// Siempre devolviendo su clerkId
		const existsUser = checkIfUserInDb({userId})
		if (!existsUser) {
			const newUser = new User({
				clerkId: userId,
			})
			await newUser.save()
			res.status(201).json(newUser.clerkId)
		}
		res.status(201).json(userId)
		next()
	}
)
