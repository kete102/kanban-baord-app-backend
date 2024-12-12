import {IUser} from 'src/models/UserModel'

export interface UserService {
	success: boolean
	message?: string
	user?: IUser
	error?: string
}
