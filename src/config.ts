import {createClerkClient} from '@clerk/clerk-sdk-node'

const ClerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
})

export const CLERK_WEBHOOK_SECRET_KEY = process.env.WEBHOOK_SECRET as string

const port = process.env.PORT || '3000'
export const PORT = parseInt(port, 10)
export default ClerkClient
