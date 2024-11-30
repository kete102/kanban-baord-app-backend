import {Response} from 'express'

interface IHandleErrorResponse {
	res: Response
	statusCode: number
	errorMessage:
		| string
		| {
				field: string
				message: string
		  }[]
}

/**
 * Handles error responses by sending a consistent JSON structure.
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP statuc code fot the response
 * @pararm {string} errorMessage - Error message to send in the response
 **/
export function handleErrorResponse({
	res,
	statusCode,
	errorMessage,
}: IHandleErrorResponse) {
	res.status(statusCode).json({
		success: false,
		errorMessage,
	})
}
