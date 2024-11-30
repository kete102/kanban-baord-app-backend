import {z} from 'zod'

export const boardSchema = z.object({
	boardTitle: z.string({required_error: 'Missing requried field: boardTitle'}),
	boardDescription: z.string({
		required_error: 'Missing requried field: boardDescription',
	}),
	createdAt: z.string({required_error: 'Missing required field: createAt'}),
})
