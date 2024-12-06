import mongoose, {MongooseError} from 'mongoose'
import {boardZodSchema} from 'src/helpers/validateBoardRequestBody'
import {Board} from 'src/models/BoardModel'
import {Task} from 'src/models/TaskModel'
import {User} from 'src/models/UserModel'
import {BoardsService} from 'src/typeDefinitions/board/board.types'
import {ZodError} from 'zod'

/**
 * Fetches all boards associated with a given user.
 * @param {string} clerkId - User's Clerk Id.
 * @return {Promise<BoardsService>} User's boards.
 * */
export async function getAllBoards(clerkId: string): Promise<BoardsService> {
	console.log('get all boards')
	try {
		const user = await User.findOne({clerkId: clerkId})

		if (!user) {
			return {
				success: false,
				error: `No user found with clerkId: ${clerkId}`,
			}
		}

		const boards = await Board.find({userId: clerkId})

		if (!boards) {
			return {
				success: false,
				error: `No boards found for user ${clerkId}`,
			}
		}

		return {
			success: true,
			message: `User's boards`,
			board: boards,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(
				`Error fetching boards fot user ${clerkId}: ${error.message}`
			)
		} else {
			throw error
		}
	}
}

interface CreateBoard {
	clerkId: string
	boardData: Zod.infer<typeof boardZodSchema>
}
/**
 * Creates a new Board.
 * @param {string} clerkId - User's Clerk Id.
 * @param {string} boardData - New board data.
 * @returns {Promise<BoardsService>} New created board.
 * */
export async function createBoard({
	clerkId,
	boardData,
}: CreateBoard): Promise<BoardsService> {
	console.log('create board')
	try {
		const user = await User.findOne({clerkId: clerkId})

		const validatedBoardData = boardZodSchema.parse(boardData)

		if (!user) {
			return {
				success: false,
				error: `No user found with clerkId: ${clerkId}`,
			}
		}
		const newBoard = new Board({
			userId: clerkId,
			columns: ['done', 'in-progress', 'done'],
			...validatedBoardData,
		})
		const savedBoard = await newBoard.save()
		return {
			success: true,
			message: 'New board created',
			board: savedBoard,
		}
	} catch (error) {
		if (error instanceof ZodError) {
			return {
				success: false,
				error: `Validation error: ${error.message}`,
			}
		}
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
				error: `No user found with clerkId ${clerkId}`,
			}
		}

		const deletedBoard = await Board.findOneAndDelete({_id: boardId}, {session})

		if (!deletedBoard) {
			return {
				success: false,
				error: `No board found with boardId ${boardId}`,
			}
		}
		await Task.deleteMany({boardId: boardId}, {session})

		await session.commitTransaction()
		return {
			success: true,
			message: 'Board deleted',
			board: deletedBoard,
		}
	} catch (error) {
		await session.abortTransaction()
		if (error instanceof MongooseError) {
			throw new Error(
				`Error deleting board with boardId ${boardId}: ${error.message}`
			)
		} else {
			throw error
		}
	} finally {
		await session.endSession()
	}
}
