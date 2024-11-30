import mongoose, {MongooseError} from 'mongoose'
import {Board} from 'src/models/BoardModel'
import {Task} from 'src/models/TaskModel'
import {User} from 'src/models/UserModel'
import {BoardsService} from 'src/typeDefinitions/board/board.types'

/**
 * Fetches all boards associated with a given user.
 * @param {string} clerkId - User's Clerk Id.
 * @return {Promise<GetAllBoards>} User's boards.
 * */
export async function getAllBoards(clerkId: string): Promise<BoardsService> {
	try {
		const user = await User.findOne({clerkId: clerkId})

		if (!user) {
			return {
				success: false,
				message: `No user found with clerkId: ${clerkId}`,
			}
		}

		const boards = await Board.find({userId: clerkId})

		if (!boards) {
			return {
				success: false,
				message: `No boards found for user ${clerkId}`,
			}
		}

		return {
			success: true,
			board: boards,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error saving user ${clerkId}: ${error.message}`)
		} else {
			throw error
		}
	}
}

/**
 * Creates a new Board.
 * @param {string} clerkId - User's Clerk Id.
 * @param {string} boardTitle - Board title.
 * @param {string} boardDescription  - Board description.
 * @param {string} createdAt - Board creation date.
 * @returns {Promise<CreateBoard>} New created board.
 * */
export async function createBoard({
	clerkId,
	boardTitle,
	boardDescription,
	createdAt,
}: {
	clerkId: string
	boardTitle: string
	boardDescription: string
	createdAt: string
}): Promise<BoardsService> {
	try {
		const user = await User.findOne({clerkId: clerkId})

		if (!user) {
			return {
				success: false,
				message: `No user found with clerkId: ${clerkId}`,
			}
		}
		const newBoard = new Board({
			userId: clerkId,
			boardTitle,
			boardDescription,
			columns: ['done', 'in-progress', 'done'],
			createdAt,
		})
		const savedBoard = await newBoard.save()
		return {
			success: true,
			board: savedBoard,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error saving user ${clerkId}: ${error.message}`)
		} else {
			throw error
		}
	}
}

/**
 * Deletes a board and its tasks.
 * @param {string} clerkId - User's Clerk Id.
 * @param {string} boardId - Id of the Board to delete.
 * @returns {Promise<DeleteBoard>} Return the deleted board.
 * */
export async function deleteBoard({
	clerkId,
	boardId,
}: {
	clerkId: string
	boardId: string
}): Promise<BoardsService> {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const user = await User.findOne({clerkId: clerkId})

		if (!user) {
			return {
				success: false,
				message: `No user found with clerkId ${clerkId}`,
			}
		}

		const deletedBoard = await Board.findByIdAndDelete(
			{boardId: boardId},
			{session}
		)

		if (!deletedBoard) {
			return {
				success: true,
				message: `No board found with boardId ${boardId}`,
			}
		}
		await Task.deleteMany({boardId: boardId}, {session})

		await session.commitTransaction()
		return {
			success: true,
			board: deletedBoard,
		}
	} catch (error) {
		await session.abortTransaction()
		if (error instanceof MongooseError) {
			throw new Error(`Error deleting board with boardId ${boardId}`)
		} else {
			throw error
		}
	} finally {
		await session.endSession()
	}
}
