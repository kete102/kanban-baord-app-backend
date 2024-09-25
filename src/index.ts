/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import 'dotenv/config'
import cors from 'cors'
import express, {Application} from 'express'
import {StrictAuthProp} from '@clerk/clerk-sdk-node'
import {boardRoutes} from './routes/boards'
import {authRoutes} from './routes/auth'

declare global {
	namespace Express {
		interface Request extends StrictAuthProp {}
	}
}

const port = process.env.PORT || 3000
const app: Application = express()

app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['POST', 'GET', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)

app.listen(port, () => {
	console.log(`Server lintening on port: ${port}`)
})
