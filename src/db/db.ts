import mongoose, {MongooseError} from 'mongoose'
import 'dotenv/config'
import {MONGODB_CONNECTION_STRING} from 'src/config'

export function connectToDB() {
	console.log(MONGODB_CONNECTION_STRING)
	try {
		mongoose
			.connect(MONGODB_CONNECTION_STRING)
			.then(async () => {
				console.log(`Database Name: ${mongoose.connection.db?.databaseName}`)
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
