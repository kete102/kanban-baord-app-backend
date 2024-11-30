import {Board} from 'src/models/BoardModel'
import {Task} from 'src/models/TaskModel'
import {User} from 'src/models/UserModel'
import {ControllerProps} from 'src/types'

export const getUserBoards = ({req, res}: ControllerProps) => {
	const {userId} = req.auth

	User.findOne({clerkId: userId}).then(async (user) => {
		if (user) {
			Board.find({userId: userId}).then(async (boards) => {
				if (boards) {
					res.status(200).json({boards})
				}
			})
		}
	})
}

export const createBoard = async ({req, res}: ControllerProps) => {
	const {userId} = req.auth
	const {boardTitle, boardDescription, columns, createdAt} = req.body

	try {
		const user = await User.findOne({clerkId: userId})

		if (!user) {
			return res.status(400).json({
				error: 'User not found',
			})
		}
		const newBoard = new Board({
			userId: userId,
			boardTitle,
			boardDescription,
			columns,
			createdAt,
		})
		await newBoard.save()

		return res.status(200).json({newBoard})
	} catch (error) {
		// Manejo de errores
		console.error(error)
		return res.status(500).json({
			error: 'Error creating board',
		})
	}
}

export const deleteBoard = async ({req, res}: ControllerProps) => {
	const {boardId} = req.params
	const {userId} = req.auth
	try {
		const user = await User.findOne({clerkId: userId})

		if (!user) {
			return res.status(400).json({
				error: 'User not found',
			})
		}
		Board.findByIdAndDelete(boardId).then((deletedBoard) => {
			if (!deletedBoard) {
				return res.status(400).json({message: 'Board not  found'})
			} else {
				return res.status(200).json({message: 'Board deleted', deletedBoard})
			}
		})

		Task.deleteMany({boardId: boardId})
			.then(() => {
				console.log('Data deleted')
			})
			.catch(() => {
				console.log('Error')
			})
	} catch (error) {
		console.log(error)
	}
}
