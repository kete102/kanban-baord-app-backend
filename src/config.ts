import {createClerkClient} from '@clerk/clerk-sdk-node'

const ClerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
})

export default ClerkClient
