import {Request, Response} from 'express'

export interface ControllerProps {
	req: Request
	res: Response
}
