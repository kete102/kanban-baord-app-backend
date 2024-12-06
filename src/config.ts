import {createClerkClient} from '@clerk/clerk-sdk-node'

const ClerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
})
const port = process.env.PORT || '3000'
export let MONGODB_CONNECTION_STRING = ''

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
if (process.env.NODE_ENV === 'development') {
	MONGODB_CONNECTION_STRING = process.env
		.LOCAL_MONGODB_CONNECTION_STRING as string
} else if (process.env.NODE_ENV === 'production') {
	MONGODB_CONNECTION_STRING = process.env.MONGO_URL as string
}

export const CLERK_WEBHOOK_SECRET_KEY = process.env.WEBHOOK_SECRET as string
export const PORT = parseInt(port, 10)
export default ClerkClient
