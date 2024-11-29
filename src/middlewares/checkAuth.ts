import {Request, Response, NextFunction} from 'express'
export async function checkAuth(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const {sessionId} = req.auth
	if (!sessionId) {
		res.status(401).json({
			error: 'Not authenticated',
		})
	}
	next()
}
