/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import 'dotenv/config'
import cors from 'cors'
import express, {Application} from 'express'
import {
	ClerkExpressRequireAuth,
	createClerkClient,
	StrictAuthProp,
} from '@clerk/clerk-sdk-node'

const port = process.env.PORT || 3000
const app: Application = express()

declare global {
	namespace Express {
		interface Request extends StrictAuthProp {}
	}
}

const clerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
})

app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['POST', 'GET', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

app.get(
	'/api/auth',
	ClerkExpressRequireAuth({
		onError: (error) => {
			console.log(error)
		},
	}),
	async (req, res) => {
		const {sessionId} = req.auth
		const {sessions} = clerkClient
		const {userId} = await sessions.getSession(sessionId)
		//TODO: Aqui va la logica de guardar en el base de datos al usuario
		console.log('Llamad a auth: ', userId)
		res.json({userId: userId})
	}
)

app.listen(port, () => {
	console.log(`Server lintening on port: ${port}`)
})
