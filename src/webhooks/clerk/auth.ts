import {Webhook, WebhookRequiredHeaders} from 'svix'
import {CLERK_WEBHOOK_SECRET_KEY} from '../../config'
import {WebhookEvent} from '@clerk/clerk-sdk-node'
import {Request, Response} from 'express'
import {createUser, deleteUser} from '../../services/userServices'

export async function clerkWebhook(req: Request, res: Response) {
	try {
		const payloadString = req.body.toString()
		const svixHeaders = req.headers as unknown as WebhookRequiredHeaders

		const wh = new Webhook(CLERK_WEBHOOK_SECRET_KEY)
		const evt = wh.verify(payloadString, svixHeaders) as WebhookEvent
		const eventType = evt.type

		switch (eventType) {
			case 'user.created': {
				const {email_addresses, id} = evt.data
				const primaryEmail = email_addresses[0].email_address

				if (!primaryEmail) {
					return res.status(400).json({
						succes: false,
						message: 'No primary email found',
					})
				}

				try {
					const newUser = await createUser(id, primaryEmail)
					console.log(`User ${newUser} created successfully`)
					return res.status(200).json({
						success: true,
						message: `User ${id} saved in DB`,
						user: newUser,
					})
				} catch (error) {
					console.error('Error saving user in DB: ', error)
					return res.status(500).json({
						succes: false,
						message: 'Error saving user in DB',
					})
				}
			}

			case 'user.deleted': {
				const {id} = evt.data

				if (!id) {
					return res.status(400).json({
						succes: false,
						message: 'Error: no id provided',
					})
				}

				try {
					const message = await deleteUser(id)
					return res.status(200).json({
						succes: true,
						message,
					})
				} catch (error) {
					console.log(error)
					if (error instanceof Error) {
						return res.status(404).json({
							succes: false,
							message: error.message,
						})
					}
					return res.status(404).json({
						succes: false,
						message: `Error deleting user ${id}`,
					})
				}
			}

			default: {
				return res.status(400).json({
					succes: false,
					message: `Unhandled event type: ${eventType}`,
				})
			}
		}
	} catch (error) {
		console.log('Webhook processing error: ', error)
		res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}
