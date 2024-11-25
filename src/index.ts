/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import 'dotenv/config'
import cors from 'cors'
import express, {Application} from 'express'
import {ClerkExpressRequireAuth, StrictAuthProp} from '@clerk/clerk-sdk-node'
import {boardRoutes} from './routes/boards'
import {authRoutes} from './routes/auth'
import {tasksRoutes} from './routes/tasks'
import {connectToDB} from './db/db'
import {PORT} from './config'

declare global {
	namespace Express {
		interface Request extends StrictAuthProp {}
	}
}
const app: Application = express()
connectToDB()

app.use(express.json())
app.use(
	cors({
		origin: '*',
		methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)
app.get('/', (_req, res) => {
	res.status(200).json({
		message: 'Welcome',
	})
})

app.get('/ping', (_req, res) => {
	res.json({
		message: 'pong',
	})
})

app.use(
	'/api/*',
	ClerkExpressRequireAuth({
		onError: (error) => {
			console.log('Auth error: ', error)
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

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/tasks', tasksRoutes)

app.listen(PORT, () => {
	console.log(`Server lintening on port: ${PORT}`)
})
