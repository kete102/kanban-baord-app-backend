import mongoose from 'mongoose'

export type ColumnType = 'todo' | 'inprogress' | 'done'

export interface ITask {
	userId: string
	boardId: string
	taskTitle: string
	taskDescription: string
	status: ColumnType
	priority: 'high' | 'low' | 'medium'
	createdAt: string
	endDate: string
}

export interface IColumn {
	columnId: ColumnType
	tasks: Task[]
}

export interface IBoard {
	boardTitle: string
	boardDescription: string
	userId: mongoose.Schema.Types.ObjectId
	createdAt: string
}

interface IUser {
	userId: string
	userName: string
	avatarImage: string
}
