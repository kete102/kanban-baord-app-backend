import mongoose from 'mongoose'
import 'dotenv/config'

const MONGODB_CONNECTION_STRING = process.env
	.MONGODB_CONNECTION_STRING as string

export function connectToDB() {
	mongoose
		.connect(MONGODB_CONNECTION_STRING)
		.then(() => {
			console.log('DB connected')
		})
		.catch((error) => {
			console.error('Error connecting to DB', error)
		})
}
