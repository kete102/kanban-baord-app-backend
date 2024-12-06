import mongoose, {MongooseError} from 'mongoose'
import 'dotenv/config'
import {MONGODB_CONNECTION_STRING} from 'src/config'

export function connectToDB() {
	try {
		mongoose
			.connect(MONGODB_CONNECTION_STRING)
			.then(async () => {
				console.log(`DB connection success.`)
			})
			.catch((error) => {
				console.error('Error connecting to DB', error)
			})
	} catch (error) {
		if (error instanceof MongooseError) {
			console.log(`Error connecting to DB: ${error.message}`)
		}
		console.log(`DB Error: ${error}`)
	}
}
