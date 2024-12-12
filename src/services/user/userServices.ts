import {MongooseError} from 'mongoose'
import {Board} from 'src/models/BoardModel'
import {Task} from 'src/models/TaskModel'
import {User} from 'src/models/UserModel'
import {UserService} from 'src/typeDefinitions/user/user.types'

/**
 * Creates user in Db.
 * @async
 * @function createUser
 * @param {string} clerkId - User Id from Clerk.
 * @param {string} email - Primary Email of the User.
 * @returns {Promise<object>} Created User.
 * @throws {Error} - Error on creating User.
 **/
export async function createUser(
	clerkId: string,
	email: string
): Promise<UserService> {
	try {
		const user = new User({
			clerkId,
			email,
		})

		const alreadyExistsUserWithEmail = await User.findOne({email: email})

		if (alreadyExistsUserWithEmail) {
			console.error({
				success: false,
				error: `Already exists user with email: ${email}`,
			})
			throw new Error(`Already exists User with email: ${email}`)
		}

		const savedUser = await user.save()

		if (!savedUser) {
			console.error({
				success: false,
				error: `Erro saving new User: ${clerkId}, ${email}`,
			})
			throw new Error(`Error saving new User: ${clerkId}, ${email}`)
		}

		console.info({
			success: true,
			message: 'New user created',
			user: savedUser,
		})
		return {
			success: true,
			user: savedUser,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			console.error({
				success: false,
				message: `MongooseError creating user ${clerkId}: ${error.message}`,
			})
			throw new Error(
				`MongooseError creating user ${clerkId}: ${error.message}`
			)
		} else {
			console.error({
				success: false,
				message: `Error creating user: ${error}`,
			})
			throw new Error(`Error creating user: ${error}`)
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
export async function deleteUser(clerkId: string): Promise<UserService> {
	if (!clerkId || typeof clerkId !== 'string') {
		throw new Error('Invalid clerkId provided. It must be a non-empty string.')
	}
	try {
		const user = await User.findOne({clerkId})

		if (!user) {
			console.error({
				success: false,
				error: `User with clerkId ${clerkId} not found.`,
			})
			throw new Error(`User with clerkId ${clerkId} not found.`)
		}

		const deletionResults = await Promise.allSettled([
			User.deleteOne({clerkId: clerkId}),
			Task.deleteMany({userId: clerkId}),
			Board.deleteMany({userId: clerkId}),
		])

		// Check for any failures in the cascading deletions
		const failedDeletions = deletionResults.filter(
			(result) => result.status === 'rejected'
		)

		if (failedDeletions.length > 0) {
			const errorDetails = failedDeletions.map(
				(failure) => (failure as PromiseRejectedResult).reason
			)
			console.error({
				success: false,
				message: `Partial failure during cascading deletion for clerkId ${clerkId}.`,
				errors: errorDetails,
			})
			throw new Error(
				`Partial failure during cascading deletion: ${errorDetails.join('; ')}`
			)
		}

		console.info({
			success: true,
			message: `User with clerkId ${clerkId} and related data deleted successfully.`,
		})

		return {
			success: true,
			message: `User with clerkId ${clerkId} and related data deleted successfully.`,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			console.error({
				success: false,
				message: `MongooseError during cascading deletion: ${error.message}`,
			})
			throw new Error(
				`MongooseError during cascading deletion: ${error.message}`
			)
		} else {
			console.error({
				success: false,
				message: `Error during cascading deletion: ${error}`,
			})
			throw new Error(`Error during cascading deletion: ${error}`)
		}
	}
}
