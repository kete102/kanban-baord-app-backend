import mongoose, {MongooseError} from 'mongoose'
import {IUser, User} from '../../models/UserModel'
import {Task} from '../../models/TaskModel'
import {Board} from '../../models/BoardModel'

/**
 * Creates user in Db.
 * @async
 * @function createUser
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
 * Deletes a user and all associated resources in a cascading manner.
 * @async
 * @function deleteUser
 * @param {string} clerkId - The Clerk Id of the user to be deleted.
 * @returns {Promise<string>} A message confirming the successful deletion of the user and related data.
 * @throws {Error} If the user does not exist or any operation in the transaction fails.
 */
export async function deleteUser(clerkId: string): Promise<string> {
	console.log('deleteUser')
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const deletedUser = await User.findOne({clerkId})
		console.log({deletedUser})

		if (!deletedUser) {
			return `User with clerkId ${clerkId} not found.`
		}

		await User.deleteOne({clerkId: clerkId}, {session})
		await Task.deleteMany({userId: clerkId}, {session})
		await Board.deleteMany({userId: clerkId}, {session})

		await session.commitTransaction()

		return `User with clerkId ${clerkId} and related data deleted successfully.`
	} catch (error) {
		await session.abortTransaction()
		if (error instanceof MongooseError) {
			throw new Error(`Error during cascading deletion:  ${error.message}`)
		} else {
			throw error
		}
	} finally {
		session.endSession()
	}
}
