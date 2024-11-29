import {MongooseError} from 'mongoose'
import {IUser, User} from '../models/User'

/**
 * Creates user in Db.
 * @param {string} clerkId - User Id from Clerk.
 * @param {string} email - Primary Email of the User.
 * @returns {Promise<object>} Created User.
 * @throws Error on creating User.
 **/
export async function createUser(
	clerkId: string,
	email: string
): Promise<IUser> {
	try {
		const user = new User({
			clerkId,
			email,
		})
		const savedUser = await user.save()
		return savedUser
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error saving user ${clerkId}: ${error.message}`)
		} else {
			throw error
		}
	}
}

/**
 * Deletes user from DB.
 * @param {string} clerkId - User Id from Clerk.
 * @returns {Promise<string>} Succes deleting User message.
 * @throws Error if User doesn't exist or problem deleting it.
 */
export async function deleteUser(clerkId: string): Promise<string> {
	try {
		const deletedUser = await User.findOneAndDelete({clerkId})

		if (!deletedUser) {
			throw new Error(`User ${clerkId} not found.`)
		}

		return `User ${clerkId} deleted successfully.`
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error deleting user ${clerkId}: ${error.message}`)
		} else {
			throw error
		}
	}
}
