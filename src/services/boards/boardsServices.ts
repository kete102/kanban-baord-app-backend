import {MongooseError} from 'mongoose'
import {Board} from 'src/models/BoardModel'
import {User} from 'src/models/UserModel'
import {CreateBoard, GetAllBoards} from 'src/typeDefinitions/board/board.types'

/**
 * Fetches all boards associated with a given user.
 * @param {string} clerkId - User's Clerk Id.
 * @return {Promise<GetAllBoards>} Result of the operation
 **/
export async function getAllBoards(clerkId: string): Promise<GetAllBoards> {
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
			boards,
		}
	} catch (error) {
		if (error instanceof MongooseError) {
			throw new Error(`Error saving user ${clerkId}: ${error.message}`)
		} else {
			throw error
		}
	}
}

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
}): Promise<CreateBoard> {
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

export function deleteBoard() {}
