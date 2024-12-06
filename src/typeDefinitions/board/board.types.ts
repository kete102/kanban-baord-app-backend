import {IBoard} from 'src/models/BoardModel'

export interface BoardsService {
	success: boolean
	message?: string
	error?: string
	board?: IBoard[] | IBoard
}
