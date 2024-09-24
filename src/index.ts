import 'dotenv/config'
import {ClerkExpressWithAuth} from '@clerk/clerk-sdk-node'
import express, {Application} from 'express'

const port = process.env.PORT ?? 3000

const app: Application = express()

app.get('/api/*', ClerkExpressWithAuth({}))

app.listen(port, () => {
	console.log(`Server lintening on port: ${port}`)
})
