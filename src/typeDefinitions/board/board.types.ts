import {IBoard} from 'src/models/BoardModel'

export interface GetAllBoards {
	success: boolean
	message?: string
	boards?: IBoard[]
}

export interface CreateBoard {
	success: boolean
	message?: string
	board?: IBoard
}

export interface DeleteBoard {
	success: boolean
	message?: string
	board?: IBoard
}
