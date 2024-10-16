export type ColumnType = 'todo' | 'inprogess' | 'done'

export interface ITask {
	taskId: string
	userId: string
	tasksTitle: string
	taskDescription: string
	status: ColumnType
	priority: 'high' | 'low' | 'medium'
	createdAt: string
}

export interface IColumn {
	columnId: ColumnType
	tasks: Task[]
}

export interface IBoard {
	boardId: string
	boardTitle: string
	boardDescription: string
	userId: mongoose.Schema.Types.ObjectId
	columns: Map<ColumnType, Column>
}

interface IUser {
	userId: string
	userName: string
	avatarImage: string
}
