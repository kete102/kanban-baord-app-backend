import {User} from '../models/UserModel'

export async function checkIfUserInDb({userId}: {userId: string}) {
	const user = User.findOne({clerkId: userId})
	if (user) {
		return user
	} else {
		return false
	}
}
