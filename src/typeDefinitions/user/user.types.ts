import {IUser} from 'src/models/UserModel'

export interface Deleteuser {
	success: boolean
	message?: string
	user?: IUser
}

export interface CreateUser {
	success: boolean
	message?: string
	user?: IUser
}
