import {User} from '../models/User'

export async function checkIfUserInDb({userId}: {userId: string}) {
	return User.exists({clerkId: userId})
}
