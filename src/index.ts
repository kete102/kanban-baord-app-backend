import 'dotenv/config' // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import {ClerkExpressWithAuth} from '@clerk/clerk-sdk-node'
import express, {Application} from 'express'

const port = process.env.PORT ?? 3000

const app: Application = express()

app.get('/api/*', ClerkExpressWithAuth({}))

app.listen(port, () => {
	console.log(`Server lintening on port: ${port}`)
})
