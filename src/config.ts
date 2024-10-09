import {createClerkClient} from '@clerk/clerk-sdk-node'

const ClerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
})

const port = process.env.PORT || '3000'
export const PORT = parseInt(port, 10)
export default ClerkClient
