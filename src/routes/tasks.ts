import {ClerkExpressRequireAuth} from '@clerk/clerk-sdk-node'
import {Router} from 'express'

export const tasksRoutes = Router()

tasksRoutes.use(
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

//TODO: Get all tasks
tasksRoutes.get('/', () => {})
//TODO: Create a task
tasksRoutes.put('/', () => {})
//TODO: Update a task
tasksRoutes.patch('/', () => {})
//TODO: Delete a task
tasksRoutes.delete('/', () => {})
